'use client'; // Ensure the component is rendered client-side

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Select from 'react-select';
import dynamic from 'next/dynamic';

const EducationTable = () => {
  const [data, setData] = useState([]); // Original data from the API
  const [filteredData, setFilteredData] = useState([]); // Data filtered by branch or program
  const [educationTypes, setEducationTypes] = useState<{ label: string; value: string }[]>([]);
  const [selectedEducation, setSelectedEducation] = useState(null);
  const [branches, setBranches] = useState([]);
  const [selectedBranches, setSelectedBranches] = useState([]);
  const [error, setError] = useState('');

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
        setBranches([allBranchOption, ...result.data.map((branch: any) => ({
          value: branch.brcode,
          label: branch.brcode_title,
        }))]);
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchBranches();
  }, []);

  // Fetch education data
  const fetchEducationData = async () => {
    const isAllBranches = selectedBranches.some((branch) => branch.value === 'ALL');
    const branchFilter = isAllBranches
      ? '' // No branch filter for "All Branches"
      : selectedBranches.map((branch) => branch.value).join(',');

    const apiPrefix = isAllBranches ? '/api/principal' : '/api/hod'; // Adjust API prefix dynamically
    const endpoint = `${apiPrefix}/fac_edu${
      branchFilter ? `?branches=${encodeURIComponent(branchFilter)}` : ''
    }`;

    try {
      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error(`Error fetching data: ${response.statusText}`);
      }

      const result = await response.json();
      setData(result.data); // Set the original data
      setFilteredData(result.data); // Initially, filtered data is the same as original

      // Extract unique education types for the dropdown
      const uniqueEducationTypes = Array.from(
        new Set(result.data.map((item: any) => item.Program))
      ).map((type) => ({ label: type, value: type }));
      setEducationTypes(uniqueEducationTypes);
    } catch (err: any) {
      setError(`Failed to load education data: ${err.message}`);
    }
  };

  // Fetch data whenever branches are selected
  useEffect(() => {
    if (selectedBranches.length > 0) {
      fetchEducationData();
    } else {
      // Reset data when no branches are selected
      setFilteredData([]);
    }
  }, [selectedBranches]);

  const handleEducationFilter = (selectedOption: any) => {
    setSelectedEducation(selectedOption);
    if (!selectedOption) {
      setFilteredData(data); // Reset to original data if no program is selected
    } else {
      const filtered = data.filter((item: any) => item.Program === selectedOption.value);
      setFilteredData(filtered);
    }
  };

  const exportToCSV = () => {
    if (filteredData.length === 0) {
      alert('No data available to export.');
      return;
    }

    const headers = [
      'Sl. No.',
      'Faculty Name',
      'Program',
      'Reg No',
      'School/College',
      'Specialization',
      'Medium',
      'Pass Class',
      'Year of Award',
    ];

    const rows = filteredData.map((row: any, idx: number) => ({
      'Sl. No.': idx + 1,
      'Faculty Name': row.faculty_name || 'N/A',
      Program: row.Program,
      'Reg No': row.regNo,
      'School/College': row.schoolCollege,
      Specialization: row.specialization,
      Medium: row.mediumOfInstruction,
      'Pass Class': row.passClass,
      'Year of Award': row.yearOfAward,
    }));

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
    link.setAttribute('download', 'faculty_education_details.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const branchOptions = branches;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto p-6"
    >
      <h1 className="text-3xl font-bold mb-6 text-center">Faculty Education Details</h1>

      {error && <p className="text-red-500 text-center">{error}</p>}

      <div className="mb-4 flex items-center justify-between">
        <Select
          options={branchOptions}
          isMulti
          placeholder="Filter by Branch"
          value={selectedBranches}
          onChange={(selected) => {
            setSelectedBranches(selected || []);
            setSelectedEducation(null); // Reset program filter when branches change
          }}
          className="w-1/3"
        />
        <Select
          options={educationTypes}
          isClearable
          placeholder="Filter by Education Program"
          value={selectedEducation}
          onChange={handleEducationFilter}
          className="w-1/3"
        />
        <button
          onClick={exportToCSV}
          className="px-4 py-2 bg-green-600 text-white rounded-md font-semibold hover:bg-green-700"
        >
          Export CSV
        </button>
      </div>

      <div className="overflow-x-auto">
        <motion.table
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="table-auto w-full border-collapse border border-gray-300"
        >
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left">Sl. No.</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Faculty Name</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Program</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Reg No</th>
              <th className="border border-gray-300 px-4 py-2 text-left">School/College</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Specialization</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Medium</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Pass Class</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Year of Award</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((row: any, idx) => (
                <motion.tr
                  key={idx}
                  whileHover={{ scale: 1.02 }}
                  className="hover:bg-gray-50"
                >
                  <td className="border border-gray-300 px-4 py-2">{idx + 1}</td>
                  <td className="border border-gray-300 px-4 py-2">{row.faculty_name || 'N/A'}</td>
                  <td className="border border-gray-300 px-4 py-2">{row.Program}</td>
                  <td className="border border-gray-300 px-4 py-2">{row.regNo}</td>
                  <td className="border border-gray-300 px-4 py-2">{row.schoolCollege}</td>
                  <td className="border border-gray-300 px-4 py-2">{row.specialization}</td>
                  <td className="border border-gray-300 px-4 py-2">{row.mediumOfInstruction}</td>
                  <td className="border border-gray-300 px-4 py-2">{row.passClass}</td>
                  <td className="border border-gray-300 px-4 py-2">{row.yearOfAward}</td>
                </motion.tr>
              ))
            ) : (
              <tr>
                <td colSpan={9} className="text-center py-4 text-gray-500">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </motion.table>
      </div>
    </motion.div>
  );
};

export default dynamic(() => Promise.resolve(EducationTable), { ssr: false });
