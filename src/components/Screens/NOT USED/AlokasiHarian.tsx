// "use client";
// import { ColumnDef } from "@tanstack/react-table";
// import { Button } from "../../ui/button";
// import { DataTable } from "../../ui/data-table";
// import Link from "next/link";
// import { Label } from "../../ui/label";
// import ComboBox from "../../FeatureComponents/ComboBox";
// import {
//   CalendarCheck,
//   Database,
//   Handshake,
//   SearchX,
//   Upload,
//   Weight,
// } from "lucide-react";
// import { useEffect, useState } from "react";
// import { DatePickerWithRange } from "../../FeatureComponents/DateRange";
// import {
//   calculateTotalAgen,
//   calculateTotalQty,
//   formatNumberQty,
//   normalizeDateFrom,
//   normalizeDateTo,
// } from "@/utils/page";
// import { Card } from "../../ui/card";
// import type { User } from "../../../../generated/prisma_client";
// import { format } from "date-fns";
// import { id } from "date-fns/locale";
// import { Allocation } from "@/lib/types";
// import InfoCard from "@/components/InfoCard";
// import { getAllokasiAll } from "@/app/actions/alokasi.action";

// interface AlokasiProps<TData, TValue> {
//   columns: ColumnDef<TData, TValue>[];
//   user: User;
// }

// const today = {
//   from: new Date(),
//   to: new Date(),
// };
// var isFiltered = false;

// const AlokasiHarian = <TData extends Allocation, TValue>({
//   columns,
//   user,
// }: AlokasiProps<TData, TValue>) => {
//   const [rawData, setRawData] = useState<TData[]>([]);
//   const optionStatus = ["Pending", "Approved"];
//   const [status, setStatus] = useState<string>("Pending");

//   const [agentName, setAgentName] = useState<string>("");
//   const [doNumber, setDoNumber] = useState<string>("");
//   const [dateFilter, setDateFilter] = useState<{
//     from: Date | null;
//     to: Date | null;
//   } | null>({ from: new Date(), to: null });

//   const [filteredData, setFilteredData] = useState<TData[]>([]);
//   const [filtered, setFiltered] = useState<Boolean>(false);

//   const generateOptions = () => {
//     const statusOptions = optionStatus.map((item) => ({
//       label: item,
//       value: item,
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

//     return { statusOptions, agentNameOptions, doNumberOptions };
//   };
//   const { statusOptions, agentNameOptions, doNumberOptions } =
//     generateOptions();

//   const applyFilter = () => {
//     const filtered = rawData.filter((item) => {
//       const matchesStatus = status ? item.status === status : true;
//       const matchesAgentName = agentName ? item.agentName === agentName : true;
//       const matchesDoNumber = doNumber
//         ? item.deliveryNumber === doNumber
//         : true;

//       const matchesDate = item.giDate
//         ? dateFilter?.from
//           ? dateFilter?.to
//             ? normalizeDateFrom(item.giDate) >=
//                 normalizeDateFrom(dateFilter.from) &&
//               normalizeDateTo(item.giDate) <= normalizeDateTo(dateFilter.to)
//             : normalizeDateFrom(item.giDate) >=
//                 normalizeDateFrom(dateFilter.from) &&
//               normalizeDateTo(item.giDate) <= normalizeDateTo(dateFilter.from)
//           : dateFilter?.from?.toDateString() === new Date().toDateString() &&
//             (dateFilter?.to == null ||
//               dateFilter?.to?.toDateString() === new Date().toDateString())
//           ? normalizeDateFrom(item.giDate) === normalizeDateTo(new Date())
//           : true
//         : false;

//       // console.log("ARDINE")
//       // console.log(status, agentName, doNumber, dateFilter)
//       // console.log(matchesStatus, matchesAgentName, matchesDoNumber, matchesDate)

//       return (
//         matchesStatus && matchesAgentName && matchesDoNumber && matchesDate
//       );
//     });

//     setFilteredData(filtered);
//     isFiltered =
//       status !== "" ||
//       agentName !== "" ||
//       doNumber !== "" ||
//       dateFilter?.to === new Date() ||
//       dateFilter !== null;

//     // console.log(filtered)
//     // console.log(filtered)
//     // console.log("matchesStatus:",  " >" ,status,status === "");
//     // console.log("matchesAgentName:", " >" ,agentName ,agentName === "");
//     // console.log("matchesDoNumber:",  " >" ,doNumber ,doNumber === "");
//     // console.log("matchesDate:",  " >" ,dateFilter, dateFilter !==null);
//     // console.log("matchesDate From:", dateFilter?.from );
//     // console.log("matchesDate To:", dateFilter?.to );
//     setFiltered(
//       status !== "" ||
//         agentName !== "" ||
//         doNumber !== "" ||
//         dateFilter === today ||
//         dateFilter !== null
//     );
//   };

//   const handleClearSearch = () => {
//     // isFiltered = !isFiltered
//     setStatus("");
//     setAgentName("");
//     setDoNumber("");

//     setDateFilter(null);
//     setFiltered(false);
//     loadAllData();
//   };

//   const loadAllData = async () => {
//     const data = (await getAllokasiAll()) as TData[];
//     setRawData(data);
//     // applyFilter()
//   };

//   useEffect(() => {
//     applyFilter();
//   }, [status, agentName, doNumber, dateFilter, rawData]);

//   useEffect(() => {
//     isFiltered = true;
//     setFiltered(true);
//     loadAllData();
//     // if (rawData.length > 0) {
//     //   // isFiltered = true
//     //   setStatus("Pending");
//     // }
//     // applyFilter();
//   }, []);

//   return (
//     <div className="mx-5">
//       <div className="mb-4">
//         <div className="pt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 mb-4">
//           <InfoCard
//             icon={<CalendarCheck className="h-10 w-10 text-white" />}
//             title="TOTAL TABUNG"
//             value={formatNumberQty(
//               calculateTotalQty(filteredData, "allocatedQty")
//             )}
//           />
//           <InfoCard
//             icon={<Weight className="h-10 w-10 text-white" />}
//             title="TOTAL BERAT TABUNG"
//             value={formatNumberQty(
//               calculateTotalQty(filteredData, "allocatedQty") * 3
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
//             title="TOTAL ALOKASI HARIAN"
//             value={filteredData.length}
//           />
//         </div>
//         <Card className="px-6 py-6 my-3 shadow-lg rounded-2xl bg-white border border-gray-200">
//           <div className="px-4 text-center">
//             <h1 className="text-lg font-semibold py-2 pb-4">Filter Alokasi</h1>
//           </div>
//           <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 mb-4">
//             <div>
//               <Label htmlFor="status-search" className="text-lg">
//                 Status
//               </Label>
//               <ComboBox
//                 data={statusOptions}
//                 value={status}
//                 setValue={setStatus}
//                 placeholder="Semua status"
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
//                 placeholder="Semua nomor DO"
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
//               <div className="w-full sm:w-auto">
//                 <Button
//                   variant="default"
//                   className="w-full sm:w-auto flex items-center justify-center"
//                   asChild
//                 >
//                   <Link href="alokasi-harian/upload">
//                     <Upload className="h-4 w-4 mr-2 cursor-pointer" />
//                     <span className="truncate">Upload Alokasi</span>
//                   </Link>
//                 </Button>
//               </div>
//             )}

//             {isFiltered && (
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

// export default AlokasiHarian;
