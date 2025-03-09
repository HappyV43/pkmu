import { getCurrentSession } from "@/app/actions/auth.actions";
import { redirect } from "next/navigation";
import {
  getFilterData,
  getLpgDataDefault,
} from "@/app/actions/lpg-distribution.action";
import RekapanScreen from "@/components/Screens/Rekapan/RekapanScreen";

export const metadata = {
  title: "Rekap Penyaluran PKMU",
};

const RekapPage: React.FC = async () => {
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
    <>
      <RekapanScreen
        user={user}
        dataBpeDeliveryAgent={dataBpeDeliveryAgent}
        defaultData={defaultData}
      />
    </>
  );
};

export default RekapPage;
