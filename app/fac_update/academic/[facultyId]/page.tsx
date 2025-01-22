"use client";

import React, { useState, useEffect } from "react";

const FacultyDetailsPage = () => {
  const [data, setData] = useState<any>(null); // Contains data for all tables
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [employeeId, setEmployeeId] = useState<string | null>(null);
  //const employeeId = "CSU07"; // Replace with the actual employee ID
  useEffect(() => {
    const pathname = window.location.pathname; // Get the full path
    const segments = pathname.split("/"); // Split path into segments
    const idFromPath = segments[segments.length - 1]; // Get the last segment (facultyId)
    console.log(idFromPath);
    if (idFromPath) {
        setEmployeeId(idFromPath);
      } else {
        console.warn("Faculty ID is not present in the dynamic route.");
      }
    }, []);  // Default schemas for all tables
    console.log("use state data: ", employeeId);
  const defaultSchemas = {
    FacultyAcademicDetails: [{ employee_id: employeeId, id: "", level: "" }],
    TeachingExperience: [
      {
        employee_id: employeeId,
        id: "",
        instituteName: "",
        fromDate: "",
        toDate: "",
        Designation: "",
        departmentName: "",
      },
    ],
    IndustryExperience: [
      {
        employee_id: employeeId,
        id: "",
        organization: "",
        fromDate: "",
        toDate: "",
        designation: "",
      },
    ],
    AwardAndRecognition: [
      {
        employee_id: employeeId,
        id: "",
        recognitionorawardReceived: "",
        recognitionorawardFrom: "",
        awardReceived: "",
        awardDate: "",
        awardFrom: "",
        recognitionorawardDate: "",
      },
    ],
    AdditionalResponsibility: [
      {
        employee_id: employeeId,
        id: "",
        level: "",
        fromDate: "",
        toDate: "",
        responsibility: "",
      },
    ],
    Extracurricular: [
      {
        employee_id: employeeId,
        id: "",
        eventType: "",
        eventTitle: "",
        fromDate: "",
        toDate: "",
        organizer: "",
        level: "",
        achievement: "",
      },
    ],
    OutreachActivity: [
      {
        employee_id: employeeId,
        id: "",
        activity: "",
        role: "",
        fromDate: "",
        toDate: "",
        place: "",
      },
    ],
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/fac_update_academics?employee_id=${employeeId}`);
        const response = await res.json();
        console.log("Fetched Response:", response); // Debugging response
        if (response.data) {
          const mappedData = {
            ...response.data,
            AdditionalResponsibility: response.data.addtionalResponsibility || [], // Map backend key
          };
          delete mappedData.addtionalResponsibility; // Remove old key
  
          const initializedData = Object.keys(defaultSchemas).reduce((acc, key) => {
            acc[key] = mappedData[key] || []; // Initialize with fetched data or an empty array
            return acc;
          }, {});
  
          setData(initializedData);
        } else {
          throw new Error(response.message || "Failed to fetch data");
        }
      } catch (err: any) {
        setError(err.message || "Error fetching data");
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
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
    const newRow = { ...defaultSchemas[table][0] };
    setData((prev: any) => ({
      ...prev,
      [table]: [...prev[table], newRow],
    }));
  };

  const handleDelete = async (table: string, index: number, id: number | null) => {
    if (id) {
      try {
        const res = await fetch(`/api/fac_update_academics`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id, table }),
        });
        const response = await res.json();
        if (response.message === "Record deleted successfully") {
          alert("Record deleted successfully!");
        } else {
          throw new Error(response.message);
        }
      } catch (err: any) {
        alert(err.message || "Failed to delete the record");
      }
    }

    // Remove the record locally
    setData((prev: any) => ({
      ...prev,
      [table]: prev[table].filter((_: any, i: number) => i !== index),
    }));
  };

  const handleUpdate = async () => {
    try {
      const payload = {
        facultyId: employeeId,
        previousTeachingExperienceSchema: data.TeachingExperience,
        teachingExperienceIndustrySchema: data.IndustryExperience,
        awardsSchema: data.AwardAndRecognition,
        recognitionsSchema: data.AwardAndRecognition,
        responsibilitiesSchema: data.AdditionalResponsibility,
        extracurricularsSchema: data.Extracurricular,
        outreachSchema: data.OutreachActivity,
      };

      const res = await fetch(`/api/fac_update_academics`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const response = await res.json();
      if (response.success) {
        alert("Data updated successfully!");
      } else {
        throw new Error(response.error || "Update failed");
      }
    } catch (err: any) {
      alert(err.message || "Failed to update data");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const renderTable = (table: string, rows: any[]) => {
    const headers = rows.length
      ? Object.keys(rows[0]).filter((key) => key !== "id" && key !== "employee_id")
      : Object.keys(defaultSchemas[table][0]).filter((key) => key !== "id" && key !== "employee_id");
  
    return (
      
      <div key={table} className="mb-6 overflow-auto">
        
        <h2 className="text-2xl font-bold my-4">{table.replace(/([A-Z])/g, " $1")}</h2>
        {rows.length > 0 ? (
          <table className="table-auto border-collapse border border-gray-300 w-full text-left">
            <thead>
              <tr className="bg-gray-200">
                {headers.map((header) => (
                  <th
                    key={header}
                    className="border border-gray-300 px-4 py-2"
                    style={{ minWidth: "150px", whiteSpace: "nowrap" }}
                  >
                    {header.replace(/([A-Z])/g, " $1")}
                  </th>
                ))}
                <th
                  className="border border-gray-300 px-4 py-2"
                  style={{ minWidth: "150px", whiteSpace: "nowrap" }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={index}>
                  {headers.map((header) => (
                    <td
                      key={header}
                      className="border border-gray-300 px-4 py-2"
                      style={{ minWidth: "150px", whiteSpace: "nowrap" }}
                    >
                      {header.toLowerCase().includes("date") ? (
                        <input
                          type="date"
                          value={row[header]?.split("T")[0] || ""}
                          onChange={(e) => handleChange(table, index, header, e.target.value)}
                          className="border border-gray-300 p-2 rounded"
                          style={{ width: "auto", minWidth: "150px" }}
                        />
                      ) : (
                        <input
                          type="text"
                          value={row[header] || ""}
                          onChange={(e) => handleChange(table, index, header, e.target.value)}
                          className="border border-gray-300 p-2 rounded"
                          style={{
                            width: "auto",
                            minWidth: "150px",
                            maxWidth: "100%",
                          }}
                        />
                      )}
                    </td>
                  ))}
                  <td className="border border-gray-300 px-4 py-2">
                    <button
                      onClick={() => handleDelete(table, index, row.id)}
                      className="text-red-600 underline hover:text-red-800"
                      >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No records found for {table.replace(/([A-Z])/g, " $1")}.</p>
        )}
        {table !== "FacultyAcademicDetails" && (
  <button
    onClick={() => addNewRow(table)}
    className="bg-green-600 text-white px-6 py-2 rounded shadow hover:bg-green-700 mt-4"
  >
    Add New Row
  </button>
)}
      </div>
    );
  };
  
  

  return (
    <div className="container mx-auto p-6">
      {/* <Faculty Update Nav /> */}
      <nav className="flex items-center justify-end gap-4 mr-4 mt-2 text-xl text-blue-500 font-bold">
        <a
          className={`link hover:underline underline-offset-3`}
          href="/mis_faculty/faculty_home"
        >
          Home
        </a>
        <a
          className={`link hover:underline underline-offset-3`}
          href={`/fac_update/${employeeId}`}
        >
          Personal Details
        </a>
        <a
          className={`link hover:underline underline-offset-3`}
          href={`/fac_update/academic/${employeeId}`}
        >
          Academic Details
        </a>
        <a
          className={`link hover:underline underline-offset-3 `}
          href={`/fac_update/research/${employeeId}`}
        >
          Research Details
        </a>
      </nav>
      <h1 className="text-3xl font-bold mb-6 text-center my-10">Faculty Details</h1>
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
