import { useState } from "react";
import Joi from "joi";
import { handleForm10BERequest } from "../../api/masterApi";

const Form10BE = () => {
  const currentYear = new Date().getFullYear();
  const financialYears = Array.from({ length: 5 }, (_, i) => {
    const startYear = currentYear - i;
    return `${startYear}-${startYear + 1}`;
  });

  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  const [selectedFinancialYear, setSelectedFinancialYear] = useState(
    financialYears[0]
  );
  const [selectedYear, setSelectedYear] = useState(years[0]);

  const schema = Joi.object({
    ngoID: Joi.number().required(),
    startDate: Joi.string().required(),
    endDate: Joi.string().required(),
    ngo80GNumber: Joi.string().required(),
    reg80GDate: Joi.string().required(),
  });

  const getStartAndEndDates = (financialYear) => {
    const [startYear, endYear] = financialYear.split("-").map(Number);
    return {
      startDate: `${startYear}-04-01`,
      endDate: `${endYear}-03-31`,
    };
  };

  const handleDownloadReport = async () => {
    const { startDate, endDate } = getStartAndEndDates(selectedFinancialYear);
    const userData = localStorage.getItem("user");
    const parsedUser = JSON.parse(userData);

    const requestData = {
      ngoID: parsedUser.NGO_ID,
      startDate,
      endDate,
      ngo80GNumber: parsedUser.NGO_80G_NUMBER,
      reg80GDate: parsedUser.NGO_80G_NUMBER,
    };

    const { error } = schema.validate(requestData);
    if (error) {
      console.error("Validation error:", error.details);
      return;
    }

    console.log(requestData);

    try {
      const response = await handleForm10BERequest(requestData);
      if (!response.ok) throw new Error("Failed to download");
      const result = await response.json();
      console.log("Report Generated:", result);
    } catch (err) {
      console.error("Error generating report:", err);
    }
  };

  return (
    <div className="w-full mt-16 mx-auto p-6 bg-gray-100 rounded-lg shadow-md">
      <label className="block text-lg font-semibold mb-2">
        Select Financial Year
      </label>
      <select
        className="p-2 w-[400px] border border-gray-300 rounded-md text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={selectedFinancialYear}
        onChange={(e) => setSelectedFinancialYear(e.target.value)}
      >
        {financialYears.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>

      <button
        onClick={handleDownloadReport}
        className="mt-4 bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition ml-24"
      >
        Generate Report
      </button>
    </div>
  );
};

export default Form10BE;
