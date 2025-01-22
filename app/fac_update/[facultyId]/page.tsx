"use client";

import React, { useState, useEffect } from "react";

const FacultyDetailsPage = () => {
  const [facultyData, setFacultyData] = useState<any>(null);
  const [educationData, setEducationData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [branch, setBranch] = useState<Branch[]>([]);
  const [employeeId, setEmployeeId] = useState<string | null>(null);

  useEffect(() => {
    const pathname = window.location.pathname; // Get the full path
    const segments = pathname.split("/"); // Split path into segments
    const idFromPath = segments[segments.length - 1]; // Get the last segment (facultyId)

    if (idFromPath) {
      setEmployeeId(idFromPath); // Store the ID in state
      fetchData(idFromPath); // Pass it directly to fetch functions
    } else {
      console.warn("Faculty ID is not present in the dynamic route.");
      setLoading(false);
    }
  }, []);

  const fetchData = (id: string) => {
    // Fetch personal details
    fetch(`/api/fac_update_personal?employee_id=${id}`)
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
    fetch(`/api/fac_update_education?employee_id=${id}`)
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
  };

  // Fetch Branch
  useEffect(() => {
    async function fetchBranch() {
      try {
        const response = await fetch("/api/fetchBranch");
        if (!response.ok) throw new Error("Failed to fetch branch.");
        const data = await response.json();
        console.log(data);
        setBranch(data);
      } catch (error) {
        console.error("Error fetching branch:", error);
        setErrorMessage("Failed to load branch.");
      }
    }
    fetchBranch();
  }, []);

  // const employeeId = "CSU07"; // Replace with the actual employee ID

  const passClassOptions = ["Distinction", "First", "Second", "Third", "Fail"];
  const departments = [
    { code: "EI", title: "Electronics and Instrumentation Engineering" },
    { code: "AE", title: "Aeronautical Engineering" },
    { code: "ME", title: "Mechanical Engineering" },
    { code: "EE", title: "Electrical Engineering" },
    { code: "EC", title: "Electronics and Communication Engineering" },
    { code: "CV", title: "Civil Engineering" },
    { code: "CS", title: "Computer Science and Engineering" },
    { code: "AI", title: "Artificial Intelligence and Machine Learning" },
    { code: "CB", title: "Computer Science and Business System" },
    { code: "ET", title: "Electronics and Telecommunication Engineering" },
    { code: "IM", title: "Industrial Engineering and Management" },
    { code: "IS", title: "Information Science and Engineering" },
  ];

  const programOptions = [
    "B.E.",
    "B.Sc.",
    "M.Tech.",
    "B.Tech.",
    "M.Sc.",
    "Ph.D",
    "MCA",
    "MBA",
    "BBA",
    "BCA",
    "B.Com",
    "M.Com",
    "B.A.",
    "M.A.",
    "B.Ed.",
    "M.Ed.",
    "D.Ed.",
  ];
  const languagesOptions = [
    "English",
    "Hindi",
    "Kannada",
    "Malayalam",
    "Tamil",
    "Telugu",
    "Marathi",
    "Gujarati",
  ];

  const titleOptions = ["Mr", "Mrs", "Ms", "Dr"];
  const aidedOptions = ["Yes", "No"];
  // useEffect(() => {
  //   // Fetch personal details
  //   console.log("2nd log", employeeId);
  //   fetch(`/api/fac_update_personal?employee_id=${employeeId}`)
  //     .then((res) => res.json())
  //     .then((data) => {
  //       if (data.data) {
  //         setFacultyData(data.data);
  //       } else {
  //         setError(data.message || "Failed to fetch personal details");
  //       }
  //       setLoading(false);
  //     })
  //     .catch(() => {
  //       setError("Failed to fetch personal details");
  //       setLoading(false);
  //     });

  //   // Fetch education details
  //   fetch(`/api/fac_update_education?employee_id=${employeeId}`)
  //     .then((res) => res.json())
  //     .then((data) => {
  //       if (data.educationDetails) {
  //         setEducationData(data.educationDetails);
  //       } else {
  //         setError(data.message || "Failed to fetch education details");
  //       }
  //     })
  //     .catch(() => {
  //       setError("Failed to fetch education details");
  //     });
  // }, [employeeId]);

  const handleChange = (field: string, value: any) => {
    setFacultyData((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleEducationChange = (index: number, field: string, value: any) => {
    setEducationData((prev) =>
      prev.map((edu, i) => (i === index ? { ...edu, [field]: value } : edu))
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

      <h1 className="text-3xl font-bold mb-6 text-center my-10">
        Faculty Details
      </h1>

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
                    onChange={(e) =>
                      handleChange("faculty_name", e.target.value)
                    }
                    className="w-full border border-gray-300 p-2 rounded"
                  />
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">
                  Qualification
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <select
                    value={facultyData.qualification || ""}
                    onChange={(e) =>
                      handleChange("qualification", e.target.value)
                    }
                    className="w-full border border-gray-300 p-2 rounded"
                  >
                    <option value="">Select Qualification</option>
                    <option value="B.E.">B.E.</option>
                    <option value="B.Sc.">B.Sc.</option>
                    <option value="M.Tech.">M.Tech.</option>
                    <option value="B.Tech.">B.Tech.</option>
                    <option value="M.Sc.">M.Sc.</option>
                    <option value="Ph.D">Ph.D</option>
                    <option value="MCA">MCA</option>
                    <option value="MBA">MBA</option>
                    <option value="BBA">BBA</option>
                    <option value="BCA">BCA</option>
                    <option value="B.Com">B.Com</option>
                    <option value="M.Com">M.Com</option>
                    <option value="B.A.">B.A.</option>
                    <option value="M.A.">M.A.</option>
                    <option value="B.Ed.">B.Ed.</option>
                    <option value="M.Ed.">M.Ed.</option>
                    <option value="D.Ed.">D.Ed.</option>
                  </select>
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">Department</td>
                <td className="border border-gray-300 px-4 py-2">
                  <select
                    value={facultyData.department || ""}
                    onChange={(e) => handleChange("department", e.target.value)}
                    className="w-full border border-gray-300 p-2 rounded"
                  >
                    <option value="">Select Department</option>
                    {branch.map((br) => (
                      <option key={br.brcode} value={br.brcode}>
                        {br.brcode_title}
                      </option>
                    ))}
                  </select>
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
                  <select
                    value={facultyData.title || ""}
                    onChange={(e) => handleChange("title", e.target.value)}
                    className="w-full border border-gray-300 p-2 rounded"
                  >
                    <option value="">Select Title</option>
                    {titleOptions.map((title) => (
                      <option key={title} value={title}>
                        {title}
                      </option>
                    ))}
                  </select>
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
                <td className="border border-gray-300 px-4 py-2">
                  Contact Number
                </td>
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
                <td className="border border-gray-300 px-4 py-2">
                  Alternate Contact
                </td>
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
                <td className="border border-gray-300 px-4 py-2">
                  Emergency Contact
                </td>
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
                <td className="border border-gray-300 px-4 py-2">
                  Aadhar Number
                </td>
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
                <td className="border border-gray-300 px-4 py-2">
                  Date of Birth
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <input
                    type="date"
                    value={facultyData.dob?.split("T")[0] || ""}
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
                <td className="border border-gray-300 px-4 py-2">
                  Nationality
                </td>
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
                <td className="border border-gray-300 px-4 py-2">
                  Corresponding Address
                </td>
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
                  <select
                    value={facultyData.religion || ""}
                    onChange={(e) => handleChange("religion", e.target.value)}
                    className="w-full border border-gray-300 p-2 rounded"
                  >
                    <option value="">Select Religion</option>
                    <option value="Hindu">Hindu</option>
                    <option value="Muslim">Muslim</option>
                    <option value="Christian">Christian</option>
                    <option value="Sikh">Sikh</option>
                    <option value="Other">Other</option>
                  </select>
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">Caste</td>
                <td className="border border-gray-300 px-4 py-2">
                  <select
                    value={facultyData.caste || ""}
                    onChange={(e) => handleChange("caste", e.target.value)}
                    className="w-full border border-gray-300 p-2 rounded"
                  >
                    <option value="">Select Caste</option>
                    {/* Add all caste options */}
                    <option value="">Select Caste</option>
                    <option value="Brahmins">Brahmins</option>
                    <option value="Thakur">Thakur</option>
                    <option value="Vaishya">Vaishya</option>
                    <option value="Tyagi">Tyagi</option>
                    <option value="Bhumihar">Bhumihar</option>
                    <option value="Muslims">Muslims</option>
                    <option value="Christians">Christians</option>
                    <option value="Rajput">Rajput</option>
                    <option value="Kayastha">Kayastha</option>
                    <option value="Pathans">Pathans</option>
                    <option value="Muslim Mughals">Muslim Mughals</option>
                    <option value="Muslim Shaikh">Muslim Shaikh</option>
                    <option value="Muslim Sayyad">Muslim Sayyad</option>
                    <option value="Jat Sikh">Jat Sikh</option>
                    <option value="Bania">Bania</option>
                    <option value="Punjabi Khatri">Punjabi Khatri</option>
                    <option value="Punjabi Arora">Punjabi Arora</option>
                    <option value="Punjabi Sood">Punjabi Sood</option>
                    <option value="Baidya">Baidya</option>
                    <option value="Patidar">Patidar</option>
                    <option value="Patel">Patel</option>
                    <option value="Kshatriya">Kshatriya</option>
                    <option value="Reddy">Reddy</option>
                    <option value="Kamma">Kamma</option>
                    <option value="Kapu">Kapu</option>
                    <option value="Gomati Baniya">Gomati Baniya</option>
                    <option value="Velamma">Velamma</option>
                    <option value="Kshatriya Raju">Kshatriya Raju</option>
                    <option value="Iyengar">Iyengar</option>
                    <option value="Iyer">Iyer</option>
                    <option value="Vellalars">Vellalars</option>
                    <option value="Nair">Nair</option>
                    <option value="Naidu">Naidu</option>
                    <option value="Mukkulathor">Mukkulathor</option>
                    <option value="Sengunthar">Sengunthar</option>
                    <option value="Parkavakulam">Parkavakulam</option>
                    <option value="Nagarathar Baniya">Nagarathar Baniya</option>
                    <option value="Komati">Komati</option>
                    <option value="Vokkaligas">Vokkaligas</option>
                    <option value="Lingayats">Lingayats</option>
                    <option value="Bunts">Bunts</option>
                    <option value="Others">Others</option>
                  </select>
                </td>
              </tr>

              <tr>
                <td className="border border-gray-300 px-4 py-2">Category</td>
                <td className="border border-gray-300 px-4 py-2">
                  <select
                    value={facultyData.category || ""}
                    onChange={(e) => handleChange("category", e.target.value)}
                    className="w-full border border-gray-300 p-2 rounded"
                  >
                    <option value="">Select Category</option>
                    <option value="General">General</option>
                    <option value="OBC">OBC</option>
                    <option value="SC">SC</option>
                    <option value="ST">ST</option>
                  </select>
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">
                  Mother Tongue
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <select
                    value={facultyData.motherTongue || ""}
                    onChange={(e) =>
                      handleChange("motherTongue", e.target.value)
                    }
                    className="w-full border border-gray-300 p-2 rounded"
                  >
                    <option value="">Select Mother Tongue</option>
                    <option value="Kannada">Kannada</option>
                    <option value="Malayalam">Malayalam</option>
                    <option value="Hindi">Hindi</option>
                    <option value="English">English</option>
                    <option value="Tamil">Tamil</option>
                    <option value="Telugu">Telugu</option>
                    <option value="Other">Other</option>
                  </select>
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
                <td className="border border-gray-300 px-4 py-2">
                  Account Number
                </td>
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
                <td className="border border-gray-300 px-4 py-2">
                  Account Name
                </td>
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
                <td className="border border-gray-300 px-4 py-2">
                  Account Type
                </td>
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
                <td className="border border-gray-300 px-4 py-2">
                  Pension Number
                </td>
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
                <td className="border border-gray-300 px-4 py-2">
                  Mother Name
                </td>
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
                <td className="border border-gray-300 px-4 py-2">
                  Father Name
                </td>
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
                <td className="border border-gray-300 px-4 py-2">
                  Spouse Name
                </td>
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
                <td className="border border-gray-300 px-4 py-2">
                  Date of Joining Dr AIT
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <input
                    type="date"
                    value={facultyData.dob?.split("T")[0] || ""}
                    onChange={(e) => handleChange("title", e.target.value)}
                    className="w-full border border-gray-300 p-2 rounded"
                  />
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">Aided</td>
                <td className="border border-gray-300 px-4 py-2">
                  <select
                    value={facultyData.aided || ""}
                    onChange={(e) => handleChange("aided", e.target.value)}
                    className="w-full border border-gray-300 p-2 rounded"
                  >
                    <option value="">Select Aided</option>
                    {aidedOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
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
                <th className="border border-gray-300 px-4 py-2">
                  Institution
                </th>
                <th className="border border-gray-300 px-4 py-2">
                  Specialization
                </th>
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
                    <select
                      value={education.Program || ""}
                      onChange={(e) =>
                        handleEducationChange(index, "Program", e.target.value)
                      }
                      className="w-full border border-gray-300 p-2 rounded"
                    >
                      <option value="">Select Program</option>
                      {programOptions.map((program) => (
                        <option key={program} value={program}>
                          {program}
                        </option>
                      ))}
                    </select>
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
                        handleEducationChange(
                          index,
                          "schoolCollege",
                          e.target.value
                        )
                      }
                      className="w-full border border-gray-300 p-2 rounded"
                    />
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <input
                      type="text"
                      value={education.specialization || ""}
                      onChange={(e) =>
                        handleEducationChange(
                          index,
                          "specialization",
                          e.target.value
                        )
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
                    <select
                      value={education.passClass || ""}
                      onChange={(e) =>
                        handleEducationChange(
                          index,
                          "passClass",
                          e.target.value
                        )
                      }
                      className="w-full border border-gray-300 p-2 rounded"
                    >
                      <option value="">Select Pass Class</option>
                      {passClassOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <input
                      type="number"
                      value={education.yearOfAward || ""}
                      onChange={(e) =>
                        handleEducationChange(
                          index,
                          "yearOfAward",
                          e.target.value
                        )
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
