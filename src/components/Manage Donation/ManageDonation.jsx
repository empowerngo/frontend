import { useEffect, useState, useRef } from "react";
import UploadBankStatement from "./UploadBankStatement";
import PaymentDetails from "./PaymentDetails";
import DonationTable from "./DonationTable";
import DonationReceipt from "./Recipt";
import { handleDonationRequest } from "../../api/masterApi";
import { useSelector } from "react-redux";
import Decrypt from "../../Decrypt";
import { hasAccess } from "../../utils/ValidateAccess";

const ManageDonation = () => {
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [selectedDonationTable, setSelectedDonationTable] = useState(null);
  const [isSearchDisable, setisSearchDisable] = useState(false);
  const encryptedUserData = useSelector((state) => state.userData);
  const usageDetails = useSelector((state) => state.usageDetails);
  const canSubmit = hasAccess(usageDetails, "NUMBER_OF_DONATIONS");
  const [formData, setFormData] = useState({
    amount: "",
    bank: "",
    type: "",
    purpose: "",
    project: "",
    donationDate: "",
    note: "",
    transactionID: "",
    Fname: "",
    Lname: "",
  });
  const [showForm, setShowForm] = useState(false);
  const userData = Decrypt(encryptedUserData);
  let parsedData = JSON.parse(userData);

  const donationTableRef = useRef(null);
  const uploadBankRef = useRef(null);

  const handleOnSubmit = () => {
    if (donationTableRef.current) {
      donationTableRef.current.clickButton();
    }
    if (uploadBankRef.current) {
      uploadBankRef.current.clickButton();
    }
  };

  return (
    <div className="p-6 h-full w-full">
      {!canSubmit && (
        <marquee className="text-red-500 font-bold text-lg">
          Please Upgrade your plan to Add Donations
        </marquee>
      )}
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
