import { connectToDatabase } from "../../app/config/dbconfig";

export default async function handler(req, res) {
  try {
    const pool = await connectToDatabase();

    if (req.method === "GET") {
      // Fetch teaching plan data
      const query = `
      USE aittest;
        SELECT 
          id, 
          unit AS classNo, 
          lessonText, 
          bloomsTaxonomyLevel, 
          category, 
          teachingMethodology, 
          remarks, 
          status, 
          dateOfMarking AS date, 
          employeeId, 
          classId, 
          activityDone
        FROM [dbo].[teaching_plan];
      `;
      const result = await pool.request().query(query);
      res.status(200).json({ data: result.recordset });
    } 
    
    if (req.method === "POST") {
      const { id, category, status, remarks, activity, date } = req.body;
    
      if (!id) {
        return res.status(400).json({ message: "ID is required for update" });
      }
    
      try {
        const pool = await connectToDatabase();
    
        const updateQuery = `
        USE aittest;
          UPDATE [dbo].[teaching_plan]
          SET 
            category = @category,
            status = @status,
            remarks = @remarks,
            activityDone = @activity,
            dateOfMarking = @date
          WHERE id = @id;
        `;
    
        const request = pool.request();
        request.input("id", id);
        request.input("category", category);
        request.input("status", status);
        request.input("remarks", remarks);
        request.input("activity", activity);
        request.input("date", date);
    
        await request.query(updateQuery);
        res.status(200).json({ message: "Row updated successfully" });
      } catch (error) {
        console.error("Database update error:", error);
        res.status(500).json({ message: "Internal server error", error });
      }
    }
     else {
      res.status(405).json({ message: "Method not allowed" });
    }
  } catch (error) {
    console.error("Error handling teaching plan request:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
}
