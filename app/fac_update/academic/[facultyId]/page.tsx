"use client";

import React, { useState, useEffect } from "react";

const FacultyDetailsPage = () => {
  const [data, setData] = useState<any>(null); // Contains data for all tables
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  const employeeId = "SHA512"; // Replace with the actual employee ID

  useEffect(() => {
    // Fetch data for all tables
    fetch(`/api/fac_update_academics?employee_id=${employeeId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.data) {
          // Remove FacultyAcademicDetails from data
          const { FacultyAcademicDetails, ...restData } = data.data;
          setData(restData);
        } else {
          setError(data.message || "Failed to fetch data");
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch data");
        setLoading(false);
      });
  }, [employeeId]);

  const handleChange = (table: string, index: number, field: string, value: any) => {
    setData((prev: any) => ({
      ...prev,
      [table]: prev[table].map((row: any, i: number) =>
        i === index ? { ...row, [field]: value } : row
      ),
    }));
  };

  const addNewRow = (table: string) => {
    const newRow = Object.keys(data[table][0] || {}).reduce((acc, key) => {
      acc[key] = key === "id" ? null : ""; // Default value for new rows
      return acc;
    }, {} as any);

    setData((prev: any) => ({
      ...prev,
      [table]: [...prev[table], newRow],
    }));
  };

  const handleDelete = (table: string, index: number, id: number | null) => {
    if (id) {
      fetch(`/api/fac_update_academics`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, table }),
      })
        .then((res) => res.json())
        .then((response) => {
          if (response.message === "Record deleted successfully") {
            alert("Record deleted successfully!");
          } else {
            alert(`Error: ${response.message}`);
          }
        })
        .catch(() => {
          alert("Failed to delete the record");
        });
    }

    // Remove the record locally
    setData((prev: any) => ({
      ...prev,
      [table]: prev[table].filter((_: any, i: number) => i !== index),
    }));
  };

  const handleUpdate = () => {
    fetch(`/api/fac_update_academics`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        facultyId: employeeId,
        previousTeachingExperienceSchema: data.TeachingExperience,
        teachingExperienceIndustrySchema: data.IndustryExperience,
        awardsSchema: data.AwardAndRecognition,
        recognitionsSchema: data.AwardAndRecognition, // Adjust as needed
        responsibilitiesSchema: data.addtionalResponsibility,
        extracurricularsSchema: data.Extracurricular,
        outreachSchema: data.OutreachActivity,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          alert("Data updated successfully!");
        } else {
          alert(`Error: ${data.error}`);
        }
      })
      .catch(() => {
        alert("Failed to update data");
      });
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const renderTable = (table: string, rows: any[]) => {
    // Exclude id and employee_id from headers
    const headers = rows.length
      ? Object.keys(rows[0]).filter((key) => key !== "id" && key !== "employee_id")
      : [];

    return (
      <div key={table} className="mb-6">
        <h2 className="text-2xl font-bold my-4">{table.replace(/([A-Z])/g, " $1")}</h2>
        <table className="table-auto border-collapse border border-gray-300 w-full text-left">
          <thead>
            <tr className="bg-gray-200">
              {headers.map((header) => (
                <th key={header} className="border border-gray-300 px-4 py-2">
                  {header.replace(/([A-Z])/g, " $1")}
                </th>
              ))}
              <th className="border border-gray-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={index}>
                {headers.map((header) => (
                  <td key={header} className="border border-gray-300 px-4 py-2">
                    {header.toLowerCase().includes("date") ? (
                      <input
                        type="date"
                        value={row[header]?.split("T")[0] || ""} // Handle date format
                        onChange={(e) =>
                          handleChange(table, index, header, e.target.value)
                        }
                        className="w-full border border-gray-300 p-2 rounded"
                      />
                    ) : (
                      <input
                        type="text"
                        value={row[header] || ""}
                        onChange={(e) =>
                          handleChange(table, index, header, e.target.value)
                        }
                        className="w-full border border-gray-300 p-2 rounded"
                      />
                    )}
                  </td>
                ))}
                <td className="border border-gray-300 px-4 py-2">
                  <button
                    onClick={() => handleDelete(table, index, row.id)}
                    className="bg-red-600 text-white px-4 py-2 rounded shadow hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          onClick={() => addNewRow(table)}
          className="bg-green-600 text-white px-6 py-2 rounded shadow hover:bg-green-700 mt-4"
        >
          Add New Row
        </button>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Faculty Details</h1>
      {data &&
        Object.entries(data).map(([table, rows]) => renderTable(table, rows))}
      <div className="mt-6 text-center">
        <button
          type="button"
          onClick={handleUpdate}
          className="bg-blue-600 text-white px-6 py-2 rounded shadow hover:bg-blue-700"
        >
          Update All
        </button>
      </div>
    </div>
  );
};

export default FacultyDetailsPage;
