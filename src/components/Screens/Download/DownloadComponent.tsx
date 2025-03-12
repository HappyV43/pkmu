"use client";
import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import ComboBoxNelsen from "@/components/FeatureComponents/ComboBoxNelsen";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "@radix-ui/react-icons";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
// import { PDFDownloadLink } from "@react-pdf/renderer";
import { Download, Loader, Printer, SearchX } from "lucide-react";
import RekapPenyaluranBe from "@/components/FeatureComponents/CetakDistribusi/RekapPenyaluranBe";
import { id } from "date-fns/locale";
import dynamic from "next/dynamic";

const PDFDownloadLink = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
  {
    ssr: false,
    loading: () => <p>Loading...</p>,
  },
);

type valuesFilter = {
  agentName: string;
  deliveryNumber: string;
  range: any;
};

type bpeNumberData = {
  agentName: string;
  deliveryNumber: string;
};

type LpgDistribution = {
  agentName: string;
  deliveryNumber: string;
  id: number;
  bpeNumber: string;
  giDate: Date;
  licensePlate: string;
  allocatedQty: number;
  distributionQty: number;
  volume: number;
  updatedAt: Date;
};

export default function DownloadComponent({
  dataBpeDeliveryAgent,
}: {
  dataBpeDeliveryAgent: bpeNumberData[];
}) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [isAgentFiltered, setIsAgentFiltered] = useState<boolean>(false);
  const downloadLinkRef = useRef<HTMLButtonElement>(null);

  const form = useForm<valuesFilter>({
    defaultValues: {
      agentName: "",
      deliveryNumber: "",
      range: {
        from: null,
        to: null,
      },
    },
  });

  async function fetchData(values: valuesFilter) {
    try {
      setIsAgentFiltered(values.agentName != "");
      const { from, to } = values.range || {};
      const response = await fetch("/api/rekap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          range: {
            from: from ? format(new Date(from), "yyyy-MM-dd") : null,
            to: to ? format(new Date(to), "yyyy-MM-dd") : null,
          },
        }),
      });
      const result = await response.json();
      console.log(result, "API RESULT");
      setData(result.data);
      // Menunggu PDF ter-generate sebelum klik
      setTimeout(() => {
        downloadLinkRef.current?.click();
      }, 500);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  // Fungsi untuk submit dengan loading
  async function onSubmit(values: valuesFilter) {
    setLoading(true);
    await fetchData(values);
    setLoading(false);
  }

  // Reset form and fetch all data
  function handleReset() {
    form.reset({
      agentName: "",
      deliveryNumber: "",
      range: {
        from: null,
        to: null,
      },
    });
    // onSubmit(form.getValues());
  }

  return (
    <div className="w-full">
      <div className="py-4 mx-4">
        <Card className="px-6 py-6 my-3 shadow-lg rounded-2xl bg-white border border-gray-200">
          <div className="px-4 text-center">
            <h1 className="text-lg font-semibold py-2 pb-4">Filter Rekap</h1>
          </div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col space-y-4"
            >
              <div className="grid grid-cols-3 gap-4 items-end">
                {/* Agent Name */}
                <FormField
                  control={form.control}
                  name="agentName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg">Nama Agen</FormLabel>
                      <FormControl>
                        <ComboBoxNelsen
                          placeholder="Pilih Nama Agen"
                          data={dataBpeDeliveryAgent}
                          selectedValue={field.value}
                          onSelect={field.onChange}
                          valueKey="agentName"
                          displayKey="agentName"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Delivery Number */}
                <FormField
                  control={form.control}
                  name="deliveryNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg">Nomor DO</FormLabel>
                      <FormControl>
                        <ComboBoxNelsen
                          placeholder="Pilih Nomor DO"
                          data={dataBpeDeliveryAgent}
                          selectedValue={field.value}
                          onSelect={field.onChange}
                          valueKey="deliveryNumber"
                          displayKey="deliveryNumber"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Date Range */}
                <FormField
                  control={form.control}
                  name="range"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg"> Tanggal</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full justify-start text-left font-normal my-2",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon />⁠
                              {field.value?.from && field.value?.to
                                ? `${format(field.value.from, "dd MMMM yyyy", {
                                    locale: id,
                                  })} - ${format(
                                    field.value.to,
                                    "dd MMMM yyyy",
                                    { locale: id }
                                  )}`
                                : field.value?.from
                                ? `${format(field.value.from, "dd MMMM yyyy", {
                                    locale: id,
                                  })}`
                                : "Semua Tanggal"}
                              ⁠
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="range"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                            numberOfMonths={2}
                            locale={id}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex justify-end space-x-2 mt-5">
                <Button
                  type="submit"
                  className="flex items-center"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader className="h-4 w-4 animate-spin mr-2" />
                      <span className="truncate">Memproses...</span>
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4 text-green-500 cursor-pointer mr-2" />
                      <span className="truncate">Unduh Rekap</span>
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleReset}
                >
                  <SearchX className="h-4 w-4 cursor-pointer" />
                  <span className="truncate">Reset</span>
                </Button>
              </div>
            </form>
            {/* Buttons */}
          </Form>
        </Card>
        {/* Trigger PDF download automatically after form submission */}
        {/* {data.length > 0 && ( */}
        <PDFDownloadLink
          className="text-center"
          document={
            <RekapPenyaluranBe data={data} isAgentFiltered={isAgentFiltered} />
          }
          fileName={`Rekap Penyaluran Elpiji.pdf`}
        >
          <Button ref={downloadLinkRef} className="hidden">
            <Download className="h-4 w-4 text-green-500 cursor-pointer mr-2" />
            <span className="truncate">Unduh Rekap</span>
          </Button>
        </PDFDownloadLink>
      </div>
    </div>
  );
}
