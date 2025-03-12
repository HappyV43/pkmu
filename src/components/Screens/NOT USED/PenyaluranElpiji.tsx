// "use client";

// import Link from "next/link";
// import { useEffect, useMemo, useState } from "react";
// import { ColumnDef } from "@tanstack/react-table";
// import {
//   CalendarCheck,
//   Database,
//   Handshake,
//   Loader2,
//   Plus,
//   Printer,
//   SearchX,
//   Weight,
// } from "lucide-react";
// import {
//   calculateTotalAgen,
//   calculateTotalQty,
//   formatNumberQty,
//   normalizeDateFrom,
//   normalizeDateTo,
// } from "@/utils/page";
// import { format } from "date-fns";
// import { getMonthlyAllocation, getSummary } from "@/app/actions/alokasi.action";
// import { ChartConfig } from "@/components/ui/chart";
// import RekapPenyaluran from "@/components/FeatureComponents/CetakDistribusi/RekapPenyaluran";
// import ComboBox from "@/components/FeatureComponents/ComboBox";
// import { DatePickerWithRange } from "@/components/FeatureComponents/DateRange";
// import { Card } from "@/components/ui/card";
// import { DataTable } from "@/components/ui/data-table";
// import { Label } from "@radix-ui/react-label";
// import { Button } from "@/components/ui/button";
// import type { User } from "../../../../generated/prisma_client";
// import { id } from "date-fns/locale";
// import {
//   AllocationData,
//   LpgDistributions,
//   MonthlyAllocation,
//   SummaryProps,
// } from "@/lib/types";
// import DownloadRekap from "./DownloadRekap";
// import { PDFDownloadLink } from "@react-pdf/renderer";
// import InfoCard from "@/components/InfoCard";
// import { getAllLpg } from "@/app/actions/lpg-distribution.action";

// interface DistributionProps<TData, TValue> {
//   columns: ColumnDef<TData, TValue>[];
//   user: User;
// }

// const today = {
//   from: new Date(),
//   to: new Date(),
// };

// var isFiltered = false;
// const PenyaluranElpiji = <TData extends LpgDistributions, TValue>({
//   columns,
//   user,
// }: DistributionProps<TData, TValue>) => {
//   const [rawData, setRawData] = useState<TData[]>([]);
//   const [notrans, setnotrans] = useState("");

//   // BUAT REKAP
//   // const [isAgentFiltered, setIsAgentFiltered] = useState(false);

//   const [agentName, setAgentName] = useState("");
//   const [doNumber, setDoNumber] = useState("");
//   const [dateFilter, setDateFilter] = useState<{
//     from: Date | null;
//     to: Date | null;
//   } | null>({ from: new Date(), to: null });

//   const [filteredData, setFilteredData] = useState<TData[]>([]);
//   const [filtered, setFiltered] = useState<Boolean>(false);

//   // BUAT REKAP
//   // const [allocationDaily, setAllocationDaily] = useState<{giDate: Date | null, qty: number | undefined}[]>([]);
//   // const [allocationMonthly, setAllocationMonthly] = useState<{giDate: Date | null, allocatedQty: number | undefined[]}[]>([]);

//   const generateOptions = () => {
//     const notransOptions = Array.from(
//       new Set(rawData.map((item) => item.bpeNumber))
//     ).map((bpeNumber) => ({
//       label: bpeNumber,
//       value: bpeNumber,
//     }));

//     const agentNameOptions = Array.from(
//       new Set(rawData.map((item) => item.agentName))
//     ).map((agentName) => ({
//       label: agentName,
//       value: agentName,
//     }));

//     const doNumberOptions = Array.from(
//       new Set(rawData.map((item) => item.deliveryNumber))
//     ).map((deliveryNumber) => ({
//       label: deliveryNumber,
//       value: deliveryNumber,
//     }));

//     return { notransOptions, agentNameOptions, doNumberOptions };
//   };

//   const { notransOptions, agentNameOptions, doNumberOptions } =
//     generateOptions();

