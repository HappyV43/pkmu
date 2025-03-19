import { getMonthlyAllocation } from "@/app/actions/alokasi.action";
import { getCurrentSession } from "@/app/actions/auth.actions";
import { getDefaultMonthlyData } from "@/app/actions/monthly-allocation.action";
import { ContentLayout } from "@/components/ContentLayout";
import AlokasiBulanan from "@/components/Screens/Alokasi/AlokasiBulanan";
import { monthlyAllocationColumns } from "@/lib/Column";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Alokasi Bulanan PKMU",
};

const AlokasiBulananPage = async () => {
  const [sessionData, data] = await Promise.all([
    getCurrentSession(),
    getDefaultMonthlyData(),
  ]);

  const { session, user } = sessionData;

  if (!session && !user) {
    redirect("/auth/login");
  }
  return (
    //   <ContentLayout
    //     home={"dashboard"}
    //     mainpage={"alokasi-bulanan"}
    //     children={
        <AlokasiBulanan
          columns={monthlyAllocationColumns}
          user={user}
          data={data}
        />
    //   }
    // />
  );
};

export default AlokasiBulananPage;
