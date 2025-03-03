import UploadBankStatement  from "./UploadBankStatement";
import  PaymentDetails from "./PaymentDetails";
import  DonationTable  from "./DonationTable";

const ManageDonation = () => {
  return (
    <div className="p-6 h-full">
      <UploadBankStatement />
      <PaymentDetails />
      <DonationTable />
    </div>
  );
};

export default ManageDonation;
