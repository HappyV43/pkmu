// import Alokasi from "@/components/Alokasi/Alokasi";
import { getCurrentSession } from "@/app/actions/auth.actions";
import { ContentLayout } from "@/components/ContentLayout";
import UploadAlokasiBulanan from "@/components/UploadAlokasiBulanan/UploadAlokasiBulanan";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Upload Alokasi Bulanan PKMU",
};

const AlokasiPage = async () => {
  const { user, session } = await getCurrentSession();
  if (!user && !session) {
    redirect("/auth/login");
  }

  return (
    // <ContentLayout
    //   home={"dashboard"}
    //   mainpage={"alokasi-bulanan"}
    //   childpage={"upload"}
    //   children={
      <UploadAlokasiBulanan user={user} />
    // }/>
  );
};

export default AlokasiPage;
