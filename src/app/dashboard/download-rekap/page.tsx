import { getCurrentSession } from "@/app/actions/auth.actions";
import { redirect } from "next/navigation";
import { getFilterData } from "@/app/actions/lpg-distribution.action";
import DownloadComponent from "@/components/Screens/Download/DownloadComponent";

export const metadata = {
  title: "Rekap Penyaluran PKMU",
};

export default async function DownloadPage() {
  const [dataBpeDeliveryAgent, sessionData] = await Promise.all([
    getFilterData(),
    getCurrentSession(),
  ]);

  const { user, session } = sessionData;
  if (!session && !user) {
    redirect("/auth/login");
  }
  return <DownloadComponent dataBpeDeliveryAgent={dataBpeDeliveryAgent} />;
}
