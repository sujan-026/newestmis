// "use client";
// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// const Page = () => {
//   const router = useRouter();
//   const [facultyId, setFacultyId] = useState("");
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (facultyId) {
//       try {
//         const response = await fetch(`/api/check_emp`, {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ facultyId }),
//         });
//         if (!response.ok) {
//           const errorData = await response.json();
//           alert(errorData.message || "Something went wrong");
//           return;
//         }
//         const data = await response.json();
        // if (data) {
        //   router.push(`/faculty/faculty_reg/${facultyId}`);
        // } else {
        //   alert("Faculty is not registered or does not exist.");
        // }
    //   } catch (error) {
    //     console.error("Error:", error);
    //     alert("An error occurred while checking faculty ID.");
    //   }
    // } else {
    //   alert("Please enter a Faculty ID");
    // }
//   };
//   return (
//     <div>
//       {" "}
//       <h1>Find Faculty Page</h1>{" "}
//       <form onSubmit={handleSubmit}>
//         {" "}
//         <input
//           type="text"
//           value={facultyId}
//           onChange={(e) => setFacultyId(e.target.value)}
//           placeholder="Enter Faculty ID"
//         />{" "}
//         <button type="submit">Submit</button>{" "}
//       </form>{" "}
//     </div>
//   );
// };
// export default Page;

"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();
  const [facultyId, setFacultyId] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (facultyId) {
      try {
        const response = await fetch(`/api/check_emp`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ facultyId }),
        });
        if (!response.ok) {
          const errorData = await response.json();
          alert(errorData.message || "Something went wrong");
          return;
        }
        const data = await response.json();
        console.log(data.role);

        if (data.role === "faculty" || data.role === "deanp" || data.role === "hod" || data.role === "dean-exam" || data.role === "principal") {
          router.push(`/faculty/faculty_reg/${facultyId}`);
        } else if(data.role === "non-teaching staff" || data.role === "staff") {
          router.push(`/mis_non_teaching_staff/register/${facultyId}`);
        } else {
          alert("Faculty is not registered or does not exist.");
        }
        // if (
        //   (!data.isRegistered && data.role === "faculty") ||
        //   data.role === "admin" ||
        //   data.role === "hod" ||
        //   data.role === "principal" ||
        //   data.role === "dean" ||
        //   data.role === "est" ||
        //   data.role === "adm_admin" ||
        //   data.role === "acc_admin" ||
        //   data.role === "est_admin" ||
        //   data.role === "dean-academic"
        // ) {
        //   router.push(`/faculty/faculty_reg/${facultyId}`);
        // } else {
        //   if (data.isRegistered) {
        //     alert("Faculty already exist.");
        //     router.push("mis_est");
        //   } else {
        //     alert("Faculty is not registered or does not exist.");
        //   }
        // }

        // if (
        //   (!data.isRegistered && data.role === "non-teaching staff") ||
        //   data.role === "staff"
        // ) {
        //   router.push(`/mis_non_teaching_staff/register/${facultyId}`);
        // } else {
        //   if (data.isRegistered) {
        //     alert("Non Teaching Staff already exist.");
        //     router.push("mis_est");
        //   } else {
        //     alert("Non Teaching Staff is not registered or does not exist.");
        //   }
        // }

  //       if (
  //         !data.isRegistered &&
  //         [
  //           "faculty",
  //           "admin",
  //           "hod",
  //           "principal",
  //           "dean",
  //           "est",
  //           "adm_admin",
  //           "acc_admin",
  //           "est_admin",
  //           "dean-academic",
  //         ].includes(data.role)
  //       ) {
  //         router.push(`/faculty/faculty_reg/${facultyId}`);
  //       } else if (
  //         data.isRegistered &&
  //         [
  //           "faculty",
  //           "admin",
  //           "hod",
  //           "principal",
  //           "dean",
  //           "est",
  //           "adm_admin",
  //           "acc_admin",
  //           "est_admin",
  //           "dean-academic",
  //         ].includes(data.role)
  //       ) {
  //         alert("Faculty already exists.");
  //         router.push("mis_est");
  //       } else if (
  //         !data.isRegistered &&
  //         ["non-teaching staff", "staff"].includes(data.role)
  //       ) {
  //         router.push(`/mis_non_teaching_staff/register/${facultyId}`);
  //       } else if (
  //         data.isRegistered &&
  //         ["non-teaching staff", "staff"].includes(data.role)
  //       ) {
  //         alert("Non-Teaching Staff already exists.");
  //         router.push("mis_est");
  //       } else {
  //         alert("The user is not registered or does not exist.");
  //       }
      } catch (error) {
        console.error("Error:", error);
        alert("An error occurred while checking faculty ID.");
      }
    } else {
      alert("Please enter a Faculty ID");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Find Faculty Page
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={facultyId}
            onChange={(e) => setFacultyId(e.target.value)}
            placeholder="Enter Faculty ID"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Submit
          </button>
        </form>
        <button
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 mt-4 my-4"
          onClick={() => router.push("/mis_est")}
        >
          Home
        </button>
      </div>
    </div>
  );
};

export default Page;
