"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { redirect } from "next/navigation";
import { Allocation, RawDataMap } from "@/lib/types";
import * as XLSX from "xlsx";
import { uploadBulkExcel } from "@/app/actions/upload-file.action";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"; // import shadcn table components

interface User {
  id: string;
}

interface user {
  user: User;
}

export default function Component({ user }: user) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState<Allocation[]>([]);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  async function uploadExcel() {
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const data = e.target?.result;
        if (data) {
          const workbook = XLSX.read(data, { type: "binary" });
          const sheetName = workbook.SheetNames[0];
          const workSheet = workbook.Sheets[sheetName];
          const json = XLSX.utils.sheet_to_json(workSheet);
          const test = json as RawDataMap[];
          const prev = json as Allocation[];

          const transformedData = test.map((row) => {
            return {
              shipTo: String(row.SHIP_TO),
              agentName: String(row.SHIP_TO_NAME),
              deliveryNumber: String(row.DO_NUMBER),
              allocatedQty:
                typeof row.QUANTITY === "string"
                  ? parseInt(row.QUANTITY)
                  : row.QUANTITY,
              materialName: String(row.MATERIAL_NAME),
              plannedGiDate: String(row.PLANNED_GI_DATE),
              giDate: row.giDate ? new Date(row.giDate) : null,
              createdBy: user.id,
              updatedBy: user.id,
            };
          });

        //   giDate?: Date | null;
        //   bpeNumber?: string | null;
        //   deliveryNumber: string;
        //   agentId?: string | null;
        //   shipTo: string;
        //   materialName: string;
        //   agentName: string;
        //   plannedGiDate: string;
        //   period?: string | null;
        //   allocatedQty: number;
        //   status?: "Pending" | "Approved";
        //   createdBy: string;
        //   updatedBy: string;
        //   updatedAt?: Date;
        //   createdAt?: Date;
        // }

          // const prevData = prev.map((row) => {
          //   return {
          //     shipTo: String(row.shipTo),
          //     agentName: String(row.agentName),
          //     deliveryNumber: String(row.DO_NUMBER),
          //     allocatedQty:
          //       typeof row.QUANTITY === "string"
          //         ? parseInt(row.QUANTITY)
          //         : row.QUANTITY,
          //     materialName: String(row.MATERIAL_NAME),
          //     plannedGiDate: String(row.plannedGiDate),
          //     giDate: row.giDate ? new Date(row.giDate) : null,
          //     createdBy: user.id,
          //     updatedBy: user.id,
          //   };
          // })

          setTableData(transformedData);

          try {
            await uploadBulkExcel(transformedData);
            redirect("/dashboard/alokasi");
          } catch (error) {
            console.error(error);
          }
        }
      };
      reader.readAsArrayBuffer(selectedFile);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center gap-8 px-4 py-12 md:px-6 lg:px-8">
      <div className="max-w-xl text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Upload Excel
        </h1>
      </div>

      <div className="w-full max-w-md">
        <div>
          <label
            htmlFor="dropzone-file"
            className="flex flex-col items-center justify-center gap-4  w-full h-96 border-2 border-primary border-dashed rounded-lg cursor-pointer bg-gray-50  dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg
                className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 16"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                />
              </svg>
              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold">Click to upload</span> or drag
                and drop
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                .xlsx, .xls
              </p>
            </div>
            <input
              id="dropzone-file"
              type="file"
              accept=".xlsx, .xls"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        </div>
        <div className="mt-4 flex justify-center">
          <Input
            disabled
            type="text"
            value={selectedFile ? selectedFile.name : "Upload File"}
            className="text-primary"
          />
          <Button onClick={uploadExcel}>Impor File</Button>
        </div>
      </div>

      {tableData.length > 0 && (
        <div className="mt-8 w-full max-w-4xl">
          <h2 className="text-2xl font-semibold">Pratinjau Excel</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ship To</TableHead>
                <TableHead>Nama Agen</TableHead>
                <TableHead>Nomer DO</TableHead>
                <TableHead>Jumlah Tabung</TableHead>
                <TableHead>Nama Material</TableHead>
                <TableHead>Planned GI Date</TableHead>
                <TableHead>GI Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tableData.map((row, index) => (
                <TableRow key={index} className="my-6">
                  <TableCell>{row.shipTo}</TableCell>
                  <TableCell>{row.agentName}</TableCell>
                  <TableCell>{row.deliveryNumber}</TableCell>
                  <TableCell>{row.allocatedQty}</TableCell>
                  <TableCell>{row.materialName}</TableCell>
                  <TableCell>{row.plannedGiDate}</TableCell>
                  <TableCell>
                    {row.giDate ? row.giDate.toLocaleDateString() : ""}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}