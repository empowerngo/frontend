import { useEffect, useState } from "react";
import DonationSummary from "../../components/dashboard/DonationDashboard";
import { retrieveDashboard } from "../../api/masterApi";
import { useSelector } from "react-redux";
import Decrypt from "../../Decrypt";
import SuperAdminDashboard from "../../components/dashboard/SuperAdminDashboard";
const data = {
  dailySummary: [
    { TodaySum: "0.00", MonthToDateSum: "7502.00", YearToDateSum: "179729.00" },
  ],
  monthlySummary: [
    { DonationMonth: 2, MonthlySum: "172227.00" },
    { DonationMonth: 3, MonthlySum: "7502.00" },
  ],
  receiptCount: [{ RECEIPT_COUNT: 27 }],
  userCount: [{ USER_COUNT: 6 }],
  donationSummary: [
    { PROJECT: "Balgram", PURPOSE: "Child Shelter", AMOUNT: "200.00" },
    { PROJECT: "Balgram", PURPOSE: "Education", AMOUNT: "7000.00" },
    { PROJECT: "Balgram", PURPOSE: "Education Support", AMOUNT: "2299.00" },
    { PROJECT: "Balgram", PURPOSE: "Food Support", AMOUNT: "1100.00" },
    { PROJECT: "Balgram", PURPOSE: "Medical Support", AMOUNT: "15703.00" },
    { PROJECT: "Balgram", PURPOSE: "Nutrition", AMOUNT: "14151.00" },
    {
      PROJECT: "Scholarship Program",
      PURPOSE: "Education",
      AMOUNT: "134876.00",
    },
    { PROJECT: "Yuvagram", PURPOSE: "Food Support", AMOUNT: "6302.00" },
    { PROJECT: "Yuvagram", PURPOSE: "Scholarship", AMOUNT: "4000.00" },
  ],
};

const Dashboard = () => {
  const [Data, setData] = useState(null);
  const encryptedUserData = useSelector((state) => state.userData);
  const userData = JSON.parse(Decrypt(encryptedUserData));
  console.log(userData);
  const getData = async () => {
    const response = await retrieveDashboard(Decrypt(encryptedUserData));
    console.log(response);
    setData(response);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      {userData.ROLE_CODE === 1 ? (
        <SuperAdminDashboard data={Data || {}} />
      ) : (
        <DonationSummary data={Data || {}} />
      )}
    </>
  );
};

export default Dashboard;
