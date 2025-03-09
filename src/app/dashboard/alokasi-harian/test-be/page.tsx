import { getCurrentSession } from "@/app/actions/auth.actions";
import { redirect } from "next/navigation";
import React from "react";
import AlokasiHarianBe from "@/components/Screens/Alokasi/AlokasiHarianBe";
import { getAllocationDefault, getFilterDataAllocation } from "@/app/actions/alokasi.action";

const AllokasiHarianBePage = async () => {
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
    // <ContentLayout
    //   home={"dashboard"}
    //   mainpage={"alokasi-harian"}
    //   children={
    <AlokasiHarianBe user={user} defaultdata={defaultData} dataBpeDeliveryAgent={dataBpeDeliveryAgent} />
    //   }
    // />
  );
};

export default AllokasiHarianBePage;
