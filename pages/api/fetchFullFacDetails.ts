// import { connectToDatabase } from '../../app/config/dbconfig';
// import sql from "mssql";

// export default async function handler(req, res) {
//   if (req.method !== "POST") {
//     res.setHeader("Allow", ["POST", "GET"]);
//     return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
//   }

//   try {
//     const { employee_id } = req.body;

//     if (!employee_id) {
//       return res.status(400).json({ error: "Employee ID is required" });
//     }

//     const pool = await connectToDatabase();

//     const personalDetailsQuery = `
//       SELECT
//         [id], [employee_id], [qualification], [department], [photo], [title], [faculty_name],
//         [emailId], [contactNo], [alternateContactNo], [emergencyContactNo], [adharNo], [panNo],
//         [dob], [gender], [nationality], [firstAddressLine], [correspondenceAddressLine], [religion],
//         [caste], [category], [motherTongue], [speciallyChallenged], [remarks], [languages],
//         [bankName], [accountNo], [accountName], [accountType], [branch], [ifsc], [pfNumber],
//         [uanNumber], [pensionNumber], [motherName], [fatherName], [spouseName], [children],
//         [dateOfJoiningDrait], [designation], [aided]
//       FROM [aittest].[dbo].[facultyPersonalDetails]
//       WHERE [employee_id] = @employee_id
//     `;

//     const academicDetailsQuery = `
//       SELECT
//        [qualification], [department], [level], [designation]
//       FROM [aittest].[dbo].[facultyAcademicDetails]
//       WHERE [employee_id] = @employee_id
//     `;

//      // Fetch faculty education details
//     const educationDetailsQuery = `
//       SELECT TOP (1000)
//         [id],
//         [employee_id],
//         [Program],
//         [regNo],
//         [schoolCollege],
//         [specialization],
//         [mediumOfInstruction],
//         [passClass],
//         [yearOfAward]
//       FROM [aittest].[dbo].[facultyEducation]
//       WHERE [employee_id] = @employee_id
//     `;

//      const researchDetailsQuery = `
//       SELECT TOP (1000)
//        [employee_id], [orcidId], [googleScholarId], [scopusId], [publonsId], [researchId]
//       FROM [aittest].[dbo].[FacultyResearchDetails]
//       WHERE [employee_id] = @employee_id
//     `;

//     const personalDetailsResult = await pool
//       .request()
//       .input("employee_id", sql.NVarChar, employee_id)
//       .query(personalDetailsQuery);

//     // const academicDetailsResult = await pool
//     //   .request()
//     //   .input("employee_id", sql.NVarChar, employee_id)
//     //   .query(academicDetailsQuery);

//     const educationDetailsResult = await pool
//       .request()
//       .input("employee_id", sql.NVarChar, employee_id)
//       .query(educationDetailsQuery);

//     const researchDetailsResult = await pool
//       .request()
//       .input("employee_id", sql.NVarChar, employee_id)
//       .query(researchDetailsQuery);

//     if (personalDetailsResult.recordset.length === 0 && academicDetailsResult.recordset.length === 0 && researchDetailsResult.recordset.length === 0 && educationDetailsResult.recordset.length === 0) {
//       return res.status(404).json({ error: "Faculty not found" });
//     }

//     const response = {
//       personalDetails: personalDetailsResult.recordset[0],
//       // academicDetails: academicDetailsResult.recordset[0],
//       researchDetails: researchDetailsResult.recordset[0],
//       educationDetails: educationDetailsResult.recordset[0]
//     };

//     return res.status(200).json(response);
//   } catch (error) {
//     console.error("Error fetching faculty details:", error);
//     return res.status(500).json({ error: "Failed to fetch faculty details" });
//   }
// }

