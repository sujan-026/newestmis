"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";

interface RowData {
  id: number;
  classNo: string;
  subUnit: string;
  lessonText: string;
  bloomTaxonomyLevel: string;
  teachingMethodology: string;
  category: string;
  remarks: string;
  status: string;
  activity: string[];
  date: string;
}

const TeachingTable: React.FC = () => {
  const [rows, setRows] = useState<RowData[]>([]);
  const [changes, setChanges] = useState<RowData[]>([]);
  const [activeActivityField, setActiveActivityField] = useState<number | null>(
    null
  );
  const [showModal, setShowModal] = useState(false);

  const activityOptions = [
    "THINK PAIR SHARE",
    "BRAIN STORMING",
    "MIND MAPPING",
    "SIMULATION",
    "PROBLEM SOLVING",
    "CASE STUDY",
    "QUIZ",
    "ROLE MODEL",
    "GROUP DISCUSSION",
    "PICTURE ANALYSIS",
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("/api/fac_teaching");
  
        const updatedData = res.data.data.map((row: any) => {
          const rawDate = row.date;
          const formattedDate = rawDate
            ? new Date(rawDate).toLocaleDateString("en-GB").replace(/\//g, "-") // Convert to DD-MM-YYYY
            : "N/A"; // Default to "N/A" if date is missing
  
          return {
            id: row.id,
            classNo: row.classNo || "N/A",
            subUnit: row.subUnit || "",
            lessonText: row.lessonText || "",
            bloomTaxonomyLevel: row.bloomsTaxonomyLevel || "",
            teachingMethodology: row.teachingMethodology || "",
            category: row.category || "",
            remarks: row.remarks || "",
            status: row.status || "",
            activity: row.activityDone
              ? row.activityDone.split(",").map((item: string) => item.trim())
              : [],
            date: formattedDate,
          };
        });
  
        setRows(updatedData);
      } catch (err) {
        console.error("Error fetching data:", err);
        alert("Failed to fetch data from the server.");
      }
    };
  
    fetchData();
  }, []);

  const updateRow = (id: number, key: keyof RowData, value: any) => {
    setRows((prevRows) =>
      prevRows.map((row) =>
        row.id === id
          ? { ...row, [key]: value, date: new Date().toISOString().split("T")[0] }
          : row
      )
    );

    setChanges((prevChanges) => {
      const existingChange = prevChanges.find((change) => change.id === id);
      if (existingChange) {
        return prevChanges.map((change) =>
          change.id === id
            ? { ...change, [key]: value, date: new Date().toISOString().split("T")[0] }
            : change
        );
      } else {
        const updatedRow = rows.find((row) => row.id === id);
        return updatedRow
          ? [
              ...prevChanges,
              { ...updatedRow, [key]: value, date: new Date().toISOString().split("T")[0] },
            ]
          : prevChanges;
      }
    });
  };

  const validateChanges = () => {
    for (const change of changes) {
      if (!change.category || !change.status || !change.remarks || change.activity.length === 0) {
        return false;
      }
    }
    return true;
  };

  const saveChanges = async () => {
    try {
      for (const change of changes) {
        await axios.put("/api/update_fac_teaching", {
          id: change.id,
          category: change.category,
          status: change.status,
          remarks: change.remarks,
          activity: change.activity.join(", "),
          date: change.date,
        });
      }
      alert("All changes saved successfully!");
      setChanges([]);
      setShowModal(false);
    } catch (err) {
      console.error("Error saving changes:", err);
      alert("Failed to save changes.");
    }
  };

  // Calculate progress
  const totalClasses = rows.length;
  const completedClasses = rows.filter((row) => row.status === "Complete").length;
  const progressPercentage = totalClasses > 0 ? (completedClasses / totalClasses) * 100 : 0;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Teaching Plan Table</h1>
      <div className="text-left w-full mb-4">
        <p className="text-slate-500 ml-3">
          Review and manage the teaching plan details for your classes.
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-5">
        <p className="text-slate-700 font-medium mb-2">
          Progress: {Math.round(progressPercentage)}% ({completedClasses}/{totalClasses} classes completed)
        </p>
        <div className="w-full bg-gray-200 rounded-md h-4">
          <div
            style={{ width: `${progressPercentage}%` }}
            className="bg-green-500 h-full rounded-md"
          ></div>
        </div>
      </div>

      <div className="relative flex flex-col w-full h-full text-gray-700 bg-white shadow-md rounded-lg bg-clip-border">
        <div className="overflow-y-auto max-h-[75vh]"> {/* Scrollable container */}
          <table className="w-full text-left table-auto min-w-max">
            <thead>
              <tr>
                <th className="p-4 border-b border-slate-300 bg-slate-50">
                  <p className="block text-sm font-normal leading-none text-slate-500">Class No.</p>
                </th>
                <th className="p-4 border-b border-slate-300 bg-slate-50">
                  <p className="block text-sm font-normal leading-none text-slate-500">Sub Unit</p>
                </th>
                <th className="p-4 border-b border-slate-300 bg-slate-50">
                  <p className="block text-sm font-normal leading-none text-slate-500">Lesson Text</p>
                </th>
                <th className="p-1 border-b border-slate-300 bg-slate-50">
                  <p className="block text-sm font-normal leading-none text-slate-500">
                    Blooms Taxonomy Level
                  </p>
                </th>
                <th className="p-4 border-b border-slate-300 bg-slate-50">
                  <p className="block text-sm font-normal leading-none text-slate-500">
                    Teaching Methodology
                  </p>
                </th>
                <th className="p-4 border-b border-slate-300 bg-slate-50">
                  <p className="block text-sm font-normal leading-none text-slate-500">
                    Category (L/T/P/S)
                  </p>
                </th>
                <th className="p-4 border-b border-slate-300 bg-slate-50">
                  <p className="block text-sm font-normal leading-none text-slate-500">Status</p>
                </th>
                <th className="p-4 border-b border-slate-300 bg-slate-50">
                  <p className="block text-sm font-normal leading-none text-slate-500">Remarks</p>
                </th>
                <th className="p-4 border-b border-slate-300 bg-slate-50">
                  <p className="block text-sm font-normal leading-none text-slate-500">
                    Activity Done
                  </p>
                </th>
                <th className="p-4 border-b border-slate-300 bg-slate-50">
                  <p className="block text-sm font-normal leading-none text-slate-500">Date</p>
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr
                  key={row.id}
                  className={`${
                    row.status === "Complete"
                      ? "bg-green-100 hover:bg-green-100"
                      : row.status === "Partially Complete"
                      ? "bg-yellow-100 hover:bg-yellow-100"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <td className="p-4 border-b border-slate-200">
                    <p className="block text-sm text-slate-800">{index + 1}</p>
                  </td>
                  <td className="p-4 border-b border-slate-200">
                    <p className="block text-sm text-slate-800">{row.classNo}</p>
                  </td>
                  <td className="p-4 border-b border-slate-200">
                    <p className="block text-sm text-slate-800">{row.lessonText}</p>
                  </td>
                  <td className="p-4 border-b border-slate-200">
                    <p className="block text-sm text-slate-800">{row.bloomTaxonomyLevel}</p>
                  </td>
                  <td className="p-4 border-b border-slate-200">
                    <p className="block text-sm text-slate-800">{row.teachingMethodology}</p>
                  </td>
                  <td className="p-4 border-b border-slate-200">
                    <select
                      value={row.category}
                      onChange={(e) => updateRow(row.id, "category", e.target.value)}
                      className="w-full border border-slate-300 rounded-md p-2 text-sm"
                    >
                      <option value="">Select</option>
                      <option value="L">Lecture</option>
                      <option value="T">Tutorial</option>
                      <option value="P">Practical</option>
                      <option value="S">Self Study</option>
                    </select>
                  </td>
                  <td className="p-4 border-b border-slate-200">
                    <select
                      value={row.status}
                      onChange={(e) => updateRow(row.id, "status", e.target.value)}
                      className="w-full border border-slate-300 rounded-md p-2 text-sm"
                    >
                      <option value="">Select</option>
                      <option value="Complete">Complete</option>
                      <option value="Partially Complete">Partially Complete</option>
                    </select>
                  </td>
                  <td className="p-4 border-b border-slate-200">
                    <textarea
                      value={row.remarks}
                      onChange={(e) => updateRow(row.id, "remarks", e.target.value)}
                      className="w-[250px] border border-slate-300 rounded-md p-2 text-sm resize-none overflow-y-auto"
                      rows={Math.max(2, Math.ceil(row.remarks.length / 50))}
                      placeholder="Add remarks here"
                    ></textarea>
                  </td>
                  <td className="w-[500px] p-4 border-b border-slate-200">
                    <div
                      onClick={() =>
                        setActiveActivityField(
                          activeActivityField === row.id ? null : row.id
                        )
                      }
                      className="cursor-pointer bg-gray-100 p-2 rounded-md hover:bg-gray-200"
                    >
                      {row.activity.length > 0 ? row.activity.join(", ") : "Select Activities"}
                    </div>
                    {activeActivityField === row.id && (
                      <div className="bg-white shadow-md rounded-lg p-2 mt-2 border">
                        {activityOptions.map((activity) => (
                          <div key={activity} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={row.activity.includes(activity)}
                              onChange={(e) => {
                                const updatedActivities = e.target.checked
                                  ? [...row.activity, activity]
                                  : row.activity.filter((a) => a !== activity);
                                updateRow(row.id, "activity", updatedActivities);
                              }}
                              className="mr-2"
                            />
                            <label>{activity}</label>
                          </div>
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="p-4 border-b border-slate-200">
                    <p className="block text-sm text-slate-800">{row.date || "N/A"}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4">
        <button
          onClick={() => {
            if (!validateChanges()) {
              alert("Please fill all required fields before saving.");
              return;
            }
            setShowModal(true);
          }}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
        >
          Save Changes
        </button>
      </div>

      {/* Modal for preview */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-3/4">
            <h2 className="text-xl font-bold mb-4">Confirm Changes</h2>
            <table className="table-auto w-full bg-gray-100 shadow-md rounded-lg">
              <thead>
                <tr>
                  <th className="p-2 border">Class No.</th>
                  <th className="p-2 border">Category</th>
                  <th className="p-2 border">Status</th>
                  <th className="p-2 border">Remarks</th>
                  <th className="p-2 border">Activity</th>
                  <th className="p-2 border">Date</th>
                </tr>
              </thead>
              <tbody>
                {changes.map((change) => (
                  <tr key={change.id}>
                    <td className="p-2 border">{change.classNo}</td>
                    <td className="p-2 border">{change.category}</td>
                    <td className="p-2 border">{change.status}</td>
                    <td className="p-2 border">{change.remarks}</td>
                    <td className="p-2 border">{change.activity.join(", ")}</td>
                    <td className="p-2 border">{change.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-4 flex justify-end gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={saveChanges}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Final Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeachingTable;
