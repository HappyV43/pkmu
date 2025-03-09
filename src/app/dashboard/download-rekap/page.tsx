import { getCurrentSession } from "@/app/actions/auth.actions";
import { redirect } from "next/navigation";
import {
  getFilterData,
  getLpgDataDefault,
} from "@/app/actions/lpg-distribution.action";
import DownloadComponent from "@/components/Screens/Download/DownloadComponent";

export const metadata = {
  title: "Rekap Penyaluran PKMU",
};

export default async function DownloadPage() {
  const [dataBpeDeliveryAgent, sessionData, defaultData] = await Promise.all([
    getFilterData(),
    getCurrentSession(),
    getLpgDataDefault(),
  ]);

  const { user, session } = sessionData;
  if (!session && !user) {
    redirect("/auth/login");
  }
  return (
    <DownloadComponent
      dataBpeDeliveryAgent={dataBpeDeliveryAgent}
      defaultData={defaultData}
    />
  );
}
