import { connectToDatabase } from "../../app/config/dbconfig";
import sql from "mssql";

function validateDate(date) {
  const parsedDate = new Date(date);
  if (
    isNaN(parsedDate.getTime()) ||
    parsedDate < new Date("1900-01-01") ||
    parsedDate > new Date("2079-06-06")
  ) {
    return null; // Return null for invalid dates
  }
  return parsedDate;
}

const typeMapping = {
  IJ: "International Journal",
  NJ: "National Journal",
  IC: "International Conference",
  NC: "National Conference",
};

const reverseTypeMapping = {
  "International Journal": "IJ",
  "National Journal": "NJ",
  "International Conference": "IC",
  "National Conference": "NC",
};

export default async function handler(req, res) {
  try {
    const pool = await connectToDatabase();

    if (req.method === "GET") {
      const { facultyId } = req.query;

      if (!facultyId) {
        return res.status(400).json({ message: "Faculty ID is required" });
      }

      const query = `
        USE aittest;
        SELECT * FROM [dbo].[FacultyResearchDetails] WHERE employee_Id = @facultyId;
        SELECT * FROM [dbo].[ConferenceAndJournal] WHERE employee_Id = @facultyId;
        SELECT * FROM [dbo].[Consultancy] WHERE employee_Id = @facultyId;
        SELECT * FROM [dbo].[Patent] WHERE employee_Id = @facultyId;
        SELECT * FROM [dbo].[ProfessionalMembers] WHERE employee_Id = @facultyId;
        SELECT * FROM [dbo].[EventAttended] WHERE employee_Id = @facultyId;
        SELECT * FROM [dbo].[EventOrganized] WHERE employee_Id = @facultyId;
        SELECT * FROM [dbo].[bookPublication] WHERE employee_Id = @facultyId;
        SELECT * FROM [dbo].[research_experience] WHERE employee_Id = @facultyId;
        SELECT * FROM [dbo].[research_supervision] WHERE employee_Id = @facultyId;
        SELECT * FROM [dbo].[ResearchProjects] WHERE employee_Id = @facultyId;
      `;

      const request = pool.request().input("facultyId", sql.NVarChar, facultyId);
      const result = await request.query(query);

      const [
        facultyResearchSchema,
        conferenceAndJournal,
        researchGrantsSchema,
        consultancySchema,
        patentsSchema,
        professionalMembershipSchema,
        eventsAttendedSchema,
        eventsOrganizedSchema,
        publicationsSchema,
        research_experienceSchema,
        researchSupervisionSchema,
      ] = result.recordsets;

      // Map short forms to full names
      const mappedConferenceAndJournal = conferenceAndJournal.map((entry) => ({
        ...entry,
        typeOfPublication: typeMapping[entry.typeOfPublication] || entry.typeOfPublication,
      }));

      // Separate `ConferenceAndJournal` into specific categories
      const nationalJournalDetailsSchema = mappedConferenceAndJournal.filter(
        (entry) => entry.typeOfPublication === "National Journal"
      );
      const internationalJournalDetailsSchema = mappedConferenceAndJournal.filter(
        (entry) => entry.typeOfPublication === "International Journal"
      );
      const nationalConferenceDetailsSchema = mappedConferenceAndJournal.filter(
        (entry) => entry.typeOfPublication === "National Conference"
      );
      const internationalConferenceDetailsSchema = mappedConferenceAndJournal.filter(
        (entry) => entry.typeOfPublication === "International Conference"
      );

      return res.status(200).json({
        data: {
          facultyResearchSchema,
          nationalJournalDetailsSchema,
          internationalJournalDetailsSchema,
          nationalConferenceDetailsSchema,
          internationalConferenceDetailsSchema,
          researchGrantsSchema,
          consultancySchema,
          patentsSchema,
          professionalMembershipSchema,
          eventsAttendedSchema,
          eventsOrganizedSchema,
          publicationsSchema,
          research_experienceSchema,
          researchSupervisionSchema,
        },
      });
    }

    if (req.method === "POST" || req.method === "PUT") {
      const {
        facultyResearchSchema,
        nationalJournalDetailsSchema,
        internationalJournalDetailsSchema,
        nationalConferenceDetailsSchema,
        internationalConferenceDetailsSchema,
        researchGrantsSchema,
        consultancySchema,
        patentsSchema,
        professionalMembershipSchema,
        eventsAttendedSchema,
        eventsOrganizedSchema,
        publicationsSchema,
        research_experienceSchema,
        researchSupervisionSchema,
        facultyId,
      } = req.body;

      if (!facultyId) {
        return res.status(400).json({ success: false, error: "Faculty ID is required" });
      }

      const schemas = {
        facultyResearchSchema,
        conferenceAndJournal: [
          ...(nationalJournalDetailsSchema || []).map((item) => ({
            ...item,
            typeOfPublication: reverseTypeMapping["National Journal"],
          })),
          ...(internationalJournalDetailsSchema || []).map((item) => ({
            ...item,
            typeOfPublication: reverseTypeMapping["International Journal"],
          })),
          ...(nationalConferenceDetailsSchema || []).map((item) => ({
            ...item,
            typeOfPublication: reverseTypeMapping["National Conference"],
          })),
          ...(internationalConferenceDetailsSchema || []).map((item) => ({
            ...item,
            typeOfPublication: reverseTypeMapping["International Conference"],
          })),
        ],
        researchGrantsSchema,
        consultancySchema,
        patentsSchema,
        professionalMembershipSchema,
        eventsAttendedSchema,
        eventsOrganizedSchema,
        publicationsSchema,
        research_experienceSchema,
        researchSupervisionSchema,
      };

      for (const [key, items] of Object.entries(schemas)) {
        if (!items || !items.length) continue;

        for (const item of items) {
          const columns = Object.keys(item).filter((col) => col !== "id");
          const values = columns.map((col) => `@${col}`);
          const setStatements = columns.map((col) => `${col} = EXCLUDED.${col}`).join(", ");

          const query = `
            MERGE [dbo].[${key}]
            USING (VALUES (${values.join(", ")})) AS source(${columns.join(", ")})
            ON target.id = @id
            WHEN MATCHED THEN
              UPDATE SET ${setStatements}
            WHEN NOT MATCHED THEN
              INSERT (${columns.join(", ")})
              VALUES (${values.join(", ")});
          `;

          const request = pool.request();
          Object.entries(item).forEach(([col, value]) => {
            request.input(col, sql.NVarChar, validateDate(value) || value || null);
          });

          await request.query(query);
        }
      }

      return res.status(200).json({ success: true, message: "Data processed successfully" });
    }

    if (req.method === "DELETE") {
      const { id, table } = req.body;

      if (!id || !table) {
        return res
          .status(400)
          .json({ message: "Record ID and table name are required for deletion" });
      }

      const deleteQuery = `
        DELETE FROM [dbo].[${table}]
        WHERE id = @id;
      `;

      await pool.request().input("id", sql.Int, id).query(deleteQuery);

      return res.status(200).json({ message: "Record deleted successfully" });
    }

    return res.status(405).json({ message: "Method not allowed" });
  } catch (error) {
    console.error("Error handling request:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
}
