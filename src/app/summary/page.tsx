import { redirect } from "next/navigation";
import { getCurrentSession } from "../actions/auth.actions";
import Summary from "@/components/Screens/Summary/Summary";
import {
  allDataDefault,
  getSummaryToday,
  getWeeklySummaryDefault,
  getYearlySummaryData,
} from "../actions/summary.action";

export const metadata = {
  title: "Data Summary PKMU",
};

const SummaryPage = async () => {
  const [sessionData, summaryData, weekly, yearly, allData] = await Promise.all([
    getCurrentSession(),
    getSummaryToday(),
    getWeeklySummaryDefault(),
    getYearlySummaryData(),
    allDataDefault()
  ]);

  const { session, user } = sessionData;
  if (!session && !user) {
    redirect("/auth/login");
  }

  return (
    // <ContentLayout
    //   home={"summary"}
    //   children={
    <>
      <Summary defaultdata={summaryData} weekly={weekly} yearly={yearly} allData={allData} />
    </>

    // }
    // />
  );
};

export default SummaryPage;
