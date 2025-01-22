"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import img from "../../assets/buddha.jpg";

interface FacultyDetails {
  id: number;
  faculty_name?: string;
  employee_id: string;
  qualification: string;
  department: string;
  photo?: string;
  title: string;
  emailId?: string;
  contactNo: string;
  alternateContactNo?: string;
  emergencyContactNo?: string;
  adharNo?: string;
  panNo?: string;
  dob?: string;
  gender?: string;
  nationality?: string;
  firstAddressLine?: string;
  correspondenceAddressLine?: string;
  religion?: string;
  caste?: string;
  category?: string;
  motherTongue?: string;
  speciallyChallenged?: string;
  remarks?: string;
  languages?: string;
  bankName?: string;
  accountNo?: string;
  accountName?: string;
  accountType?: string;
  branch?: string;
  ifsc?: string;
  pfNumber?: string;
  uanNumber?: string;
  pensionNumber?: string;
  motherName?: string;
  fatherName?: string;
  spouseName?: string;
  children?: string;
  dateOfJoiningDrait?: string;
  designation?: string;
  aided?: string;
}

interface facultyResearchDetails {
  id: number;
  employee_id: string;
  orcidId?: string;
  googleScholarId?: string;
  scopusId?: string;
  publonsId?: string;
  researchId?: string;
}

interface facultyEducationDetails {
  id: number;
  employee_id: string;
  Program?: string;
  regNo?: string;
  schoolCollege?: string;
  specialization?: string;
  mediumOfInstruction?: string;
  passClass?: string;
  yearOfAward?: string;
}

interface facultyConsultancyDetails {
  employee_id: string;
  sanctionedDate?: string;
  projectPeriod?: string;
  amount?: number;
  principalInvestigator?: string;
  coPrincipalInvestigator?: string;
  status?: string;
}

interface ConferenceAndJournalDetails {
  id: number;
  employee_id: string;
  typeOfPublication?: string;
  title?: string;
  doi?: string;
  issn?: string;
  joConName?: string;
  yearOfPublication?: string;
  pageNo?: string;
  authors?: string;
  publishedUnder?: string;
  impactFactor?: string;
  quartile?: string;
  sponsor?: string;
  venue?: string;
  volume?: string;
  issueNo?: string;
}

interface BookPublicationDetails {
  id: number;
  publicationType?: string;
  name?: string;
  volume?: string;
  pageNumber?: string;
  issn?: string;
  publisher?: string;
  title?: string;
  area?: string;
  impactFactor?: string;
  employee_id: string;
  yearOfPublish?: string;
  authors?: string;
}

interface AwardAndRecognitionDetails {
  id: number;
  employee_id: string;
  recognitionorawardReceived?: string;
  recognitionorawardFrom?: string;
  awardReceived?: string;
  recognitionorawardDate?: string;
  awardDate?: string;
  awardFrom?: string;
}

interface AddtionalResponsibilityDetails {
  id: number;
  employee_id: string;
  level?: string;
  fromDate?: string;
  toDate?: string;
  responsibility?: string;
}

interface EventAttendedDetails {
  id: number;
  fromDate: string;
  toDate: string;
  organizer: string;
  venue: string;
  sponsor: string;
  targetAudience: string;
  employee_id: string;
  nameofevent: string;
  typeofevent: string;
}

interface EventOrganizedDetails {
  id: number;
  typeofevent: string;
  nameofevent: string;
  fromDate: string;
  toDate: string;
  organizer: string;
  venue: string;
  sponsor: string;
  targetAudience: string;
  employee_id: string;
}

interface IndustryExperienceDetails {
  id: number;
  employee_id: string;
  organization: string;
  designation: string;
  fromDate: string;
  toDate: string;
}

interface OutreachActivityDetails {
  id: number;
  employee_id: string;
  activity: string;
  role: string;
  fromDate: string;
  toDate: string;
  place: string;
}

interface PatentDetails {
  id: number;
  employee_id: string;
  areaOfResearch: string;
  grantedYear: string;
  patentNo: string;
  patentStatus: string;
  author: string;
}

interface ProfessionalMembersDetails {
  employee_id: string;
  professionalBody: string;
  membershipId: string;
  membershipSince: string;
  membershipType: string;
}