//   const applyFilter = () => {
//     const filtered = rawData.filter((item) => {
//       const matchesNoTrans = notrans ? item.bpeNumber === notrans : true;
//       const matchesAgentName = agentName ? item.agentName === agentName : true;
//       const matchesDoNumber = doNumber
//         ? item.deliveryNumber === doNumber
//         : true;

//       const matchesDate = dateFilter?.from
//         ? dateFilter?.to
//           ? // For Range Dates
//             item.giDate >= normalizeDateFrom(dateFilter.from) &&
//             item.giDate <= normalizeDateTo(dateFilter.to)
//           : // For Single Dates
//             item.giDate >= normalizeDateFrom(dateFilter.from) &&
//             item.giDate <= normalizeDateTo(dateFilter.from)
//         : (dateFilter?.from == new Date() && dateFilter?.to == null) ||
//           dateFilter?.to == new Date()
//         ? normalizeDateFrom(item.giDate) === normalizeDateTo(new Date())
//         : true;

//       return (
//         matchesNoTrans && matchesAgentName && matchesDate && matchesDoNumber
//       );
//     });

//     // console.log(filtered)
//     setFilteredData(filtered);
//     isFiltered =
//       notrans !== "" ||
//       agentName !== "" ||
//       doNumber !== "" ||
//       dateFilter?.to === new Date() ||
//       dateFilter !== null;
//     // setFiltered(
//     //   notrans !== "" ||
//     //   agentName !== "" ||
//     //   doNumber !== "" ||
//     //   (dateFilter === today || dateFilter !==null)
//     // );

//     console.log(filtered);
//     console.log("matchesAgentName:", " >", agentName, agentName === "");
//     console.log("matchesDoNumber:", " >", doNumber, doNumber === "");
//     console.log("matchesDate:", " >", dateFilter, dateFilter !== null);
//     console.log("matchesDate From:", dateFilter?.from);
//     console.log("matchesDate To:", dateFilter?.to);
//   };

//   useEffect(() => {
//     applyFilter();
//   }, [notrans, agentName, doNumber, dateFilter, rawData]);

//   // BUAT REKAP
//   // useEffect(() => {
//   //   setIsAgentFiltered(!!agentName);
//   // }, [agentName]);

//   const loadAllData = async () => {
//     // DISTRIBUTION
//     const dataLPG = (await getAllLpg()) as TData[];
//     setRawData(dataLPG);

//     // ALLOCATION
//     const { data } = await getSummary();
//     const dailyData = data.map((item: AllocationData) => ({
//       giDate: item.plannedGiDate,
//       qty: item.allocatedQty,
//     }));
//     // setAllocationDaily(dailyData); // BUAT REKAP

//     // MONTHLY
//     const dataMontly = (await getMonthlyAllocation()) as MonthlyAllocation[];
//     const monthlyData = dataMontly.map((item) => ({
//       giDate: item.date,
//       allocatedQty: item.totalElpiji,
//     }));
//     // setAllocationMonthly(monthlyData); //BUAT REKAP

//     // applyFilter()
//   };

//   useEffect(() => {
//     isFiltered = true;
//     setFiltered(true);
//     loadAllData();
//   }, []);

//   const handleClearSearch = () => {
//     setAgentName("");
//     setDoNumber("");
//     setnotrans("");

//     setDateFilter(null);
//     setFiltered(false);
//     loadAllData();
//   };

