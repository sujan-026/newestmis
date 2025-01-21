"use client";

import { useEffect, useState } from "react";
import Select from "react-select";
import { motion } from "framer-motion";

// Helper function to format dates
const formatDate = (dateString: string) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Invalid Date";
  return `${date.getDate().toString().padStart(2, "0")}-${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${date.getFullYear()}`;
};

const ResearchTableDisplay = () => {
  const [selectedTable, setSelectedTable] = useState("");
  const [tableData, setTableData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [branches, setBranches] = useState([]);
  const [selectedBranches, setSelectedBranches] = useState([]);
  const [error, setError] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Tables that require date filtering
  const tablesWithDateFilter = [
    "fac_bookPublication",
    "fac_conferenceAndJournal",
    "fac_patent",
    "fac_eventAttended",
    "fac_eventOrganized",
    "fac_consultancy",
  ];

  // Fetch branches
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await fetch("/api/hod/branches");
        if (!response.ok) {
          throw new Error(`Error fetching branches: ${response.statusText}`);
        }
        const result = await response.json();
        setBranches(result.data);
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchBranches();
  }, []);

  // Fetch table data
  const fetchTableData = async (tableName: string) => {
    try {
      const isAllBranches = selectedBranches.some(
        (branch) => branch.value === "ALL"
      );
      const branchFilter = isAllBranches
        ? "" // No branch filter needed for "All Branches"
        : selectedBranches.map((branch) => branch.value).join(",");

      const apiPrefix = isAllBranches ? "/api/principal" : "/api/hod";
      const endpoint = `${apiPrefix}/${tableName}${
        branchFilter ? `?branches=${encodeURIComponent(branchFilter)}` : ""
      }`;

      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error(
          `Error fetching ${tableName} data: ${response.statusText}`
        );
      }

      const result = await response.json();
      setTableData(result.data);
      setFilteredData(result.data); // Initialize filtered data
      setError("");
    } catch (err: any) {
      setError(err.message);
      setTableData([]);
      setFilteredData([]);
    }
  };

  useEffect(() => {
    if (selectedTable) {
      fetchTableData(selectedTable);
    }
  }, [selectedTable, selectedBranches]);

  useEffect(() => {
    if (tablesWithDateFilter.includes(selectedTable)) {
      filterByDate();
    }
  }, [startDate, endDate, tableData]);

  const filterByDate = () => {
    if (!startDate || !endDate) {
      setFilteredData(tableData); // Reset to full data if no dates are set
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    const filtered = tableData.filter((row: any) => {
      const dateFields = tableHeaders[selectedTable]
        .filter((header) => header.isDate)
        .map((header) => header.key);

      return dateFields.some((field) => {
        const rowDate = new Date(row[field]);
        return rowDate >= start && rowDate <= end;
      });
    });

    setFilteredData(filtered);
  };

  const resetDateFilter = () => {
    setStartDate("");
    setEndDate("");
    setFilteredData(tableData); // Reset the filtered data to the full table data
  };

  const exportToCSV = () => {
    try {
      if (filteredData.length === 0) {
        alert("No data available to export.");
        return;
      }

      const headers = tableHeaders[selectedTable].map((header) => header.label);
      const rows = filteredData.map((row, idx) => {
        const rowObj: any = { "Sl. No": idx + 1 };
        tableHeaders[selectedTable].forEach((header) => {
          rowObj[header.label] =
            header.isDate && row[header.key]
              ? formatDate(row[header.key])
              : row[header.key] || "-";
        });
        return rowObj;
      });

      const csvContent = [
        headers.join(","),
        ...rows.map((row) =>
          Object.values(row)
            .map((value) => `"${value}"`)
            .join(",")
        ),
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `faculty_data_${selectedTable}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Error exporting CSV:", err);
    }
  };

  const branchOptions = [
    { value: "ALL", label: "All Branches" },
    ...branches.map((branch) => ({
      value: branch.brcode,
      label: branch.brcode_title,
    })),
  ];

  const tableHeaders: {
    [key: string]: { label: string; key: string; isDate?: boolean }[];
  } = {
    fac_research: [
      { label: "Sl. No.", key: "slno" },
      { label: "Employee Name", key: "faculty_name" },
      { label: "ORCID ID", key: "orcidId" },
      { label: "Google Scholar ID", key: "googleScholarId" },
      { label: "Scopus ID", key: "scopusId" },
      { label: "Publons ID", key: "publonsId" },
      { label: "Researcher ID", key: "researchId" },
    ],
    fac_bookPublication: [
      { label: "Sl. No.", key: "slno" },
      { label: "Employee Name", key: "faculty_name" },
      { label: "Title", key: "title" },
      { label: "Publication Type", key: "publicationType" },
      { label: "ISSN", key: "issn" },
      { label: "Publisher", key: "publisher" },
      { label: "Impact Factor", key: "impactFactor" },
      { label: "Year of Publish", key: "yearOfPublish", isDate: true },
      { label: "Authors", key: "authors" },
    ],
    fac_conferenceAndJournal: [
      { label: "Sl. No.", key: "slno" },
      { label: "Employee Name", key: "faculty_name" },
      { label: "Title", key: "title" },
      { label: "Type of Publication", key: "typeOfPublication" },
      { label: "DOI", key: "doi" },
      { label: "ISSN", key: "issn" },
      { label: "Year of Publication", key: "yearOfPublication", isDate: true },
      { label: "Impact Factor", key: "impactFactor" },
      { label: "Volume", key: "volume" },
      { label: "Pages", key: "pages" },
    ],
    fac_patent: [
      { label: "Sl. No.", key: "slno" },
      { label: "Employee Name", key: "faculty_name" },
      { label: "Granted Year", key: "grantedYear", isDate: true },
      { label: "Patent Number", key: "patentNo" },
      { label: "Patent Status", key: "patentStatus" },
    ],
    fac_researchProject: [
      { label: "Sl. No.", key: "slno" },
      { label: "Employee Name", key: "faculty_name" },
      { label: "Project Title", key: "projectTitle" },
      { label: "Principal Investigator", key: "pi" },
      { label: "Co-PI", key: "coPi" },
      { label: "Funding Agency", key: "fundingAgency" },
      { label: "Duration", key: "duration" },
      { label: "Amount", key: "amount" },
      { label: "Status", key: "status" },
    ],
    fac_eventAttended: [
      { label: "Sl. No.", key: "slno" },
      { label: "Employee Name", key: "faculty_name" },
      { label: "Event Name", key: "eventName" },
      { label: "Type of Event", key: "typeOfEvent" },
      { label: "Organizer", key: "organizer" },
      { label: "Venue", key: "venue" },
      { label: "From Date", key: "fromDate", isDate: true },
      { label: "To Date", key: "toDate", isDate: true },
    ],
    fac_eventOrganized: [
      { label: "Sl. No.", key: "slno" },
      { label: "Employee Name", key: "faculty_name" },
      { label: "Event Name", key: "eventName" },
      { label: "Type of Event", key: "typeOfEvent" },
      { label: "Organizer", key: "organizer" },
      { label: "Venue", key: "venue" },
      { label: "From Date", key: "fromDate", isDate: true },
      { label: "To Date", key: "toDate", isDate: true },
    ],
    fac_consultancy: [
      { label: "Sl. No.", key: "slno" },
      { label: "Employee Name", key: "faculty_name" },
      { label: "Project Title", key: "projectTitle" },
      { label: "Principal Investigator", key: "principalInvestigator" },
      { label: "Co-PI", key: "coPrincipalInvestigator" },
      { label: "Sanctioned Date", key: "sanctionedDate", isDate: true },
      { label: "Amount", key: "amount" },
      { label: "Status", key: "status" },
    ],
  };

  const renderTable = () => {
    if (!selectedTable || filteredData.length === 0) return null;

    const headers = tableHeaders[selectedTable];
    return (
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="overflow-x-auto mt-6 shadow-lg rounded-lg bg-white"
      >
        <table className="table-auto w-full border-collapse">
          <thead className="bg-blue-600 text-white">
            <tr>
              {headers.map((header, index) => (
                <th
                  key={index}
                  className="px-4 py-2 text-left text-sm font-medium border border-gray-300"
                >
                  {header.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row: any, idx: number) => (
              <tr
                key={idx}
                className={`${
                  idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                } hover:bg-blue-100`}
              >
                {headers.map((header, index) => (
                  <td
                    key={index}
                    className="px-4 py-2 text-sm border border-gray-300"
                  >
                    {header.key === "slno"
                      ? idx + 1
                      : header.isDate
                      ? formatDate(row[header.key])
                      : row[header.key] || "N/A"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    );
  };
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">
        Faculty Research Details
      </h1>
      {error && <p className="text-red-500 text-center">{error}</p>}
      <div className="mb-6">
        <label className="block mb-2 font-medium">Select Branches:</label>
        <Select
          options={branchOptions}
          value={selectedBranches}
          onChange={(selected) => setSelectedBranches(selected || [])}
          isMulti
          placeholder="Select branches"
        />
      </div>
      <div className="flex flex-wrap justify-center gap-4 mb-6">
        <button
          onClick={() => setSelectedTable("fac_research")}
          className={`px-6 py-2 rounded-md font-semibold ${
            selectedTable === "fac_research"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 hover:bg-blue-100"
          }`}
        >
          Research Details
        </button>
        <button
          onClick={() => setSelectedTable("fac_bookPublication")}
          className={`px-6 py-2 rounded-md font-semibold ${
            selectedTable === "fac_bookPublication"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 hover:bg-blue-100"
          }`}
        >
          Book Publications
        </button>
        <button
          onClick={() => setSelectedTable("fac_conferenceAndJournal")}
          className={`px-6 py-2 rounded-md font-semibold ${
            selectedTable === "fac_conferenceAndJournal"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 hover:bg-blue-100"
          }`}
        >
          Conference and Journals
        </button>
        <button
          onClick={() => setSelectedTable("fac_patent")}
          className={`px-6 py-2 rounded-md font-semibold ${
            selectedTable === "fac_patent"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 hover:bg-blue-100"
          }`}
        >
          Patents
        </button>
        <button
          onClick={() => setSelectedTable("fac_researchProject")}
          className={`px-6 py-2 rounded-md font-semibold ${
            selectedTable === "fac_researchProject"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 hover:bg-blue-100"
          }`}
        >
          Research Projects
        </button>
        <button
          onClick={() => setSelectedTable("fac_eventAttended")}
          className={`px-6 py-2 rounded-md font-semibold ${
            selectedTable === "fac_eventAttended"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 hover:bg-blue-100"
          }`}
        >
          Events Attended
        </button>
        <button
          onClick={() => setSelectedTable("fac_eventOrganized")}
          className={`px-6 py-2 rounded-md font-semibold ${
            selectedTable === "fac_eventOrganized"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 hover:bg-blue-100"
          }`}
        >
          Events Organized
        </button>
        <button
          onClick={() => setSelectedTable("fac_consultancy")}
          className={`px-6 py-2 rounded-md font-semibold ${
            selectedTable === "fac_consultancy"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 hover:bg-blue-100"
          }`}
        >
          Consultancies
        </button>
      </div>
      {tablesWithDateFilter.includes(selectedTable) && (
        <div className="flex flex-wrap justify-center gap-4 items-center mb-6">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border border-gray-300 p-2 rounded-md shadow-sm focus:ring focus:ring-blue-400 focus:outline-none"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border border-gray-300 p-2 rounded-md shadow-sm focus:ring focus:ring-blue-400 focus:outline-none"
          />
          <button
            onClick={filterByDate}
            disabled={!startDate || !endDate}
            className={`px-6 py-2 rounded-md font-semibold ${
              startDate && endDate
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Apply Filter
          </button>
          <button
            onClick={resetDateFilter}
            className="px-6 py-2 bg-red-600 text-white rounded-md font-semibold hover:bg-red-700"
          >
            Reset Filter
          </button>
          <button
            onClick={exportToCSV}
            className="px-6 py-2 bg-green-600 text-white rounded-md font-semibold hover:bg-green-700"
          >
            Export CSV
          </button>
        </div>
      )}
      {!tablesWithDateFilter.includes(selectedTable) && (
        <div className="flex justify-center mb-6">
          <button
            onClick={exportToCSV}
            className="px-6 py-2 bg-green-600 text-white rounded-md font-semibold hover:bg-green-700"
          >
            Export CSV
          </button>
        </div>
      )}
      {renderTable()}
    </div>
  );
};

export default ResearchTableDisplay;
