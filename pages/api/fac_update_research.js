import { connectToDatabase } from "../../app/config/dbconfig";
import sql from "mssql";

export default async function handler(req, res) {
  try {
    const pool = await connectToDatabase();
    const tableNameMapping = {
        facultyResearchDetails: "FacultyResearchDetails",
        ConferenceAndJournal: "ConferenceAndJournal",
        ResearchProjects: "ResearchProjects",
        ResearchSupervision: "research_supervision",
        ResearchExperience: "research_experience",
        Consultancy: "Consultancy",
        Patent: "Patent",
        BookPublication: "bookPublication",
        EventAttended: "EventAttended",
        EventOrganized: "EventOrganized",
        ProfessionalMembers: "ProfessionalMembers",
      };
    if (req.method === "GET") {
      const { employee_id } = req.query;

      if (!employee_id) {
        return res.status(400).json({ message: "Employee ID is required" });
      }

      // Queries for each research-related table
      const queries = {
        FacultyResearchDetails: `
          SELECT [id], [employee_id], [orcidId], [googleScholarId], [scopusId], [publonsId], [researchId]
          FROM [aittest].[dbo].[FacultyResearchDetails]
          WHERE [employee_id] = @employee_id;
        `,
        ConferenceAndJournal: `
          SELECT [id], [employee_id], [typeOfPublication], [title], [doi], [issn], [joConName], 
                 [yearOfPublication], [pageNo], [authors], [publishedUnder], [impactFactor], 
                 [quartile], [sponsor], [venue], [volume], [issueNo]
          FROM [aittest].[dbo].[ConferenceAndJournal]
          WHERE [employee_id] = @employee_id;
        `,
        ResearchProjects: `
          SELECT [id], [employee_id], [projectTitle], [pi], [coPi], [dOfSanction], 
                 [duration], [fundingAgency], [amount], [status]
          FROM [aittest].[dbo].[ResearchProjects]
          WHERE [employee_id] = @employee_id;
        `,
        ResearchSupervision: `
          SELECT [id], [employee_id], [Research_Supervisor], [Research_Scholar_Name], [USN], 
                 [University], [Institute], [Discipline], [Title_Research], [Status]
          FROM [aittest].[dbo].[research_supervision]
          WHERE [employee_id] = @employee_id;
        `,
        ResearchExperience: `
          SELECT [id], [employee_id], [areaofresearch], [from_date], [to_date]
          FROM [aittest].[dbo].[research_experience]
          WHERE [employee_id] = @employee_id;
        `,
        Consultancy: `
          SELECT [id], [employee_id], [sanctionedDate], [projectPeriod], [amount], 
                 [principalInvestigator], [coPrincipalInvestigator], [status]
          FROM [aittest].[dbo].[Consultancy]
          WHERE [employee_id] = @employee_id;
        `,
        Patent: `
          SELECT [id], [employee_id], [areaOfResearch], [grantedYear], [patentNo], 
                 [patentStatus], [author]
          FROM [aittest].[dbo].[Patent]
          WHERE [employee_id] = @employee_id;
        `,
        BookPublication: `
          SELECT [id], [publicationType], [name], [volume], [pageNumber], [issn], 
                 [publisher], [title], [area], [impactFactor], [employee_id], 
                 [yearOfPublish], [authors]
          FROM [aittest].[dbo].[bookPublication]
          WHERE [employee_id] = @employee_id;
        `,
        EventAttended: `
          SELECT [id], [fromDate], [toDate], [organizer], [venue], [sponsor], 
                 [targetAudience], [employee_id], [nameofevent], [typeofevent]
          FROM [aittest].[dbo].[EventAttended]
          WHERE [employee_id] = @employee_id;
        `,
        EventOrganized: `
          SELECT [id], [typeofevent], [nameofevent], [fromDate], [toDate], [organizer], 
                 [venue], [sponsor], [targetAudience], [employee_id]
          FROM [aittest].[dbo].[EventOrganized]
          WHERE [employee_id] = @employee_id;
        `,
        ProfessionalMembers: `
          SELECT [id], [employee_id], [professionalBody], [membershipId], 
                 [membershipSince], [membershipType]
          FROM [aittest].[dbo].[ProfessionalMembers]
          WHERE [employee_id] = @employee_id;
        `
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
        researchDetails = [],
        conferenceJournals = [],
        researchProjects = [],
        researchSupervision = [],
        researchExperience = [],
        consultancy = [],
        patents = [],
        bookPublications = [],
        eventsAttended = [],
        eventsOrganized = [],
        professionalMemberships = [],
        facultyId
      } = req.body;

      if (!facultyId) {
        return res.status(400).json({ success: false, error: "Faculty ID is required" });
      }

      const operations = [
        {
          schema: [researchDetails].filter(Boolean),
          query: `
            MERGE [aittest].[dbo].[FacultyResearchDetails] AS target
            USING (SELECT @id AS id, @employee_id AS employee_id, @orcidId AS orcidId, 
                          @googleScholarId AS googleScholarId, @scopusId AS scopusId, 
                          @publonsId AS publonsId, @researchId AS researchId) AS source
            ON target.id = source.id
            WHEN MATCHED THEN
              UPDATE SET 
                orcidId = source.orcidId,
                googleScholarId = source.googleScholarId,
                scopusId = source.scopusId,
                publonsId = source.publonsId,
                researchId = source.researchId
            WHEN NOT MATCHED THEN
              INSERT (employee_id, orcidId, googleScholarId, scopusId, publonsId, researchId)
              VALUES (source.employee_id, source.orcidId, source.googleScholarId, 
                     source.scopusId, source.publonsId, source.researchId);
          `,
          params: (item) => [
            { name: "id", type: sql.Int, value: item.id ? Number(item.id) || null : null },
            { name: "employee_id", type: sql.NVarChar, value: facultyId },
            { name: "orcidId", type: sql.NVarChar, value: item.orcidId || null },
            { name: "googleScholarId", type: sql.NVarChar, value: item.googleScholarId || null },
            { name: "scopusId", type: sql.NVarChar, value: item.scopusId || null },
            { name: "publonsId", type: sql.NVarChar, value: item.publonsId || null },
            { name: "researchId", type: sql.NVarChar, value: item.researchId || null }
          ]
        },
        {
          schema: conferenceJournals,
          query: `
            MERGE [aittest].[dbo].[ConferenceAndJournal] AS target
            USING (SELECT @id AS id, @employee_id AS employee_id, @typeOfPublication AS typeOfPublication,
                          @title AS title, @doi AS doi, @issn AS issn, @joConName AS joConName,
                          @yearOfPublication AS yearOfPublication, @pageNo AS pageNo, @authors AS authors,
                          @publishedUnder AS publishedUnder, @impactFactor AS impactFactor,
                          @quartile AS quartile, @sponsor AS sponsor, @venue AS venue,
                          @volume AS volume, @issueNo AS issueNo) AS source
            ON target.id = source.id
            WHEN MATCHED THEN
              UPDATE SET 
                typeOfPublication = source.typeOfPublication,
                title = source.title,
                doi = source.doi,
                issn = source.issn,
                joConName = source.joConName,
                yearOfPublication = source.yearOfPublication,
                pageNo = source.pageNo,
                authors = source.authors,
                publishedUnder = source.publishedUnder,
                impactFactor = source.impactFactor,
                quartile = source.quartile,
                sponsor = source.sponsor,
                venue = source.venue,
                volume = source.volume,
                issueNo = source.issueNo
            WHEN NOT MATCHED THEN
              INSERT (employee_id, typeOfPublication, title, doi, issn, joConName,
                     yearOfPublication, pageNo, authors, publishedUnder, impactFactor,
                     quartile, sponsor, venue, volume, issueNo)
              VALUES (source.employee_id, source.typeOfPublication, source.title,
                     source.doi, source.issn, source.joConName, source.yearOfPublication,
                     source.pageNo, source.authors, source.publishedUnder,
                     source.impactFactor, source.quartile, source.sponsor,
                     source.venue, source.volume, source.issueNo);
          `,
          params: (item) => [
            { name: "id", type: sql.Int, value: item.id ? Number(item.id) || null : null },
            { name: "employee_id", type: sql.NVarChar, value: facultyId },
            { name: "typeOfPublication", type: sql.NVarChar, value: item.typeOfPublication || null },
            { name: "title", type: sql.NVarChar, value: item.title || null },
            { name: "doi", type: sql.NVarChar, value: item.doi || null },
            { name: "issn", type: sql.NVarChar, value: item.issn || null },
            { name: "joConName", type: sql.NVarChar, value: item.joConName || null },
            { name: "yearOfPublication", type: sql.Int, value: item.yearOfPublication || null },
            { name: "pageNo", type: sql.NVarChar, value: item.pageNo || null },
            { name: "authors", type: sql.NVarChar, value: item.authors || null },
            { name: "publishedUnder", type: sql.NVarChar, value: item.publishedUnder || null },
            { name: "impactFactor", type: sql.Decimal(10, 2), value: item.impactFactor || null },
            { name: "quartile", type: sql.NVarChar, value: item.quartile || null },
            { name: "sponsor", type: sql.NVarChar, value: item.sponsor || null },
            { name: "venue", type: sql.NVarChar, value: item.venue || null },
            { name: "volume", type: sql.NVarChar, value: item.volume || null },
            { name: "issueNo", type: sql.NVarChar, value: item.issueNo || null }
          ]
        },
        // Add similar blocks for other tables: ResearchProjects, ResearchSupervision, etc.
        // Following the same pattern but with appropriate fields and types
        {
            schema: researchProjects,
            query: `
              MERGE [aittest].[dbo].[ResearchProjects] AS target
              USING (SELECT @id AS id, @employee_id AS employee_id, @projectTitle AS projectTitle,
                            @pi AS pi, @coPi AS coPi, @dOfSanction AS dOfSanction,
                            @duration AS duration, @fundingAgency AS fundingAgency, @amount AS amount,
                            @status AS status) AS source
              ON target.id = source.id
              WHEN MATCHED THEN
                UPDATE SET 
                  projectTitle = source.projectTitle,
                  pi = source.pi,
                  coPi = source.coPi,
                  dOfSanction = source.dOfSanction,
                  duration = source.duration,
                  fundingAgency = source.fundingAgency,
                  amount = source.amount,
                  status = source.status
              WHEN NOT MATCHED THEN
                INSERT (employee_id, projectTitle, pi, coPi, dOfSanction,
                       duration, fundingAgency, amount, status)
                VALUES (source.employee_id, source.projectTitle, source.pi,
                       source.coPi, source.dOfSanction, source.duration,
                       source.fundingAgency, source.amount, source.status);
            `,
            params: (item) => [
              { name: "id", type: sql.Int, value: item.id ? Number(item.id) || null : null },
              { name: "employee_id", type: sql.NVarChar, value: facultyId },
              { name: "projectTitle", type: sql.NVarChar, value: item.projectTitle || null },
              { name: "pi", type: sql.NVarChar, value: item.pi || null },
              { name: "coPi", type: sql.NVarChar, value: item.coPi || null },
              { name: "dOfSanction", type: sql.Date, value: item.dOfSanction || null },
              { name: "duration", type: sql.NVarChar, value: item.duration || null },
              { name: "fundingAgency", type: sql.NVarChar, value: item.fundingAgency || null },
              { name: "amount", type: sql.Decimal(10, 2), value: item.amount || null },
              { name: "status", type: sql.NVarChar, value: item.status || null }
            ]

        },
        {
            schema: researchSupervision,
            query: `
              MERGE [aittest].[dbo].[research_supervision] AS target
              USING (SELECT @id AS id, @employee_id AS employee_id, @Research_Supervisor AS Research_Supervisor,
                            @Research_Scholar_Name AS Research_Scholar_Name, @USN AS USN,
                            @University AS University, @Institute AS Institute, @Discipline AS Discipline,
                            @Title_Research AS Title_Research, @Status AS Status) AS source
              ON target.id = source.id
              WHEN MATCHED THEN
                UPDATE SET 
                  Research_Supervisor = source.Research_Supervisor,
                  Research_Scholar_Name = source.Research_Scholar_Name,
                  USN = source.USN,
                  University = source.University,
                  Institute = source.Institute,
                  Discipline = source.Discipline,
                  Title_Research = source.Title_Research,
                  Status = source.Status
              WHEN NOT MATCHED THEN
                INSERT (employee_id, Research_Supervisor, Research_Scholar_Name, USN, University,
                       Institute, Discipline, Title_Research, Status)
                VALUES (source.employee_id, source.Research_Supervisor, source.Research_Scholar_Name,
                       source.USN, source.University, source.Institute, source.Discipline,
                       source.Title_Research, source.Status);
            `,
            params: (item) => [
              { name: "id", type: sql.Int, value: item.id ? Number(item.id) || null : null },
              { name: "employee_id", type: sql.NVarChar, value: facultyId },
              { name: "Research_Supervisor", type: sql.NVarChar, value: item.Research_Supervisor || null },
              { name: "Research_Scholar_Name", type: sql.NVarChar, value: item.Research_Scholar_Name || null },
              { name: "USN", type: sql.NVarChar, value: item.USN || null },
              { name: "University", type: sql.NVarChar, value: item.University || null },
              { name: "Institute", type: sql.NVarChar, value: item.Institute || null },
              { name: "Discipline", type: sql.NVarChar, value: item.Discipline || null },
              { name: "Title_Research", type: sql.NVarChar, value: item.Title_Research || null },
              { name: "Status", type: sql.NVarChar, value: item.Status || null }
            ]

        },
        {
            schema: researchExperience,
            query: `
              MERGE [aittest].[dbo].[research_experience] AS target
              USING (SELECT @id AS id, @employee_id AS employee_id, @areaofresearch AS areaofresearch,
                            @from_date AS from_date, @to_date AS to_date) AS source
              ON target.id = source.id
              WHEN MATCHED THEN
                UPDATE SET 
                  areaofresearch = source.areaofresearch,
                  from_date = source.from_date,
                  to_date = source.to_date
              WHEN NOT MATCHED THEN
                INSERT (employee_id, areaofresearch, from_date, to_date)
                VALUES (source.employee_id, source.areaofresearch, source.from_date, source.to_date);
            `,
            params: (item) => [
              { name: "id", type: sql.Int, value: item.id ? Number(item.id) || null : null },
              { name: "employee_id", type: sql.NVarChar, value: facultyId },
              { name: "areaofresearch", type: sql.NVarChar, value: item.areaofresearch || null },
              { name: "from_date", type: sql.Date, value: item.from_date || null },
              { name: "to_date", type: sql.Date, value: item.to_date || null }
            ]

        },
        {
            schema: consultancy,
            query: `
              MERGE [aittest].[dbo].[Consultancy] AS target
              USING (SELECT @id AS id, @employee_id AS employee_id, @sanctionedDate AS sanctionedDate,
                            @projectPeriod AS projectPeriod, @amount AS amount, @principalInvestigator AS principalInvestigator,
                            @coPrincipalInvestigator AS coPrincipalInvestigator, @status AS status) AS source
              ON target.id = source.id
              WHEN MATCHED THEN
                UPDATE SET 
                  sanctionedDate = source.sanctionedDate,
                  projectPeriod = source.projectPeriod,
                  amount = source.amount,
                  principalInvestigator = source.principalInvestigator,
                  coPrincipalInvestigator = source.coPrincipalInvestigator,
                  status = source.status
              WHEN NOT MATCHED THEN
                INSERT (employee_id, sanctionedDate, projectPeriod, amount, principalInvestigator,
                       coPrincipalInvestigator, status)
                VALUES (source.employee_id, source.sanctionedDate, source.projectPeriod,
                       source.amount, source.principalInvestigator, source.coPrincipalInvestigator,
                       source.status);
            `,
            params: (item) => [
              { name: "id", type: sql.Int, value: item.id ? Number(item.id) || null : null },
              { name: "employee_id", type: sql.NVarChar, value: facultyId },
              { name: "sanctionedDate", type: sql.Date, value: item.sanctionedDate || null },
              { name: "projectPeriod", type: sql.NVarChar, value: item.projectPeriod || null },
              { name: "amount", type: sql.Decimal(10, 2), value: item.amount || null },
              { name: "principalInvestigator", type: sql.NVarChar, value: item.principalInvestigator || null },
              { name: "coPrincipalInvestigator", type: sql.NVarChar, value: item.coPrincipalInvestigator || null },
              { name: "status", type: sql.NVarChar, value: item.status || null }
            ]

        },
        {
            schema: patents,
            query: `
              MERGE [aittest].[dbo].[Patent] AS target
              USING (SELECT @id AS id, @employee_id AS employee_id, @areaOfResearch AS areaOfResearch,
                            @grantedYear AS grantedYear, @patentNo AS patentNo, @patentStatus AS patentStatus,
                            @author AS author) AS source
              ON target.id = source.id
              WHEN MATCHED THEN
                UPDATE SET 
                  areaOfResearch = source.areaOfResearch,
                  grantedYear = source.grantedYear,
                  patentNo = source.patentNo,
                  patentStatus = source.patentStatus,
                  author = source.author
              WHEN NOT MATCHED THEN
                INSERT (employee_id, areaOfResearch, grantedYear, patentNo, patentStatus, author)
                VALUES (source.employee_id, source.areaOfResearch, source.grantedYear,
                       source.patentNo, source.patentStatus, source.author);
            `,
            params: (item) => [
              { name: "id", type: sql.Int, value: item.id ? Number(item.id) || null : null },
              { name: "employee_id", type: sql.NVarChar, value: facultyId },
              { name: "areaOfResearch", type: sql.NVarChar, value: item.areaOfResearch || null },
              { name: "grantedYear", type: sql.Int, value: item.grantedYear || null },
              { name: "patentNo", type: sql.NVarChar, value: item.patentNo || null },
              { name: "patentStatus", type: sql.NVarChar, value: item.patentStatus || null },
              { name: "author", type: sql.NVarChar, value: item.author || null }
            ]
        },
        {
            schema: bookPublications,
            query: `
              MERGE [aittest].[dbo].[bookPublication] AS target
              USING (SELECT @id AS id, @publicationType AS publicationType, @name AS name,
                            @volume AS volume, @pageNumber AS pageNumber, @issn AS issn, @publisher AS publisher,
                            @title AS title, @area AS area, @impactFactor AS impactFactor, @employee_id AS employee_id,
                            @yearOfPublish AS yearOfPublish, @authors AS authors) AS source
              ON target.id = source.id
              WHEN MATCHED THEN
                UPDATE SET 
                  publicationType = source.publicationType,
                  name = source.name,
                  volume = source.volume,
                  pageNumber = source.pageNumber,
                  issn = source.issn,
                  publisher = source.publisher,
                  title = source.title,
                  area = source.area,
                  impactFactor = source.impactFactor,
                  yearOfPublish = source.yearOfPublish,
                  authors = source.authors
              WHEN NOT MATCHED THEN
                INSERT (publicationType, name, volume, pageNumber, issn, publisher, title, area,
                       impactFactor, employee_id, yearOfPublish, authors)
                VALUES (source.publicationType, source.name, source.volume, source.pageNumber,
                       source.issn, source.publisher, source.title, source.area, source.impactFactor,
                       source.employee_id, source.yearOfPublish, source.authors);
            `,
            params: (item) => [
              { name: "id", type: sql.Int, value: item.id ? Number(item.id) || null : null },
              { name: "publicationType", type: sql.NVarChar, value: item.publicationType || null },
              { name: "name", type: sql.NVarChar, value: item.name || null },
              { name: "volume", type: sql.NVarChar, value: item.volume || null },
              { name: "pageNumber", type: sql.NVarChar, value: item.pageNumber || null },
              { name: "issn", type: sql.NVarChar, value: item.issn || null },
              { name: "publisher", type: sql.NVarChar, value: item.publisher || null },
              { name: "title", type: sql.NVarChar, value: item.title || null },
              { name: "area", type: sql.NVarChar, value: item.area || null },
              { name: "impactFactor", type: sql.Decimal(10, 2), value: item.impactFactor || null },
              { name: "employee_id", type: sql.NVarChar, value: facultyId },
              { name: "yearOfPublish", type: sql.Int, value: item.yearOfPublish || null },
              { name: "authors", type: sql.NVarChar, value: item.authors || null }
            ]

        },
        {
            schema: eventsAttended,
            query: `
              MERGE [aittest].[dbo].[EventAttended] AS target
              USING (SELECT @id AS id, @fromDate AS fromDate, @toDate AS toDate, @organizer AS organizer,
                            @venue AS venue, @sponsor AS sponsor, @targetAudience AS targetAudience,
                            @employee_id AS employee_id, @nameofevent AS nameofevent, @typeofevent AS typeofevent) AS source
              ON target.id = source.id
              WHEN MATCHED THEN
                UPDATE SET 
                  fromDate = source.fromDate,
                  toDate = source.toDate,
                  organizer = source.organizer,
                  venue = source.venue,
                  sponsor = source.sponsor,
                  targetAudience = source.targetAudience,
                  nameofevent = source.nameofevent,
                  typeofevent = source.typeofevent
              WHEN NOT MATCHED THEN
                INSERT (fromDate, toDate, organizer, venue, sponsor, targetAudience, employee_id, nameofevent, typeofevent)
                VALUES (source.fromDate, source.toDate, source.organizer, source.venue,
                       source.sponsor, source.targetAudience, source.employee_id, source.nameofevent, source.typeofevent);
            `,
            params: (item) => [
              { name: "id", type: sql.Int, value: item.id ? Number(item.id) || null : null },
              { name: "fromDate", type: sql.Date, value: item.fromDate || null },
              { name: "toDate", type: sql.Date, value: item.toDate || null },
              { name: "organizer", type: sql.NVarChar, value: item.organizer || null },
              { name: "venue", type: sql.NVarChar, value: item.venue || null },
              { name: "sponsor", type: sql.NVarChar, value: item.sponsor || null },
              { name: "targetAudience", type: sql.NVarChar, value: item.targetAudience || null },
              { name: "employee_id", type: sql.NVarChar, value: facultyId },
              { name: "nameofevent", type: sql.NVarChar, value: item.nameofevent || null },
              { name: "typeofevent", type: sql.NVarChar, value: item.typeofevent || null }
            ]

        },
        {
            schema: eventsOrganized,
            query: `
             MERGE [aittest].[dbo].[EventOrganized] AS target
            USING (
                SELECT 
                    @id AS id, 
                    @typeofevent AS typeofevent, 
                    @nameofevent AS nameofevent,
                    @fromDate AS fromDate, 
                    @toDate AS toDate, 
                    @organizer AS organizer,
                    @venue AS venue, 
                    @sponsor AS sponsor, 
                    @targetAudience AS targetAudience,
                    @employee_id AS employee_id
            ) AS source
            ON target.id = source.id
            WHEN MATCHED THEN
                UPDATE SET 
                    target.typeofevent = source.typeofevent,
                    target.nameofevent = source.nameofevent,
                    target.fromDate = source.fromDate,
                    target.toDate = source.toDate,
                    target.organizer = source.organizer,
                    target.venue = source.venue,
                    target.sponsor = source.sponsor,
                    target.targetAudience = source.targetAudience
            WHEN NOT MATCHED THEN
                INSERT (typeofevent, nameofevent, fromDate, toDate, organizer, venue, sponsor, targetAudience, employee_id)
                VALUES (source.typeofevent, source.nameofevent, source.fromDate, source.toDate, source.organizer, source.venue, source.sponsor, source.targetAudience, source.employee_id);        `,
            params: (item) => [
              { name: "id", type: sql.Int, value: item.id ? Number(item.id) || null : null },
              { name: "typeofevent", type: sql.NVarChar, value: item.typeofevent || null },
              { name: "nameofevent", type: sql.NVarChar, value: item.nameofevent || null },
              { name: "fromDate", type: sql.Date, value: item.fromDate || null },
              { name: "toDate", type: sql.Date, value: item.toDate || null },
              { name: "organizer", type: sql.NVarChar, value: item.organizer || null },
              { name: "venue", type: sql.NVarChar, value: item.venue || null },
              { name: "sponsor", type: sql.NVarChar, value: item.sponsor || null },
              { name: "targetAudience", type: sql.NVarChar, value: item.targetAudience || null },
              { name: "employee_id", type: sql.NVarChar, value: facultyId }
            ]

        }
        ,{
            schema: professionalMemberships,
            query: `
           MERGE [aittest].[dbo].[ProfessionalMembers] AS target
            USING (
                SELECT 
                    @id AS id, 
                    @employee_id AS employee_id, 
                    @professionalBody AS professionalBody,
                    @membershipId AS membershipId, 
                    @membershipSince AS membershipSince,
                    @membershipType AS membershipType
            ) AS source
            ON target.id = source.id
            WHEN MATCHED THEN
                UPDATE SET 
                    target.professionalBody = source.professionalBody,
                    target.membershipId = source.membershipId,
                    target.membershipSince = source.membershipSince,
                    target.membershipType = source.membershipType
            WHEN NOT MATCHED THEN
                INSERT (employee_id, professionalBody, membershipId, membershipSince, membershipType)
                VALUES (source.employee_id, source.professionalBody, source.membershipId, source.membershipSince, source.membershipType);   `,
                        params: (item) => [
              { name: "id", type: sql.Int, value: item.id ? Number(item.id) || null : null },
              { name: "employee_id", type: sql.NVarChar, value: facultyId },
              { name: "professionalBody", type: sql.NVarChar, value: item.professionalBody || null },
              { name: "membershipId", type: sql.NVarChar, value: item.membershipId || null },
              { name: "membershipSince", type: sql.Date, value: item.membershipSince || null },
              { name: "membershipType", type: sql.NVarChar, value: item.membershipType || null }
            ]
        }
      ];
      for (const operation of operations) {
        for (const item of operation.schema) {
          const request = pool.request();
          for (const param of operation.params(item)) {
            if (param.name === "id" && param.value !== null && isNaN(param.value)) {
              throw new Error(`Invalid id value: ${param.value}`);
            }
            request.input(param.name, param.type, param.value);
          }
          await request.query(operation.query);
        }
      }

      res.status(200).json({
        success: true,
        message: "Research information added/updated successfully",
      });

    } if (req.method === "DELETE") {
        const { id, table } = req.body;
  
        if (!id || !table) {
          return res.status(400).json({
            message: "Record ID and table name are required for deletion",
          });
        }
  
        // Validate and map the table name
        const mappedTableName = tableNameMapping[table];
        if (!mappedTableName) {
          return res.status(400).json({
            message: `Invalid table name: ${table}. Please check the mapping.`,
          });
        }
  
        // Validate ID is numeric
        const numericId = Number(id);
        if (isNaN(numericId)) {
          return res.status(400).json({ message: "Invalid ID provided" });
        }
  
        const deleteQuery = `
          DELETE FROM [aittest].[dbo].[${mappedTableName}]
          WHERE id = @id;
        `;
  
        await pool.request().input("id", sql.Int, numericId).query(deleteQuery);
  
        return res.status(200).json({ message: "Record deleted successfully" });
      } else {
      res.status(405).json({ message: "Method not allowed" });
    }
  } catch (error) {
    console.error("Error handling request:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
}
