import { useEffect, useState } from "react";
import UploadBankStatement from "./UploadBankStatement";
import PaymentDetails from "./PaymentDetails";
import DonationTable from "./DonationTable";
import DonationReceipt from "./Recipt";
import { handleDonationRequest } from "../../api/masterApi";

const ManageDonation = () => {
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [selectedDonationTable, setSelectedDonationTable] = useState(null);
  const [isSearchDisable, setisSearchDisable] = useState(false);
  const [formData, setFormData] = useState({
    amount: "",
    bank: "",
    type: "E-Transfer",
    purpose: "",
    project: "",
    donationDate: "",
    note: "",
    transactionID: "",
  });
  const [showForm, setShowForm] = useState(false);
  const userData = localStorage.getItem("user");
  let parsedData = JSON.parse(userData);

  return (
    <div className="p-6 h-full w-full">
      {parsedData.ROLE_CODE === 4 || 3 ? (
        ""
      ) : (
        <>
          <UploadBankStatement
            selectedTransaction={selectedTransaction}
            onSelectTransaction={setSelectedTransaction}
            setisSearchDisable={setisSearchDisable}
            setSelectedDonationTable={setSelectedDonationTable}
            setShowForm={setShowForm}
          />
          <PaymentDetails
            selectedTransaction={selectedTransaction}
            setSelectedTransaction={setSelectedTransaction}
            selectedDonationTable={selectedDonationTable}
            setSelectedDonationTable={setSelectedDonationTable}
            formData={formData}
            setFormData={setFormData}
            showForm={showForm}
            setShowForm={setShowForm}
          />
        </>
      )}

      <DonationTable
        setSelectedDonationTable={setSelectedDonationTable}
        selectedTransaction={selectedTransaction}
        setFormData={setFormData}
        setShowForm={setShowForm}
      />
    </div>
  );
};

export default ManageDonation;
