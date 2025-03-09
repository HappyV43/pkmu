import { getCurrentSession } from "@/app/actions/auth.actions";
import { ContentLayout } from "@/components/ContentLayout";
import Register from "@/components/Screens/Register/RegisterForm";

export const metadata = {
  title: "Register PKMU",
};

const RegisterPage = async () => {
  const { user } = await getCurrentSession();
  const role = user?.role || "USER";
  return (
    // <ContentLayout
    //   home={"setting"}
    //   mainpage={"register"}
    //   children={
        <Register role={role} />
    //   }
    // />
  );
};

export default RegisterPage;
