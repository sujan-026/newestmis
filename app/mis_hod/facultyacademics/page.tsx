'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Parser } from 'json2csv'; // Ensure this library is installed

// Helper function to format dates
const formatDate = (dateString) => {
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
  const [branch, setBranch] = useState('');
  const [error, setError] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isDateFilterActive, setIsDateFilterActive] = useState(false);

  // Fetch branch only on the client
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedBranch = sessionStorage.getItem('departmentName');
      if (storedBranch) {
        setBranch(storedBranch);
      } else {
        setError('Branch not found in session');
      }
    }
  }, []);

  const fetchTableData = async (tableName) => {
    if (!branch) {
      setError('Branch is not set. Cannot fetch data.');
      return;
    }

    try {
      const response = await fetch(`/api/hod/${tableName}?branches=${encodeURIComponent(branch)}`);
      if (!response.ok) {
        throw new Error(`Error fetching ${tableName} data: ${response.statusText}`);
      }

      const result = await response.json();
      const hasDateFields = tableHeaders[tableName].some((header) => header.isDate);
      setIsDateFilterActive(hasDateFields);

      setTableData(result.data);
      setFilteredData(result.data);
      setError('');
    } catch (err) {
      setError(err.message);
      setTableData([]);
      setFilteredData([]);
    }
  };

  useEffect(() => {
    if (selectedTable) {
      fetchTableData(selectedTable);
    }
  }, [selectedTable]);

  const filterByDate = () => {
    if (!startDate || !endDate) {
      setFilteredData(tableData);
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    const filtered = tableData.filter((row) => {
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
        const rowObj = { 'Sl. No': idx + 1 };
        tableHeaders[selectedTable].forEach((header) => {
          rowObj[header.label] =
            header.isDate && row[header.key]
              ? formatDate(row[header.key])
              : row[header.key] || '-';
        });
        return rowObj;
      });

      const parser = new Parser({ fields: ['Sl. No', ...headers] });
      const csv = parser.parse(rows);

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute(
        'download',
        `${selectedTable}_data_${branch}_${new Date().toISOString().slice(0, 10)}.csv`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Error exporting CSV:', err);
      alert('An error occurred while exporting the data. Please try again.');
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
                  className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider border border-gray-300"
                >
                  {header.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row, idx) => (
              <tr
                key={idx}
                className={`${
                  idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                } hover:bg-blue-50`}
              >
                {headers.map((header, index) => (
                  <td
                    key={index}
                    className="px-6 py-4 text-sm text-gray-700 border border-gray-300"
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
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Faculty Information Management</h1>
      {error && <p className="text-red-500 text-center">{error}</p>}
      {isDateFilterActive && (
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
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
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
      )}
      <div className="flex flex-wrap justify-center gap-4 mb-6">
        <button
          onClick={() => setSelectedTable('fac_outreach')}
          className={`px-4 py-2 rounded-md ${
            selectedTable === 'fac_outreach'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 hover:bg-blue-100'
          }`}
        >
          Outreach Activities
        </button>
        <button
          onClick={() => setSelectedTable('fac_awards')}
          className={`px-4 py-2 rounded-md ${
            selectedTable === 'fac_awards'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 hover:bg-blue-100'
          }`}
        >
          Awards & Recognition
        </button>
        <button
          onClick={() => setSelectedTable('fac_respon')}
          className={`px-4 py-2 rounded-md ${
            selectedTable === 'fac_respon'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 hover:bg-blue-100'
          }`}
        >
          Additional Responsibility
        </button>
        <button
          onClick={() => setSelectedTable('fac_industry')}
          className={`px-4 py-2 rounded-md ${
            selectedTable === 'fac_industry'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 hover:bg-blue-100'
          }`}
        >
          Industry Experience
        </button>
        <button
          onClick={() => setSelectedTable('fac_teach')}
          className={`px-4 py-2 rounded-md ${
            selectedTable === 'fac_teach'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 hover:bg-blue-100'
          }`}
        >
          Teaching Experience
        </button>
      </div>

      {renderTable()}
    </div>
  );
};

export default TableDisplay;
