import { connectToDatabase } from "../../app/config/dbconfig";
import sql from "mssql";


export default async function handler(req, res) {
  try {
    const pool = await connectToDatabase();

    if (req.method === "GET") {
      const { employee_id } = req.query;

      if (!employee_id) {
        return res.status(400).json({ message: "Employee ID is required" });
      }

      // Queries for each table
      const queries = {
        FacultyAcademicDetails: `
          SELECT [id], [employee_id], [level]
          FROM [aittest].[dbo].[FacultyAcademicDetails]
          WHERE [employee_id] = @employee_id;
        `,
        TeachingExperience: `
          SELECT [id], [employee_id], [instituteName], [fromDate], [toDate], [Designation], [departmentName]
          FROM [aittest].[dbo].[TeachingExperience]
          WHERE [employee_id] = @employee_id;
        `,
        IndustryExperience: `
          SELECT [id], [employee_id], [organization], [fromDate], [toDate], [designation]
          FROM [aittest].[dbo].[IndustryExperience]
          WHERE [employee_id] = @employee_id;
        `,
        AwardAndRecognition: `
          SELECT [id], [employee_id], [recognitionorawardReceived], [recognitionorawardFrom], 
                 [awardReceived], [awardDate], [awardFrom], [recognitionorawardDate]
          FROM [aittest].[dbo].[AwardAndRecognition]
          WHERE [employee_id] = @employee_id;
        `,
        addtionalResponsibility: `
            SELECT [id], [employee_id], [level], [fromDate], [toDate], [responsibility]
            FROM [aittest].[dbo].[addtionalResponsibility]
            WHERE [employee_id] = @employee_id;
          `,
        Extracurricular: `
          SELECT [id], [employee_id], [eventType], [eventTitle], [fromDate], [toDate], 
                 [organizer], [level], [achievement]
          FROM [aittest].[dbo].[Extracurricular]
          WHERE [employee_id] = @employee_id;
        `,
        OutreachActivity: `
          SELECT [id], [employee_id], [activity], [role], [fromDate], [toDate], [place]
          FROM [aittest].[dbo].[OutreachActivity]
          WHERE [employee_id] = @employee_id;
        `,
      };

      const results = {};
      for (const [key, query] of Object.entries(queries)) {
        results[key] = (
          await pool.request().input("employee_id", sql.NVarChar, employee_id).query(query)
        ).recordset;
      }

      res.status(200).json({ data: results });
    } else if (req.method === "POST" || req.method === "PUT") {
      const {
        academicSchema = null,
        previousTeachingExperienceSchema = [],
        teachingExperienceIndustrySchema = [],
        awardsSchema = [],
        recognitionsSchema = [],
        responsibilitiesSchema = [],
        extracurricularsSchema = [],
        outreachSchema = [],
        facultyId,
      } = req.body;

      if (!facultyId) {
        return res.status(400).json({ success: false, error: "Faculty ID is required" });
      }

      const operations = [
        {
          schema: [academicSchema].filter(Boolean), // Skip null schemas
          query: `
            MERGE [aittest].[dbo].[FacultyAcademicDetails] AS target
            USING (SELECT @employee_id AS employee_id, @level AS level) AS source
            ON target.employee_id = source.employee_id
            WHEN MATCHED THEN
              UPDATE SET level = source.level
            WHEN NOT MATCHED THEN
              INSERT (employee_id, level) VALUES (source.employee_id, source.level);
          `,
          params: (item) => [
            { name: "employee_id", type: sql.NVarChar, value: facultyId },
            { name: "level", type: sql.NVarChar, value: item.level || "N/A" },
          ],
        },
        {
          schema: previousTeachingExperienceSchema,
          query: `
            MERGE [aittest].[dbo].[TeachingExperience] AS target
            USING (SELECT @id AS id, @employee_id AS employee_id, 
                          @instituteName AS instituteName, @fromDate AS fromDate, 
                          @toDate AS toDate, @Designation AS Designation, 
                          @departmentName AS departmentName) AS source
            ON target.id = source.id
            WHEN MATCHED THEN
              UPDATE SET 
                instituteName = source.instituteName, 
                fromDate = source.fromDate, 
                toDate = source.toDate, 
                Designation = source.Designation, 
                departmentName = source.departmentName
            WHEN NOT MATCHED THEN
              INSERT (employee_id, instituteName, fromDate, toDate, Designation, departmentName)
              VALUES (source.employee_id, source.instituteName, source.fromDate, source.toDate, source.Designation, source.departmentName);
          `,
          params: (item) => [
            { name: "id", type: sql.Int, value: item.id || null },
            { name: "employee_id", type: sql.NVarChar, value: facultyId },
            { name: "instituteName", type: sql.NVarChar, value: item.instituteName || "Unknown Institute" },
            { name: "fromDate", type: sql.Date, value: item.fromDate ? new Date(item.fromDate) : null },
            { name: "toDate", type: sql.Date, value: item.toDate ? new Date(item.toDate) : null },
            { name: "Designation", type: sql.NVarChar, value: item.Designation || "Unknown" },
            { name: "departmentName", type: sql.NVarChar, value: item.departmentName || "Unknown Department" },
          ],
        },
        // Repeat similar structure for IndustryExperience, Awards, etc.
        {
            schema: teachingExperienceIndustrySchema,
            query: `
              MERGE [aittest].[dbo].[IndustryExperience] AS target
              USING (SELECT @id AS id, @employee_id AS employee_id, 
                            @organization AS organization, @fromDate AS fromDate, 
                            @toDate AS toDate, @designation AS designation) AS source
              ON target.id = source.id
              WHEN MATCHED THEN
                UPDATE SET 
                  organization = source.organization, 
                  fromDate = source.fromDate, 
                  toDate = source.toDate, 
                  designation = source.designation
              WHEN NOT MATCHED THEN
                INSERT (employee_id, organization, fromDate, toDate, designation)
                VALUES (source.employee_id, source.organization, source.fromDate, source.toDate, source.designation);
            `,
            params: (item) => [
              { name: "id", type: sql.Int, value: item.id || null },
              { name: "employee_id", type: sql.NVarChar, value: facultyId },
              { name: "organization", type: sql.NVarChar, value: item.organization || "Unknown Organization" },
              { name: "fromDate", type: sql.Date, value: item.fromDate ? new Date(item.fromDate) : null },
              { name: "toDate", type: sql.Date, value: item.toDate ? new Date(item.toDate) : null },
              { name: "designation", type: sql.NVarChar, value: item.designation || "Unknown" },
            ],

        },
        {
            schema: awardsSchema,
            query: `
              MERGE [aittest].[dbo].[AwardAndRecognition] AS target
              USING (SELECT @id AS id, @employee_id AS employee_id, 
                            @recognitionorawardReceived AS recognitionorawardReceived, @recognitionorawardFrom AS recognitionorawardFrom, 
                            @awardReceived AS awardReceived, @awardDate AS awardDate, 
                            @awardFrom AS awardFrom, @recognitionorawardDate AS recognitionorawardDate) AS source
              ON target.id = source.id
              WHEN MATCHED THEN
                UPDATE SET 
                  recognitionorawardReceived = source.recognitionorawardReceived, 
                  recognitionorawardFrom = source.recognitionorawardFrom, 
                  awardReceived = source.awardReceived, 
                  awardDate = source.awardDate, 
                  awardFrom = source.awardFrom, 
                  recognitionorawardDate = source.recognitionorawardDate
              WHEN NOT MATCHED THEN
                INSERT (employee_id, recognitionorawardReceived, recognitionorawardFrom, awardReceived, awardDate, awardFrom, recognitionorawardDate)
                VALUES (source.employee_id, source.recognitionorawardReceived, source.recognitionorawardFrom, source.awardReceived, source.awardDate, source.awardFrom, source.recognitionorawardDate);
            `,
            params: (item) => [
              { name: "id", type: sql.Int, value: item.id || null },
              { name: "employee_id", type: sql.NVarChar, value: facultyId },
              { name: "recognitionorawardReceived", type: sql.NVarChar, value: item.recognitionorawardReceived || "Unknown" },
              { name: "recognitionorawardFrom", type: sql.NVarChar, value: item.recognitionorawardFrom || "Unknown" },
              { name: "awardReceived", type: sql.NVarChar, value: item.awardReceived || "Unknown" },
              { name: "awardDate", type: sql.Date, value: item.awardDate ? item.awardDate : null },
              { name: "awardFrom", type: sql.NVarChar, value: item.awardFrom || "Unknown" },
              { name: "recognitionorawardDate", type: sql.Date, value: item.awardDate ? item.awardDate : null },
            ],

        },
        {
            schema: recognitionsSchema,
            query: `
              MERGE [aittest].[dbo].[AwardAndRecognition] AS target
              USING (SELECT @id AS id, @employee_id AS employee_id, 
                            @recognitionorawardReceived AS recognitionorawardReceived, @recognitionorawardFrom AS recognitionorawardFrom, 
                            @awardReceived AS awardReceived, @awardDate AS awardDate, 
                            @awardFrom AS awardFrom, @recognitionorawardDate AS recognitionorawardDate) AS source
              ON target.id = source.id
              WHEN MATCHED THEN
                UPDATE SET 
                  recognitionorawardReceived = source.recognitionorawardReceived, 
                  recognitionorawardFrom = source.recognitionorawardFrom, 
                  awardReceived = source.awardReceived, 
                  awardDate = source.awardDate, 
                  awardFrom = source.awardFrom, 
                  recognitionorawardDate = source.recognitionorawardDate
              WHEN NOT MATCHED THEN
                INSERT (employee_id, recognitionorawardReceived, recognitionorawardFrom, awardReceived, awardDate, awardFrom, recognitionorawardDate)
                VALUES (source.employee_id, source.recognitionorawardReceived, source.recognitionorawardFrom, source.awardReceived, source.awardDate, source.awardFrom, source.recognitionorawardDate);
            `,
            params: (item) => [
              { name: "id", type: sql.Int, value: item.id || null },
              { name: "employee_id", type: sql.NVarChar, value: facultyId },
              { name: "recognitionorawardReceived", type: sql.NVarChar, value: item.recognitionorawardReceived || "Unknown" },
              { name: "recognitionorawardFrom", type: sql.NVarChar, value: item.recognitionorawardFrom || "Unknown" },
              { name: "awardReceived", type: sql.NVarChar, value: item.awardReceived || "Unknown" },
              { name: "awardDate", type: sql.Date, value: item.awardDate ? item.awardDate : null },
              { name: "awardFrom", type: sql.NVarChar, value: item.awardFrom || "Unknown" },
              { name: "recognitionorawardDate", type: sql.Date, value: item.awardDate ? item.awardDate : null },
            ],
        },
        {
            schema: responsibilitiesSchema,
            query: `
              MERGE [aittest].[dbo].[addtionalResponsibility] AS target
              USING (SELECT @id AS id, @employee_id AS employee_id, 
                            @level AS level, @fromDate AS fromDate, 
                            @toDate AS toDate, @responsibility AS responsibility) AS source
              ON target.id = source.id
              WHEN MATCHED THEN
                UPDATE SET 
                  level = source.level, 
                  fromDate = source.fromDate, 
                  toDate = source.toDate, 
                  responsibility = source.responsibility
              WHEN NOT MATCHED THEN
                INSERT (employee_id, level, fromDate, toDate, responsibility)
                VALUES (source.employee_id, source.level, source.fromDate, source.toDate, source.responsibility);
            `,
            params: (item) => [
              { name: "id", type: sql.Int, value: item.id || null },
              { name: "employee_id", type: sql.NVarChar, value: facultyId },
              { name: "level", type: sql.NVarChar, value: item.level || "Unknown" },
              { name: "fromDate", type: sql.Date, value: item.fromDate ? new Date(item.fromDate) : new Date() },
              { name: "toDate", type: sql.Date, value: item.toDate ? new Date(item.toDate) : new Date() },
              { name: "responsibility", type: sql.NVarChar, value: item.responsibility || "Unknown" },
            ],

        }
        ,
        {
            schema: extracurricularsSchema,
            query: `
              MERGE [aittest].[dbo].[Extracurricular] AS target
              USING (SELECT @id AS id, @employee_id AS employee_id, 
                            @eventType AS eventType, @eventTitle AS eventTitle, 
                            @fromDate AS fromDate, @toDate AS toDate, 
                            @organizer AS organizer, @level AS level, @achievement AS achievement) AS source
              ON target.id = source.id
              WHEN MATCHED THEN
                UPDATE SET 
                  eventType = source.eventType, 
                  eventTitle = source.eventTitle, 
                  fromDate = source.fromDate, 
                  toDate = source.toDate, 
                  organizer = source.organizer, 
                  level = source.level, 
                  achievement = source.achievement
              WHEN NOT MATCHED THEN
                INSERT (employee_id, eventType, eventTitle, fromDate, toDate, organizer, level, achievement)
                VALUES (source.employee_id, source.eventType, source.eventTitle, source.fromDate, source.toDate, source.organizer, source.level, source.achievement);
            `,
            params: (item) => [
              { name: "id", type: sql.Int, value: item.id || null },
              { name: "employee_id", type: sql.NVarChar, value: facultyId },
              { name: "eventType", type: sql.NVarChar, value: item.eventType || "Unknown" },
              { name: "eventTitle", type: sql.NVarChar, value: item.eventTitle || "Unknown" },
              { name: "fromDate", type: sql.Date, value: item.fromDate ? new Date(item.fromDate) : null },
              { name: "toDate", type: sql.Date, value: item.toDate ? new Date(item.toDate) : null },
              { name: "organizer", type: sql.NVarChar, value: item.organizer || "Unknown" },
              { name: "level", type: sql.NVarChar, value: item.level || "Unknown" },
              { name: "achievement", type: sql.NVarChar, value: item.achievement || "Unknown" },
            ],
        }
        ,
        {
            schema: outreachSchema,
            query: `
              MERGE [aittest].[dbo].[OutreachActivity] AS target
              USING (SELECT @id AS id, @employee_id AS employee_id, 
                            @activity AS activity, @role AS role, 
                            @fromDate AS fromDate, @toDate AS toDate, 
                            @place AS place) AS source
              ON target.id = source.id
              WHEN MATCHED THEN
                UPDATE SET 
                  activity = source.activity, 
                  role = source.role, 
                  fromDate = source.fromDate, 
                  toDate = source.toDate, 
                  place = source.place
              WHEN NOT MATCHED THEN
                INSERT (employee_id, activity, role, fromDate, toDate, place)
                VALUES (source.employee_id, source.activity, source.role, source.fromDate, source.toDate, source.place);
            `,
            params: (item) => [
              { name: "id", type: sql.Int, value: item.id || null },
              { name: "employee_id", type: sql.NVarChar, value: facultyId },
              { name: "activity", type: sql.NVarChar, value: item.activity || "Unknown" },
              { name: "role", type: sql.NVarChar, value: item.role || "Unknown" },
              { name: "fromDate", type: sql.Date, value: item.fromDate ? new Date(item.fromDate) : null },
              { name: "toDate", type: sql.Date, value: item.toDate ? new Date(item.toDate) : null },
              { name: "place", type: sql.NVarChar, value: item.place || "Unknown" },
            ],
        }
    ];

      for (const operation of operations) {
        for (const item of operation.schema) {
          const request = pool.request();
          for (const param of operation.params(item)) {
            request.input(param.name, param.type, param.value);
          }
          await request.query(operation.query);
        }
      }

      res.status(200).json({
        success: true,
        message: "Records added/updated successfully",
      });
    } else if (req.method === "DELETE") {
      const { id, table } = req.body;

      if (!id || !table) {
        return res
          .status(400)
          .json({ message: "Record ID and table name are required for deletion" });
      }

      const deleteQuery = `
        DELETE FROM [aittest].[dbo].[${table}]
        WHERE id = @id;
      `;

      await pool.request().input("id", sql.Int, id).query(deleteQuery);

      res.status(200).json({ message: "Record deleted successfully" });
    } else {
      res.status(405).json({ message: "Method not allowed" });
    }
  } catch (error) {
    console.error("Error handling request:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
}
