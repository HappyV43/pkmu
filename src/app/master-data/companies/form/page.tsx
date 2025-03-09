import { getCurrentSession } from "@/app/actions/auth.actions";
import { ContentLayout } from "@/components/ContentLayout";
import CompanyForm from "@/components/Screens/FormComponent/CompanyForm";
import { redirect } from "next/navigation";
import React from "react";

export const metadata = {
  title: "Form PKMU",
};

const FormCompanyPage = async () => {
  const { session, user } = await getCurrentSession();
  if (!session && !user) {
    redirect("/auth/login");
  }
  return (
    // <ContentLayout
    //   home={"master-data"}
    //   mainpage={"companies"}
    //   childpage={"form"}
    //   children={
        <CompanyForm user={user} />
    //   }
    // />
  );
};

export default FormCompanyPage;
