"use client";

import { ChartComponent } from "@/components/FeatureComponents/Chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartConfig } from "@/components/ui/chart";
import { format } from "date-fns";
import React, { useRef, useState } from "react";
import { normalizeDateFrom, normalizeDateTo } from "@/utils/page";
import { id } from "date-fns/locale";
import {
  CalendarCheck,
  CalendarDays,
  CalendarX2,
  ChartSpline,
  Clock4,
  Download,
  Loader2,
  PackagePlus,
  ScrollText,
  X,
} from "lucide-react";
import { DatePickerWithRange } from "@/components/FeatureComponents/DateRange";
import { Button } from "@/components/ui/button";
import SummaryItems from "@/components/FeatureComponents/SummaryItems";
import html2canvas from "html2canvas";

import { AllocationData, DataConfig } from "@/lib/types";
import { Prisma } from "../../../../generated/prisma_client";
import {
  allDataDefault,
  getSummaryToday,
  getWeeklySummaryDefault,
} from "@/app/actions/summary.action";

// 🟢 Ambil otomatis tipe return dari getSummaryToday
type SummaryProps = {
  defaultdata: Prisma.PromiseReturnType<typeof getSummaryToday>;
  weekly: Prisma.PromiseReturnType<typeof getWeeklySummaryDefault>;
  yearly: any;
  allData: Prisma.PromiseReturnType<typeof allDataDefault>;
};

