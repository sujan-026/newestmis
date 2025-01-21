"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { z } from "zod";
import { facultyResearchDetailsSchema, research_experienceSchema, researchSupervisionSchema } from "../../../../schemas/research-details";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler, useFieldArray } from "react-hook-form";
import { identity, remove } from "lodash";
import { Step } from "../../../../types/form";
import FormField from "../../../../components/FormField";
import { FormProvider } from "../../../../hooks/FormProvider";
import axios from "axios";

import { useRouter, useSearchParams } from "next/navigation";
type Inputs = z.infer<typeof facultyResearchDetailsSchema>;
const steps: Step[] = [
  {
    id: "Step 1",
    name: "Faculty Research Details",
    fields: [
      "facultyResearchSchema.vtuFacultyId",
      "facultyResearchSchema.googleScholarId",
      "facultyResearchSchema.orcId",
      "facultyResearchSchema.scopusId",
      "facultyResearchSchema.publonsAndWebOfScienceId",
      "facultyResearchSchema.researchId",
      "nationalJournalDetailsSchema",
      "eventsAttendedSchema",
      "eventsOrganizedSchema",
      "invitedTalksSchema",
      "internationalJournalDetailsSchema",
      "nationalConferenceDetailsSchema",
      "internationalConferenceDetailsSchema",
       "researchGrantsSchema", 
       "consultancySchema",
        "patentsSchema"
        ,"researchScholarDetailsSchema"
        ,"publicationsSchema"
      ,"professionalMembershipsSchema","research_experienceSchema","researchSupervisionSchema"],
  },
  { id: "Step 8", name: "Complete", fields: [] },
];

export default function Form() {
  const [previousStep, setPreviousStep] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [facultyId, setFacultyId] = useState("");
  const delta = currentStep - previousStep;
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    control,
    register,
    handleSubmit,
    watch,
    reset,
    trigger,
    setValue,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(facultyResearchDetailsSchema),
  });

  const {
    fields: nationalJournal,
    append: appendNationalJournal,
    remove: removeNationalJournal,
  } = useFieldArray({ control, name: "nationalJournalDetailsSchema" });
  

  const {
    fields: eventsAttended,
    append: appendEventsAttended,
    remove: removeEventsAttended,
  } = useFieldArray({ control, name: "eventsAttendedSchema" });

  const {
    fields: eventsOrganized,
    append: appendEventsOrganized,
    remove: removeEventsOrganized,
  } = useFieldArray({ control, name: "eventsOrganizedSchema" });

  // const {
  //   fields: invitedTalks,
  //   append: appendInvitedTalks,
  //   remove: removeInvitedTalks,
  // } = useFieldArray({ control, name: "invitedTalksSchema" });

  const {
    fields: internationalJournal,
    append: appendInternationalJournal,
    remove: removeInternationalJournal,
  } = useFieldArray({ control, name: "internationalJournalDetailsSchema" });
  const {
    fields: nationalConference,
    append: appendNationalConference,
    remove: removeNationalConference,
  } = useFieldArray({ control, name: "nationalConferenceDetailsSchema" });

  const {
    fields: internationalConference,
    append: appendInternationalConference,
    remove: removeInternationalConference,
  } = useFieldArray({ control, name: "internationalConferenceDetailsSchema" });

  const {
    fields: researchGrants,
    append: appendResearchGrants,
    remove: removeResearchGrants,
  } = useFieldArray({ control, name: "researchGrantsSchema" });

  const {
    fields: consultancy,
    append: appendConsultancy,
    remove: removeConsultancy,
  } = useFieldArray({ control, name: "consultancySchema" });

  const {
    fields: patents,
    append: appendPatents,
    remove: removePatents,
  } = useFieldArray({ control, name: "patentsSchema" });
  const {
    fields:professionalMembership,
    append: appendProfessionalMembership,
    remove: removeProfessionalMembership,
  } = useFieldArray({ control, name: "professionalMembershipSchema" });
  const {
    fields:research_experience,
    append: appendResearchExperience,
    remove: removeResearchExperience,
  } = useFieldArray({ control, name: "research_experienceSchema" });  
  const {
    fields:researchSupervision,
    append: appendResearchSupervision,
    remove: removeResearchSupervision,
  } = useFieldArray({ control, name: "researchSupervisionSchema" });
  // const {
  //   fields: researchScholar,
  //   append: appendResearchScholar,
  //   remove: removeResearchScholar,
  // } = useFieldArray({ control, name: "researchScholarDetailsSchema" });
  const {
    fields: publications,
    append: appendPublications,
    remove: removePublications,
  } = useFieldArray({ control, name: "publicationsSchema" });
  const [patentsState, setPatentsState] = useState<Inputs["patentsSchema"]>([]);

  // const emp_id = sessionStorage.getItem('emp_id');
  // const facultyId= emp_id;

//   const facultyId = searchParams.get("facultyId");
//   useEffect(() => {
//     if (!facultyId) {
//       alert("Faculty ID is missing. Redirecting...");
//       router.push("/"); // Redirect to the dashboard or relevant page
//     }
//   }, [facultyId, router]);

