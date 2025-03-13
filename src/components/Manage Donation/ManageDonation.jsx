import { useEffect, useState,  useRef } from "react";
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


  const donationTableRef = useRef(null);
  const uploadBankRef = useRef(null);

  const handleOnSubmit = () => {
    if (donationTableRef.current) {
      donationTableRef.current.clickButton();
      console.log("Donation Table Refresh Clicked")
    }
    if (uploadBankRef.current) {
      uploadBankRef.current.clickButton();
      console.log("Upload Bank Stats Refresh Clicked")
    }
  };

  return (
    <div className="p-6 h-full w-full">
      {parsedData.ROLE_CODE === 4 ? (
        ""
      ) : (
        <>
          <UploadBankStatement
            selectedTransaction={selectedTransaction}
            onSelectTransaction={setSelectedTransaction}
            setisSearchDisable={setisSearchDisable}
            setSelectedDonationTable={setSelectedDonationTable}
            setShowForm={setShowForm}
            ref={uploadBankRef} 
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
            onSubmit={handleOnSubmit}
          />
        </>
      )}

      <DonationTable
        setSelectedDonationTable={setSelectedDonationTable}
        selectedTransaction={selectedTransaction}
        setFormData={setFormData}
        setShowForm={setShowForm}
        ref={donationTableRef}
      />
    </div>
  );
};

export default ManageDonation;
