import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Pencil, Printer } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
// import { EditForm } from "./EditForm";
import { PDFDownloadLink } from "@react-pdf/renderer";
import CetakPenyaluran from "./CetakDistribusi/CetakPenyaluran";

interface ActionButtonProps {
  data?: any;
  page?: string;
}

export function ActionButtons({ data, page }: ActionButtonProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleEditClick = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  return (
    <>
      <PDFDownloadLink
        document={<CetakPenyaluran data={data} />}
        fileName={`Penyaluran Elpiji ${data.deliveryNumber}.pdf`}
        >
        <Printer className="h-4 w-4 text-green-500 cursor-pointer" />
        </PDFDownloadLink>
      {/* Dialog for Edit Form */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Data</DialogTitle>
            <DialogDescription>
              Make changes to your data here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          {/* <EditForm data={data} page={page} /> */}
          <DialogFooter>
            <Button onClick={handleCloseDialog}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default ActionButtons;