const Summary = ({ defaultdata, weekly, yearly, allData }: SummaryProps) => {
  const [summaryData, setSummaryData] = useState(defaultdata);
  const [allDataSummary, setAllDataSummary] = useState(allData);
  const [weeklySummary, setWeeklySummary] = useState(weekly);
  const [yearlySummary, setYearlySummary] = useState(yearly);

  const [data, setData] = useState<AllocationData[]>([]);
  const [monthly, setMonthly] = useState<DataConfig[]>([]);
  // Summary Chart
  const [monthlyAllocation, setMonthlyAllocation] = useState<DataConfig[]>([]);
  const [dailyAllocation, setDailyAllocation] = useState<DataConfig[]>([]);
  const [dailyDistribution, setDailyDistribution] = useState<DataConfig[]>([]);

  // Filtering Data
  const [loading, setLoading] = useState<Boolean>(false);
  const [isFiltered, setIsFiltered] = useState<Boolean>(false);
  const [dateFilter, setDateFilter] = useState<{
    from: Date | null;
    to: Date | null;
  } | null>();

  // const [filteredDaily, setFilteredDaily] = useState<AllocationData[]>([]);
  // const [filteredMonthly, setFilteredMonthly] = useState<DataConfig[]>([]);
  // const [filteredDistribution, setFilteredDistribution] = useState<
  //   AllocationData[]
  // >([]);

  // const totalDailyQty = calculateSummaryQty(filteredDaily, "allocatedQty");
  // const totalMonthlyQty = calculateSummaryQty(filteredMonthly, "qty");
  // const totalDistributionlyQty = calculateSummaryQty(
  //   filteredDistribution,
  //   "lpgDistribution.distributionQty"
  // );

  const filterByDate = (itemDate: Date, day?: string) => {
    const matchesDate = dateFilter?.from
      ? dateFilter?.to
        ? normalizeDateFrom(itemDate) >= normalizeDateFrom(dateFilter.from) &&
          normalizeDateTo(itemDate) <= normalizeDateTo(dateFilter.to)
        : normalizeDateFrom(itemDate) >= normalizeDateFrom(dateFilter.from) &&
          normalizeDateTo(itemDate) <= normalizeDateTo(dateFilter.from)
      : day
      ? normalizeDateFrom(new Date()) === normalizeDateTo(new Date())
      : true;
    return matchesDate;
  };

  // Initial load
  // useEffect(() => {
  //   loadAllData();
  // }, []);

  const clearFilters = () => {
    setDateFilter(null);
  };

  // const loadAllData = async () => {
  //   const { data, monthly } = await getSummary();
  //   setData(data);
  //   setMonthly(monthly);

  //   const monthlyData = monthly.map((item: any) => ({
  //     date: item.date,
  //     qty: item.qty,
  //   }));

  //   const dailyData = data.map((item: any) => ({
  //     date: item.plannedGiDate,
  //     qty: item.allocatedQty,
  //   }));

  //   const distributionData = data
  //     .filter((item: any) => item.lpgDistribution !== null)
  //     .map((item: any) => ({
  //       date: item.lpgDistribution.giDate,
  //       qty: item.lpgDistribution.distributionQty ?? 0,
  //     }));

  //   setDailyAllocation(dailyData);
  //   setMonthlyAllocation(monthlyData);
  //   setDailyDistribution(distributionData);
  // };

  const allocationData = weeklySummary.weeklySummary.map((item) => ({
    date: new Date(item.date).toLocaleDateString("id-ID"), // Format jadi YYYY-MM-DD
    qty: item.dailySummary,
  }));

  const distributionData = weeklySummary.weeklySummary.map((item) => ({
    date: new Date(item.date).toLocaleDateString("id-ID"),
    qty: item.distributionSummary,
  }));

  const totalElpijiData = weeklySummary.weeklySummary.map((item) => ({
    date: new Date(item.date).toLocaleDateString("id-ID"),
    qty: item.totalElpiji,
  }));

  const allocationDataYearly = yearlySummary.map((item: any) => ({
    date: item.month,
    qty: item.totalAllocatedQty,
  }));

  const distributionDataYearly = yearlySummary.map((item: any) => ({
    date: item.month,
    qty: item.totalDistributionQty,
  }));

  const totalElpijiDataYearly = yearlySummary.map((item: any) => ({
    date: item.month,
    qty: item.totalMonthlyElpiji,
  }));

  // Configure data format and apply initial transformations
  // useEffect(() => {
  //   const monthlyData = monthly.map((item: any) => ({
  //     date: item.date,
  //     qty: item.totalElpiji,
  //   }));

  //   const dailyData = data.map((item: any) => ({
  //     date: item.plannedGiDate,
  //     qty: item.allocatedQty,
  //   }));

  //   const distributionData = data
  //     .filter((item: any) => item.lpgDistribution !== null)
  //     .map((item: any) => ({
  //       date: item.lpgDistribution.giDate,
  //       qty: item.lpgDistribution.distributionQty ?? 0,
  //     }));

  //   setDailyAllocation(dailyData);
  //   setMonthlyAllocation(monthlyData);
  //   setDailyDistribution(distributionData);
  // }, [data, monthly]);

  // Apply filters when date filter changes
  // useEffect(() => {
  //   const filteredDailyData = data.filter((item: AllocationData) =>
  //     item.lpgDistribution?.giDate
  //       ? filterByDate(item.lpgDistribution.giDate)
  //       : false
  //   );

  //   const filteredMonthlyData = monthly.filter((item) =>
  //     filterByDate(item.date)
  //   );

  //   const filteredDistributionData = data
  //     .filter((item) => item.lpgDistribution !== null)
  //     .filter((item) =>
  //       item.lpgDistribution?.giDate
  //         ? filterByDate(item.lpgDistribution.giDate)
  //         : false
  //     );

  //   setFilteredDaily(filteredDailyData);
  //   setFilteredMonthly(filteredMonthlyData);
  //   setFilteredDistribution(filteredDistributionData);
  // }, [data, monthly, dateFilter]);

  // const downloadPDF = async () => {
  //   try {
  //     const doc = new jsPDF("portrait", "mm", "a4");
  //     const pageHeight = doc.internal.pageSize.height; // Tinggi halaman A4 dalam mm
  //     const margin = 10; // Margin halaman
  //     let currentHeight = margin; // Posisi vertikal awal

  //     // Ambil elemen pertama (Chart Minggu Ini)
  //     const firstChart = document.querySelector("#chart-weekly");
  //     if (firstChart) {
  //       const canvas = await html2canvas(firstChart as HTMLElement);
  //       const imgData = canvas.toDataURL("image/png");
  //       const imgHeight = (canvas.height * 210) / canvas.width; // Sesuaikan lebar ke 210mm (A4 width)

  //       // Tambahkan ke PDF
  //       if (currentHeight + imgHeight > pageHeight - margin) {
  //         doc.addPage(); // Tambahkan halaman baru jika konten melampaui batas
  //         currentHeight = margin;
  //       }
  //       doc.addImage(imgData, "PNG", margin, currentHeight, 190, imgHeight);
  //       currentHeight += imgHeight + 10; // Tambahkan margin antar elemen
  //     }

  //     // Ambil elemen kedua (Chart Tahun Ini)
  //     const secondChart = document.querySelector("#chart-annual");
  //     if (secondChart) {
  //       const canvas = await html2canvas(secondChart as HTMLElement);
  //       const imgData = canvas.toDataURL("image/png");
  //       const imgHeight = (canvas.height * 210) / canvas.width;

  //       // Tambahkan ke PDF
  //       if (currentHeight + imgHeight > pageHeight - margin) {
  //         doc.addPage();
  //         currentHeight = margin;
  //       }
  //       doc.addImage(imgData, "PNG", margin, currentHeight, 190, imgHeight);
  //     }

  //     // Simpan PDF
  //     doc.save("summary-charts.pdf");
  //   } catch (error) {
  //     console.error("Terjadi kesalahan saat mengunduh PDF:", error);
  //   }
  // };

  const weeklyChartRef = useRef(null);
  const yearlyChartRef = useRef(null);

  const downloadWeeklyChart = async () => {
    try {
      const chart = weeklyChartRef.current;
      if (chart) {
        const canvas = await html2canvas(chart);
        const imgData = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = imgData;
        link.download = "weekly_chart.png";
        link.click();
      }
    } catch (error) {
      console.error("Terjadi kesalahan saat mengunduh chart mingguan:", error);
    }
  };

  const downloadYearlyChart = async () => {
    try {
      const chart = yearlyChartRef.current;
      if (chart) {
        const canvas = await html2canvas(chart);
        const imgData = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = imgData;
        link.download = "yearly_chart.png";
        link.click();
      }
    } catch (error) {
      console.error("Terjadi kesalahan saat mengunduh chart tahunan:", error);
    }
  };

  const fetchFilteredSummary = async (
    tgl: { from: Date | null; to: Date | null } | null
  ) => {
    if (!tgl) return;

    setDateFilter(tgl);
    setIsFiltered(true);
    setLoading(true);
    // console.log("Selected Date Range:", tgl);

    try {
      const response = await fetch("/api/filter-summary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: tgl.from,
          to: tgl.to,
        }),
      });

      if (!response.ok) {
        throw new Error(`API responded with status ${response.status}`);
      }

      const data = await response.json();
      // console.log("Response from API route:", data);

      const allData = {
        allSummary: {
          _count: {
            _all: data?.dailySummary?._count?._all ?? 0,
          },
          _sum: {
            allocatedQty: data?.dailySummary?._sum?.allocatedQty ?? 0,
          },
        },
        allDistributionSummary: {
          _count: {
            _all: data?.distributionSummary?._count?._all ?? 0,
          },
          _sum: {
            distributionQty:
              data?.distributionSummary?._sum?.distributionQty ?? 0,
          },
        },
        allMonthlyData: {
          _count: {
            _all: data?.monthlyData?._count?._all ?? 0,
          },
          _sum: {
            totalElpiji: data?.monthlyData?._sum?.totalElpiji ?? 0,
          },
        },
        pending: data?.pending ?? 0,
        fakultatif: data?.fakultatif ?? 0,
        tidakTembus: data?.tidakTembus ?? 0,
        average: data?.average ?? 0,
      };

      setAllDataSummary(allData);
    } catch (error) {
      console.error("Error sending date range:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-5">
      <div className="mb-4">
        <div className="flex md:flex-row items-start md:items-center gap-4 my-4">
          <div className="pl-2">
            <h1 className="text-xl md:text-2xl font-bold">
              Ringkasan Eksekutif
            </h1>
          </div>
        </div>

        {/* TODAY */}
        <Card className="px-6 py-6 my-5 shadow-lg rounded-2xl bg-white border border-gray-200">
          <h1 className="text-2xl font-semibold mb-1 ">
            Wawasan Hari Ini
            <span className="text-sm m-3 font-semibold text-gray-500 mb-1">
              ({format(new Date(), "dd MMMM yyyy")})
            </span>
          </h1>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-3 justify-between">
            <SummaryItems
              icon={<CalendarCheck className="h-10 w-10 text-white" />}
              title={`ALOKASI HARIAN`}
              value={`${
                summaryData?.dailySummary._sum.allocatedQty
                  ? (summaryData?.dailySummary._sum.allocatedQty).toLocaleString(
                      "id-ID"
                    )
                  : 0
              } / `}
              additionalInfo={`${
                summaryData?.dailySummary._sum.allocatedQty
                  ? (
                      summaryData?.dailySummary._sum.allocatedQty * 3
                    ).toLocaleString("id-ID")
                  : "0"
              } Kg`}
            />

            <SummaryItems
              icon={<CalendarDays className="h-10 w-10 text-white" />}
              title={`ALOKASI BULANAN`}
              value={`${summaryData?.safeMonthlyData.totalElpiji.toLocaleString(
                "id-ID"
              )} / `}
              additionalInfo={`${summaryData?.safeMonthlyData.volume.toLocaleString(
                "id-ID"
              )} Kg`}
            />

            <SummaryItems
              icon={<ScrollText className="h-10 w-10 text-white" />}
              title={`PENYALURAN LPG`}
              value={`${
                summaryData?.distributionSummary._sum.distributionQty
                  ? (summaryData?.distributionSummary._sum.distributionQty).toLocaleString(
                      "id-ID"
                    )
                  : 0
              } / `}
              additionalInfo={`${
                summaryData?.distributionSummary._sum.distributionQty
                  ? (
                      summaryData?.distributionSummary._sum.distributionQty * 3
                    ).toLocaleString("id-ID")
                  : "0"
              } Kg`}
            />

            <SummaryItems
              icon={<Clock4 className="h-10 w-10 text-white" />}
              title={"PENDING HARIAN"}
              value={`${summaryData?.pending.toLocaleString("id-ID")} / `}
              additionalInfo={`${(
                (summaryData?.pending ?? 0) * 3
              ).toLocaleString("id-ID")} Kg`}
            />

            <SummaryItems
              icon={<PackagePlus className="h-10 w-10 text-white" />}
              title={"TOTAL FAKULTATIF"}
              value={`${summaryData?.fakultatif.toLocaleString("id-ID")} / `}
              additionalInfo={`${(
                (summaryData?.fakultatif ?? 0) * 3
              ).toLocaleString("id-ID")} Kg`}
            />

            <SummaryItems
              icon={<CalendarX2 className="h-10 w-10 text-white" />}
              title={"TOTAL ALOKASI TIDAK DITEBUS"}
              value={`${summaryData?.tidakTembus.toLocaleString("id-ID")} / `}
              additionalInfo={`${(
                (summaryData?.tidakTembus ?? 0) * 3
              ).toLocaleString("id-ID")} Kg`}
            />
          </div>
        </Card>

        {/* FILTER DATA */}
        <Card className="px-6 py-6 my-5 shadow-lg rounded-2xl bg-white border border-gray-200 mb-5">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 my-4">
            <h1 className="text-2xl font-semibold mb-4">
              Ringkasan
              <span className="text-sm m-3 font-semibold text-gray-500 mb-1">
                {
                  dateFilter?.from && dateFilter?.to
                    ? `${format(dateFilter.from, "(dd MMMM yyyy)", {
                        locale: id,
                      })} - ${format(dateFilter.to, "(dd MMMM yyyy)", {
                        locale: id,
                      })}`
                    : dateFilter?.from
                    ? `${format(dateFilter.from, "(dd MMMM yyyy)", {
                        locale: id,
                      })}`
                    : "(Semua Tanggal)"
                  // : format(new Date(), "dd MMMM yyyy", { locale: id })
                }
              </span>
            </h1>
            <div className="flex flex-row items-center sm:gap-4 ml-auto self-center w-full sm:w-auto">
              <div className="w-full sm:w-auto flex-1">
                <DatePickerWithRange
                  value={dateFilter}
                  onDateChange={(txt) => {
                    fetchFilteredSummary(txt);
                  }}
                  placeholder={
                    dateFilter?.from && dateFilter?.to
                      ? `${format(dateFilter.from, "dd MMMM yyyy", {
                          locale: id,
                        })} - ${format(dateFilter.to, "dd MMMM yyyy", {
                          locale: id,
                        })}`
                      : "Semua Tanggal"
                  }
                  className="w-full sm:w-auto"
                />
              </div>

              {isFiltered && (
                <Button
                  variant="destructive"
                  onClick={() => {
                    setIsFiltered(false);
                    clearFilters();
                    setAllDataSummary(allData);
                  }}
                  className="flex items-center justify-center flex-2"
                >
                  <X className="h-5 w-5 cursor-pointer" />
                </Button>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-3 justify-between">
            {loading ? (
              <div className="col-span-full flex justify-center items-center h-64">
                <Loader2 className="h-16 w-16 animate-spin text-gray-500" />
              </div>
            ) : (
              <>
                <SummaryItems
                  icon={<CalendarCheck className="h-10 w-10 text-white" />}
                  title={`TOTAL ALOKASI HARIAN (${allDataSummary.allSummary._count._all.toLocaleString(
                    "id-ID"
                  )})`}
                  value={`${(
                    allDataSummary.allSummary._sum.allocatedQty ?? 0
                  ).toLocaleString("id-ID")} / `}
                  additionalInfo={`${(
                    (allDataSummary.allSummary._sum.allocatedQty ?? 0) * 3
                  ).toLocaleString("id-ID")} Kg`}
                  cs={"p-4"}
                />
                <SummaryItems
                  icon={<CalendarDays className="h-10 w-10 text-white" />}
                  title={`TOTAL ALOKASI BULANAN(${allDataSummary.allMonthlyData._count._all.toLocaleString(
                    "id-ID"
                  )})`}
                  value={`${(
                    allDataSummary.allMonthlyData._sum.totalElpiji ?? 0
                  ).toLocaleString("id-ID")} / `}
                  additionalInfo={`${(
                    (allDataSummary.allMonthlyData._sum.totalElpiji ?? 0) * 3
                  ).toLocaleString("id-ID")} Kg`}
                  cs={"p-4"}
                />

                <SummaryItems
                  icon={<ScrollText className="h-10 w-10 text-white" />}
                  title={`TOTAL PENYALURAN LPG (${allDataSummary.allDistributionSummary._count._all.toLocaleString(
                    "id-ID"
                  )})`}
                  value={`${(
                    allDataSummary.allDistributionSummary._sum
                      .distributionQty ?? 0
                  ).toLocaleString("id-ID")} / `}
                  additionalInfo={`${(
                    (allDataSummary.allDistributionSummary._sum
                      .distributionQty ?? 0) * 3
                  ).toLocaleString("id-ID")} Kg`}
                  cs={"p-4"}
                />

                <SummaryItems
                  icon={<Clock4 className="h-10 w-10 text-white" />}
                  title={"TOTAL PENDING HARIAN"}
                  value={`${allDataSummary.pending.toLocaleString("id-ID")} / `}
                  additionalInfo={`${(
                    allDataSummary.pending * 3
                  ).toLocaleString("id-ID")} Kg`}
                  cs={"p-4"}
                />

                <SummaryItems
                  icon={<PackagePlus className="h-10 w-10 text-white" />}
                  title={"TOTAL FAKULTATIF"}
                  value={`${allDataSummary.fakultatif.toLocaleString(
                    "id-ID"
                  )} / `}
                  additionalInfo={`${(
                    allDataSummary.fakultatif * 3
                  ).toLocaleString("id-ID")} Kg`}
                  cs={"p-4"}
                />

                <SummaryItems
                  icon={<CalendarX2 className="h-10 w-10 text-white" />}
                  title={"TOTAL ALOKASI TIDAK DITEBUS"}
                  value={`${allDataSummary.tidakTembus.toLocaleString(
                    "id-ID"
                  )} / `}
                  additionalInfo={`${(
                    allDataSummary.tidakTembus * 3
                  ).toLocaleString("id-ID")} Kg`}
                  cs={"p-4"}
                />

                <SummaryItems
                  icon={<ChartSpline className="h-10 w-10 text-white" />}
                  title={"RATA-RATA DISTRIBUSI"}
                  value={`${Number(allDataSummary.average).toLocaleString(
                    "id-ID"
                  )} / `}
                  additionalInfo={`${(
                    Number(allDataSummary.average) * 3
                  ).toLocaleString("id-ID")} Kg`}
                  cs={"p-4"}
                />
              </>
            )}
          </div>
        </Card>
      </div>

      <div className="mb-16" />
      <div className="my-5">
        <div className="pl-2 mt-5">
          <div className="md:flex items-center justify-between mx-1 mb-4">
            <h1 className="text-2xl font-semibold">Chart Jumlah Tabung</h1>
            <div className="flex flex-wrap gap-2 justify-center md:justify-end">
              <Button
                onClick={downloadWeeklyChart}
                className="w-full md:w-auto flex items-center justify-center"
              >
                <Download className="h-5 w-5 mr-2" />
                <span className="truncate">Chart Mingguan</span>
              </Button>
              <Button
                onClick={downloadYearlyChart}
                className="w-full md:w-auto flex items-center justify-center"
              >
                <Download className="h-5 w-5 mr-2" />
                <span className="truncate">Chart Tahunan</span>
              </Button>
            </div>
          </div>
        </div>

        <div ref={weeklyChartRef} id="chart-weekly">
          <Card className="flex flex-col w-full h-[550px] pb-3 shadow-lg rounded-2xl bg-white ">
            <CardHeader className="pb-0">
              <CardTitle>Minggu ini</CardTitle>
              <CardDescription>
                {format(weeklySummary.startDate, "dd MMMM yyyy", {
                  locale: id,
                })}{" "}
                - {""}
                {format(weeklySummary.endDate, "dd MMMM yyyy", { locale: id })}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0 pl-2">
              <ChartComponent
                data={allocationData}
                data2={totalElpijiData}
                data3={distributionData}
                title="Tabung Elpiji"
                timeFrame="weekly"
              />
              {/* <ChartComponent
                data={getWeeklyTotalQty(dailyAllocation)}
                data2={getWeeklyTotalQty(monthlyAllocation)}
                data3={getWeeklyTotalQty(dailyDistribution)}
                title="Tabung Elpiji"
                timeFrame="weekly"
              /> */}
            </CardContent>
            <CardContent className="flex-1 pb-0 pl-2"></CardContent>
          </Card>
        </div>
        <div className="mb-6"></div>
        <div ref={yearlyChartRef} id="chart-annual">
          <Card className="flex flex-col w-full h-[550px] pb-3 shadow-lg rounded-2xl bg-white ">
            <CardHeader className="pb-0">
              <CardTitle>Tahun ini</CardTitle>
              <CardDescription>
                {format(new Date(), "MMMM yyyy", { locale: id })}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0 pl-2">
              {/* <ChartComponent
                data={getAnnualTotalQty(dailyAllocation)}
                data2={getAnnualTotalQty(monthlyAllocation)}
                data3={getAnnualTotalQty(dailyDistribution)}
                title="Tabung Elpiji"
                timeFrame="monthly"
              /> */}
              <ChartComponent
                data={allocationDataYearly}
                data2={totalElpijiDataYearly}
                data3={distributionDataYearly}
                title="Tabung Elpiji"
                timeFrame="monthly"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Summary;
