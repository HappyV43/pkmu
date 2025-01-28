"use client";

import { useState } from "react";
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
import { DataTable } from "@/components/FeatureComponents/data-table-backend";
import { lpgDistributionColumns } from "@/lib/Column";
import Pagination from "@/components/FeatureComponents/Pagination";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "@radix-ui/react-icons";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

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

const Rekapan = ({
  dataBpeDeliveryAgent,
  defaultData,
}: {
  dataBpeDeliveryAgent: bpeNumberData[];
  defaultData: any[];
}) => {
  const [loading, setLoading] = useState(false);
  const [paginationLoading, setPaginationLoading] = useState(false);
  const [tableData, setTableData] = useState(defaultData);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 15,
    total: 0,
    totalPages: 0,
  });

  const form = useForm<valuesFilter>({
    defaultValues: {
      agentName: "",
      deliveryNumber: "",
      range: null,
    },
  });

  async function fetchData(values: valuesFilter, pageNumber: number) {
    setPaginationLoading(true);
    try {
      const { from, to } = values.range || {};
      const response = await fetch("/api/penyaluran-elpiji", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          range: {
            from: from ? format(new Date(from), "yyyy-MM-dd") : null,
            to: to ? format(new Date(to), "yyyy-MM-dd") : null,
          },
          page: pageNumber,
          pageSize: pagination.pageSize,
        }),
      });
      const result = await response.json();

      if (response.ok) {
        setTableData(result.data);
        setPagination((prev) => ({
          ...prev,
          page: pageNumber,
          total: result.pagination.total,
          totalPages: result.pagination.totalPages,
        }));
      } else {
        setTableData([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setPaginationLoading(false);
    }
  }

  // Fungsi untuk submit dengan loading
  async function onSubmit(values: valuesFilter) {
    setLoading(true);
    await fetchData(values, 1);
    setLoading(false);
  }

  function handlePageChange(newPage: number) {
    fetchData(form.getValues(), newPage);
  }

  // Reset form and fetch all data
  function handleReset() {
    form.reset();
    onSubmit(form.getValues());
  }

  return (
    <div className="w-full">
      <div className="py-4 mx-4">
        <Card className="px-6 py-6 my-3 shadow-lg rounded-2xl bg-white border border-gray-200">
          <div className="px-4 text-center">
            <h1 className="text-lg font-semibold py-2 pb-4">Filter Rekap</h1>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2 mb-4">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="agentName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name Agent</FormLabel>
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
                <FormField
                  control={form.control}
                  name="deliveryNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>No Delivery</FormLabel>
                      <FormControl>
                        <ComboBoxNelsen
                          placeholder="Pilih Nomor Delivery"
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
                <FormField
                  control={form.control}
                  name="range"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rentang Tanggal</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-[240px] pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value?.from && field.value?.to ? (
                                <>
                                  {format(field.value.from, "PPP")} -{" "}
                                  {format(field.value.to, "PPP")}
                                </>
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="range" // Mengubah mode menjadi range
                            selected={field.value} // Menyambungkan nilai yang dipilih dengan field value
                            onSelect={field.onChange} // Memperbarui form dengan nilai yang dipilih
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            } // Validasi untuk tanggal yang tidak bisa dipilih
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-between items-center">
                  <Button type="submit" disabled={loading}>
                    {loading ? "Loading..." : "Submit"}
                  </Button>
                  <Button type="button" variant="outline" onClick={handleReset}>
                    Reset
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </Card>
        <div>
          <DataTable columns={lpgDistributionColumns} data={tableData} />
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
            loading={paginationLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default Rekapan;
