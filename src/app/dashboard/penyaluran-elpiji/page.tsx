import { getCurrentSession } from "@/app/actions/auth.actions";
import {
  getFilterData,
  getLpgDataDefault,
} from "@/app/actions/lpg-distribution.action";
import PenyaluranElpiji from "@/components/Screens/PenyaluranElpiji/PenyaluranElpiji";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Penyaluran Elpiji PKMU",
};

const PenyaluranElpijiPage = async () => {
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
      <PenyaluranElpiji
        user={user}
        dataBpeDeliveryAgent={dataBpeDeliveryAgent}
        defaultData={defaultData}
      />
    </>
  );
};

export default PenyaluranElpijiPage;
