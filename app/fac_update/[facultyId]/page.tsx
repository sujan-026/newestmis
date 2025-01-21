"use client";

import React, { useState, useEffect } from "react";

const FacultyDetailsPage = () => {
  const [facultyData, setFacultyData] = useState<any>(null);
  const [educationData, setEducationData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const employeeId = "SHA512"; // Replace with the actual employee ID

  useEffect(() => {
    // Fetch personal details
    fetch(`/api/fac_update_personal?employee_id=${employeeId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.data) {
          setFacultyData(data.data);
        } else {
          setError(data.message || "Failed to fetch personal details");
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch personal details");
        setLoading(false);
      });

    // Fetch education details
    fetch(`/api/fac_update_education?employee_id=${employeeId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.educationDetails) {
          setEducationData(data.educationDetails);
        } else {
          setError(data.message || "Failed to fetch education details");
        }
      })
      .catch(() => {
        setError("Failed to fetch education details");
      });
  }, [employeeId]);

  const handleChange = (field: string, value: any) => {
    setFacultyData((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleEducationChange = (index: number, field: string, value: any) => {
    setEducationData((prev) =>
      prev.map((edu, i) =>
        i === index ? { ...edu, [field]: value } : edu
      )
    );
  };

  const addNewEducation = () => {
    setEducationData((prev) => [
      ...prev,
      {
        id: null,
        Program: "",
        regNo: "",
        schoolCollege: "",
        specialization: "",
        mediumOfInstruction: "",
        passClass: "",
        yearOfAward: "",
      },
    ]);
  };

  const handleDelete = (index: number, id: number | null) => {
    if (id) {
      fetch(`/api/fac_update_education`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.message === "Record deleted successfully") {
            alert("Record deleted successfully!");
          } else {
            alert(`Error: ${data.message}`);
          }
        })
        .catch(() => {
          alert("Failed to delete the record");
        });
    }

    // Remove the record locally
    setEducationData((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdate = () => {
    // Update personal details
    fetch(`/api/fac_update_personal`, {
      method: "POST", // or "PUT" if needed
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(facultyData),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message === "Record updated successfully") {
          alert("Personal details updated successfully!");
        } else {
          alert(`Error: ${data.message}`);
        }
      })
      .catch(() => {
        alert("Failed to update personal details");
      });

    // Update education details
    fetch(`/api/fac_update_education`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        employee_id: employeeId,
        educationDetails: educationData,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message === "Education records updated successfully") {
          alert("Education details updated successfully!");
        } else {
          alert(`Error: ${data.message}`);
        }
      })
      .catch(() => {
        alert("Failed to update education details");
      });
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Faculty Details</h1>

      {facultyData && (
        <form>
          <h2 className="text-2xl font-bold mb-4">Personal Details</h2>
          <table className="table-auto border-collapse border border-gray-300 w-full text-left">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-4 py-2">Field</th>
                <th className="border border-gray-300 px-4 py-2">Value</th>
              </tr>
            </thead>
            <tbody>
              
              <tr>
                <td className="border border-gray-300 px-4 py-2">Name</td>
                <td className="border border-gray-300 px-4 py-2">
                  <input
                    type="text"
                    value={facultyData.faculty_name || ""}
                    onChange={(e) => handleChange("faculty_name", e.target.value)}
                    className="w-full border border-gray-300 p-2 rounded"
                  />
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">Qualification</td>
                <td className="border border-gray-300 px-4 py-2">
                  <input
                    type="text"
                    value={facultyData.qualification || ""}
                    onChange={(e) => handleChange("qualification", e.target.value)}
                    className="w-full border border-gray-300 p-2 rounded"
                  />
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">Department</td>
                <td className="border border-gray-300 px-4 py-2">
                  <input
                    type="text"
                    value={facultyData.department || ""}
                    onChange={(e) => handleChange("department", e.target.value)}
                    className="w-full border border-gray-300 p-2 rounded"
                  />
                </td>
              </tr>
              {/* phtoto url */}
              <tr>
                <td className="border border-gray-300 px-4 py-2">Photo URL</td>
                <td className="border border-gray-300 px-4 py-2">
                  <input
                    type="text"
                    value={facultyData.photo || ""}
                    onChange={(e) => handleChange("photo", e.target.value)}
                    className="w-full border border-gray-300 p-2 rounded"
                  />
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">Title</td>
                <td className="border border-gray-300 px-4 py-2">
                  <input
                    type="text"
                    value={facultyData.title || ""}
                    onChange={(e) => handleChange("title", e.target.value)}
                    className="w-full border border-gray-300 p-2 rounded"
                  />
                </td>
              </tr>
              
              <tr>
                <td className="border border-gray-300 px-4 py-2">Email</td>
                <td className="border border-gray-300 px-4 py-2">
                  <input
                    type="email"
                    value={facultyData.emailId || ""}
                    onChange={(e) => handleChange("emailId", e.target.value)}
                    className="w-full border border-gray-300 p-2 rounded"
                  />
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">Contact Number</td>
                <td className="border border-gray-300 px-4 py-2">
                  <input
                    type="text"
                    value={facultyData.contactNo || ""}
                    onChange={(e) => handleChange("contactNo", e.target.value)}
                    className="w-full border border-gray-300 p-2 rounded"
                  />
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">Alternate Contact</td>
                <td className="border border-gray-300 px-4 py-2">
                  <input
                    type="text"
                    value={facultyData.alternateContactNo || ""}
                    onChange={(e) =>
                      handleChange("alternateContactNo", e.target.value)
                    }
                    className="w-full border border-gray-300 p-2 rounded"
                  />
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">Emergency Contact</td>
                <td className="border border-gray-300 px-4 py-2">
                  <input
                    type="text"
                    value={facultyData.emergencyContactNo || ""}
                    onChange={(e) =>
                      handleChange("emergencyContactNo", e.target.value)
                    }
                    className="w-full border border-gray-300 p-2 rounded"
                  />
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">Aadhar Number</td>
                <td className="border border-gray-300 px-4 py-2">
                  <input
                    type="text"
                    value={facultyData.adharNo || ""}
                    onChange={(e) => handleChange("adharNo", e.target.value)}
                    className="w-full border border-gray-300 p-2 rounded"
                  />
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">PAN Number</td>
                <td className="border border-gray-300 px-4 py-2">
                  <input
                    type="text"
                    value={facultyData.panNo || ""}
                    onChange={(e) => handleChange("panNo", e.target.value)}
                    className="w-full border border-gray-300 p-2 rounded"
                  />
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">Date of Birth</td>
                <td className="border border-gray-300 px-4 py-2">
                  <input
                    type="date"
                    value={facultyData.dob || ""}
                    onChange={(e) => handleChange("dob", e.target.value)}
                    className="w-full border border-gray-300 p-2 rounded"
                  />
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">gender</td>
                <td className="border border-gray-300 px-4 py-2">
                  <input
                    type="text"
                    value={facultyData.gender || ""}
                    onChange={(e) => handleChange("title", e.target.value)}
                    className="w-full border border-gray-300 p-2 rounded"
                  />
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">Nationality</td>
                <td className="border border-gray-300 px-4 py-2">
                  <input
                    type="text"
                    value={facultyData.nationality || ""}
                    onChange={(e) => handleChange("title", e.target.value)}
                    className="w-full border border-gray-300 p-2 rounded"
                  />
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">Address</td>
                <td className="border border-gray-300 px-4 py-2">
                  <input
                    type="text"
                    value={facultyData.firstAddressLine || ""}
                    onChange={(e) => handleChange("title", e.target.value)}
                    className="w-full border border-gray-300 p-2 rounded"
                  />
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">Corresponding Address</td>
                <td className="border border-gray-300 px-4 py-2">
                  <input
                    type="text"
                    value={facultyData.correspondenceAddressLine || ""}
                    onChange={(e) => handleChange("title", e.target.value)}
                    className="w-full border border-gray-300 p-2 rounded"
                  />
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">Corresponding Address</td>
                <td className="border border-gray-300 px-4 py-2">
                  <input
                    type="text"
                    value={facultyData.correspondenceAddressLine || ""}
                    onChange={(e) => handleChange("title", e.target.value)}
                    className="w-full border border-gray-300 p-2 rounded"
                  />
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">Religion</td>
                <td className="border border-gray-300 px-4 py-2">
                  <input
                    type="text"
                    value={facultyData.religion || ""}
                    onChange={(e) => handleChange("title", e.target.value)}
                    className="w-full border border-gray-300 p-2 rounded"
                  />
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">Caste</td>
                <td className="border border-gray-300 px-4 py-2">
                  <input
                    type="text"
                    value={facultyData.caste || ""}
                    onChange={(e) => handleChange("title", e.target.value)}
                    className="w-full border border-gray-300 p-2 rounded"
                  />
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">Category</td>
                <td className="border border-gray-300 px-4 py-2">
                  <input
                    type="text"
                    value={facultyData.category || ""}
                    onChange={(e) => handleChange("title", e.target.value)}
                    className="w-full border border-gray-300 p-2 rounded"
                  />
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">Mother Tongue</td>
                <td className="border border-gray-300 px-4 py-2">
                  <input
                    type="text"
                    value={facultyData.motherTongue || ""}
                    onChange={(e) => handleChange("title", e.target.value)}
                    className="w-full border border-gray-300 p-2 rounded"
                  />
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">languages</td>
                <td className="border border-gray-300 px-4 py-2">
                  <input
                    type="text"
                    value={facultyData.languages || ""}
                    onChange={(e) => handleChange("title", e.target.value)}
                    className="w-full border border-gray-300 p-2 rounded"
                  />
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">BankName</td>
                <td className="border border-gray-300 px-4 py-2">
                  <input
                    type="text"
                    value={facultyData.bankName || ""}
                    onChange={(e) => handleChange("title", e.target.value)}
                    className="w-full border border-gray-300 p-2 rounded"
                  />
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">Account Number</td>
                <td className="border border-gray-300 px-4 py-2">
                  <input
                    type="text"
                    value={facultyData.accountNo || ""}
                    onChange={(e) => handleChange("title", e.target.value)}
                    className="w-full border border-gray-300 p-2 rounded"
                  />
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">Account Name</td>
                <td className="border border-gray-300 px-4 py-2">
                  <input
                    type="text"
                    value={facultyData.accountName || ""}
                    onChange={(e) => handleChange("title", e.target.value)}
                    className="w-full border border-gray-300 p-2 rounded"
                  />
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">Account Type</td>
                <td className="border border-gray-300 px-4 py-2">
                  <input
                    type="text"
                    value={facultyData.accountType || ""}
                    onChange={(e) => handleChange("title", e.target.value)}
                    className="w-full border border-gray-300 p-2 rounded"
                  />
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">branch</td>
                <td className="border border-gray-300 px-4 py-2">
                  <input
                    type="text"
                    value={facultyData.branch || ""}
                    onChange={(e) => handleChange("title", e.target.value)}
                    className="w-full border border-gray-300 p-2 rounded"
                  />
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">IFSC code</td>
                <td className="border border-gray-300 px-4 py-2">
                  <input
                    type="text"
                    value={facultyData.ifsc || ""}
                    onChange={(e) => handleChange("title", e.target.value)}
                    className="w-full border border-gray-300 p-2 rounded"
                  />
                </td>
              </tr>
            
              <tr>
                <td className="border border-gray-300 px-4 py-2">PF Number</td>
                <td className="border border-gray-300 px-4 py-2">
                  <input
                    type="text"
                    value={facultyData.pfNumber || ""}
                    onChange={(e) => handleChange("title", e.target.value)}
                    className="w-full border border-gray-300 p-2 rounded"
                  />
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">UAN Number</td>
                <td className="border border-gray-300 px-4 py-2">
                  <input
                    type="text"
                    value={facultyData.uanNumber || ""}
                    onChange={(e) => handleChange("title", e.target.value)}
                    className="w-full border border-gray-300 p-2 rounded"
                  />
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">Pension Number</td>
                <td className="border border-gray-300 px-4 py-2">
                  <input
                    type="text"
                    value={facultyData.pensionNumber || ""}
                    onChange={(e) => handleChange("title", e.target.value)}
                    className="w-full border border-gray-300 p-2 rounded"
                  />
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">Mother Name</td>
                <td className="border border-gray-300 px-4 py-2">
                  <input
                    type="text"
                    value={facultyData.motherName || ""}
                    onChange={(e) => handleChange("title", e.target.value)}
                    className="w-full border border-gray-300 p-2 rounded"
                  />
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">Father Name</td>
                <td className="border border-gray-300 px-4 py-2">
                  <input
                    type="text"
                    value={facultyData.fatherName || ""}
                    onChange={(e) => handleChange("title", e.target.value)}
                    className="w-full border border-gray-300 p-2 rounded"
                  />
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">Spouse Name</td>
                <td className="border border-gray-300 px-4 py-2">
                  <input
                    type="text"
                    value={facultyData.spouseName || ""}
                    onChange={(e) => handleChange("title", e.target.value)}
                    className="w-full border border-gray-300 p-2 rounded"
                  />
                </td>
                
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">Children</td>
                <td className="border border-gray-300 px-4 py-2">
                  <input
                    type="text"
                    value={facultyData.children || ""}
                    onChange={(e) => handleChange("title", e.target.value)}
                    className="w-full border border-gray-300 p-2 rounded"
                  />
                </td>
                
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">Date of Joining Dr AIT</td>
                <td className="border border-gray-300 px-4 py-2">
                  <input
                    type="date"
                    value={facultyData.dateOfJoiningDrait || ""}
                    onChange={(e) => handleChange("title", e.target.value)}
                    className="w-full border border-gray-300 p-2 rounded"
                  />
                </td>
                
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">Aided</td>
                <td className="border border-gray-300 px-4 py-2">
                  <input
                    type="text"
                    value={facultyData.aided || ""}
                    onChange={(e) => handleChange("title", e.target.value)}
                    className="w-full border border-gray-300 p-2 rounded"
                  />
                </td>
                
              </tr>
            </tbody>
          </table>

          <h2 className="text-2xl font-bold mb-4">Education Details</h2>
          <table className="table-auto border-collapse border border-gray-300 w-full text-left">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-4 py-2">Program</th>
                <th className="border border-gray-300 px-4 py-2">Reg No</th>
                <th className="border border-gray-300 px-4 py-2">Institution</th>
                <th className="border border-gray-300 px-4 py-2">Specialization</th>
                <th className="border border-gray-300 px-4 py-2">Medium</th>
                <th className="border border-gray-300 px-4 py-2">Pass Class</th>
                <th className="border border-gray-300 px-4 py-2">Year</th>
                <th className="border border-gray-300 px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {educationData.map((education, index) => (
                <tr key={index}>
                  <td className="border border-gray-300 px-4 py-2">
                    <input
                      type="text"
                      value={education.Program || ""}
                      onChange={(e) =>
                        handleEducationChange(index, "Program", e.target.value)
                      }
                      className="w-full border border-gray-300 p-2 rounded"
                    />
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <input
                      type="text"
                      value={education.regNo || ""}
                      onChange={(e) =>
                        handleEducationChange(index, "regNo", e.target.value)
                      }
                      className="w-full border border-gray-300 p-2 rounded"
                    />
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <input
                      type="text"
                      value={education.schoolCollege || ""}
                      onChange={(e) =>
                        handleEducationChange(index, "schoolCollege", e.target.value)
                      }
                      className="w-full border border-gray-300 p-2 rounded"
                    />
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <input
                      type="text"
                      value={education.specialization || ""}
                      onChange={(e) =>
                        handleEducationChange(index, "specialization", e.target.value)
                      }
                      className="w-full border border-gray-300 p-2 rounded"
                    />
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <input
                      type="text"
                      value={education.mediumOfInstruction || ""}
                      onChange={(e) =>
                        handleEducationChange(
                          index,
                          "mediumOfInstruction",
                          e.target.value
                        )
                      }
                      className="w-full border border-gray-300 p-2 rounded"
                    />
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <input
                      type="text"
                      value={education.passClass || ""}
                      onChange={(e) =>
                        handleEducationChange(index, "passClass", e.target.value)
                      }
                      className="w-full border border-gray-300 p-2 rounded"
                    />
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <input
                      type="number"
                      value={education.yearOfAward || ""}
                      onChange={(e) =>
                        handleEducationChange(index, "yearOfAward", e.target.value)
                      }
                      className="w-full border border-gray-300 p-2 rounded"
                    />
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <button
                      onClick={() => handleDelete(index, education.id)}
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
            type="button"
            onClick={addNewEducation}
            className="bg-green-600 text-white px-6 py-2 rounded shadow hover:bg-green-700 mt-4"
          >
            Add New Education
          </button>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={handleUpdate}
              className="bg-blue-600 text-white px-6 py-2 rounded shadow hover:bg-blue-700"
            >
              Update
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default FacultyDetailsPage;
