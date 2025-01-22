"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
  }, []);
  const defaultSchemas = {
    facultyResearchDetails: [
      { employee_id: employeeId, orcidId: "", googleScholarId: "", scopusId: "", publonsId: "", researchId: "" },
    ],
    ConferenceAndJournal: [
      {
        employee_id: employeeId,
        typeOfPublication: "",
        title: "",
        doi: "",
        issn: "",
        joConName: "",
        yearOfPublication: "",
        pageNo: "",
        authors: "",
        publishedUnder: "",
        impactFactor: "",
        quartile: "",
        sponsor: "",
        venue: "",
        volume: "",
        issueNo: "",
      },
    ],
    ResearchProjects: [
      { employee_id: employeeId, projectTitle: "", pi: "", coPi: "", dOfSanction: "", duration: "", fundingAgency: "", amount: "", status: "" },
    ],
    ResearchSupervision: [
      {
        employee_id: employeeId,
        Research_Supervisor: "",
        Research_Scholar_Name: "",
        USN: "",
        University: "",
        Institute: "",
        Discipline: "",
        Title_Research: "",
        Status: "",
      },
    ],
    ResearchExperience: [
      { employee_id: employeeId, areaofresearch: "", from_date: "", to_date: "" },
    ],
    Consultancy: [
      { employee_id: employeeId, sanctionedDate: "", projectPeriod: "", amount: "", principalInvestigator: "", coPrincipalInvestigator: "", status: "" },
    ],
    Patent: [
      { employee_id: employeeId, areaOfResearch: "", grantedYear: "", patentNo: "", patentStatus: "", author: "" },
    ],
    BookPublication: [
      { employee_id: employeeId, publicationType: "", name: "", volume: "", pageNumber: "", issn: "", publisher: "", title: "", area: "", impactFactor: "", yearOfPublish: "", authors: "" },
    ],
    EventAttended: [
      { employee_id: employeeId, fromDate: "", toDate: "", organizer: "", venue: "", sponsor: "", targetAudience: "", nameofevent: "", typeofevent: "" },
    ],
    EventOrganized: [
      { employee_id: employeeId, typeofevent: "", nameofevent: "", fromDate: "", toDate: "", organizer: "", venue: "", sponsor: "", targetAudience: "" },
    ],
    ProfessionalMembers: [
      { employee_id: employeeId, professionalBody: "", membershipId: "", membershipSince: "", membershipType: "" },
    ],
  };

  useEffect(() => {
    fetch(`/api/fac_update_research?employee_id=${employeeId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.data) {
          setData(data.data);
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
        i === index ? { ...row, [field]: value || null } : row
      ),
    }));
  };

  const addNewRow = (table: string) => {
    const defaultRow = defaultSchemas[table]?.[0];
    if (!defaultRow) {
      alert(`No default schema found for table: ${table}`);
      return;
    }

    setData((prev: any) => ({
      ...prev,
      [table]: [...(prev[table] || []), { ...defaultRow }],
    }));
  };

  const handleDelete = (table: string, index: number, id: number | null) => {
    if (id) {
      fetch(`/api/fac_update_research`, {
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

    setData((prev: any) => ({
      ...prev,
      [table]: prev[table].filter((_: any, i: number) => i !== index),
    }));
  };

  const handleUpdate = () => {
    fetch(`/api/fac_update_research`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        facultyId: employeeId,
        researchDetails: data.FacultyResearchDetails ? data.FacultyResearchDetails[0] : null,
        conferenceJournals: data.ConferenceAndJournal || [],
        researchProjects: data.ResearchProjects || [],
        researchSupervision: data.ResearchSupervision || [],
        researchExperience: data.ResearchExperience || [],
        consultancy: data.Consultancy || [],
        patents: data.Patent || [],
        bookPublications: data.BookPublication || [],
        eventsAttended: data.EventAttended || [],
        eventsOrganized: data.EventOrganized || [],
        professionalMemberships: data.ProfessionalMembers || [],
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
    const headers = rows.length
      ? Object.keys(rows[0]).filter((key) => key !== "id" && key !== "employee_id")
      : [];

    return (
      <div key={table} className="mb-6">
        <h2 className="text-2xl font-bold my-4">{table.replace(/([A-Z])/g, " $1")}</h2>
        <table
          className="table-auto border-collapse border border-gray-300 w-full text-left"
          style={{ tableLayout: "auto", width: "100%" }}
        >
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
              <th className="border border-gray-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={index}>
                { headers.map((header) => (
                  <td
                    key={header}
                    className="border border-gray-300 px-4 py-2"
                    style={{ minWidth: "150px", whiteSpace: "nowrap" }}
                  >
                    {header === "status" ? (
      <select
        value={row[header] || ""}
        onChange={(e) => handleChange(table, index, header, e.target.value)}
        className="w-full border border-gray-300 p-2 rounded"
      >
        <option value="">Select Status</option>
        <option value="Ongoing">Ongoing</option>
        <option value="Completed">Completed</option>
      </select>
    ) :header === "Status" ? (
      <select
        value={row[header] || ""}
        onChange={(e) => handleChange(table, index, header, e.target.value)}
        className="w-full border border-gray-300 p-2 rounded"
      >
        <option value="">Select Status</option>
        <option value="Ongoing">Ongoing</option>
        <option value="Completed">Completed</option>
      </select>
    ) : header === "from_date" && table === "ResearchExperience" ? (
                    <input
                      type="date"
                      value={row[header]?.split("T")[0] || ""}
                      onChange={(e) => handleChange(table, index, header, e.target.value)}
                      className="w-full border border-gray-300 p-2 rounded"
                    />
                  ) : header === "to_date" && table === "ResearchExperience" ? (
                    <input
                      type="date"
                      value={row[header]?.split("T")[0] || ""}
                      onChange={(e) => handleChange(table, index, header, e.target.value)}
                      className="w-full border border-gray-300 p-2 rounded"
                    />
                  ) : header.toLowerCase().includes("date") ? (
                    <input
                      type="date"
                      value={row[header]?.split("T")[0] || ""}
                      onChange={(e) => handleChange(table, index, header, e.target.value)}
                      className="w-full border border-gray-300 p-2 rounded"
                    />
                  ) :header === "typeOfPublication" && table === "ConferenceAndJournal" ? (
                      <select
                        value={row[header] || ""}
                        onChange={(e) => handleChange(table, index, header, e.target.value)}
                        className="w-full border border-gray-300 p-2 rounded"
                      >
                        <option value="">Select Type</option>
                        <option value="NC">National Conference</option>
                        <option value="IC">International Conference</option>
                        <option value="NJ">National Journal</option>
                        <option value="IJ">International Journal</option>
                      </select>
                    ) : header === "publishedUnder" && table === "ConferenceAndJournal" ? (
                      <select
                        value={row[header] || ""}
                        onChange={(e) => handleChange(table, index, header, e.target.value)}
                        className="w-full border border-gray-300 p-2 rounded"
                      >
                        <option value="">Select Published Under</option>
                        <option value="Web of Science">Web of Science</option>
                        <option value="Scopus">Scopus</option>
                        <option value="Q1">Q1</option>
                        <option value="Q2">Q2</option>
                        <option value="Q3">Q3</option>
                      </select>
                    ) : header === "Status" ? (
                      <select
                        value={row[header] || ""}
                        onChange={(e) => handleChange(table, index, header, e.target.value)}
                        className="w-full border border-gray-300 p-2 rounded"
                      >
                        <option value="">Select Status</option>
                        <option value="Ongoing">Ongoing</option>
                        <option value="Completed">Completed</option>
                      </select>
                    ) : header === "membershipType" && table === "ProfessionalMembers" ? (
                      <select
                        value={row[header] || ""}
                        onChange={(e) => handleChange(table, index, header, e.target.value)}
                        className="w-full border border-gray-300 p-2 rounded"
                      >
                        <option value="">Select Membership Type</option>
                        <option value="Annual">Annual</option>
                        <option value="Permanent">Permanent</option>
                      </select>
                    ) : header === "membershipSince" && table === "ProfessionalMembers" ? (
                      <input
                        type="date"
                        value={row[header]?.split("T")[0] || ""}
                        onChange={(e) => handleChange(table, index, header, e.target.value)}
                        className="w-full border border-gray-300 p-2 rounded"
                      />
                    ) : header === "yearOfPublication" && table === "ConferenceAndJournal" ? (
                      <input
                        type="number"
                        value={row[header] || ""}
                        onChange={(e) => handleChange(table, index, header, e.target.value)}
                        className="w-full border border-gray-300 p-2 rounded"
                      />
                    ) : header === "amount" && ["ResearchProjects", "Consultancy"].includes(table) ? (
                      <input
                        type="number"
                        value={row[header] || ""}
                        onChange={(e) => handleChange(table, index, header, e.target.value)}
                        className="w-full border border-gray-300 p-2 rounded"
                      />
                    ) : (
                      <input
                        type="text"
                        value={row[header] || ""}
                        onChange={(e) => handleChange(table, index, header, e.target.value)}
                        className="w-full border border-gray-300 p-2 rounded"
                      />
                    )}
                  </td>
                ))}
                <td className="border border-gray-300 px-4 py-2">
                  <button
                    onClick={() => handleDelete(table, index, row.id)}
                    className="bg-red-600 text-white px-6 py-2 rounded shadow hover:bg-red-700 mt-4"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {table !== "facultyResearchDetails" && (
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
