"use client";
import { UpdateLpgData } from "@/app/actions/lpg-distribution.action";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Loader2, Pencil } from "lucide-react";
import React, { useRef, useState } from "react";
import { DatePick } from "../DatePick";
import { redirect, useRouter } from "next/navigation";

const EditFormLpg = ({ row }: any) => {
  const router = useRouter();
  const ref = useRef<HTMLFormElement>(null);
  const [open, setOpen] = useState(false);
  const [id, setId] = useState(row.id);
  const [loading, setLoading] = useState(false);
  const [giDate, setGiDate] = useState<any>(row.giDate);
  const [platKendaraan, setPlatKendaraan] = useState(row.licensePlate);
  const [namaSopir, setNamaSopir] = useState(row.driverName);
  const [namaSupervisor, setNamaSupervisor] = useState(row.superVisor ?? "");
  const [namaGateKeeper, setNamaGateKeeper] = useState(row.gateKeeper ?? "");
  const [namaAdministrasi, setNamaAdministrasi] = useState(
    row.administrasi ?? ""
  );
  const [jumlahTabungBocor, setJumlahTabungBocor] = useState(row.bocor);
  const [isiKurang, setIsiKurang] = useState(row.isiKurang);

  const handleEditAgent = async (formData: FormData) => {
    try {
      setLoading(true);

      if (
        !platKendaraan ||
        !namaSopir ||
        !namaAdministrasi ||
        !namaGateKeeper
      ) {
        toast({
          title: "Gagal",
          description: "Ada field yang kosong",
          variant: "destructive",
          duration: 3000,
        });
        setLoading(false);
        return;
      }

      const result = await UpdateLpgData(formData);

      if (result?.error) {
        setLoading(false);
        toast({
          title: "Gagal",
          description: result.error,
          variant: "destructive",
          duration: 3000,
        });
      } else {
        setLoading(false);
        ref.current?.reset();
        toast({
          title: "Berhasil",
          description: "Penyaluran Lpg berhasil diupdate",
          duration: 3000,
        });
        setOpen(false);
        window.location.reload();
      }
    } catch (error) {
      console.error("Error updating agent:", error);
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  const resetFormState = () => {
    setId(row.id);
    setGiDate(new Date(row.giDate));
    setPlatKendaraan(row.licensePlate);
    setNamaSopir(row.driverName);
    setNamaSupervisor(row.superVisor);
    setNamaGateKeeper(row.gateKeeper);
    setNamaAdministrasi(row.administrasi);
    setJumlahTabungBocor(row.bocor);
    setIsiKurang(row.isiKurang);
  };

  const handleCancel = (e: React.MouseEvent) => {
    if (
      platKendaraan !== row.licensePlate ||
      namaSopir !== row.driverName ||
      namaSupervisor !== row.superVisor ||
      namaGateKeeper !== row.gateKeeper ||
      namaAdministrasi !== row.administrasi ||
      jumlahTabungBocor !== row.bocor ||
      isiKurang !== row.isiKurang
    ) {
      const confirmClose = confirm(
        "Perubahan belum disimpan. Apakah Anda yakin ingin keluar?"
      );
      if (!confirmClose) {
        e.preventDefault();
      } else {
        resetFormState();
      }
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) {
          resetFormState();
        }
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="text-center align-center justify-center w-1"
        >
          <Pencil
            className="h-4 w-4 text-center align-center cursor-pointer"
            style={{ color: "orange" }}
            aria-label="Edit"
          />
        </Button>
      </DialogTrigger>
      <DialogContent onInteractOutside={(e) => e.preventDefault()}>
        <form
          ref={ref}
          action={async (formData) => {
            await handleEditAgent(formData);
          }}
        >
          <div>
            <DialogHeader>
              <DialogTitle>Edit Data</DialogTitle>
              <DialogDescription>
                Klik simpan apabila telah melakukan perubahan.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label>Waktu Pengambilan</Label>
                <DatePick
                  value={giDate}
                  onDateChange={setGiDate}
                  className="col-span-3"
                  name="giDate"
                />
                {/* <Input
                  id="giDate"
                  name="giDate"
                                          placeholder={format(new Date(), "dd MMMM yyyy", { locale: id })}
                  
                  value={format(giDate, 'dddd MM yyyy'), locale}
                  onChange={(e) => setGiDate(e.target.value)}
                  className="col-span-3"
                /> */}
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label>Plat Kendaraan</Label>
                <Input
                  id="platKendaraan"
                  name="platKendaraan"
                  value={platKendaraan}
                  onChange={(e) => setPlatKendaraan(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label>Nama Sopir</Label>
                <Input
                  id="namaSopir"
                  name="namaSopir"
                  value={namaSopir}
                  onChange={(e) => setNamaSopir(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label>GateKeeper</Label>
                <Input
                  id="gateKeeper"
                  name="gateKeeper"
                  value={namaGateKeeper}
                  onChange={(e) => setNamaGateKeeper(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label>Supervisor</Label>
                <Input
                  id="superVisor"
                  name="superVisor"
                  value={namaSupervisor}
                  onChange={(e) => setNamaSupervisor(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label>Administrasi</Label>
                <Input
                  id="administrasi"
                  name="administrasi"
                  value={namaAdministrasi}
                  onChange={(e) => setNamaAdministrasi(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label>Tabung Bocor</Label>
                <Input
                  id="jumlahTabungBocor"
                  name="jumlahTabungBocor"
                  value={jumlahTabungBocor}
                  onChange={(e) => setJumlahTabungBocor(e.target.value)}
                  className="col-span-3"
                  defaultValue=""
                  min="0"
                  type="number"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label>Isi Kurang</Label>
                <Input
                  id="isiKurang"
                  name="isiKurang"
                  value={isiKurang}
                  onChange={(e) => setIsiKurang(e.target.value)}
                  className="col-span-3"
                  defaultValue=""
                  min="0"
                  type="number"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Input
                  id="id"
                  name="id"
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  className="col-span-3 hidden"
                  readOnly
                />
              </div>
            </div>
            <DialogFooter>
              {loading ? (
                <Button type="button" className="px-9" disabled>
                  <Loader2 className="animate-spin mr-2" />
                  Menyimpan...
                </Button>
              ) : (
                <Button type="submit">Simpan Perubahan</Button>
              )}
              <DialogClose asChild>
                <Button onClick={handleCancel}>Kembali</Button>
              </DialogClose>
            </DialogFooter>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditFormLpg;