//   return (
//     <div className="mx-5">
//       <div className="mb-4">
//         <div className="pt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 mb-4">
//           <InfoCard
//             icon={<CalendarCheck className="h-10 w-10 text-white" />}
//             title="TOTAL TABUNG"
//             value={formatNumberQty(
//               calculateTotalQty(filteredData, "distributionQty")
//             )}
//           />
//           <InfoCard
//             icon={<Weight className="h-10 w-10 text-white" />}
//             title="TOTAL BERAT TABUNG"
//             value={formatNumberQty(
//               calculateTotalQty(filteredData, "distributionQty") * 3
//             )}
//             unit="Kg"
//           />
//           <InfoCard
//             icon={<Handshake className="h-10 w-10 text-white" />}
//             title="TOTAL AGEN"
//             value={calculateTotalAgen(filteredData)}
//           />
//           <InfoCard
//             icon={<Database className="h-10 w-10 text-white" />}
//             title="TOTAL DISTRIBUSI LPG"
//             value={filteredData.length}
//           />
//         </div>
//         <Card className="px-6 py-6 my-3 shadow-lg rounded-2xl bg-white border border-gray-200">
//           <div className="px-4 text-center">
//             <h1 className="text-lg font-semibold py-2 pb-4">
//               Filter Penyaluran Elpiji
//             </h1>
//           </div>
//           <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 mb-4">
//             <div>
//               <Label htmlFor="notrans-search" className="text-lg">
//                 Nomer Transaksi
//               </Label>
//               <ComboBox
//                 data={notransOptions}
//                 value={notrans}
//                 setValue={setnotrans}
//                 placeholder="Semua nomor BPE"
//               />
//             </div>
//             <div>
//               <Label htmlFor="agent-search" className="text-lg">
//                 Name Agen
//               </Label>
//               <ComboBox
//                 data={agentNameOptions}
//                 value={agentName}
//                 setValue={setAgentName}
//                 placeholder="Semua agen"
//               />
//             </div>
//             <div>
//               <Label htmlFor="do-search" className="text-lg">
//                 Nomer DO
//               </Label>
//               <ComboBox
//                 data={doNumberOptions}
//                 value={doNumber}
//                 setValue={setDoNumber}
//                 placeholder="Semua number DO"
//               />
//             </div>
//             <div>
//               <Label htmlFor="date-search" className="text-lg">
//                 Tanggal
//               </Label>
//               <DatePickerWithRange
//                 value={dateFilter}
//                 onDateChange={setDateFilter}
//                 placeholder={
//                   dateFilter == null
//                     ? "Semua Tanggal"
//                     : `${format(new Date(), "dd MMMM yyyy", { locale: id })}`
//                 }
//               />
//             </div>
//           </div>

//           <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center mb-3 space-y-2 sm:space-y-0 sm:space-x-2">
//             {user.role === "ADMIN" && (
//               <div className="flex flex-col sm:flex-row sm:space-x-2 w-full sm:w-auto space-y-2 sm:space-y-0">
//                 <Button
//                   variant="default"
//                   className="w-full sm:w-auto flex items-center justify-center"
//                   asChild
//                 >
//                   <Link href="penyaluran-elpiji/form">
//                     <Plus className="h-4 w-4 mr-2 cursor-pointer" />
//                     <span className="truncate">New Penyaluran Elpiji</span>
//                   </Link>
//                 </Button>

//                 {/* <Button
//                   variant="default"
//                   className="w-full sm:w-auto flex items-center justify-center"
//                   asChild
//                 >
//                   <PDFDownloadLink
//                     className="text-center"
//                     document={
//                       <RekapPenyaluran
//                         data={filteredData}
//                         data2={allocationMonthly}
//                         data3={allocationDaily}
//                         isAgentFiltered={isAgentFiltered}
//                       />
//                     }
//                     fileName={`Rekap Penyaluran Elpiji.pdf`}
//                   >
//                     <Printer className="h-4 w-4 text-green-500 cursor-pointer mr-2" />
//                     <span className="truncate">Cetak Rekap</span>
//                   </PDFDownloadLink>
//                 </Button> */}
//               </div>
//             )}

//             {/* Reset Button */}
//             {filtered && (
//               <div className="w-full sm:w-auto">
//                 <Button
//                   variant="destructive"
//                   className="w-full sm:w-auto flex items-center justify-center"
//                   onClick={() => {
//                     setDateFilter(null);
//                     setFiltered(false);
//                     isFiltered = !isFiltered;
//                     handleClearSearch();
//                   }}
//                 >
//                   <SearchX className="h-4 w-4 mr-2 cursor-pointer" />
//                   <span className="truncate">Reset</span>
//                 </Button>
//               </div>
//             )}
//           </div>
//         </Card>
//         <DataTable columns={columns} data={filteredData} />
//       </div>
//     </div>
//   );
// };

// export default PenyaluranElpiji;
