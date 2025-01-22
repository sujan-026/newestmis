import { connectToDatabase } from "../../app/config/dbconfig";

export default async function handler(req, res) {
  try {
    const pool = await connectToDatabase();

    if (req.method === "GET") {
      const { employee_id } = req.query;

      if (!employee_id) {
        return res.status(400).json({ message: "Employee ID is required" });
      }

      const educationDetailsQuery = `
        SELECT 
          [id],
          [employee_id],
          [Program],
          [regNo],
          [schoolCollege],
          [specialization],
          [mediumOfInstruction],
          [passClass],
          [yearOfAward]
        FROM [aittest].[dbo].[facultyEducation]
        WHERE [employee_id] = @employee_id;
      `;

      const result = await pool.request().input("employee_id", employee_id).query(educationDetailsQuery);

      if (result.recordset.length === 0) {
        return res.status(404).json({ message: "No education records found for the given employee ID" });
      }

      res.status(200).json({ educationDetails: result.recordset });
    } else if (req.method === "POST") {
      const { employee_id, educationDetails } = req.body;

      if (!employee_id || !educationDetails || !Array.isArray(educationDetails)) {
        return res.status(400).json({ message: "Employee ID and education details array are required" });
      }

      for (const education of educationDetails) {
        if (education.id) {
          const updateEducationQuery = `
            UPDATE [aittest].[dbo].[facultyEducation]
            SET 
              Program = @Program,
              regNo = @regNo,
              schoolCollege = @schoolCollege,
              specialization = @specialization,
              mediumOfInstruction = @mediumOfInstruction,
              passClass = @passClass,
              yearOfAward = @yearOfAward
            WHERE id = @id AND employee_id = @employee_id;
          `;
          const educationRequest = pool.request();
          educationRequest.input("id", education.id);
          educationRequest.input("employee_id", employee_id);
          educationRequest.input("Program", education.Program || "Unknown");
          educationRequest.input("regNo", education.regNo || "Unknown");
          educationRequest.input("schoolCollege", education.schoolCollege || "Unknown");
          educationRequest.input("specialization", education.specialization || "Unknown");
          educationRequest.input("mediumOfInstruction", education.mediumOfInstruction || "Unknown");
          educationRequest.input("passClass", education.passClass || "Unknown");
          educationRequest.input("yearOfAward", education.yearOfAward || 0);
          await educationRequest.query(updateEducationQuery);
        } else {
          const insertEducationQuery = `
            INSERT INTO [aittest].[dbo].[facultyEducation] (
              employee_id, Program, regNo, schoolCollege, specialization, 
              mediumOfInstruction, passClass, yearOfAward
            )
            VALUES (
              @employee_id, @Program, @regNo, @schoolCollege, @specialization, 
              @mediumOfInstruction, @passClass, @yearOfAward
            );
          `;
          const educationRequest = pool.request();
          educationRequest.input("employee_id", employee_id);
          educationRequest.input("Program", education.Program || "Unknown");
          educationRequest.input("regNo", education.regNo || "Unknown");
          educationRequest.input("schoolCollege", education.schoolCollege || "Unknown");
          educationRequest.input("specialization", education.specialization || "Unknown");
          educationRequest.input("mediumOfInstruction", education.mediumOfInstruction || "Unknown");
          educationRequest.input("passClass", education.passClass || "Unknown");
          educationRequest.input("yearOfAward", education.yearOfAward || 0);
          await educationRequest.query(insertEducationQuery);
        }
      }

      //res.status(200).json({ message: "Education records added/updated successfully" });
    } else if (req.method === "DELETE") {
      const { id } = req.body;

      if (!id) {
        return res.status(400).json({ message: "Education ID is required for deletion" });
      }

      const deleteEducationQuery = `
        DELETE FROM [aittest].[dbo].[facultyEducation]
        WHERE id = @id;
      `;

      await pool.request().input("id", id).query(deleteEducationQuery);

      res.status(200).json({ message: "Record deleted successfully" });
    } else {
      res.status(405).json({ message: "Method not allowed" });
    }
  } catch (error) {
    console.error("Error handling education data request:", error); // Log full error details
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
}
