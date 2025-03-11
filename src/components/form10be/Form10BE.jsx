import { useState } from "react";

const Form10BE = () => {
  const currentYear = new Date().getFullYear();
  const financialYears = Array.from({ length: 5 }, (_, i) => {
    const startYear = currentYear - i;
    return `${startYear}-${startYear + 1}`;
  });

  const [selectedYear, setSelectedYear] = useState(financialYears[0]);

  const handleDownloadReport = () => {
    if (!selectedYear) return;
    const data = `Financial Year: ${selectedYear}\nReport Data...`;
    console.log(data);
  };

  return (
    <div className="w-full mt-16 mx-auto p-6 bg-gray-100 rounded-lg shadow-md">
      <label className="block text-lg font-semibold mb-2">
        Select Financial Year
      </label>
      <div className="flex justify-around items-center">
        <select
          className="p-2 w-[200px] border border-gray-300 rounded-md text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
        >
          {financialYears.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
        <button
          onClick={handleDownloadReport}
          className="mt-4 bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition"
        >
          Generate Report
        </button>
      </div>
    </div>
  );
};

export default Form10BE;