useEffect(() => {
  const pathname = window.location.pathname; // Get the full path
  const segments = pathname.split("/"); // Split path into segments
  const idFromPath = segments[segments.length - 1]; // Get the last segment (facultyId)
  console.log(idFromPath);
  if (idFromPath) {
    setFacultyId(idFromPath);
  } else {
    console.warn("Faculty ID is not present in the dynamic route.");
  }
}, []);
  
  const processForm: SubmitHandler<Inputs> = async (data) => {
    console.log(data);
    const submitresearch = await axios.post("/api/facultyresearchdetails", {
      facultyResearchSchema: data.facultyResearchSchema,
      nationalJournalDetailsSchema: data.nationalJournalDetailsSchema,
      internationalJournalDetailsSchema: data.internationalJournalDetailsSchema,
      nationalConferenceDetailsSchema: data.nationalConferenceDetailsSchema,
      internationalConferenceDetailsSchema:
        data.internationalConferenceDetailsSchema,
      researchGrantsSchema: data.researchGrantsSchema,
      consultancySchema: data.consultancySchema,
      patentsSchema: data.patentsSchema,
      //researchScholarDetailsSchema: data.researchScholarDetailsSchema,
      publicationsSchema: data.publicationsSchema,
    });
    if (submitresearch.status === 200) {
      console.log("Data submitted successfully");
    } else {
      console.log("Data submission failed");
    }
    //reset();
  };

  type FieldName = keyof Inputs;

  const nextButtonFunction = async () => {
    const fields = steps[currentStep].fields;
  
    const output = await trigger(fields as FieldName[], { shouldFocus: true });
  
    if (!output) return; // Prevent navigation if validation fails
  
    if (currentStep < steps.length - 1) {
      setPreviousStep(currentStep);
      setCurrentStep((step) => step + 1);
    }
  };

  const prevButtonFunction = () => {
    if (currentStep > 0) {
      setPreviousStep(currentStep);
      setCurrentStep((step) => step - 1);
    }
  };
  const [nationalJournalState, setNationalJournalState] = useState<Inputs["nationalJournalDetailsSchema"]>([]);
  const [internationalJournalState, setInternationalJournalState] = useState<Inputs["internationalJournalDetailsSchema"]>([]);
  const [nationalConferenceState, setNationalConferenceState] = useState<Inputs["nationalConferenceDetailsSchema"]>([]);
  const [internationalConferenceState, setInternationalConferenceState] = useState<Inputs["internationalConferenceDetailsSchema"]>([]);
  const [Publication,setPublication] = useState<Inputs["publicationsSchema"]>([]);
  function removeAuthor(journalIndex : any, authorIndex : any , rest: any , state :any) {
    const updatedNationalJournal = [...rest];
    updatedNationalJournal[journalIndex].authors.splice(authorIndex, 1);
    state(updatedNationalJournal);
  }
  function appendAuthor(journalIndex: any, rest :any ,state :any) {
    const updatedNationalJournal = [...rest];
    if (!updatedNationalJournal[journalIndex].authors) {
      updatedNationalJournal[journalIndex].authors = [];
    }
    updatedNationalJournal[journalIndex].authors.push("");
    state(updatedNationalJournal);
  }
  return (
    <div>
      {/* <FacultyProfileNav /> */}
      <nav className="flex items-center justify-end gap-4 mr-4 mt-2 text-xl text-blue-500 font-bold">
        <a
          className={`link hover:underline underline-offset-3`}
          href="/mis_est"
        >
          Home
        </a>
        <a
          className={`link hover:underline underline-offset-3`}
          href={`/faculty/faculty_reg/${facultyId}`}
        >
          Personal Details
        </a>
        <a
          className={`link hover:underline underline-offset-3`}
          href={`/faculty/faculty_reg/academic/${facultyId}`}
        >
          Academic Details
        </a>
        <a
          className={`link hover:underline underline-offset-3 `}
          href={`/faculty/faculty_reg/research/${facultyId}`}
        >
          Research Details
        </a>
      </nav>
      <section className=" flex flex-col justify-between p-24">
        {/* <FormProgress steps={steps} currentStep={currentStep} /> */}

        <FormProvider register={register} errors={errors}>
          <form className="mt-12 py-12" onSubmit={handleSubmit(processForm)}>
            {currentStep === 0 && (
              <motion.div
                initial={{ x: delta >= 0 ? "50%" : "-50%", opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="space-y-6  mb-[10px] border border-gray-300 rounded-md p-6 shadow-md"


              >
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                  Faculty Research Details
                </h2>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <FormField
                    label="VTU Faculty ID"
                    stepsReference="facultyResearchSchema.vtuFacultyId"
                    type="text"
                  />

                 <FormField
                    label="Google Scholar ID"
                    stepsReference="facultyResearchSchema.googleScholarId"
                    type="text"
                  />

                  <FormField
                    label="ORCID"
                    stepsReference="facultyResearchSchema.orcId"
                    type="text"
                  />

                  <FormField
                    label="Scopus ID"
                    stepsReference="facultyResearchSchema.scopusId"
                    type="text"
                  />

                  <FormField
                    label="Publons and Web of Science ID"
                    stepsReference="facultyResearchSchema.publonsAndWebOfScienceId"
                    type="text"
                  />

                  <FormField
                    label="Research ID"
                    stepsReference="facultyResearchSchema.researchId"
                    type="text"
                  />
                </div>
              </motion.div>
            )}

            {currentStep === 0 && (
              <motion.div
                initial={{ x: delta >= 0 ? "50%" : "-50%", opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="space-y-6  mb-[10px] border border-gray-300 rounded-md p-6 shadow-md"

              >
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                  National Journal Details
                </h2>
                {nationalJournal.map((field, index) => (
                    <div
                      key={field.id}
                      className="grid grid-cols-1 gap-6 sm:grid-cols-2"
                    >
                      <FormField
                        label="Title Of Research Paper"
                        stepsReference={`nationalJournalDetailsSchema[${index}].titleOfResearchPaper`}
                        type="text"
                      />
                      <FormField
                        label="Name Of Journal"
                        stepsReference={`nationalJournalDetailsSchema[${index}].joConName`}
                        type="text"
                      />
                      <FormField
                        label="Volume"
                        stepsReference={`nationalJournalDetailsSchema[${index}].volume`}
                        type="text"
                      />
                      <FormField
                        label="Issue No"
                        stepsReference={`nationalJournalDetailsSchema[${index}].issueNo`}
                        type="text"
                      />
                      <FormField
                        label="Year Of Publication"
                        stepsReference={`nationalJournalDetailsSchema[${index}].yearOfPublication`}
                        type="number"
                      />
                      <FormField
                        label="Number of Pages"
                        stepsReference={`nationalJournalDetailsSchema[${index}].pageNo`}
                        type="number"
                      />
                      <FormField
                        label="Sponsor"
                        stepsReference={`nationalJournalDetailsSchema[${index}].sponsor`}
                        type="text"
                      />
                      <FormField
                        label="Venue"
                        stepsReference={`nationalJournalDetailsSchema[${index}].venue`}
                        type="text"
                      />
                      <FormField
                        label="DOI"
                        stepsReference={`nationalJournalDetailsSchema[${index}].doi`}
                        type="text"
                      />
                      <FormField
                        label="Quartile"
                        stepsReference={`nationalJournalDetailsSchema[${index}].quartile`}
                        type="text"
                      />
                      <FormField
                      label="ISSN"
                      stepsReference={`nationalJournalDetailsSchema[${index}].issn`}
                      type="text"
                    />


                      {/* Author List Section */}
                      <div className="col-span-2">
                        <h3 className="text-sm font-medium text-gray-700 mb-2">Authors</h3>
                        {field.authors?.map((author : String, authorIndex: any) => (
                          <div
                            key={authorIndex}
                            className="flex items-center space-x-4 mb-2"
                          >
                            <input
                              type="text"
                              placeholder={`Author ${authorIndex + 1}`}
                              {...register(
                                `nationalJournalDetailsSchema.${index}.authors.${authorIndex}`
                              )}
                              className="flex-1 p-2 border rounded-md"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                removeAuthor(index, authorIndex, nationalJournal, setNationalJournalState)
                              }
                              className="text-red-500 text-sm"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() =>
                            appendAuthor(index, nationalJournal, setNationalJournalState)
                          }
                          className="text-blue-500 text-sm"
                        >
                          + Add Author
                        </button>
                      </div>

                      {/* Published Under */}
                      <div>
                        <label
                          htmlFor={`nationalJournalDetailsSchema.${index}.publishedUnder`}
                          className="block text-sm font-medium text-gray-700"
                        >
                          Published Under
                        </label>
                        <select
                          id={`nationalJournalDetailsSchema.${index}.publishedUnder`}
                          {...register(
                            `nationalJournalDetailsSchema.${index}.publishedUnder`
                          )}
                          className="mt-1 block w-full p-2 border rounded-md bg-gray-50"
                        >
                          <option value="Web of Science">Web of Science</option>
                          <option value="Scopus">Scopus</option>
                          <option value="Q1">Q1</option>
                          <option value="Q2">Q2</option>
                          <option value="Q3">Q3</option>
                        </select>
                      </div>

                      <FormField
                        label="Impact Factor"
                        stepsReference={`nationalJournalDetailsSchema[${index}].impactFactor`}
                        type="number"
                      />

                      {/* Remove National Journal */}
                      <div className="col-span-2 flex justify-end">
                        <button
                          type="button"
                          onClick={() => removeNationalJournal(index)}
                          className="text-red-500 text-sm"
                        >
                          Remove Journal
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Add New National Journal */}
                  <button
                    type="button"
                    onClick={() =>
                      appendNationalJournal({
                        titleOfResearchPaper: "",
                        joConName: "",
                        issn : "",
                        volume: "",
                        issueNo: "",
                        yearOfPublication: "",
                        pageNo: "",
                        authors: [], // Initialize authors as an empty array
                        publishedUnder: "Web of Science",
                        impactFactor: "",
                        quartile: "",
                        sponsor: "",
                        venue: "",
                        doi: "",
                      })
                    }
                    className="text-blue-500 text-sm"
                  >
                    + Add a National Journal Publication
                  </button>


                <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                  International Journal Details
                </h2>

                {internationalJournal.map((field, index) => (
                      <div
                      key={field.id}
                      className="grid grid-cols-1 gap-6 sm:grid-cols-2"
                    >
                      <FormField
                        label="Title Of Research Paper"
                        stepsReference={`internationalJournalDetailsSchema[${index}].titleOfResearchPaper`}
                        type="text"
                      />
                      <FormField
                        label="Name Of Journal"
                        stepsReference={`internationalJournalDetailsSchema[${index}].joConName`}
                        type="text"
                      />
                      <FormField
                        label="Volume"
                        stepsReference={`internationalJournalDetailsSchema[${index}].volume`}
                        type="text"
                      />
                      <FormField
                        label="Issue No"
                        stepsReference={`internationalJournalDetailsSchema[${index}].issueNo`}
                        type="text"
                      />
                      <FormField
                        label="Year Of Publication"
                        stepsReference={`internationalJournalDetailsSchema[${index}].yearOfPublication`}
                        type="number"
                      />
                      <FormField
                        label="Number of Pages"
                        stepsReference={`internationalJournalDetailsSchema[${index}].pageNo`}
                        type="number"
                      />
                      <FormField
                        label="Sponsor"
                        stepsReference={`internationalJournalDetailsSchema[${index}].sponsor`}
                        type="text"
                      />
                      <FormField
                        label="Venue"
                        stepsReference={`internationalJournalDetailsSchema[${index}].venue`}
                        type="text"
                      />
                      <FormField
                        label="DOI"
                        stepsReference={`internationalJournalDetailsSchema[${index}].doi`}
                        type="text"
                      />
                      <FormField
                        label="Quartile"
                        stepsReference={`internationalJournalDetailsSchema[${index}].quartile`}
                        type="text"
                      />
                      <FormField
                      label="ISSN"
                      stepsReference={`internationalJournalDetailsSchema[${index}].issn`}
                      type="text"
                    />


                      {/* Author List Section */}
                      <div className="col-span-2">
                        <h3 className="text-sm font-medium text-gray-700 mb-2">Authors</h3>
                        {field.authors?.map((author : String, authorIndex: any) => (
                          <div
                            key={authorIndex}
                            className="flex items-center space-x-4 mb-2"
                          >
                            <input
                              type="text"
                              placeholder={`Author ${authorIndex + 1}`}
                              {...register(
                                `internationalJournalDetailsSchema.${index}.authors.${authorIndex}`
                              )}
                              className="flex-1 p-2 border rounded-md"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                removeAuthor(index, authorIndex, internationalJournal, setInternationalJournalState)
                              }
                              className="text-red-500 text-sm"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() =>
                            appendAuthor(index, internationalJournal, setInternationalJournalState)
                          }
                          className="text-blue-500 text-sm"
                        >
                          + Add Author
                        </button>

                      </div>
                      

                      {/* Published Under */}
                      <div>
                        <label
                          htmlFor={`internationalJournalDetailsSchema.${index}.publishedUnder`}
                          className="block text-sm font-medium text-gray-700"
                        >
                          Published Under
                        </label>
                        <select
                          id={`internationalJournalDetailsSchema.${index}.publishedUnder`}
                          {...register(
                            `internationalJournalDetailsSchema.${index}.publishedUnder`
                          )}
                          className="mt-1 block w-full p-2 border rounded-md bg-gray-50"
                        >
                          <option value="Web of Science">Web of Science</option>
                          <option value="Scopus">Scopus</option>
                          <option value="Q1">Q1</option>
                          <option value="Q2">Q2</option>
                          <option value="Q3">Q3</option>
                        </select>
                      </div>

                      <FormField
                        label="Impact Factor"
                        stepsReference={`internationalJournalDetailsSchema[${index}].impactFactor`}
                        type="number"
                      />

                      {/* Remove National Journal */}
                      <div className="col-span-2 flex justify-end">
                        <button
                          type="button"
                          onClick={() => removeInternationalJournal(index)}
                          className="text-red-500 text-sm"
                        >
                          Remove Journal
                        </button>
                      </div>
                    </div>
                ))}
                <button
                  type="button"
                  onClick={() =>
                    appendInternationalJournal({
                        titleOfResearchPaper: "",
                        joConName: "",
                        volume: "",
                        issueNo: "",
                        yearOfPublication: "",
                        pageNo: "",
                        authors: [], // Initialize authors as an empty array
                        publishedUnder: "Web of Science",
                        impactFactor: "",
                        quartile: "",
                        sponsor: "",
                        venue: "",
                        doi: "",
                    })
                  }
                  className="text-blue-500 text-sm"
                >
                  + Add an International Journal Publication
                </button>
              </motion.div>
            )}

            {currentStep === 0 && (
              <motion.div
                initial={{ x: delta >= 0 ? "50%" : "-50%", opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="space-y-6  mb-[10px] border border-gray-300 rounded-md p-6 shadow-md"

              >
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                  National Conference Details
                </h2>

                {nationalConference.map((field, index) => (
                           <div
                           key={field.id}
                           className="grid grid-cols-1 gap-6 sm:grid-cols-2"
                         >
                           <FormField
                             label="Title Of Research Paper"
                             stepsReference={`nationalConferenceDetailsSchema[${index}].titleOfResearchPaper`}
                             type="text"
                           />
                           
                      <FormField
                        label="Name Of Journal"
                        stepsReference={`nationalConferenceDetailsSchema[${index}].joConName`}
                        type="text"
                      />
                      <FormField
                        label="Volume"
                        stepsReference={`nationalConferenceDetailsSchema[${index}].volume`}
                        type="text"
                      />
                      <FormField
                        label="Issue No"
                        stepsReference={`nationalConferenceDetailsSchema[${index}].issueNo`}
                        type="text"
                      />
                      <FormField
                        label="Year Of Publication"
                        stepsReference={`nationalConferenceDetailsSchema[${index}].yearOfPublication`}
                        type="number"
                      />
                      <FormField
                        label="Number of Pages"
                        stepsReference={`nationalConferenceDetailsSchema[${index}].pageNo`}
                        type="number"
                      />
                      <FormField
                        label="Sponsor"
                        stepsReference={`nationalConferenceDetailsSchema[${index}].sponsor`}
                        type="text"
                      />
                      <FormField
                        label="Venue"
                        stepsReference={`nationalConferenceDetailsSchema[${index}].venue`}
                        type="text"
                      />
                      <FormField
                        label="DOI"
                        stepsReference={`nationalConferenceDetailsSchema[${index}].doi`}
                        type="text"
                      />
                      <FormField
                        label="Quartile"
                        stepsReference={`nationalConferenceDetailsSchema[${index}].quartile`}
                        type="text"
                      />
                      <FormField
                      label="ISSN"
                      stepsReference={`nationalConferenceDetailsSchema[${index}].issn`}
                      type="text"
                    />

     
                           {/* Author List Section */}
                           <div className="col-span-2">
                             <h3 className="text-sm font-medium text-gray-700 mb-2">Authors</h3>
                             {field.authors?.map((author : String, authorIndex: any) => (
                               <div
                                 key={authorIndex}
                                 className="flex items-center space-x-4 mb-2"
                               >
                                 <input
                                   type="text"
                                   placeholder={`Author ${authorIndex + 1}`}
                                   {...register(
                                     `nationalConferenceDetailsSchema.${index}.authors.${authorIndex}`
                                   )}
                                   className="flex-1 p-2 border rounded-md"
                                 />
                                 <button
                                   type="button"
                                   onClick={() =>
                                    removeAuthor(index, authorIndex, nationalConference, setNationalConferenceState)
                              }
                                   className="text-red-500 text-sm"
                                 >
                                   Remove
                                 </button>
                               </div>
                             ))}
                             <button
                               type="button"
                               onClick={() =>
                                appendAuthor(index, nationalConference, setNationalConferenceState)
                                   }
                               className="text-blue-500 text-sm"
                             >
                               + Add Author
                             </button>
     
                           </div>
                           
     
                           {/* Published Under */}
                           <div>
                             <label
                               htmlFor={`nationalConferenceDetailsSchema.${index}.publishedUnder`}
                               className="block text-sm font-medium text-gray-700"
                             >
                               Published Under
                             </label>
                             <select
                               id={`nationalConferenceDetailsSchema.${index}.publishedUnder`}
                               {...register(
                                 `nationalConferenceDetailsSchema.${index}.publishedUnder`
                               )}
                               className="mt-1 block w-full p-2 border rounded-md bg-gray-50"
                             >
                               <option value="Web of Science">Web of Science</option>
                               <option value="Scopus">Scopus</option>
                               <option value="Q1">Q1</option>
                               <option value="Q2">Q2</option>
                               <option value="Q3">Q3</option>
                             </select>
                           </div>
     
                           <FormField
                             label="Impact Factor"
                             stepsReference={`nationalConferenceDetailsSchema[${index}].impactFactor`}
                             type="number"
                           />
     
                           {/* Remove National Journal */}
                           <div className="col-span-2 flex justify-end">
                             <button
                               type="button"
                               onClick={() => removeNationalConference(index)}
                               className="text-red-500 text-sm"
                             >
                               Remove Conference
                             </button>
                           </div>
                         </div>
                ))}

                <button
                  type="button"
                  onClick={() =>
                    appendNationalConference({
                      titleOfResearchPaper: "",
                      joConName: "",
                      volume: "",
                      issueNo: "",
                      yearOfPublication: "",
                      pageNo: "",
                      authors: [], // Initialize authors as an empty array
                      publishedUnder: "Web of Science",
                      impactFactor: "",
                      quartile: "",
                      sponsor: "",
                      venue: "",
                      doi: "",
                    })
                  }
                  className="text-blue-500 text-sm"
                >
                  + Add a National Conference Publication
                </button>

                <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                  International Conference Details
                </h2>

                {internationalConference.map((field, index) => (
                    <div
                    key={field.id}
                    className="grid grid-cols-1 gap-6 sm:grid-cols-2"
                  >
                    <FormField
                      label="Title Of Research Paper"
                      stepsReference={`internationalConferenceDetailsSchema[${index}].titleOfResearchPaper`}
                      type="text"
                    />

                      <FormField
                        label="Name Of Journal"
                        stepsReference={`internationalConferenceDetailsSchema[${index}].joConName`}
                        type="text"
                      />
                      <FormField
                        label="Volume"
                        stepsReference={`internationalConferenceDetailsSchema[${index}].volume`}
                        type="text"
                      />
                      <FormField
                        label="Issue No"
                        stepsReference={`internationalConferenceDetailsSchema[${index}].issueNo`}
                        type="text"
                      />
                      <FormField
                        label="Year Of Publication"
                        stepsReference={`internationalConferenceDetailsSchema[${index}].yearOfPublication`}
                        type="number"
                      />
                      <FormField
                        label="Number of Pages"
                        stepsReference={`internationalConferenceDetailsSchema[${index}].pageNo`}
                        type="number"
                      />
                      <FormField
                        label="Sponsor"
                        stepsReference={`internationalConferenceDetailsSchema[${index}].sponsor`}
                        type="text"
                      />
                      <FormField
                        label="Venue"
                        stepsReference={`internationalConferenceDetailsSchema[${index}].venue`}
                        type="text"
                      />
                      <FormField
                        label="DOI"
                        stepsReference={`internationalConferenceDetailsSchema[${index}].doi`}
                        type="text"
                      />
                      <FormField
                        label="Quartile"
                        stepsReference={`internationalConferenceDetailsSchema[${index}].quartile`}
                        type="text"
                      />
                      <FormField
                      label="ISSN"
                      stepsReference={`internationalConferenceDetailsSchema[${index}].issn`}
                      type="text"
                    />



                    {/* Author List Section */}
                    <div className="col-span-2">
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Authors</h3>
                      {field.authors?.map((author : String, authorIndex: any) => (
                        <div
                          key={authorIndex}
                          className="flex items-center space-x-4 mb-2"
                        >
                          <input
                            type="text"
                            placeholder={`Author ${authorIndex + 1}`}
                            {...register(
                              `internationalConferenceDetailsSchema.${index}.authors.${authorIndex}`
                            )}
                            className="flex-1 p-2 border rounded-md"
                          />
                          <button
                            type="button"
                            onClick={() =>

                              removeAuthor(index, authorIndex, internationalConference, setInternationalConferenceState)
                            }
                            className="text-red-500 text-sm"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() =>
                          appendAuthor(index, internationalConference, setInternationalConferenceState)
                             
                        }
                        className="text-blue-500 text-sm"
                      >
                        + Add Author
                      </button>
                    </div>

                    {/* Published Under */}
                    <div>
                      <label
                        htmlFor={`internationalConferenceDetailsSchema.${index}.publishedUnder`}
                        className="block text-sm font-medium text-gray-700"
                      >
                        Published Under
                      </label>
                      <select
                        id={`internationalConferenceDetailsSchema.${index}.publishedUnder`}
                        {...register(
                          `internationalConferenceDetailsSchema.${index}.publishedUnder`
                        )}
                        className="mt-1 block w-full p-2 border rounded-md bg-gray-50"
                      >
                        <option value="Web of Science">Web of Science</option>
                        <option value="Scopus">Scopus</option>
                        <option value="Q1">Q1</option>
                        <option value="Q2">Q2</option>
                        <option value="Q3">Q3</option>
                      </select>
                    </div>

                    <FormField
                      label="Impact Factor"
                      stepsReference={`internationalConferenceDetailsSchema[${index}].impactFactor`}
                      type="number"
                    />

                    {/* Remove National Journal */}
                    <div className="col-span-2 flex justify-end">
                      <button
                        type="button"
                        onClick={() => removeInternationalConference(index)}
                        className="text-red-500 text-sm"
                      >
                        Remove Conference
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() =>
                    appendInternationalConference({
                      titleOfResearchPaper: "",
                      joConName: "",
                      volume: "",
                      issueNo: "",
                      yearOfPublication: "",
                      pageNo: "",
                      authors: [], // Initialize authors as an empty array
                      publishedUnder: "Web of Science",
                      impactFactor: "",
                      quartile: "",
                      sponsor: "",
                      venue: "",
                      doi: "",
                    })
                  }
                  className="text-blue-500 text-sm"
                >
                  + Add an International Conference Publication
                </button>
              </motion.div>
            )}

            {currentStep === 0 && (
              <motion.div
                initial={{ x: delta >= 0 ? "50%" : "-50%", opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="space-y-6  mb-[10px] border border-gray-300 rounded-md p-6 shadow-md"

              >
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                  Research Projects
                </h2>
                {researchGrants.map((field, index) => (
                  <div
                    key={field.id}
                    className="grid grid-cols-1 gap-6 sm:grid-cols-2"
                  >
                    <FormField
                      label="Project Title"
                      stepsReference={`researchGrantsSchema[${index}].projectTitle`}
                      type="text"
                    />
                    <FormField
                      label="Principal Investigator"
                      stepsReference={`researchGrantsSchema[${index}].pi`}
                      type="text"
                    />
                    <FormField
                      label="Co-Principal Investigator"
                      stepsReference={`researchGrantsSchema[${index}].coPi`}
                      type="text"
                    />
                    <FormField
                      label="Date of Sanction"
                      stepsReference={`researchGrantsSchema[${index}].dOfSanction`}
                      type="date"
                    />
                    <FormField
                      label="Duration"
                      stepsReference={`researchGrantsSchema[${index}].duration`}
                      type="number"
                    />
                    <FormField
                      label="Funding Agency"
                      stepsReference={`researchGrantsSchema[${index}].fundingAgency`}
                      type="text"
                    />
                    <FormField
                      label="Amount"
                      stepsReference={`researchGrantsSchema[${index}].amount`}
                      type="number"
                    />
                    <div>
                      <label
                        htmlFor="publishedUnder"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Status of Project
                      </label>
                      <select
                        id="publishedUnder"
                        {...register(`researchGrantsSchema.${index}.status`)}
                        className="mt-1 block w-full p-1 py-2.5 rounded-md border bg-gray-50 border-gray-300 shadow-sm"
                      >
                        <option value="Ongoing">Ongoing</option>
                        <option value="Completed">Completed</option>
                      </select>
                      {errors.researchGrantsSchema?.[index]?.status && (
                        <p className="mt-2 text-sm text-red-600">
                          {errors.researchGrantsSchema[index].status.message}
                        </p>
                      )}
                    </div>
                    

                    <div className="col-span-2 flex justify-end">
                      <button
                        type="button"
                        onClick={() => removeResearchGrants(index)}
                        className="text-red-500 text-sm"
                      >
                        Remove Button
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() =>
                    appendResearchGrants({
                      projectTitle: "",
                      pi: "",
                      coPi: "",
                      dOfSanction: new Date(),
                      duration: "",
                      fundingAgency: "",
                      amount: "",
                      status: "Ongoing",
                    })
                  }
                  className="text-blue-500 text-sm"
                >
                  + Add a Research Project
                </button>
                
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                  Consultancy
                </h2>
                {consultancy.map((field, index) => (
                  <div
                    key={field.id}
                    className="grid grid-cols-1 gap-6 sm:grid-cols-2"
                  >
                    <FormField
                      label="Title"
                      stepsReference={`consultancySchema[${index}].faculty_name`}
                      type="text"
                    />
                    <FormField
                      label="Sanctioned Date"
                      stepsReference={`consultancySchema[${index}].sanctionedDate`}
                      type="date"
                    />
                    <FormField
                      label="Project Period"
                      stepsReference={`consultancySchema[${index}].projectPeriod`}
                      type="number"
                    />
                    <FormField
                      label="Amount"
                      stepsReference={`consultancySchema[${index}].amount`}
                      type="number"
                    />
                    <FormField
                      label="Principal Investigator"
                      stepsReference={`consultancySchema[${index}].principalInvestigator`}
                      type="text"
                    />
                    <FormField
                      label="Co-Principal Investigator"
                      stepsReference={`consultancySchema[${index}].coPrincipalInvestigator`}
                      type="text"
                    />
                    <div>
                      <label
                        htmlFor="publishedUnder"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Status of Project
                      </label>
                      <select
                        id="publishedUnder"
                        {...register(`consultancySchema.${index}.status`)}
                        className="mt-1 block w-full p-1 py-2.5 rounded-md border bg-gray-50 border-gray-300 shadow-sm"
                      >
                        <option value="Ongoing">Ongoing</option>
                        <option value="Completed">Completed</option>
                      </select>
                      {errors.consultancySchema?.[index]?.status && (
                        <p className="mt-2 text-sm text-red-600">
                          {errors.consultancySchema[index].status.message}
                        </p>
                      )}
                    </div>


                    <div className="col-span-2 flex justify-end">
                      <button
                        type="button"
                        onClick={() => removeConsultancy(index)}
                        className="text-red-500 text-sm"
                      >
                        Remove Button
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() =>
                    appendConsultancy({
                    faculty_name: "",
                    sanctionedDate: new Date(),
                    projectPeriod: "",
                    amount:"",
                    principalInvestigator: "",
                    coPrincipalInvestigator: "",
                    status: "Ongoing",
                    })
                  }
                  className="text-blue-500 text-sm"
                >
                  + Add a Consultancy
                </button>
              </motion.div>
            )}

            {currentStep === 0 && (
              <motion.div
                initial={{ x: delta >= 0 ? "50%" : "-50%", opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="space-y-6  mb-[10px] border border-gray-300 rounded-md p-6 shadow-md"
              >
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                  Research Experience Details
                </h2>
                {research_experience.map((field, index) => (
                  <div key={field.id} className="grid grid-cols-1 gap-6 sm:grid-cols-2">

                    <FormField
                      label="Area of research"
                      stepsReference={`research_experienceSchema[${index}].areaofresearch`}
                      type="text"
                    />
                    <FormField
                      label="From Date"
                      stepsReference={`research_experienceSchema[${index}].from_date`}
                      type="date"
                    />
                    <FormField
                      label="To Date"
                      stepsReference={`research_experienceSchema[${index}].to_date`}
                      type="date"
                    />
                    <div className="col-span-2 flex justify-end">
                      <button
                        type="button"
                        onClick={() => removeResearchExperience(index)}
                        className="text-red-500 text-sm"
                      >
                        Remove Research Experience
                      </button>
                    </div>

                  </div>
                  
                ))}
                                <button
                  type="button"
                  onClick={() =>
                    appendResearchExperience({
                      areaofresearch: "",
                      from_date :new Date() ,
                      to_date : new Date(),
                    })
                  }
                  className="text-blue-500 text-sm"
                >
                  + Add Research Experince
                </button>
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                  Patents
                </h2>

                {patents.map((field, index) => (
                  <div
                    key={field.id}
                    className="grid grid-cols-1 gap-6 sm:grid-cols-2"
                  >
                    <FormField
                      label="Area Of Research"
                      stepsReference={`patentsSchema[${index}].areaOfResearch`}
                      type="text"
                    />
                    <FormField
                      label="Granted Year"
                      stepsReference={`patentsSchema[${index}].grantedYear`}
                      type="number"
                    />
                    <FormField
                      label="Patent Number"
                      stepsReference={`patentsSchema[${index}].patentNo`}
                      type="text"
                    />

                    <div className="col-span-2">
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Authors</h3>
                      {field.authors?.map((author : String, authorIndex: any) => (
                        <div
                          key={authorIndex}
                          className="flex items-center space-x-4 mb-2"
                        >
                          <input
                            type="text"
                            placeholder={`Author ${authorIndex + 1}`}
                            {...register(
                              `patentsSchema.${index}.authors.${authorIndex}`
                            )}
                            className="flex-1 p-2 border rounded-md"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              removeAuthor(index, authorIndex, patents, setPatentsState)
                            }
                            className="text-red-500 text-sm"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() =>
                          appendAuthor(index, patents, setPatentsState)
                        }
                        className="text-blue-500 text-sm"
                      >
                        + Add Author
                      </button>
                    </div>
                    <div>
                      <label
                        htmlFor="publishedUnder"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Status of Project
                      </label>
                      <select
                        id="publishedUnder"
                        {...register(`patentsSchema.${index}.patentStatus`)}
                        className="mt-1 block w-full p-1 py-2.5 rounded-md border bg-gray-50 border-gray-300 shadow-sm"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Expired">Expired</option>
                        <option value="Granted">Granted</option>
                      </select>
                      {errors.patentsSchema?.[index]?.patentStatus && (
                        <p className="mt-2 text-sm text-red-600">
                          {errors.patentsSchema[index].patentStatus.message}
                        </p>
                      )}
                    </div>


                    <div className="col-span-2 flex justify-end">
                      <button
                        type="button"
                        onClick={() => removePatents(index)}
                        className="text-red-500 text-sm"
                      >
                        Remove Patent
                      </button>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() =>
                    appendPatents({
                      areaOfResearch: "",
                      grantedYear : "",
                      patentNo : "",
                      patentStatus : "Pending",
                      authors: [""]
                    })
                  }
                  className="text-blue-500 text-sm"
                >
                  + Add Patent
                </button>
              
              </motion.div>
            )}

            {/* {currentStep === 0 && (
              <motion.div
                initial={{ x: delta >= 0 ? "50%" : "-50%", opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="space-y-6  mb-[10px] border border-gray-300 rounded-md p-6 shadow-md"

              >
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                  Research Scholar
                </h2>

                {researchScholar.map((field, index) => (
                  <div
                    key={field.id}
                    className="grid grid-cols-1 gap-6 sm:grid-cols-2"
                  >
                    <FormField
                      label="Name Of Research Scholar"
                      stepsReference={`researchScholarDetailsSchema[${index}].nameOfResearchScholar`}
                      type="text"
                    />

                    <FormField
                      label="University Seat Number"
                      stepsReference={`researchScholarDetailsSchema[${index}].universitySeatNumber`}
                      type="text"
                    />

                    <FormField
                      label="Area Of Research"
                      stepsReference={`researchScholarDetailsSchema[${index}].areaOfResearch`}
                      type="text"
                    />

                    <FormField
                      label="Date Of Registration"
                      stepsReference={`researchScholarDetailsSchema[${index}].dateOfRegistration`}
                      type="date"
                    />

                    <FormField
                      label="University of Registration"
                      stepsReference={`researchScholarDetailsSchema[${index}].universityOfRegistration`}
                      type="text"
                    />

                    <FormField
                      label="Designation of Supervisor"
                      stepsReference={`researchScholarDetailsSchema[${index}].designationOfResearcher`}
                      type="text"
                    />

                    <FormField
                      label="Name of Institute"
                      stepsReference={`researchScholarDetailsSchema[${index}].nameOfInstitute`}
                      type="text"
                    />

                    <div>
                      <label
                        htmlFor="publishedUnder"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Progress of Research Work
                      </label>
                      <select
                        id="publishedUnder"
                        {...register(
                          `researchScholarDetailsSchema.${index}.progressOfResearchWork`
                        )}
                        className="mt-1 block w-full p-1 py-2.5 rounded-md border bg-gray-50 border-gray-300 shadow-sm"
                      >
                        <option value="Ongoing">Ongoing</option>
                        <option value="Completed">Completed</option>
                      </select>
                      {errors.researchScholarDetailsSchema?.[index]
                        ?.progressOfResearchWork && (
                        <p className="mt-2 text-sm text-red-600">
                          {
                            errors.researchScholarDetailsSchema[index]
                              .progressOfResearchWork.message
                          }
                        </p>
                      )}
                    </div>

                    <div className="col-span-2 flex justify-end">
                      <button
                        type="button"
                        onClick={() => removeResearchScholar(index)}
                        className="text-red-500 text-sm"
                      >
                        Remove Research Scholar
                      </button>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() =>
                    appendResearchScholar({
                      nameOfResearchScholar: "",
                      universitySeatNumber: "",
                      areaOfResearch: "",
                      dateOfRegistration: new Date(),
                      universityOfRegistration: "",
                      designationOfResearcher: "",
                      nameOfInstitute: "",
                      progressOfResearchWork: "Ongoing",
                    })
                  }
                  className="text-blue-500 text-sm"
                >
                  + Add Research Scholar
                </button>
              </motion.div>
            )} */}
            {currentStep === 0 && (
              <motion.div
                initial={{ x: delta >= 0 ? "50%" : "-50%", opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="space-y-6  mb-[10px] border border-gray-300 rounded-md p-6 shadow-md"

              >
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                 Book Publications
                </h2>


                {publications.map((field, index) => (
                  <div
                    key={field.id}
                    className="grid grid-cols-1 gap-6 sm:grid-cols-2"
                  >
                   <div>
                      <label
                        htmlFor={`publicationsSchema.${index}.publicationType`}
                        className="block text-sm font-medium text-gray-700"
                      >
                        Book Publication Type
                      </label>
                      <select
                        id={`publicationsSchema.${index}.publicationType`}
                        {...register(`publicationsSchema.${index}.publicationType`)}
                        className="mt-1 block w-full p-2 border rounded-md bg-gray-50"
                      >
                        <option value="" disabled>
                          Select Publication Type
                        </option>
                        <option value="Textbook">Textbook</option>
                        <option value="Reference">Reference</option>
                        <option value="Monograph">Monograph</option>
                        <option value="Edited">Edited</option>
                        <option value="Chapter">Chapter</option>
                      </select>
                      {errors.publicationsSchema?.[index]?.publicationType && (
                        <p className="mt-2 text-sm text-red-600">
                          {errors.publicationsSchema[index].publicationType.message}
                        </p>
                      )}
                    </div>

                    <FormField
                      label="Name"
                      stepsReference={`publicationsSchema[${index}].name`}
                      type="text"
                    />
                    <FormField
                      label="Volume"
                      stepsReference={`publicationsSchema[${index}].volume`}
                      type="text"
                    />
                    <FormField
                      label="Page Number"
                      stepsReference={`publicationsSchema[${index}].pageNumber`}
                      type="text"
                    />
                    <FormField
                      label="ISSN"
                      stepsReference={`publicationsSchema[${index}].issn`}
                      type="text"
                    />
                    <FormField
                      label="Publisher"
                      stepsReference={`publicationsSchema[${index}].publisher`}
                      type="text"
                    />
                    <FormField
                      label="Title"
                      stepsReference={`publicationsSchema[${index}].title`}
                      type="text"
                    />
                    <FormField
                      label="Area Covered"
                      stepsReference={`publicationsSchema[${index}].area`}
                      type="text"
                    />
                    <FormField
                      label="Impact Factor"
                      stepsReference={`publicationsSchema[${index}].impactFactor`}
                      type="number"
                    />
                    <FormField
                      label="Year Of Publish"
                      stepsReference={`publicationsSchema[${index}].yearOfPublish`}
                      type="number"
                    />
                  <div className="col-span-2">
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Authors</h3>
                      {field.authors?.map((author : String, authorIndex: any) => (
                        <div
                          key={authorIndex}
                          className="flex items-center space-x-4 mb-2"
                        >
                          <input
                            type="text"
                            placeholder={`Author ${authorIndex + 1}`}
                            {...register(
                              `publicationsSchema.${index}.authors.${authorIndex}`
                            )}
                            className="flex-1 p-2 border rounded-md"
                          />
                          <button
                            type="button"
                            onClick={() =>

                              removeAuthor(index, authorIndex, publications, setPublication)
                            }
                            className="text-red-500 text-sm"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() =>
                          appendAuthor(index, publications, setPublication)
                             
                        }
                        className="text-blue-500 text-sm"
                      >
                        + Add Author
                      </button>
                    </div>
                    <div className="col-span-2 flex justify-end">
                      <button
                        type="button"
                        onClick={() => removePublications(index)}
                        className="text-red-500 text-sm"
                      >
                        Remove Button
                      </button>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() =>
                    appendPublications({
                      publicationType: "Book",
                      name: "",
                      volume: "",
                      pageNumber: "",
                      issn: "",
                      publisher: "",
                      title: "",
                      area: "",
                      authors: [],
                      impactFactor: "",
                      yearOfPublish: "",
                    })
                  }
                  className="text-blue-500 text-sm"
                >
                  + Add Publications
                </button>
              </motion.div>
            )}
                      {currentStep === 0 && (
            <motion.div
              initial={{ x: delta >= 0 ? "50%" : "-50%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="space-y-6  mb-[10px] border border-gray-300 rounded-md p-6 shadow-md"

            >
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Events Attended
              </h2>

              {eventsAttended.map((field, index) => (
                <div
                  key={field.id}
                  className="grid grid-cols-1 gap-6 sm:grid-cols-2"
                >
                 

                  <FormField
                    label="Type of Event"
                    stepsReference={`eventsAttendedSchema[${index}].typeOfEvent`}
                    type="text"
                  />

                  <FormField
                    label="Title"
                    stepsReference={`eventsAttendedSchema[${index}].nameofevent`}
                    type="text"
                  />

                  <FormField
                    label="From Date"
                    stepsReference={`eventsAttendedSchema[${index}].fromDate`}
                    type="date"
                  />

                  <FormField
                    label="To Date"
                    stepsReference={`eventsAttendedSchema[${index}].toDate`}
                    type="date"
                  />

                  <FormField
                    label="Organizer"
                    stepsReference={`eventsAttendedSchema[${index}].organizer`}
                    type="text"
                  />

                  <FormField
                    label="Venue of Event"
                    stepsReference={`eventsAttendedSchema[${index}].venue`}
                    type="text"
                  />
                  <FormField
                    label="Sponsor"
                    stepsReference={`eventsAttendedSchema[${index}].sponsor`}
                    type="text"
                  />
                  <FormField
                    label="Target Audience"
                    stepsReference={`eventsAttendedSchema[${index}].targetAudience`}
                    type="text"
                  />
                  <div className="col-span-2 flex justify-end">
                    <button
                      type="button"
                      onClick={() => removeEventsAttended(index)}
                      className="text-red-500 text-sm"
                    >
                      Remove Button
                    </button>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={() =>
                  appendEventsAttended({

                    typeOfEvent: "",
                    nameofevent: "",
                    fromDate: new Date(),
                    toDate: new Date(),
                    organizer: "",
                    venue: "",
                    sponsor: "",
                    targetAudience: "",
                  })
                }
                className="text-blue-500 text-sm"
              >
                + Add Events Attended
              </button>

              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Events Organized
              </h2>

              {eventsOrganized.map((field, index) => (
                <div
                  key={field.id}
                  className="grid grid-cols-1 gap-6 sm:grid-cols-2"
                >

                  <FormField
                    label="Type of Event"
                    stepsReference={`eventsOrganizedSchema[${index}].typeOfEvent`}
                    type="text"
                  />

                  <FormField
                    label="Title"
                    stepsReference={`eventsOrganizedSchema[${index}].nameofevent`}
                    type="text"
                  />

                  <FormField
                    label="From Date"
                    stepsReference={`eventsOrganizedSchema[${index}].fromDate`}
                    type="date"
                  />

                  <FormField
                    label="To Date"
                    stepsReference={`eventsOrganizedSchema[${index}].toDate`}
                    type="date"
                  />

                  <FormField
                    label="Sponsor"
                    stepsReference={`eventsOrganizedSchema[${index}].sponsor`}
                    type="text"
                  />

                  <FormField
                    label="Venue of Event"
                    stepsReference={`eventsOrganizedSchema[${index}].venue`}
                    type="text"
                  />

                  <FormField
                    label="Target Audience"
                    stepsReference={`eventsOrganizedSchema[${index}].targetAudience`}
                    type="text"
                  />
                  <FormField
                    label="Organizer"
                    stepsReference={`eventsOrganizedSchema[${index}].organizer`}
                    type="text"
                    />
                  <FormField
                    label="Target Audience"
                    stepsReference={`eventsOrganizedSchema[${index}].targetAudience`}
                    type="text"
                  />
                  <div className="col-span-2 flex justify-end">
                    <button
                      type="button"
                      onClick={() => removeEventsOrganized(index)}
                      className="text-red-500 text-sm"
                    >
                      Remove Button
                    </button>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={() =>
                  appendEventsOrganized({

                    typeOfEvent: "",
                    nameofevent: "",
                    fromDate: new Date(),
                    toDate: new Date(),
                    organizer: "",
                    venue: "",
                    sponsor: "",
                    targetAudience: "",
                  })
                }
                className="text-blue-500 text-sm"
              >
                + Add Events Organized
              </button>
             {/* Invited Talks
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Invited Talks
              </h2>

              {invitedTalks.map((field, index) => (
                <div
                  key={field.id}
                  className="grid grid-cols-1 gap-6 sm:grid-cols-2"
                >
                  

                  <FormField
                    label="Type of Event"
                    stepsReference={`invitedTalksSchema[${index}].typeOfEvent`}
                    type="text"
                  />

                  <FormField
                    label="Title"
                    stepsReference={`invitedTalksSchema[${index}].title`}
                    type="text"
                  />

                  <FormField
                    label="From Date"
                    stepsReference={`invitedTalksSchema[${index}].fromDate`}
                    type="date"
                  />

                  <FormField
                    label="To Date"
                    stepsReference={`invitedTalksSchema[${index}].toDate`}
                    type="date"
                  />

                  <FormField
                    label="Organizer"
                    stepsReference={`invitedTalksSchema[${index}].organizer`}
                    type="text"
                  />

                  <FormField
                    label="Venue of Event"
                    stepsReference={`invitedTalksSchema[${index}].venueOfEvent`}
                    type="text"
                  />

                  <FormField
                    label="Target Audience"
                    stepsReference={`invitedTalksSchema[${index}].targetAudience`}
                    type="text"
                  />
                  <div className="col-span-2 flex justify-end">
                    <button
                      type="button"
                      onClick={() => removeInvitedTalks(index)}
                      className="text-red-500 text-sm"
                    >
                      Remove Button
                    </button>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={() =>
                  appendInvitedTalks({

                    typeOfEvent: "",
                    title: "",
                    fromDate: new Date(),
                    toDate: new Date(),
                    organizer: "",
                    venueOfEvent: "",
                    targetAudience: "",
                  })
                }
                className="text-blue-500 text-sm"
              >
                + Add Invited Talks
              </button> */}
                          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Research Supervised Details
              </h2>
              {researchSupervision.map((field : any, index :any) => (
                <div
                  key={field.id}
                  className="grid grid-cols-1 gap-6 sm:grid-cols-2"
                >
                  <FormField
                    label="Research Supervisor"
                    stepsReference={`researchSupervisionSchema[${index}].Research_Supervisor`}
                    type="text"
                  />
                  <FormField
                    label="Research Scholar Name"
                    stepsReference={`researchSupervisionSchema[${index}].Research_Scholar_Name`}
                    type="text"
                  />
                  <FormField
                    label="USN"
                    stepsReference={`researchSupervisionSchema[${index}].USN`}
                    type="text"
                  />
                  <FormField
                    label="University"
                    stepsReference={`researchSupervisionSchema[${index}].University`}
                    type="text"
                  />
                  <FormField
                    label="Institute"
                    stepsReference={`researchSupervisionSchema[${index}].Institute`}
                    type="text"
                  />
                  <FormField
                    label="Discipline"
                    stepsReference={`researchSupervisionSchema[${index}].Discipline`}
                    type="text"
                  />
                  <FormField
                    label="Title of Research"
                    stepsReference={`researchSupervisionSchema[${index}].Title_Research`}
                    type="text"
                  />
                  <div>
                      <label
                        htmlFor={`researchSupervisionSchema.${index}.Status`}
                        className="block text-sm font-medium text-gray-700"
                      >
                        Status
                      </label>
                  <select
                            id="status"
                            {...register(`researchSupervisionSchema.${index}.Status`)}
                            className="mt-1 block w-full p-1 py-2.5 rounded-md border bg-gray-50 border-gray-300 shadow-sm"
                          >
                            <option value="Ongoing">Ongoing</option>
                            <option value="Complete">Complete</option>
                          </select>
                          {errors.researchSupervisionSchema?.[index]?.Status && (
                            <p className="mt-2 text-sm text-red-600">
                              {errors.researchSupervisionSchema[index].Status.message}
                            </p>
                          )}
                    </div>
                  <div className="col-span-2 flex justify-end">
                    <button
                      type="button"
                      onClick={() => removeResearchSupervision(index)}
                      className="text-red-500 text-sm"
                    >
                      Remove Button
                    </button>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  appendResearchSupervision({
                    Research_Supervisor: "",
                    Research_Scholar_Name: "",
                    USN: "",
                    University: "",
                    Institute: "",
                    Discipline: "",
                    Title_Research: "",
                    Status: "",
                  })
                }
                className="text-blue-500 text-sm"
              >
                + Add Professional Memberships
              </button>  
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Professional Memberships and Activities
              </h2>
              {professionalMembership.map((field : any, index :any) => (
                <div
                  key={field.id}
                  className="grid grid-cols-1 gap-6 sm:grid-cols-2"
                >
                  <FormField
                    label="Professional Body"
                    stepsReference={`professionalMembershipSchema[${index}].professionalBody`}
                    type="text"
                  />
                  <FormField
                    label="Membership ID"
                    stepsReference={`professionalMembershipSchema[${index}].membershipId`}
                    type="text"
                  />
                  <FormField
                    label="Membership Since"
                    stepsReference={`professionalMembershipSchema[${index}].membershipSince`}
                    type="date"
                  />
                    <div>
                      <label
                        htmlFor={`professionalMembershipSchema.${index}.membershipType`}
                        className="block text-sm font-medium text-gray-700"
                      >
                        Membership Type
                      </label>
                      <select
                        id={`professionalMembershipSchema.${index}.membershipType`}
                        {...register(`professionalMembershipSchema.${index}.membershipType`)}
                        className="mt-1 block w-full p-2 border rounded-md bg-gray-50"
                      >
                        <option value="" disabled>
                          Select Membership Type
                        </option>
                        <option value="Annual">Annual</option>
                        <option value="Permanent">Permanent</option>
                      </select>
                      {errors.professionalMembershipSchema?.[index]?.membershipType && (
                        <p className="mt-2 text-sm text-red-600">
                          {errors.professionalMembershipSchema[index].membershipType.message}
                        </p>
                      )}
                    </div>

                  <div className="col-span-2 flex justify-end">
                    <button
                      type="button"
                      onClick={() => removeProfessionalMembership(index)}
                      className="text-red-500 text-sm"
                    >
                      Remove Button
                    </button>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  appendProfessionalMembership({

                    professionalBody: "",
                    membershipId: "",
                    membershipSince: new Date(),
                    membershipType: "",
                  })
                }
                className="text-blue-500 text-sm"
              >
                + Add Professional Memberships
              </button>
            </motion.div>
          )}
          {currentStep === 0 && 
          (
            <motion.div
              initial={{ x: delta >= 0 ? "50%" : "-50%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="space-y-6  mb-[10px] border border-gray-300 rounded-md p-6 shadow-md"

            >
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Review and Submit
              </h2>
              <p className="text-gray-600 mb-6">
                Review the entered data below. If everything looks correct, click "Submit" to finalize.
              </p>

              <div className="space-y-6 bg-white p-6 rounded-lg shadow-md border border-gray-200">
      {/* Faculty Research Details */}
      <div className="pb-4 border-b border-gray-300">
        <h3 className="text-lg font-bold text-gray-700 mb-3">
          Faculty Research Details
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {[
            ["VTU Faculty ID", watch("facultyResearchSchema.vtuFacultyId")],
            ["Google Scholar ID", watch("facultyResearchSchema.googleScholarId")],
            ["ORCID", watch("facultyResearchSchema.orcId")],
            ["Scopus ID", watch("facultyResearchSchema.scopusId")],
            [
              "Publons/Web of Science ID",
              watch("facultyResearchSchema.publonsAndWebOfScienceId"),
            ],
            ["Research ID", watch("facultyResearchSchema.researchId")],
          ].map(([label, value], index) => (
            <p key={index}>
              <strong>{label}:</strong> {value || "N/A"}
            </p>
          ))}
        </div>
      </div>

      {/* Dynamic Section for Fields */}
      {[
        { schema: "nationalJournalDetailsSchema", label: "National Journals" },
        { schema: "internationalJournalDetailsSchema", label: "International Journals" },
        { schema: "eventsAttendedSchema", label: "Events Attended" },
        { schema: "eventsOrganizedSchema", label: "Events Organized" },
        { schema: "researchGrantsSchema", label: "Research Projects" },
        { schema: "consultancySchema", label: "Consultancy" },
        { schema: "patentsSchema", label: "Patents" },
        { schema: "publicationsSchema", label: "Publications" },
        { schema: "research_experienceSchema", label: "Research Experience" },
        { schema: "researchSupervisionSchema", label: "Research Supervision" },
        { schema: "professionalMembershipSchema", label: "Professional Memberships" },
      ].map(({ schema, label }) => (
        <div key={schema}>
          <h3 className="text-xl font-semibold text-gray-800">{label}</h3>
          <ul className="list-disc pl-5">
            {watch(schema)?.map((entry, index) => (
              <li key={index} className="mb-4">
                {Object.entries(entry).map(([field, value], i) => {
                  // Format Date objects
                  const formattedValue =
                    value instanceof Date
                      ? value.toLocaleDateString()
                      : Array.isArray(value)
                      ? value.join(", ") || "N/A"
                      : value || "N/A";
                  return (
                    <p key={i}>
                      <strong>{field.replace(/([A-Z])/g, " $1")}: </strong>
                      {formattedValue}
                    </p>
                  );
                })}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>



              {/* <div>
                <h3 className="text-xl font-semibold text-gray-800">Invited Talks</h3>
                <ul className="list-disc pl-5">
                  {watch("invitedTalksSchema")?.map((talk, index) => (
                    <li key={index}>
                      <strong>Title:</strong> {talk.title}, 
                      <strong> Organizer:</strong> {talk.organizer}, 
                      <strong> Dates:</strong> {new Date(talk.fromDate).toLocaleDateString()} -{" "}
                      {new Date(talk.toDate).toLocaleDateString()}
                    </li>
                  ))}
                </ul>
              </div> */}
              {/* Submit Button */}
              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={handleSubmit(async (data) => {
                    try {
                      const payload= {
                        facultyResearchSchema: data.facultyResearchSchema,
                        nationalJournalDetailsSchema: data.nationalJournalDetailsSchema,
                        internationalJournalDetailsSchema: data.internationalJournalDetailsSchema,
                        nationalConferenceDetailsSchema: data.nationalConferenceDetailsSchema,
                        internationalConferenceDetailsSchema: data.internationalConferenceDetailsSchema,
                        researchGrantsSchema: data.researchGrantsSchema,
                        patentsSchema: data.patentsSchema,
                        consultancySchema: data.consultancySchema,
                        professionalMembershipSchema: data.professionalMembershipSchema,
                        eventsAttendedSchema: data.eventsAttendedSchema,
                        eventsOrganizedSchema: data.eventsOrganizedSchema,
                        publicationsSchema: data.publicationsSchema,
                        research_experienceSchema: data.research_experienceSchema,
                        researchSupervisionSchema: data.researchSupervisionSchema,
                        facultyId:facultyId,
                      };
                      console.log("Payload being sent to API:", payload);
                
                      const response = await axios.post("/api/fac_reg_res", payload);
                      if (response.status === 200) {
                        console.log(response.data);
                        alert("Form submitted successfully!");
                        router.push(`/mis_est`);
                        reset();
                        setCurrentStep(0); // Restart the form
                      }
                    } catch (error) {
                      console.error(error);
                      alert("An error occurred while submitting the form.");
                    }
                  })}
                  className="bg-blue-600 text-white px-6 py-2 rounded-md shadow hover:bg-blue-700"
                >
                  Submit
                </button>
              </div>
            </motion.div>
          )}

          </form>
        </FormProvider>

        {/* <FormNavigation
          prevButtonFunction={prevButtonFunction}
          steps={steps}
          currentStep={currentStep}
          nextButtonFunction={nextButtonFunction}
        /> */}
      </section>
    </div>
  );
}
