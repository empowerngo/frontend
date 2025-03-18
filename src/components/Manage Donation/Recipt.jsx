import Decrypt from "../../Decrypt";

export default function DonationReceipt({ receiptData, encryptedUserData }) {
  const userData = Decrypt(encryptedUserData);
  let parsedData = JSON.parse(userData);

  const formatDate = (isoDateString) => {
    if (!isoDateString) return "";

    console.log("Original Date String:", isoDateString);

    const date = new Date(isoDateString);

    if (isNaN(date.getTime())) {
      console.error("Invalid date string provided.");
      return "";
    }

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    const formattedDate = `${day}-${month}-${year}`;

    console.log("Formatted Date:", formattedDate);

    return formattedDate;
  };

  return (
    <div className="w-[654px] h-full bg-white overflow-hidden relative m-20 ">
      <div className="border-8 border-[#006400] pt-[2px]">
        <div className="text-center border-b border-green-600 pb-4 mb-4 ">
          <div className="flex items-center space-x-4 ml-5">
            <img
              src={parsedData.LOGO_URL}
              alt="Company Logo"
              style={{ width: "100px", height: "100px" }}
            />
            <div>
              <h1 className="text-4xl font-extrabold text-green-700">
                {parsedData.NGO_NAME}
                <br />
              </h1>
              <div className="p-2 text-start pl-10 grid grid-cols-3 gap-2">
                {[
                  `PAN No. ${parsedData.NGO_PAN}`,
                  `12A - ${parsedData.NGO_12A_NUMBER}`,
                  `80G - ${parsedData.NGO_80G_NUMBER}`,
                  `REG No. - ${parsedData.NGO_REG_NUMBER}`                 
                ].map((text, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <svg
                      className="w-2 h-2"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      stroke="#33a373"
                    >
                      <g id="SVGRepo_bgCarrier" strokeWidth="0" />
                      <g
                        id="SVGRepo_tracerCarrier"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <g id="SVGRepo_iconCarrier">
                        <rect
                          x="1"
                          y="1"
                          width="14"
                          height="14"
                          fill="#33a373"
                        />
                      </g>
                    </svg>
                    <p className="text-[10px] text-gray-600 font-medium">
                      {text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        {/* Receipt Details */}
        <div className="grid grid-cols-2 gap-6 text-sm text-gray-700 font-light pl-20 pr-20">
          {[
            ["Receipt:", receiptData.receiptNumber],
            ["Date:", formatDate(receiptData.donationDate)],
            ["Name:", `${receiptData.donorFName} ${receiptData.donorLName}`],
            ["Address:", receiptData.donorAddress || "Not Provided"],
            ["Mobile:", receiptData.donorMobile],
            ["PAN:", receiptData.donorPAN],
            ["Email:", receiptData.donorEmail || "Not Available"],
            ["Amount:", receiptData.amount],
            ["Amount in words:", receiptData.amountInWords || "Not Specified"],
            ["Payment Method:", receiptData.type],
            ["Transaction ID:", receiptData.transactionID || "Not Available"],
            [
              "Transaction Date:",
              formatDate(receiptData.crDate) || "Not Available",
            ],
            ["Bank Name:", receiptData.bank],
            ["Project:", receiptData.project],
            ["Purpose:", receiptData.purpose],
            ["Generated By:", `${parsedData.FNAME} ${parsedData.LNAME}`],
            ["Note:", receiptData.note || "No Additional Notes"],
          ].map(([title, value], index) => (
            <p key={index} className="flex items-start gap-2">
              <span className="font-semibold max-w-32">{title}</span> {value}
            </p>
          ))}
        </div>
        {/* { Footer} */}
        <div className="w-full ">
          {/* Thank You Section */}

          <div className="w-full absolute left-[40%] bottom-[25%] items-center mt-6">
            <p className=" text-2xl font-bold font-[cursive]">Thank You!</p>
          </div>

          {/* Signature Section */}
          <div className="flex flex-col items-end justify-end pr-12 mt-4">
            {/* <img
            src={parsedData.SIGNATURE_URL}
            alt="Signature"
            className="h-20 w-40"
          /> */}
            <img
              src={parsedData.SIGNATURE_URL}
              alt="Signature"
              className="h-20 w-40 mb-3"
            />

            <img
              src={parsedData.SEAL_URL}
              alt="Signature"
              className="h-20 w-40 mb-3 absolute bottom-[20%] left-[13%]"
            />
            <p className="font-bold text-black">Authorized Signatory</p>
            <p className="pr-5 font-bold text-black">
              {parsedData.AUTHORIZED_PERSON}
            </p>
          </div>

          <div className="w-full flex flex-col justify-center items-center text-xs mt-5">
            <p className="text-pink-500 font-bold">
              (We are very much gratefull for your generous donation)
            </p>
            <p>
              (Above ₹500.00 will get facility of 50% tax exemption under
              section 80G(5) of Income Tax Act)
            </p>
          </div>

          {/* Footer Section */}
          <div className="flex justify-center items-center mt-6 border-t border-green-600 pt-4 pb-4">
            <div className="text-left">
              <p className="text-gray-700 font-medium">
                Address - {parsedData.NGO_ADDRESS}
              </p>
              <p className="text-gray-700 font-medium">
                Contact No. - {parsedData.CONTACT_NUMBER} &nbsp;
                Email ID - {parsedData.EMAIL || "Not Available"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