import { connectToDatabase } from "../../app/config/dbconfig";
import sql from "mssql";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST", "GET"]);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  try {
    const { employee_id } = req.body;

    if (!employee_id) {
      return res.status(400).json({ error: "Employee ID is required" });
    }

    const pool = await connectToDatabase();

    const personalDetailsQuery = `
      SELECT 
        [id], [employee_id], [qualification], [department], [photo], [title], [faculty_name],
        [emailId], [contactNo], [alternateContactNo], [emergencyContactNo], [adharNo], [panNo],
        [dob], [gender], [nationality], [firstAddressLine], [correspondenceAddressLine], [religion],
        [caste], [category], [motherTongue], [speciallyChallenged], [remarks], [languages],
        [bankName], [accountNo], [accountName], [accountType], [branch], [ifsc], [pfNumber],
        [uanNumber], [pensionNumber], [motherName], [fatherName], [spouseName], [children],
        [dateOfJoiningDrait], [designation], [aided]
      FROM [aittest].[dbo].[facultyPersonalDetails]
      WHERE [employee_id] = @employee_id
    `;

    const educationDetailsQuery = `
      SELECT TOP (1000)
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
      WHERE [employee_id] = @employee_id
    `;

    const researchDetailsQuery = `
      SELECT TOP (1000) 
       [employee_id], [orcidId], [googleScholarId], [scopusId], [publonsId], [researchId]
      FROM [aittest].[dbo].[FacultyResearchDetails]
      WHERE [employee_id] = @employee_id
    `;

    // New Consultancy Details Query
    const consultancyDetailsQuery = `
      SELECT TOP (1000) 
        [employee_id],
        [sanctionedDate],
        [projectPeriod],
        [amount],
        [principalInvestigator],
        [coPrincipalInvestigator],
        [status]
      FROM [aittest].[dbo].[Consultancy]
      WHERE [employee_id] = @employee_id
    `;

    const conferenceAndJournalQuery = `
      SELECT TOP (1000) 
        [id],
        [employee_id],
        [typeOfPublication],
        [title],
        [doi],
        [issn],
        [joConName],
        [yearOfPublication],
        [pageNo],
        [authors],
        [publishedUnder],
        [impactFactor],
        [quartile],
        [sponsor],
        [venue],
        [volume],
        [issueNo]
      FROM [aittest].[dbo].[ConferenceAndJournal]
      WHERE [employee_id] = @employee_id
    `;

    const bookPublicationQuery = `
      SELECT TOP (1000)
        [id],
        [publicationType],
        [name],
        [volume],
        [pageNumber],
        [issn],
        [publisher],
        [title],
        [area],
        [impactFactor],
        [employee_id],
        [yearOfPublish],
        [authors]
      FROM [aittest].[dbo].[bookPublication]
      WHERE [employee_id] = @employee_id
    `;

    const awardAndRecognitionQuery = `
      SELECT TOP (1000)
        [id],
        [employee_id],
        [recognitionorawardReceived],
        [recognitionorawardFrom],
        [awardReceived],
        [recognitionorawardDate],
        [awardDate],
        [awardFrom]
      FROM [aittest].[dbo].[AwardAndRecognition]
      WHERE [employee_id] = @employee_id
    `;

    const addtionalResponsibilityQuery = `
      SELECT TOP (1000)
        [id],
        [employee_id],
        [level],
        [fromDate],
        [toDate],
        [responsibility]
      FROM [aittest].[dbo].[addtionalResponsibility]
      WHERE [employee_id] = @employee_id
    `;

    const eventAttendedQuery = `
      SELECT TOP (1000)
        [id],
        [fromDate],
        [toDate],
        [organizer],
        [venue],
        [sponsor],
        [targetAudience],
        [employee_id],
        [nameofevent],
        [typeofevent]
      FROM [aittest].[dbo].[EventAttended]
      WHERE [employee_id] = @employee_id
    `;

    // EventOrganized query
    const eventOrganizedQuery = `
      SELECT TOP (1000)
        [id],
        [typeofevent],
        [nameofevent],
        [fromDate],
        [toDate],
        [organizer],
        [venue],
        [sponsor],
        [targetAudience],
        [employee_id]
      FROM [aittest].[dbo].[EventOrganized]
      WHERE [employee_id] = @employee_id
    `;

    const industryExperienceQuery = `
      SELECT TOP (1000)
        [id],
        [employee_id],
        [organization],
        [designation],
        [fromDate],
        [toDate]
      FROM [aittest].[dbo].[IndustryExperience]
      WHERE [employee_id] = @employee_id
    `;

     // OutreachActivity query
    const outreachActivityQuery = `
      SELECT TOP (1000)
        [id],
        [employee_id],
        [activity],
        [role],
        [fromDate],
        [toDate],
        [place]
      FROM [aittest].[dbo].[OutreachActivity]
      WHERE [employee_id] = @employee_id
    `;

    // Patent query
    const patentQuery = `
      SELECT TOP (1000)
        [id],
        [employee_id],
        [areaOfResearch],
        [grantedYear],
        [patentNo],
        [patentStatus],
        [author]
      FROM [aittest].[dbo].[Patent]
      WHERE [employee_id] = @employee_id
    `;

    // ProfessionalMembers query
    const professionalMembersQuery = `
      SELECT TOP (1000)
        [employee_id],
        [professionalBody],
        [membershipId],
        [membershipSince],
        [membershipType]
      FROM [aittest].[dbo].[ProfessionalMembers]
      WHERE [employee_id] = @employee_id
    `;

    // TeachingExperience query
    const teachingExperienceQuery = `
      SELECT TOP (1000)
        [id],
        [employee_id],
        [instituteName],
        [fromDate],
        [toDate],
        [Designation],
        [departmentName]
      FROM [aittest].[dbo].[TeachingExperience]
      WHERE [employee_id] = @employee_id
    `;

    const researchProjectsQuery = `
      SELECT TOP (1000)
        [employee_id],
        [projectTitle],
        [pi],
        [coPi],
        [dOfSanction],
        [duration],
        [fundingAgency],
        [amount],
        [status]
      FROM [aittest].[dbo].[ResearchProjects]
      WHERE [employee_id] = @employee_id
    `;


    const personalDetailsResult = await pool
      .request()
      .input("employee_id", sql.NVarChar, employee_id)
      .query(personalDetailsQuery);

    const educationDetailsResult = await pool
      .request()
      .input("employee_id", sql.NVarChar, employee_id)
      .query(educationDetailsQuery);

    const researchDetailsResult = await pool
      .request()
      .input("employee_id", sql.NVarChar, employee_id)
      .query(researchDetailsQuery);

    const consultancyDetailsResult = await pool
      .request()
      .input("employee_id", sql.NVarChar, employee_id)
      .query(consultancyDetailsQuery);

    const conferenceAndJournalResult = await pool
      .request()
      .input("employee_id", sql.NVarChar, employee_id)
      .query(conferenceAndJournalQuery);

    const bookPublicationResult = await pool
      .request()
      .input("employee_id", sql.NVarChar, employee_id)
      .query(bookPublicationQuery);

    const awardAndRecognitionResult = await pool
      .request()
      .input("employee_id", sql.NVarChar, employee_id)
      .query(awardAndRecognitionQuery);

    const addtionalResponsibilityResult = await pool
      .request()
      .input("employee_id", sql.NVarChar, employee_id)
      .query(addtionalResponsibilityQuery);

    const eventAttendedResult = await pool
      .request()
      .input("employee_id", sql.NVarChar, employee_id)
      .query(eventAttendedQuery);

    const eventOrganizedResult = await pool
      .request()
      .input("employee_id", sql.NVarChar, employee_id)
      .query(eventOrganizedQuery);

     const industryExperienceResult = await pool
       .request()
       .input("employee_id", sql.NVarChar, employee_id)
       .query(industryExperienceQuery);

      const outreachActivityResult = await pool
      .request()
      .input("employee_id", sql.NVarChar, employee_id)
      .query(outreachActivityQuery);

    const patentResult = await pool
      .request()
      .input("employee_id", sql.NVarChar, employee_id)
      .query(patentQuery);

    const professionalMembersResult = await pool
      .request()
      .input("employee_id", sql.NVarChar, employee_id)
      .query(professionalMembersQuery);

    const teachingExperienceResult = await pool
      .request()
      .input("employee_id", sql.NVarChar, employee_id)
      .query(teachingExperienceQuery);

    const researchProjectsResult = await pool
      .request()
      .input("employee_id", sql.NVarChar, employee_id)
      .query(researchProjectsQuery);


    if (
      personalDetailsResult.recordset.length === 0 &&
      educationDetailsResult.recordset.length === 0 &&
      researchDetailsResult.recordset.length === 0 &&
      consultancyDetailsResult.recordset.length === 0 &&
      conferenceAndJournalResult.recordset.length === 0 &&
      bookPublicationResult.recordset.length === 0 &&
      awardAndRecognitionResult.recordset.length === 0 &&
      addtionalResponsibilityResult.recordset.length === 0 &&
      industryExperienceResult.recordset.length === 0 &&
      patentResult.recordset.length === 0 &&
      professionalMembersResult.recordset.length === 0 &&
      teachingExperienceResult.recordset.length === 0 &&
      researchProjectsResult.recordset.length === 0
    ) {
      return res.status(404).json({ error: "Faculty not found" });
    }

    const response = {
      personalDetails: personalDetailsResult.recordset[0],
      researchDetails: researchDetailsResult.recordset[0],
      educationDetails: educationDetailsResult.recordset[0],
      consultancyDetails: consultancyDetailsResult.recordset[0],
      conferenceAndJournal: conferenceAndJournalResult.recordset[0],
      bookPublication: bookPublicationResult.recordset[0] || null,
      awardAndRecognition: awardAndRecognitionResult.recordset[0] || null,
      addtionalResponsibility:
        addtionalResponsibilityResult.recordset[0] || null,
      eventAttended: eventAttendedResult.recordset[0] || null,
      eventOrganized: eventOrganizedResult.recordset[0] || null,
            industryExperience: industryExperienceResult.recordset || [],
            outreachActivity: outreachActivityResult.recordset || [],
      patent: patentResult.recordset || [],
      professionalMembers: professionalMembersResult.recordset || [],
      teachingExperience: teachingExperienceResult.recordset || [],
       researchProjects: researchProjectsResult.recordset || [],
    };
    return res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching faculty details:", error);
    return res.status(500).json({ error: "Failed to fetch faculty details" });
  }
}
