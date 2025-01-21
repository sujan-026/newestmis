import { connectToDatabase } from "../../app/config/dbconfig";
import sql from "mssql";

export default async function handler(req, res) {
    if (req.method === "PUT") {
        const { id, category, status, remarks, activity, date } = req.body;

        // Validate required inputs
        if (!id) {
            return res.status(400).json({ message: "ID is required for update" });
        }

        try {
            const pool = await connectToDatabase();

            // Update query with parameterized inputs
            const query = `
            USE aittest;
            UPDATE teaching_plan
            SET 
                category = @category,
                status = @status,
                remarks = @remarks,
                activityDone = @activity,
                dateOfMarking = @date
            WHERE id = @id;
            `;

            // Pass inputs to the query safely
            await pool
                .request()
                .input("id", sql.Int, id) // Assuming ID is an integer
                .input("category", sql.VarChar, category || null)
                .input("status", sql.VarChar, status || null)
                .input("remarks", sql.VarChar, remarks || null)
                .input("activity", sql.VarChar, activity || null) // Assuming activity is a comma-separated string
                .input("date", sql.Date, date || null)
                .query(query);

            res.status(200).json({ message: "Record updated successfully" });
        } catch (error) {
            console.error("Error updating data:", error);
            res.status(500).json({ message: "Internal server error", error });
        }
    } else {
        res.status(405).json({ message: "Method Not Allowed" });
    }
}
