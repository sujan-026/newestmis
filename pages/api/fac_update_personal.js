import { connectToDatabase } from "../../app/config/dbconfig";

export default async function handler(req, res) {
  try {
    const pool = await connectToDatabase();

    if (req.method === "GET") {
      // Fetch faculty data based on employee_id
      const { employee_id } = req.query;

      if (!employee_id) {
        return res.status(400).json({ message: "Employee ID is required" });
      }

      const query = `
        USE aittest;
        SELECT 
          [id],
          [employee_id],
          [qualification],
          [department],
          [photo],
          [title],
          [faculty_name],
          [emailId],
          [contactNo],
          [alternateContactNo],
          [emergencyContactNo],
          [adharNo],
          [panNo],
          [dob],
          [gender],
          [nationality],
          [firstAddressLine],
          [correspondenceAddressLine],
          [religion],
          [caste],
          [category],
          [motherTongue],
          [speciallyChallenged],
          [remarks],
          [languages],
          [bankName],
          [accountNo],
          [accountName],
          [accountType],
          [branch],
          [ifsc],
          [pfNumber],
          [uanNumber],
          [pensionNumber],
          [motherName],
          [fatherName],
          [spouseName],
          [children],
          [dateOfJoiningDrait],
          [designation],
          [aided],
          [isRegistered]
        FROM [dbo].[facultyPersonalDetails]
        WHERE [employee_id] = @employee_id;
      `;

      const result = await pool.request().input("employee_id", employee_id).query(query);

      if (result.recordset.length === 0) {
        return res.status(404).json({ message: "No record found for the given employee ID" });
      }

      res.status(200).json({ data: result.recordset[0] });
    }

    if (req.method === "POST" || req.method === "PUT") {
      // Update faculty data based on employee_id
      const {
        employee_id,
        qualification,
        department,
        photo,
        title,
        faculty_name,
        emailId,
        contactNo,
        alternateContactNo,
        emergencyContactNo,
        adharNo,
        panNo,
        dob,
        gender,
        nationality,
        firstAddressLine,
        correspondenceAddressLine,
        religion,
        caste,
        category,
        motherTongue,
        speciallyChallenged,
        remarks,
        languages,
        bankName,
        accountNo,
        accountName,
        accountType,
        branch,
        ifsc,
        pfNumber,
        uanNumber,
        pensionNumber,
        motherName,
        fatherName,
        spouseName,
        children,
        dateOfJoiningDrait,
        designation,
        aided,
        isRegistered,
      } = req.body;

      if (!employee_id) {
        return res.status(400).json({ message: "Employee ID is required for update" });
      }

      const updateQuery = `
        USE aittest;
        UPDATE [dbo].[facultyPersonalDetails]
        SET 
          [qualification] = @qualification,
          [department] = @department,
          [photo] = @photo,
          [title] = @title,
          [faculty_name] = @faculty_name,
          [emailId] = @emailId,
          [contactNo] = @contactNo,
          [alternateContactNo] = @alternateContactNo,
          [emergencyContactNo] = @emergencyContactNo,
          [adharNo] = @adharNo,
          [panNo] = @panNo,
          [dob] = @dob,
          [gender] = @gender,
          [nationality] = @nationality,
          [firstAddressLine] = @firstAddressLine,
          [correspondenceAddressLine] = @correspondenceAddressLine,
          [religion] = @religion,
          [caste] = @caste,
          [category] = @category,
          [motherTongue] = @motherTongue,
          [speciallyChallenged] = @speciallyChallenged,
          [remarks] = @remarks,
          [languages] = @languages,
          [bankName] = @bankName,
          [accountNo] = @accountNo,
          [accountName] = @accountName,
          [accountType] = @accountType,
          [branch] = @branch,
          [ifsc] = @ifsc,
          [pfNumber] = @pfNumber,
          [uanNumber] = @uanNumber,
          [pensionNumber] = @pensionNumber,
          [motherName] = @motherName,
          [fatherName] = @fatherName,
          [spouseName] = @spouseName,
          [children] = @children,
          [dateOfJoiningDrait] = @dateOfJoiningDrait,
          [designation] = @designation,
          [aided] = @aided,
          [isRegistered] = @isRegistered
        WHERE [employee_id] = @employee_id;
      `;

      const request = pool.request();
      request.input("employee_id", employee_id);
      request.input("qualification", qualification);
      request.input("department", department);
      request.input("photo", photo);
      request.input("title", title);
      request.input("faculty_name", faculty_name);
      request.input("emailId", emailId);
      request.input("contactNo", contactNo);
      request.input("alternateContactNo", alternateContactNo);
      request.input("emergencyContactNo", emergencyContactNo);
      request.input("adharNo", adharNo);
      request.input("panNo", panNo);
      request.input("dob", dob);
      request.input("gender", gender);
      request.input("nationality", nationality);
      request.input("firstAddressLine", firstAddressLine);
      request.input("correspondenceAddressLine", correspondenceAddressLine);
      request.input("religion", religion);
      request.input("caste", caste);
      request.input("category", category);
      request.input("motherTongue", motherTongue);
      request.input("speciallyChallenged", speciallyChallenged);
      request.input("remarks", remarks);
      request.input("languages", languages);
      request.input("bankName", bankName);
      request.input("accountNo", accountNo);
      request.input("accountName", accountName);
      request.input("accountType", accountType);
      request.input("branch", branch);
      request.input("ifsc", ifsc);
      request.input("pfNumber", pfNumber);
      request.input("uanNumber", uanNumber);
      request.input("pensionNumber", pensionNumber);
      request.input("motherName", motherName);
      request.input("fatherName", fatherName);
      request.input("spouseName", spouseName);
      request.input("children", children);
      request.input("dateOfJoiningDrait", dateOfJoiningDrait);
      request.input("designation", designation);
      request.input("aided", aided);
      request.input("isRegistered", isRegistered);
      await request.query(updateQuery);
      res.status(200).json({ message: "Record updated successfully" });
    } else {
      res.status(405).json({ message: "Method not allowed" });
    }
  } catch (error) {
    console.error("Error handling faculty data request:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
}
