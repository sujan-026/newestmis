'use client';

import { useEffect, useState } from 'react';
import Select from 'react-select';
import { motion } from 'framer-motion';

// Helper function to format dates
const formatDate = (dateString: any) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  if (isNaN(date)) return '-'; // Handle invalid dates
  return `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1)
    .toString()
    .padStart(2, '0')}-${date.getFullYear()}`;
};

const TableDisplay = () => {
  const [selectedTable, setSelectedTable] = useState('');
  const [tableData, setTableData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [branches, setBranches] = useState([]);
  const [selectedBranches, setSelectedBranches] = useState([]);
  const [error, setError] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isDateFilterActive, setIsDateFilterActive] = useState(true); // Set default to `true`

  const tableDisplayNames: { [key: string]: string } = {
    fac_outreach: 'Outreach Activity',
    fac_awards: 'Awards and Recognition',
    fac_respon: 'Additional Responsibilities',
    fac_industry: 'Industrial Experience',
    fac_teach: 'Teaching Experience',
  };

  // Fetch branches
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await fetch('/api/hod/branches');
        if (!response.ok) {
          throw new Error(`Error fetching branches: ${response.statusText}`);
        }
        const result = await response.json();

        // Add "All Branches" option
        const allBranchOption = { value: 'ALL', label: 'All Branches' };
        setBranches([allBranchOption, ...result.data]);
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchBranches();
  }, []);

  // Fetch table data
  const fetchTableData = async (tableName: any) => {
    const isAllBranches = selectedBranches.some((branch) => branch.value === 'ALL');
    const branchFilter = isAllBranches
      ? '' // No branch filter required for all branches
      : selectedBranches.map((branch) => branch.value).join(',');

    const apiPrefix = isAllBranches ? '/api/principal' : '/api/hod'; // Redirect to principal for all branches
    const endpoint = `${apiPrefix}/${tableName}${
      branchFilter ? `?branches=${encodeURIComponent(branchFilter)}` : ''
    }`;

    try {
      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error(`Error fetching ${tableName} data: ${response.statusText}`);
      }
      const result = await response.json();

      setTableData(result.data);
      setFilteredData(result.data); // Initialize filtered data
      setError(''); // Clear error on success
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
    filterByDate();
  }, [startDate, endDate, tableData]);


  const filterByDate = () => {
    if (!startDate || !endDate) {
      setFilteredData(tableData);
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    const filtered = tableData.filter((row: any) => {
      const dateField = tableHeaders[selectedTable].find((header) => header.isDate)?.key;
      if (!dateField || !row[dateField]) return false;
      const rowDate = new Date(row[dateField]);
      return rowDate >= start && rowDate <= end;
    });

    setFilteredData(filtered);
  };


  const exportToCSV = () => {
    try {
      if (filteredData.length === 0) {
        alert('No data available to export.');
        return;
      }

      const headers = tableHeaders[selectedTable].map((header) => header.label);
      const rows = filteredData.map((row, idx) => {
        const rowObj: any = { 'Sl. No': idx + 1 };
        tableHeaders[selectedTable].forEach((header) => {
          rowObj[header.label] =
            header.isDate && row[header.key]
              ? formatDate(row[header.key])
              : row[header.key] || '-';
        });
        return rowObj;
      });

      const csvContent = [
        headers.join(','),
        ...rows.map((row) =>
          Object.values(row)
            .map((value) => `"${value}"`)
            .join(',')
        ),
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `faculty_data_${selectedTable}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Error exporting CSV:', err);
    }
  };

  const tableHeaders = {
    fac_outreach: [
      { label: 'Sl. No.', key: 'slno' },
      { label: 'Faculty Name', key: 'faculty_name' },
      { label: 'Activity', key: 'activity' },
      { label: 'Role', key: 'role' },
      { label: 'From Date', key: 'fromDate', isDate: true },
      { label: 'To Date', key: 'toDate', isDate: true },
      { label: 'Place', key: 'place' },
    ],
    fac_awards: [
      { label: 'Sl. No.', key: 'slno' },
      { label: 'Faculty Name', key: 'faculty_name' },
      { label: 'Recognition or Award Received', key: 'recognitionorawardReceived' },
      { label: 'Recognition or Award From', key: 'recognitionorawardFrom' },
      { label: 'Award Date', key: 'awardDate', isDate: true },
    ],
    fac_respon: [
      { label: 'Sl. No.', key: 'slno' },
      { label: 'Faculty Name', key: 'faculty_name' },
      { label: 'Level', key: 'level' },
      { label: 'From Date', key: 'fromDate', isDate: true },
      { label: 'To Date', key: 'toDate', isDate: true },
      { label: 'Responsibility', key: 'responsibility' },
    ],
    fac_industry: [
      { label: 'Sl. No.', key: 'slno' },
      { label: 'Faculty Name', key: 'faculty_name' },
      { label: 'Organization', key: 'organization' },
      { label: 'Designation', key: 'designation' },
      { label: 'From Date', key: 'fromDate', isDate: true },
      { label: 'To Date', key: 'toDate', isDate: true },
    ],
    fac_teach: [
      { label: 'Sl. No.', key: 'slno' },
      { label: 'Faculty Name', key: 'faculty_name' },
      { label: 'Institute Name', key: 'instituteName' },
      { label: 'From Date', key: 'fromDate', isDate: true },
      { label: 'To Date', key: 'toDate', isDate: true },
      { label: 'Designation', key: 'designation' },
      { label: 'Department Name', key: 'departmentName' },
    ],
  };

  const renderTable = () => {
    if (!selectedTable || filteredData.length === 0) {
      return (
        <p className="text-center mt-6">
          No data available for the selected table or branch.
        </p>
      );
    }

    const headers = tableHeaders[selectedTable];
    return (
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="overflow-x-auto mt-6 shadow-lg rounded-lg bg-white"
      >
        <table className="table-auto w-full border-collapse">
          <thead className="bg-gradient-to-r from-blue-500 to-blue-700 text-white">
            <tr>
              {headers.map((header, index) => (
                <th
                  key={index}
                  className="px-6 py-3 text-left text-sm font-semibold border border-gray-300"
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
                  idx % 2 === 0 ? 'bg-gray-100' : 'bg-white'
                } hover:bg-blue-100`}
              >
                {headers.map((header, index) => (
                  <td
                    key={index}
                    className="px-6 py-3 text-sm border border-gray-300"
                  >
                    {header.key === 'slno'
                      ? idx + 1
                      : header.isDate
                      ? formatDate(row[header.key])
                      : row[header.key] || '-'}
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
    <div className="container mx-auto p-6 min-h-screen">
      <h1 className="text-4xl font-bold text-center text-blue-700 mb-8">
        Faculty Education
      </h1>
      {error && <p className="text-red-500 text-center">{error}</p>}

      <div className="mb-6">
        <label className="block mb-2 font-medium text-gray-700">
          Select Branches:
        </label>
        <Select
          options={branches.map((branch) => ({
            value: branch.value || branch.brcode,
            label: branch.label || branch.brcode_title,
          }))}
          value={selectedBranches}
          onChange={(selected) => setSelectedBranches(selected || [])}
          isMulti
          placeholder="Select branches"
          className="shadow-lg"
        />
      </div>
      
      <div className="flex flex-wrap justify-center gap-4 mb-6">
        {Object.keys(tableHeaders).map((table) => (
          <button
            key={table}
            onClick={() => setSelectedTable(table)}
            className={`px-6 py-2 rounded-md font-medium shadow-md transition-all ${
              selectedTable === table
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-blue-100'
            }`}
          >
            {tableDisplayNames[table]}
          </button>

        ))}
      </div>
      <div className="flex justify-center mb-6 gap-4">
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border p-2 rounded"
        />
        <button
          onClick={filterByDate}
          disabled={!startDate || !endDate}
          className={`px-4 py-2 rounded ${
            startDate && endDate
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Filter
        </button>
        <button
          onClick={exportToCSV}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Export CSV
        </button>
      </div>
      {renderTable()}
    </div>
  );
};

export default TableDisplay;