interface TeachingExperienceDetails {
  id: number;
  employee_id: string;
  instituteName: string;
  fromDate: string;
  toDate: string;
  Designation: string;
  departmentName: string;
}

interface ResearchProjectDetails {
  employee_id: string;
  projectTitle: string;
  pi: string; 
  coPi: string; 
  dOfSanction: string; 
  duration: string; 
  fundingAgency: string; 
  amount: number; 
  status: string; 
}



export default function FacultyDetailsPage() {
  const params = useParams();
  const employee_id = params?.employee_id;
  const [errorMessage, setErrorMessage] = useState<string>("");
  const router = useRouter();

  const [facultyDetails, setFacultyDetails] = useState<FacultyDetails | null>(
    null
  );
  const [researchDetails, setResearchDetails] =
    useState<facultyResearchDetails | null>(null);
  const [educationDetails, setEducationDetails] =
    useState<facultyEducationDetails | null>(null);
  const [consultancyDetails, setConsultancyDetails] =
    useState<facultyConsultancyDetails | null>(null);
  const [conferenceAndJournal, setConferenceAndJournal] =
    useState<ConferenceAndJournalDetails | null>(null);
  const [bookPublication, setBookPublication] =
    useState<BookPublicationDetails | null>(null);
  const [awardAndRecognition, setAwardAndRecognition] =
    useState<AwardAndRecognitionDetails | null>(null);
  const [addtionalResponsibility, setAddtionalResponsibility] =
    useState<AddtionalResponsibilityDetails | null>(null);

     const [eventAttended, setEventAttended] = useState<EventAttendedDetails[]>(
       []
     );
     const [eventOrganized, setEventOrganized] = useState<
       EventOrganizedDetails[]
     >([]);
     const [industryExperience, setIndustryExperience] = useState<
       IndustryExperienceDetails[]
     >([]);

      const [outreachActivity, setOutreachActivity] = useState<
        OutreachActivityDetails[]
      >([]);
      const [patent, setPatent] = useState<PatentDetails[]>([]);
      const [professionalMembers, setProfessionalMembers] = useState<
        ProfessionalMembersDetails[]
      >([]);
      const [teachingExperience, setTeachingExperience] = useState<
        TeachingExperienceDetails[]
      >([]);
      const [researchProjects, setResearchProjects] = useState<
        ResearchProjectDetails[]
      >([]);


  useEffect(() => {
    async function fetchFacultyDetails() {
      if (!employee_id) return;

      try {
        const response = await fetch("/api/fetchFullFacDetails", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ employee_id }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.error || "Failed to fetch faculty details."
          );
        }

        const data = await response.json();
        console.log(data.researchProjects);
        setFacultyDetails(data.personalDetails);
        setResearchDetails(data.researchDetails);
        setEducationDetails(data.educationDetails);
        setConsultancyDetails(data.consultancyDetails);
        setConferenceAndJournal(data.conferenceAndJournal);
        setBookPublication(data.bookPublication);
        setAwardAndRecognition(data.awardAndRecognition);
        setAddtionalResponsibility(data.addtionalResponsibility);
         setEventAttended(data.eventAttended);
         setEventOrganized(data.eventOrganized );
         setIndustryExperience(data.industryExperience);
          setOutreachActivity(data.outreachActivity);
          setPatent(data.patent);
          setProfessionalMembers(data.setProfessionalMembers);
          setTeachingExperience(data.teachingExperience);
          setResearchProjects(data.researchProjects);
      } catch (error) {
        console.error("Error fetching faculty details:", error);
        if (error instanceof Error) {
          setErrorMessage(error.message);
        } else {
          setErrorMessage("An unknown error occurred.");
        }
      }
    }

    fetchFacultyDetails();
  }, [employee_id]);

  // const isValidImageUrl = (url: string | undefined): boolean => {
  //   return (
  //     !!url &&
  //     (url.startsWith("/") ||
  //       url.startsWith("http://") ||
  //       url.startsWith("https://"))
  //   );
  // };

  if (errorMessage) {
    return (
      <div className="container mx-auto p-4 text-red-500">
        <h1>Error</h1>
        <p>{errorMessage}</p>
        <button
          onClick={() => router.push("/")}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!facultyDetails) {
    return <div className="container mx-auto p-4">Loading...</div>;
  }

  // const customLoader = ({ src, width, quality }: { src: string; width: number; quality?: number }) => {
  //   return `http://192.168.29.12/Employee_photos/${src}`;
  // };

  return (
    <div>
      {/* <FacultyProfileNav /> */}
      <nav className="flex items-center justify-end gap-4 mr-4 mt-2 text-xl text-blue-500 font-bold">
        <a
          className={`link hover:underline underline-offset-3`}
          href="/mis_faculty/faculty_home"
        >
          Home
        </a>
        <a
          className={`link hover:underline underline-offset-3`}
          href="#personal-section"
        >
          Personal Details
        </a>
        <a
          className={`link hover:underline underline-offset-3`}
          href="#education-section"
        >
          Academic Details
        </a>
        <a
          className={`link hover:underline underline-offset-3 `}
          href="#research-section"
        >
          Research Details
        </a>
      </nav>

      <div className="max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-lg">
        <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-8">
          <div className="relative">
            <Image
              src={img}
              alt={`${facultyDetails?.faculty_name || ""} ${
                facultyDetails?.faculty_name || ""
              }`}
              className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-white shadow-lg"
              width={100}
              height={100}
            />
            {/* <Image
              loader={customLoader}
              // src={facultyDetails.employee_id + ".jpg"} // just the image name
              src={'//192.168.29.12/Employee_photos/ECU03.jpg'} // just the image name
              className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-white shadow-lg"
              alt="Employee ECU03"
              width={100}
              height={100}
            /> */}
          </div>

          <div className="flex-1 text-center md:text-left">
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-500">Name</p>
              <p className="font-medium text-gray-800">
                {facultyDetails.faculty_name}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-500">Faculty ID</p>
                <p className="font-medium text-gray-800">
                  {facultyDetails.employee_id}
                </p>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-500">Designation</p>
                <p className="font-medium text-gray-800">
                  {facultyDetails.designation}
                </p>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-500">Contact</p>
                <p className="font-medium text-gray-800">
                  {facultyDetails.contactNo}
                </p>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium text-gray-800">
                  {facultyDetails.emailId || "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Personal Details */}
        <div
          className="mt-8 pt-8 border-t border-gray-200"
          id="personal-section"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Personal Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Qualification</p>
              <p className="font-medium text-gray-800">
                {facultyDetails.qualification || "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Title</p>
              <p className="font-medium text-gray-800">
                {facultyDetails.title || "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Alternate Contact No</p>
              <p className="font-medium text-gray-800">
                {facultyDetails.alternateContactNo || "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Emergency Contact No</p>
              <p className="font-medium text-gray-800">
                {facultyDetails.emergencyContactNo || "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Aadhar No</p>
              <p className="font-medium text-gray-800">
                {facultyDetails.adharNo || "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">PAN No</p>
              <p className="font-medium text-gray-800">
                {facultyDetails.panNo || "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Date of Birth</p>
              <p className="font-medium text-gray-800">
                {facultyDetails.dob || "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Gender</p>
              <p className="font-medium text-gray-800">
                {facultyDetails.gender || "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Nationality</p>
              <p className="font-medium text-gray-800">
                {facultyDetails.nationality || "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">First Address Line 1</p>
              <p className="font-medium text-gray-800">
                {facultyDetails.firstAddressLine || "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">
                Correspondence Address Line 1
              </p>
              <p className="font-medium text-gray-800">
                {facultyDetails.correspondenceAddressLine || "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Religion</p>
              <p className="font-medium text-gray-800">
                {facultyDetails.religion || "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Caste</p>
              <p className="font-medium text-gray-800">
                {facultyDetails.caste || "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Category</p>
              <p className="font-medium text-gray-800">
                {facultyDetails.category || "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Mother Tongue</p>
              <p className="font-medium text-gray-800">
                {facultyDetails.motherTongue || "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Specially Challenged</p>
              <p className="font-medium text-gray-800">
                {facultyDetails.speciallyChallenged ? "Yes" : "No"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Remarks</p>
              <p className="font-medium text-gray-800">
                {facultyDetails.remarks || "N/A"}
              </p>
            </div>
            {/* <div className="space-y-1">
            <p className="text-sm text-gray-500">Languages</p>
            <p className="font-medium text-gray-800">
              {facultyDetails.data.languages || "N/A"}
            </p>
          </div> */}
          </div>

          {/* Bank details */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Bank Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Bank Name</p>
                <p className="font-medium text-gray-800">
                  {facultyDetails.bankName || "N/A"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Account Name</p>
                <p className="font-medium text-gray-800">
                  {facultyDetails.accountName || "N/A"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Account Type</p>
                <p className="font-medium text-gray-800">
                  {facultyDetails.accountType || "N/A"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Account Number</p>
                <p className="font-medium text-gray-800">
                  {facultyDetails.accountNo || "N/A"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Branch</p>
                <p className="font-medium text-gray-800">
                  {facultyDetails.branch || "N/A"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">IFSC</p>
                <p className="font-medium text-gray-800">
                  {facultyDetails.ifsc || "N/A"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">PF Number</p>
                <p className="font-medium text-gray-800">
                  {facultyDetails.pfNumber || "N/A"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">UAN Number</p>
                <p className="font-medium text-gray-800">
                  {facultyDetails.uanNumber || "N/A"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Pension Number</p>
                <p className="font-medium text-gray-800">
                  {facultyDetails.pensionNumber || "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Family Details */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Family Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Mother's Name</p>
                <p className="font-medium text-gray-800">
                  {facultyDetails.motherName || "N/A"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Father's Name</p>
                <p className="font-medium text-gray-800">
                  {facultyDetails.fatherName || "N/A"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Spouse Name</p>
                <p className="font-medium text-gray-800">
                  {facultyDetails.spouseName || "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Education Details */}
        <div
          className="mt-8 pt-8 border-t border-gray-200"
          id="education-section"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Education Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Program</p>
              <p className="font-medium text-gray-800">
                {educationDetails?.Program || "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Registration Number</p>
              <p className="font-medium text-gray-800">
                {educationDetails?.regNo || "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">School/College</p>
              <p className="font-medium text-gray-800">
                {educationDetails?.schoolCollege || "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Specialization</p>
              <p className="font-medium text-gray-800">
                {educationDetails?.specialization || "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Medium of Instruction</p>
              <p className="font-medium text-gray-800">
                {educationDetails?.mediumOfInstruction || "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Pass Class</p>
              <p className="font-medium text-gray-800">
                {educationDetails?.passClass || "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Year of Award</p>
              <p className="font-medium text-gray-800">
                {educationDetails?.yearOfAward || "N/A"}
              </p>
            </div>
          </div>
        </div>

        {/* Additional Responsibility */}
        <div
          className="mt-8 pt-8 border-t border-gray-200"
          id="additional-responsibility-section"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Additional Responsibility
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Level</p>
              <p className="font-medium text-gray-800">
                {addtionalResponsibility?.level || "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Responsibility</p>
              <p className="font-medium text-gray-800">
                {addtionalResponsibility?.responsibility || "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">From Date</p>
              <p className="font-medium text-gray-800">
                {addtionalResponsibility?.fromDate || "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">To Date</p>
              <p className="font-medium text-gray-800">
                {addtionalResponsibility?.toDate || "N/A"}
              </p>
            </div>
          </div>
        </div>

        {/* Research Details */}
        <div
          className="mt-8 pt-8 border-t border-gray-200"
          id="research-section"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Research Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <p className="text-sm text-gray-500">GoogleScholarId</p>
              <p className="font-medium text-gray-800">
                {researchDetails?.googleScholarId || "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Father's Name</p>
              <p className="font-medium text-gray-800">
                {researchDetails?.orcidId || "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Spouse Name</p>
              <p className="font-medium text-gray-800">
                {researchDetails?.scopusId || "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Spouse Name</p>
              <p className="font-medium text-gray-800">
                {researchDetails?.publonsId || "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Spouse Name</p>
              <p className="font-medium text-gray-800">
                {researchDetails?.researchId || "N/A"}
              </p>
            </div>
          </div>
        </div>

        {/* Consultancy Details */}
        <div
          className="mt-8 pt-8 border-t border-gray-200"
          id="consultancy-section"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Consultancy Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Sanctioned Date</p>
              <p className="font-medium text-gray-800">
                {consultancyDetails?.sanctionedDate || "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Project Period</p>
              <p className="font-medium text-gray-800">
                {consultancyDetails?.projectPeriod || "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Amount</p>
              <p className="font-medium text-gray-800">
                {consultancyDetails?.amount ?? "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Principal Investigator</p>
              <p className="font-medium text-gray-800">
                {consultancyDetails?.principalInvestigator || "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Co-Principal Investigator</p>
              <p className="font-medium text-gray-800">
                {consultancyDetails?.coPrincipalInvestigator || "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Status</p>
              <p className="font-medium text-gray-800">
                {consultancyDetails?.status || "N/A"}
              </p>
            </div>
          </div>

          {/* Book Publication */}
          <div
            className="mt-8 pt-8 border-t border-gray-200"
            id="conference-journal-section"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Book Publication
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Type of Publication</p>
                <p className="font-medium text-gray-800">
                  {bookPublication?.typeOfPublication || "N/A"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium text-gray-800">
                  {bookPublication?.title || "N/A"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Volume</p>
                <p className="font-medium text-gray-800">
                  {bookPublication?.doi || "N/A"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Page</p>
                <p className="font-medium text-gray-800">
                  {bookPublication?.issn || "N/A"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Type of Publication</p>
                <p className="font-medium text-gray-800">
                  {bookPublication?.issn || "N/A"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Type of Publication</p>
                <p className="font-medium text-gray-800">
                  {bookPublication?.publsiher || "N/A"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Type of Publication</p>
                <p className="font-medium text-gray-800">
                  {bookPublication?.title || "N/A"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Type of Publication</p>
                <p className="font-medium text-gray-800">
                  {bookPublication?.area || "N/A"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Type of Publication</p>
                <p className="font-medium text-gray-800">
                  {bookPublication?.impactFactor || "N/A"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Type of Publication</p>
                <p className="font-medium text-gray-800">
                  {bookPublication?.yearOfPublication || "N/A"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Type of Publication</p>
                <p className="font-medium text-gray-800">
                  {bookPublication?.authors || "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* ConferenceAndJournal */}
          <div
            className="mt-8 pt-8 border-t border-gray-200"
            id="book-publication-section"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Conference And Journal
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Publication Type</p>
                <p className="font-medium text-gray-800">
                  {conferenceAndJournal?.typeOfPublication || "N/A"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Title</p>
                <p className="font-medium text-gray-800">
                  {conferenceAndJournal?.title || "N/A"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">DOI</p>
                <p className="font-medium text-gray-800">
                  {conferenceAndJournal?.doi || "N/A"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">ISSN</p>
                <p className="font-medium text-gray-800">
                  {conferenceAndJournal?.issn || "N/A"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium text-gray-800">
                  {conferenceAndJournal?.joConName || "N/A"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Year Of Publication</p>
                <p className="font-medium text-gray-800">
                  {conferenceAndJournal?.yearOfPublication || "N/A"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Page Number</p>
                <p className="font-medium text-gray-800">
                  {conferenceAndJournal?.pageNo || "N/A"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Authors</p>
                <p className="font-medium text-gray-800">
                  {conferenceAndJournal?.authors || "N/A"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Published Under</p>
                <p className="font-medium text-gray-800">
                  {conferenceAndJournal?.publishedUnder || "N/A"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Impact Factor</p>
                <p className="font-medium text-gray-800">
                  {conferenceAndJournal?.impactFactor || "N/A"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Quartile</p>
                <p className="font-medium text-gray-800">
                  {conferenceAndJournal?.quartile || "N/A"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Sponsor</p>
                <p className="font-medium text-gray-800">
                  {conferenceAndJournal?.sponsor || "N/A"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Venue</p>
                <p className="font-medium text-gray-800">
                  {conferenceAndJournal?.venue || "N/A"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Volume</p>
                <p className="font-medium text-gray-800">
                  {conferenceAndJournal?.volume || "N/A"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Issue Number</p>
                <p className="font-medium text-gray-800">
                  {conferenceAndJournal?.issueNo || "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Award & Recognition */}
          <div
            className="mt-8 pt-8 border-t border-gray-200"
            id="award-recognition-section"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Award & Recognition
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <p className="text-sm text-gray-500">
                  Recognition Award Received
                </p>
                <p className="font-medium text-gray-800">
                  {awardAndRecognition?.recognitionorawardReceived || "N/A"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Recognition Award From</p>
                <p className="font-medium text-gray-800">
                  {awardAndRecognition?.recognitionorawardFrom || "N/A"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Award Received Date</p>
                <p className="font-medium text-gray-800">
                  {awardAndRecognition?.awardReceived || "N/A"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Recognition award Date</p>
                <p className="font-medium text-gray-800">
                  {awardAndRecognition?.recognitionorawardDate || "N/A"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Award Date</p>
                <p className="font-medium text-gray-800">
                  {awardAndRecognition?.recognitionorawardDate || "N/A"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Award From</p>
                <p className="font-medium text-gray-800">
                  {awardAndRecognition?.recognitionorawardDate || "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Events Attended */}
          <div
            className="mt-8 pt-8 border-t border-gray-200"
            id="event-attended-section"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Events Attended
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Event Name</p>
                <p className="font-medium text-gray-800">
                  {eventAttended?.nameofevent || "N/A"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Type of Event</p>
                <p className="font-medium text-gray-800">
                  {eventAttended?.typeofevent || "N/A"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Organizer</p>
                <p className="font-medium text-gray-800">
                  {eventAttended?.organizer || "N/A"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Venue</p>
                <p className="font-medium text-gray-800">
                  {eventAttended?.venue || "N/A"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Sponsor</p>
                <p className="font-medium text-gray-800">
                  {eventAttended?.sponsor || "N/A"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Target Audience</p>
                <p className="font-medium text-gray-800">
                  {eventAttended?.targetAudience || "N/A"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">From Date</p>
                <p className="font-medium text-gray-800">
                  {eventAttended?.fromDate || "N/A"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">To Date</p>
                <p className="font-medium text-gray-800">
                  {eventAttended?.toDate || "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Events Organized */}
          <div
            className="mt-8 pt-8 border-t border-gray-200"
            id="event-organized-section"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Events Organized
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Event Name</p>
                <p className="font-medium text-gray-800">
                  {eventOrganized?.nameofevent || "N/A"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Type of Event</p>
                <p className="font-medium text-gray-800">
                  {eventOrganized?.typeofevent || "N/A"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Organizer</p>
                <p className="font-medium text-gray-800">
                  {eventOrganized?.organizer || "N/A"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Venue</p>
                <p className="font-medium text-gray-800">
                  {eventOrganized?.venue || "N/A"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Sponsor</p>
                <p className="font-medium text-gray-800">
                  {eventOrganized?.sponsor || "N/A"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Target Audience</p>
                <p className="font-medium text-gray-800">
                  {eventOrganized?.targetAudience || "N/A"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">From Date</p>
                <p className="font-medium text-gray-800">
                  {eventOrganized?.fromDate || "N/A"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">To Date</p>
                <p className="font-medium text-gray-800">
                  {eventOrganized?.toDate || "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Outreach Activity */}
          <div
            className="mt-8 pt-8 border-t border-gray-200"
            id="outreach-activity-section"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Outreach Activities
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {outreachActivity.length === 0 ? (
                <p className="text-gray-500">
                  No outreach activity data available.
                </p>
              ) : (
                outreachActivity.map((activity) => (
                  <div key={activity.id} className="space-y-1">
                    <p className="text-lg text-black font-weight: 800">
                      Activity {activity.id}
                    </p>
                    <p className="font-medium text-gray-800">
                      {activity.activity || "N/A"}
                    </p>
                    <p className="text-sm text-gray-500">Role</p>
                    <p className="font-medium text-gray-800">
                      {activity.role || "N/A"}
                    </p>
                    <p className="text-sm text-gray-500">Place</p>
                    <p className="font-medium text-gray-800">
                      {activity.place || "N/A"}
                    </p>
                    <p className="text-sm text-gray-500">From Date</p>
                    <p className="font-medium text-gray-800">
                      {activity.fromDate || "N/A"}
                    </p>
                    <p className="text-sm text-gray-500">To Date</p>
                    <p className="font-medium text-gray-800">
                      {activity.toDate || "N/A"}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Patent */}
          <div
            className="mt-8 pt-8 border-t border-gray-200"
            id="patent-section"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Patents
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {patent.length === 0 ? (
                <p className="text-gray-500">No patent data available.</p>
              ) : (
                patent.map((item) => (
                  <div key={item.id} className="space-y-1">
                    <p className="text-sm text-black font-weight:500">
                      Patent {item.id}
                    </p>
                    <p className="text-sm text-gray-500">Area of Research</p>
                    <p className="font-medium text-gray-800">
                      {item.areaOfResearch || "N/A"}
                    </p>
                    <p className="text-sm text-gray-500">Granted Year</p>
                    <p className="font-medium text-gray-800">
                      {item.grantedYear || "N/A"}
                    </p>
                    <p className="text-sm text-gray-500">Patent Number</p>
                    <p className="font-medium text-gray-800">
                      {item.patentNo || "N/A"}
                    </p>
                    <p className="text-sm text-gray-500">Patent Status</p>
                    <p className="font-medium text-gray-800">
                      {item.patentStatus || "N/A"}
                    </p>
                    <p className="text-sm text-gray-500">Author</p>
                    <p className="font-medium text-gray-800">
                      {item.author || "N/A"}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Professional Memberships */}
          {/* <div className="mt-8 pt-8 border-t border-gray-200" id="professional-membership-section">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Professional Memberships</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {professionalMembers.length === 0 ? (
              <p className="text-gray-500">No professional memberships data available.</p>
            ) : (
              professionalMembers.map((membership, index) => (
                <div key={index} className="space-y-1">
                  <p className="text-sm text-gray-500">Professional Body</p>
                  <p className="font-medium text-gray-800">{membership.professionalBody || "N/A"}</p>
                  <p className="text-sm text-gray-500">Membership ID</p>
                  <p className="font-medium text-gray-800">{membership.membershipId || "N/A"}</p>
                  <p className="text-sm text-gray-500">Membership Since</p>
                  <p className="font-medium text-gray-800">{membership.membershipSince || "N/A"}</p>
                  <p className="text-sm text-gray-500">Membership Type</p>
                  <p className="font-medium text-gray-800">{membership.membershipType || "N/A"}</p>
                </div>
              ))
            )}
          </div>
        </div> */}

          {/* Teaching Experience */}
          <div
            className="mt-8 pt-8 border-t border-gray-200"
            id="teaching-experience-section"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Teaching Experience
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {teachingExperience.length === 0 || "undefined" ? (
                <p className="text-gray-500">
                  No teaching experience data available.
                </p>
              ) : (
                teachingExperience.map((experience) => (
                  <div key={experience.id} className="space-y-1">
                    <p className="text-sm text-gray-500">Institute Name</p>
                    <p className="font-medium text-gray-800">
                      {experience.instituteName || "N/A"}
                    </p>
                    <p className="text-sm text-gray-500">Designation</p>
                    <p className="font-medium text-gray-800">
                      {experience.Designation || "N/A"}
                    </p>
                    <p className="text-sm text-gray-500">Department Name</p>
                    <p className="font-medium text-gray-800">
                      {experience.departmentName || "N/A"}
                    </p>
                    <p className="text-sm text-gray-500">From Date</p>
                    <p className="font-medium text-gray-800">
                      {experience.fromDate || "N/A"}
                    </p>
                    <p className="text-sm text-gray-500">To Date</p>
                    <p className="font-medium text-gray-800">
                      {experience.toDate || "N/A"}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
          {/* Research Projects */}
          <div
            className="mt-8 pt-8 border-t border-gray-200"
            id="research-projects-section"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Research Projects
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Project Title</p>
                <p className="font-medium text-gray-800">
                  {researchProjects.projectTitle || "N/A"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">
                  Principal Investigator (PI)
                </p>
                <p className="font-medium text-gray-800">
                  {researchProjects?.pi || "N/A"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">
                  Co-Principal Investigator (Co-PI)
                </p>
                <p className="font-medium text-gray-800">
                  {researchProjects?.coPi || "N/A"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Date of Sanction</p>
                <p className="font-medium text-gray-800">
                  {researchProjects?.dOfSanction || "N/A"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Duration</p>
                <p className="font-medium text-gray-800">
                  {researchProjects?.duration || "N/A"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Funding Agency</p>
                <p className="font-medium text-gray-800">
                  {researchProjects?.fundingAgency || "N/A"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Amount</p>
                <p className="font-medium text-gray-800">
                  {researchProjects?.amount || "N/A"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Status</p>
                <p className="font-medium text-gray-800">
                  {researchProjects?.status || "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/*  */}
        </div>
      </div>
    </div>
  );
}
