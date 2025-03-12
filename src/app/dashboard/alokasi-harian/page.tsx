import {
  getAllocationDefault,
  getFilterDataAllocation,
} from "@/app/actions/alokasi.action";
import { getCurrentSession } from "@/app/actions/auth.actions";
import AlokasiHarian from "@/components/Screens/Alokasi/AlokasiHarian";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Alokasi PKMU",
};

const AlokasiPage = async () => {
  const [dataBpeDeliveryAgent, sessionData, defaultData] = await Promise.all([
    getFilterDataAllocation(),
    getCurrentSession(),
    getAllocationDefault(),
  ]);
  const { user, session } = sessionData;
  if (!session && !user) {
    redirect("/auth/login");
  }
  return (
    <AlokasiHarian
      user={user}
      defaultdata={defaultData}
      dataBpeDeliveryAgent={dataBpeDeliveryAgent}
    />

    // <AlokasiHarian
    //   columns={
    //     user.role === "ADMIN" ? adminAllocationColumns : allocationColumns
    //   }
    //   user={user}
    // />
  );
};

export default AlokasiPage;
