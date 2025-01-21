import { connectToDatabase } from "../../app/config/dbconfig";
import sql from "mssql";

async function dbQuery(query, inputs = []) {
  try {
    const pool = await connectToDatabase();
    const request = pool.request();

    inputs.forEach(({ name, type, value }) => {
      request.input(name, type, value);
    });

    const result = await request.query(query);
    return result;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Database query failed");
  }
}

export default async function handler(req, res) {
  try {
    if (req.method === "POST") {
      const { facultyId } = req.body;

      if (!facultyId) {
        return res.status(400).json({ success: false, message: "Faculty ID is required" });
      }

      const query = `
        USE aittest;
        SELECT eid, ename, role
        FROM employee_table
        WHERE eid = @facultyId
      `;
      const inputs = [
        { name: "facultyId", type: sql.VarChar, value: facultyId },
      ];

      const result = await dbQuery(query, inputs);

      if (result.recordset.length === 0) {
        return res.status(404).json({ success: false, message: "Faculty ID not found" });
      }

      const { emp_id, role } = result.recordset[0];

      return res.status(200).json({ success: true, emp_id, role });
    }

    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ success: false, message: `Method ${req.method} Not Allowed` });
  } catch (error) {
    console.error("Error:", error.message);
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
}

// import { connectToDatabase } from "../../app/config/dbconfig";
// import sql from "mssql";

// async function dbQuery(query, inputs = []) {
//   try {
//     const pool = await connectToDatabase();
//     const request = pool.request();

//     inputs.forEach(({ name, type, value }) => {
//       request.input(name, type, value);
//     });

//     const result = await request.query(query);
//     return result;
//   } catch (error) {
//     console.error("Database Error:", error);
//     throw new Error("Database query failed");
//   }
// }

// export default async function handler(req, res) {
//   try {
//     if (req.method === "POST") {
//       const { facultyId } = req.body;

//       if (!facultyId) {
//         return res
//           .status(400)
//           .json({ success: false, message: "Faculty ID is required" });
//       }

//       // Query 1: Fetch details from employee_table
//       const query1 = `
//         USE aittest;
//         SELECT eid, ename, role 
//         FROM employee_table 
//         WHERE eid = @facultyId
//       `;
//       const inputs1 = [
//         { name: "facultyId", type: sql.VarChar, value: facultyId },
//       ];

//       const result1 = await dbQuery(query1, inputs1);

//       if (result1.recordset.length === 0) {
//         return res
//           .status(404)
//           .json({ success: false, message: "Faculty ID not found" });
//       }

//       const { eid, ename, role } = result1.recordset[0];

//       // Query 2: Fetch isRegistered from facultyPersonalDetails
//       const query2 = `
//         SELECT isRegistered 
//         FROM facultyPersonalDetails 
//         WHERE employee_id = @facultyId
//       `;
//       const result2 = await dbQuery(query2, inputs1); // Reuse inputs1 as the parameter is the same

//       if (result2.recordset.length === 0) {
//         return res
//           .status(404)
//           .json({ success: false, message: "Faculty details not found" });
//       }

//       const { isRegistered } = result2.recordset[0];

//       // Return combined response
//       return res.status(200).json({
//         success: true,
//         emp_id: eid,
//         ename,
//         role,
//         isRegistered,
//       });
//     }

//     res.setHeader("Allow", ["POST"]);
//     return res
//       .status(405)
//       .json({ success: false, message: `Method ${req.method} Not Allowed` });
//   } catch (error) {
//     console.error("Error:", error.message);
//     return res
//       .status(500)
//       .json({ success: false, message: "Server error", error: error.message });
//   }
// }
