"use client";
import { useState } from "react";
import { motion } from "framer-motion";
// import { useEffect } from "react";

import { z } from "zod";
import { facultyAcademicDetailsSchema } from "../../../../schemas/academic-details";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler, useFieldArray } from "react-hook-form";
// import { identity } from "lodash";
import { Step } from "../../../../types/form";
import FormField from "../../../../components/FormField";
// import FormNavigation from "../../../components/FormNavigation";
import { FormProvider } from "../../../../hooks/FormProvider";
// import Header from "@/app/components/ui/commonheader";
// import { NavLinks } from "../../../components/ui/nav-links";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { useEffect } from "react";
type Inputs = z.infer<typeof facultyAcademicDetailsSchema>;

const steps: Step[] = [
  {
    id: "Step 1",
    name: "Current Teaching Experience",
    fields: [
      "academicSchema.level",
      "previousTeachingExperienceSchema",
      "teachingExperienceIndustrySchema",
      "awardsSchema",
      "recognitionsSchema",
      "responsibilitiesSchema",
      "extracurricularsSchema",
      "outreachSchema",
    ],
  },
  { id: "Step 2", name: "Preview And Complete", fields: [] },
];

export default function Form() {
  const [previousStep, setPreviousStep] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
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
    resolver: zodResolver(facultyAcademicDetailsSchema),
  });

  const {
    fields: previousTeaching,
    append: appendPreviousTeaching,
    remove: removePreviousTeaching,
  } = useFieldArray({ control, name: "previousTeachingExperienceSchema" });

  const {
    fields: teachingIndustry,
    append: appendTeachingIndustry,
    remove: removeTeachingIndustry,
  } = useFieldArray({ control, name: "teachingExperienceIndustrySchema" });

  const {
    fields: responsibilities,
    append: appendResponsibilities,
    remove: removeResponsibilities,
  } = useFieldArray({ control, name: "responsibilitiesSchema" });

  const {
    fields: extracurriculars,
    append: appendExtracurriculars,
    remove: removeExtracurriculars,
  } = useFieldArray({ control, name: "extracurricularsSchema" });
  const {
    fields: outreach,
    append: appendOutreach,
    remove: removeOutreach,
  } = useFieldArray({ control, name: "outreachSchema" });

  const {
    fields: recognitions,
    append: appendRecognitions,
    remove: removeRecognitions,
  } = useFieldArray({ control, name: "recognitionsSchema" });

  const {
    fields: awards,
    append: appendAwards,
    remove: removeAwards,
  } = useFieldArray({ control, name: "awardsSchema" });

  const [facultyid, setFacultyid] = useState("");
  // Extract facultyId from URL using query string
  useEffect(() => {
    const pathname = window.location.pathname; // Get the full path
    const segments = pathname.split("/"); // Split path into segments
    const idFromPath = segments[segments.length - 1]; // Get the last segment (facultyId)
    console.log(idFromPath);
    if (idFromPath) {
      setFacultyid(idFromPath);
    } else {
      console.warn("Faculty ID is not present in the dynamic route.");
    }
  }, []);

  const facultyId = facultyid;

  

  const processForm: SubmitHandler<Inputs> = async (data) => {
    console.log("All data", data);
    try {
      const response = await axios.post("/api/facultyacademicdetails", {
        // Include academic schema with default values if not available in your form
        academicSchema: data.academicSchema || {
          level: "1",
        },
        previousTeachingExperienceSchema:
          data.previousTeachingExperienceSchema || [],
        teachingExperienceIndustrySchema:
          data.teachingExperienceIndustrySchema || [],

        responsibilitiesSchema: data.responsibilitiesSchema || [],
        extracurricularsSchema: data.extracurricularsSchema || [],
        outreachSchema: data.outreachSchema || [],
        recognitionsSchema: data.recognitionsSchema || [],
        awardsSchema: data.awardsSchema || [],
      });

      if (response.status === 200) {
        console.log(response);
        // Handle success (e.g., show success message, redirect, etc.)
      }
    } catch (error) {
      console.error(error);
      // Handle error (e.g., show error message)
    }
  };
  type FieldName = keyof Inputs;
  //   const nextButtonFunction = async () => {
  //     const fields = steps[currentStep].fields;

  //     const output = await trigger(fields as FieldName[], { shouldFocus: true });

  //     if (!output) return; // Prevent navigation if validation fails

  //     if (currentStep < steps.length - 1) {
  //       setPreviousStep(currentStep);
  //       setCurrentStep((step) => step + 1);
  //     }
  //   };
  //   const prevButtonFunction = () => {
  //     if (currentStep > 0) {
  //       setPreviousStep(currentStep);
  //       setCurrentStep((step) => step - 1);
  //     }
  //   };

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
        <FormProvider register={register} errors={errors}>
          <form className="mt-12 py-12" onSubmit={handleSubmit(processForm)}>
            {currentStep === 0 && (
              <motion.div
                initial={{ x: delta >= 0 ? "50%" : "-50%", opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="space-y-6 mt-[-80px] mb-[10px] border border-gray-300 rounded-md p-6 shadow-md"
              >
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                  Academic Details
                </h2>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <FormField
                    label="Level"
                    stepsReference="academicSchema.level"
                    type="number"
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
                  Teaching Experience
                </h2>

                {previousTeaching.map((field, index) => (
                  <div
                    key={field.id}
                    className="grid grid-cols-1 gap-6 sm:grid-cols-2"
                  >
                    <FormField
                      label="Name of Institute"
                      stepsReference={`previousTeachingExperienceSchema[${index}].instituteName`}
                      type="text"
                    />
                    <div>
                      <label
                        htmlFor={`previousTeachingExperienceSchema[${index}].Designation`}
                        className="block text-sm font-medium text-gray-700"
                      >
                        Designation
                      </label>
                      <select
                        id={`previousTeachingExperienceSchema[${index}].Designation`}
                        {...register(`previousTeachingExperienceSchema.${index}.Designation`)}
                        className="mt-1 block w-full p-1 py-2.5 rounded-md border bg-gray-50 border-gray-300 shadow-sm"
                      >
                        <option value="Professor">Professor</option>
                        <option value="Assistant Professor">Assistant Professor</option>
                        <option value="Associate Professor">Associate Professor</option>
                        <option value="Lecturer">Lecturer</option>
                      </select>
                      {errors.previousTeachingExperienceSchema?.[index]?.Designation && (
                        <p className="mt-2 text-sm text-red-600">
                          {errors.previousTeachingExperienceSchema[index]?.Designation?.message}
                        </p>
                      )}
                    </div>
                    <FormField
                      label="Department"
                      stepsReference={`previousTeachingExperienceSchema[${index}].departmentName`}
                      type="text"
                    />
                    <FormField
                      label="From Date"
                      stepsReference={`previousTeachingExperienceSchema[${index}].fromDate`}
                      type="date"
                    />

                    <div>
                    
                      
            <div className="flex flex-col gap-2">
                        <label
                          htmlFor={`previousTeachingExperienceSchema.${index}.toDate`}
                          className="block text-sm font-medium text-gray-700"
                        >
                          To Date
                        </label>
                        <div className="flex items-center gap-2">
                          {/* Input for To Date */}
                          <input
                            type="date"
                            id={`previousTeachingExperienceSchema.${index}.toDate`}
                            {...register(`previousTeachingExperienceSchema.${index}.toDate`)}
                            className="block w-full p-2 border rounded-md"
                          />
                          {/* Button to Set Date */}
                          <button
                            type="button"
                            onClick={() =>
                              setValue(`previousTeachingExperienceSchema.${index}.toDate`, "9999-12-12")
                            }
                            className="text-blue-500 underline text-sm"
                          >
                            Set Still Date
                          </button>
                        </div>
                      </div>

                    </div>

                    <div className="col-span-2 flex justify-end">
                      <button
                        type="button"
                        onClick={() => removePreviousTeaching(index)}
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
                    appendPreviousTeaching({
                      instituteName: "",
                      Designation: "",
                      departmentName: "",
                      fromDate: new Date(),
                      toDate: new Date(),
                    })
                  }
                  className="text-blue-500 text-sm"
                >
                  + Add Previous Teaching Experience
                </button>

                <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                  Industry Teaching Experience
                </h2>

                {teachingIndustry.map((field, index) => (
                  <div
                    key={field.id}
                    className="grid grid-cols-1 gap-6 sm:grid-cols-2"
                  >
                    <FormField
                      label="Organization"
                      stepsReference={`teachingExperienceIndustrySchema[${index}].organization`}
                      type="text"
                    />

                    <FormField
                      label="From Date"
                      stepsReference={`teachingExperienceIndustrySchema[${index}].fromDate`}
                      type="date"
                                    />

          
            <div className="flex flex-col gap-2">
  <label
    htmlFor={`teachingExperienceIndustrySchema.${index}.toDate`}
    className="block text-sm font-medium text-gray-700"
  >
    To Date
  </label>
  <div className="flex items-center gap-2">
    {/* Input for To Date */}
    <input
      type="date"
      id={`teachingExperienceIndustrySchema.${index}.toDate`}
      {...register(`teachingExperienceIndustrySchema.${index}.toDate`)}
      className="block w-full p-2 border rounded-md"
    />
    {/* Button to Set Date */}
    <button
      type="button"
      onClick={() =>
        setValue(`teachingExperienceIndustrySchema.${index}.toDate`, "9999-12-12")
      }
      className="text-blue-500 underline text-sm"
    >
      Set Still Date
    </button>
  </div>
</div>

                    <FormField
                      label="Designation"
                      stepsReference={`teachingExperienceIndustrySchema[${index}].designation`}
                      type="text"
                    />
                    <div className="col-span-2 flex justify-end">
                      <button
                        type="button"
                        onClick={() => removeTeachingIndustry(index)}
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
                    appendTeachingIndustry({
                      organization: "",
                      fromDate: new Date(),
                      toDate: new Date(),
                      designation: "",
                    })
                  }
                  className="text-blue-500 text-sm"
                >
                  + Add Industry Teaching Experience
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
                  Awards
                </h2>

                {awards.map((field, index) => (
                  <div
                    key={field.id}
                    className="grid grid-cols-1 gap-6 sm:grid-cols-2"
                  >
                    <FormField
                      label="Award Title"
                      stepsReference={`awardsSchema[${index}].awardRecieved`}
                      type="text"
                    />
                    <FormField
                      label="Award From"
                      stepsReference={`awardsSchema[${index}].awardFrom`}
                      type="text"
                    />
                    <FormField
                      label="Award Date"
                      stepsReference={`awardsSchema[${index}].awardDate`}
                      type="date"
                    />
                    <div className="col-span-2 flex justify-end">
                      <button
                        type="button"
                        onClick={() => removeAwards(index)}
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
                    appendAwards({
                      awardDate: new Date(),
                      awardFrom: "",
                      awardRecieved: "",
                    })
                  }
                  className="text-blue-500 text-sm"
                >
                  + Add Awards
                </button>

                <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                  Recognitions
                </h2>

                {recognitions.map((field, index) => (
                  <div
                    key={field.id}
                    className="grid grid-cols-1 gap-6 sm:grid-cols-2"
                  >
                    <FormField
                      label="Recognition Title"
                      stepsReference={`recognitionsSchema[${index}].recognitionRecieved`}
                      type="text"
                    />
                    <FormField
                      label="Recognition From"
                      stepsReference={`recognitionsSchema[${index}].recognitionFrom`}
                      type="text"
                    />
                    <FormField
                      label="Recognition Date"
                      stepsReference={`recognitionsSchema[${index}].recognitionDate`}
                      type="date"
                    />
                    <div className="col-span-2 flex justify-end">
                      <button
                        type="button"
                        onClick={() => removeRecognitions(index)}
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
                    appendRecognitions({
                      recognitionDate: new Date(),
                      recognitionFrom: "",
                      recognitionRecieved: "",
                    })
                  }
                  className="text-blue-500 text-sm"
                >
                  + Add Recognitions
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
                  Responsibilities
                </h2>

                {responsibilities.map((field, index) => (
                  <div
                    key={field.id}
                    className="grid grid-cols-1 gap-6 sm:grid-cols-2"
                  >
                    <FormField
                      label="Responsibility"
                      stepsReference={`responsibilitiesSchema[${index}].additionalResponsibilitiesHeld`}
                      type="text"
                    />
                    <FormField
                      label="Level"
                      stepsReference={`responsibilitiesSchema[${index}].level`}
                      type="text"
                    />
                    <FormField
                      label="From Date"
                      stepsReference={`responsibilitiesSchema[${index}].fromDate`}
                      type="date"
                    />
                   <div className="flex flex-col gap-2">
  <label
    htmlFor={`responsibilitiesSchema.${index}.toDate`}
    className="block text-sm font-medium text-gray-700"
  >
    To Date
  </label>
  <div className="flex items-center gap-2">
    {/* Input for To Date */}
    <input
      type="date"
      id={`responsibilitiesSchema.${index}.toDate`}
      {...register(`responsibilitiesSchema.${index}.toDate`)}
      className="block w-full p-2 border rounded-md"
    />
    {/* Button to Set Date */}
    <button
      type="button"
      onClick={() =>
        setValue(`responsibilitiesSchema.${index}.toDate`, "9999-12-12")
      }
      className="text-blue-500 underline text-sm"
    >
      Set Still Date
    </button>
  </div>
</div>

                    <div className="col-span-2 flex justify-end">
                      <button
                        type="button"
                        onClick={() => removeResponsibilities(index)}
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
                    appendResponsibilities({
                      level: "",
                      additionalResponsibilitiesHeld: "",
                      fromDate: new Date(),
                      toDate: new Date(),
                    })
                  }
                  className="text-blue-500 text-sm"
                >
                  + Add Responsibilities
                </button>

                <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                  Extracurriculars
                </h2>

                {extracurriculars.map((field, index) => (
                  <div
                    key={field.id}
                    className="grid grid-cols-1 gap-6 sm:grid-cols-2"
                  >
                    <FormField
                      label="Type of Event"
                      stepsReference={`extracurricularsSchema[${index}].typeOfEvent`}
                      type="text"
                    />

                    <FormField
                      label="Title"
                      stepsReference={`extracurricularsSchema[${index}].titleOfEvent`}
                      type="text"
                    />

                    <FormField
                      label="From Date"
                      stepsReference={`extracurricularsSchema[${index}].fromDate`}
                      type="date"
                    />

                    <FormField
                      label="To Date"
                      stepsReference={`extracurricularsSchema[${index}].toDate`}
                      type="date"
                    />

                    <FormField
                      label="Organizer"
                      stepsReference={`extracurricularsSchema[${index}].organizer`}
                      type="text"
                    />

                    <FormField
                      label="Level"
                      stepsReference={`extracurricularsSchema[${index}].level`}
                      type="text"
                    />

                    <FormField
                      label="Achievement"
                      stepsReference={`extracurricularsSchema[${index}].achievement`}
                      type="text"
                    />

                    <div className="col-span-2 flex justify-end">
                      <button
                        type="button"
                        onClick={() => removeExtracurriculars(index)}
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
                    appendExtracurriculars({
                      typeOfEvent: "",
                      titleOfEvent: "",
                      fromDate: new Date(),
                      toDate: new Date(),
                      organizer: "",
                      level: "",
                      achievement: "",
                    })
                  }
                  className="text-blue-500 text-sm"
                >
                  + Add Extracurriculars
                </button>

                <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                  Outreach Activities
                </h2>

                {outreach.map((field, index) => (
                  <div
                    key={field.id}
                    className="grid grid-cols-1 gap-6 sm:grid-cols-2"
                  >
                    <FormField
                      label="Activity Name"
                      stepsReference={`outreachSchema[${index}].activity`}
                      type="text"
                    />

                    <FormField
                      label="Role"
                      stepsReference={`outreachSchema[${index}].role`}
                      type="text"
                    />

                    <FormField
                      label="From Date"
                      stepsReference={`outreachSchema[${index}].fromDate`}
                      type="date"
                    />

                    <FormField
                      label="To Date"
                      stepsReference={`outreachSchema[${index}].toDate`}
                      type="date"
                    />

                    <FormField
                      label="Place"
                      stepsReference={`outreachSchema[${index}].place`}
                      type="text"
                    />

                    <div className="col-span-2 flex justify-end">
                      <button
                        type="button"
                        onClick={() => removeOutreach(index)}
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
                    appendOutreach({
                      activity: "",
                      role: "",
                      fromDate: new Date(),
                      toDate: new Date(),
                      place: "",
                    })
                  }
                  className="text-blue-500 text-sm"
                >
                  + Add Outreach
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
    Review and Submit
  </h2>
  <p className="text-gray-600 mb-6">
    Please review the details below. If everything looks correct, click "Submit"
    to finalize your submission.
  </p>

  <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
    {/* Academic Details */}
    <h3 className="text-base font-semibold text-gray-800 mb-2">
      Academic Details
    </h3>
    <table className="table-auto w-full text-sm">
      <tbody>
        <tr>
          <td className="font-medium text-gray-700 px-2 py-1">Level</td>
          <td className="px-2 py-1">{watch("academicSchema.level") || "N/A"}</td>
        </tr>
      </tbody>
    </table>

    {/* Previous Teaching Experience */}
    {watch("previousTeachingExperienceSchema")?.length > 0 && (
      <>
        <h3 className="text-base font-semibold text-gray-800 mt-4 mb-2">
          Previous Teaching Experience
        </h3>
        <table className="table-auto w-full text-sm">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-2 py-1 font-medium text-gray-700">Institute</th>
              <th className="px-2 py-1 font-medium text-gray-700">
                Designation
              </th>
              <th className="px-2 py-1 font-medium text-gray-700">Department</th>
              <th className="px-2 py-1 font-medium text-gray-700">From</th>
              <th className="px-2 py-1 font-medium text-gray-700">To</th>
            </tr>
          </thead>
          <tbody>
            {watch("previousTeachingExperienceSchema")?.map((exp, index) => (
              <tr key={index} className="odd:bg-gray-100">
                <td className="px-2 py-1">{exp.instituteName || "N/A"}</td>
                <td className="px-2 py-1">{exp.Designation || "N/A"}</td>
                <td className="px-2 py-1">{exp.departmentName || "N/A"}</td>
                <td className="px-2 py-1">
                  {exp.fromDate ? new Date(exp.fromDate).toLocaleDateString() : "N/A"}
                </td>
                <td className="px-2 py-1">
                  {exp.toDate ? new Date(exp.toDate).toLocaleDateString() : "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </>
    )}

    {/* Industry Teaching Experience */}
    {watch("teachingExperienceIndustrySchema")?.length > 0 && (
      <>
        <h3 className="text-base font-semibold text-gray-800 mt-4 mb-2">
          Industry Teaching Experience
        </h3>
        <table className="table-auto w-full text-sm">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-2 py-1 font-medium text-gray-700">Organization</th>
              <th className="px-2 py-1 font-medium text-gray-700">Designation</th>
              <th className="px-2 py-1 font-medium text-gray-700">From</th>
              <th className="px-2 py-1 font-medium text-gray-700">To</th>
            </tr>
          </thead>
          <tbody>
            {watch("teachingExperienceIndustrySchema")?.map((exp, index) => (
              <tr key={index} className="odd:bg-gray-100">
                <td className="px-2 py-1">{exp.organization || "N/A"}</td>
                <td className="px-2 py-1">{exp.designation || "N/A"}</td>
                <td className="px-2 py-1">
                  {exp.fromDate ? new Date(exp.fromDate).toLocaleDateString() : "N/A"}
                </td>
                <td className="px-2 py-1">
                  {exp.toDate ? new Date(exp.toDate).toLocaleDateString() : "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </>
    )}

    {/* Awards */}
    {watch("awardsSchema")?.length > 0 && (
      <>
        <h3 className="text-base font-semibold text-gray-800 mt-4 mb-2">Awards</h3>
        <table className="table-auto w-full text-sm">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-2 py-1 font-medium text-gray-700">Title</th>
              <th className="px-2 py-1 font-medium text-gray-700">From</th>
              <th className="px-2 py-1 font-medium text-gray-700">Date</th>
            </tr>
          </thead>
          <tbody>
            {watch("awardsSchema")?.map((award, index) => (
              <tr key={index} className="odd:bg-gray-100">
                <td className="px-2 py-1">{award.awardRecieved || "N/A"}</td>
                <td className="px-2 py-1">{award.awardFrom || "N/A"}</td>
                <td className="px-2 py-1">
                  {award.awardDate
                    ? new Date(award.awardDate).toLocaleDateString()
                    : "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </>
    )}

    {/* Recognitions */}
    {watch("recognitionsSchema")?.length > 0 && (
      <>
        <h3 className="text-base font-semibold text-gray-800 mt-4 mb-2">
          Recognitions
        </h3>
        <table className="table-auto w-full text-sm">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-2 py-1 font-medium text-gray-700">Title</th>
              <th className="px-2 py-1 font-medium text-gray-700">From</th>
              <th className="px-2 py-1 font-medium text-gray-700">Date</th>
            </tr>
          </thead>
          <tbody>
            {watch("recognitionsSchema")?.map((rec, index) => (
              <tr key={index} className="odd:bg-gray-100">
                <td className="px-2 py-1">{rec.recognitionRecieved || "N/A"}</td>
                <td className="px-2 py-1">{rec.recognitionFrom || "N/A"}</td>
                <td className="px-2 py-1">
                  {rec.recognitionDate
                    ? new Date(rec.recognitionDate).toLocaleDateString()
                    : "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </>
    )}

    {/* Responsibilities */}
    {watch("responsibilitiesSchema")?.length > 0 && (
      <>
        <h3 className="text-base font-semibold text-gray-800 mt-4 mb-2">
          Responsibilities
        </h3>
        <table className="table-auto w-full text-sm">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-2 py-1 font-medium text-gray-700">Responsibility</th>
              <th className="px-2 py-1 font-medium text-gray-700">Level</th>
              <th className="px-2 py-1 font-medium text-gray-700">From</th>
              <th className="px-2 py-1 font-medium text-gray-700">To</th>
            </tr>
          </thead>
          <tbody>
            {watch("responsibilitiesSchema")?.map((resp, index) => (
              <tr key={index} className="odd:bg-gray-100">
                <td className="px-2 py-1">{resp.additionalResponsibilitiesHeld || "N/A"}</td>
                <td className="px-2 py-1">{resp.level || "N/A"}</td>
                <td className="px-2 py-1">
                  {resp.fromDate
                    ? new Date(resp.fromDate).toLocaleDateString()
                    : "N/A"}
                </td>
                <td className="px-2 py-1">
                  {resp.toDate ? new Date(resp.toDate).toLocaleDateString() : "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </>
    )}
    {/* Extracurriculars */}
    {watch("extracurricularsSchema")?.length > 0 && (
      <>
        <h3 className="text-base font-semibold text-gray-800 mt-4 mb-2">
          Extracurriculars
          </h3>
          <table className="table-auto w-full text-sm">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-2 py-1 font-medium text-gray-700">Type</th>
                <th className="px-2 py-1 font-medium text-gray-700">Title</th>
                <th className="px-2 py-1 font-medium text-gray-700">From</th>
                <th className="px-2 py-1 font-medium text-gray-700">To</th>
                <th className="px-2 py-1 font-medium text-gray-700">Organizer</th>
                <th className="px-2 py-1 font-medium text-gray-700">Level</th>
                <th className="px-2 py-1 font-medium text-gray-700">Achievement</th>
                </tr>
                </thead>
                <tbody>
                  {watch("extracurricularsSchema")?.map((extra, index) => (
                    <tr key={index} className="odd:bg-gray-100">
                      <td className="px-2 py-1">{extra.typeOfEvent || "N/A"}</td>
                      <td className="px-2 py-1">{extra.titleOfEvent || "N/A"}</td>
                      <td className="px-2 py-1">
                        {extra.fromDate
                          ? new Date(extra.fromDate).toLocaleDateString()
                          : "N/A"}
                      </td>
                      <td className="px-2 py-1">
                        {extra.toDate
                          ? new Date(extra.toDate).toLocaleDateString()
                          : "N/A"}
                      </td>
                      <td className="px-2 py-1">{extra.organizer || "N/A"}</td>
                      <td className="px-2 py-1">{extra.level || "N/A"}</td>
                      <td className="px-2 py-1">{extra.achievement || "N/A"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
          {/* Outreach */}
          {watch("outreachSchema")?.length > 0 && (
            <>
              <h3 className="text-base font-semibold text-gray-800 mt-4 mb-2">
                Outreach Activities
              </h3>
              <table className="table-auto w-full text-sm">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="px-2 py-1 font-medium text-gray-700">Activity</th>
                    <th className="px-2 py-1 font-medium text-gray-700">Role</th>
                    <th className="px-2 py-1 font-medium text-gray-700">From</th>
                    <th className="px-2 py-1 font-medium text-gray-700">To</th>
                    <th className="px-2 py-1 font-medium text-gray-700">Place</th>
                  </tr>
                </thead>
                <tbody>
                  {watch("outreachSchema")?.map((out, index) => (
                    <tr key={index} className="odd:bg-gray-100">
                      <td className="px-2 py-1">{out.activity || "N/A"}</td>
                      <td className="px-2 py-1">{out.role || "N/A"}</td>
                      <td className="px-2 py-1">
                        {out.fromDate
                          ? new Date(out.fromDate).toLocaleDateString()
                          : "N/A"}
                      </td>
                      <td className="px-2 py-1">
                        {out.toDate
                          ? new Date(out.toDate).toLocaleDateString()
                          : "N/A"}
                      </td>
                      <td className="px-2 py-1">{out.place || "N/A"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
  </div>


                {/* Submit Button */}
                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    onClick={handleSubmit(async (data) => {
                      try {
                        // Map form data to API schema
                        const payload = {
                          facultyId: facultyId, // Ensure this is defined and correct
                          academicSchema: data.academicSchema, // Adjust based on form field names
                          previousTeachingExperienceSchema:
                            data.previousTeachingExperienceSchema || [],
                          teachingExperienceIndustrySchema:
                            data.teachingExperienceIndustrySchema || [],
                          awardsSchema: data.awardsSchema || [],
                          recognitionsSchema: data.recognitionsSchema || [],
                          responsibilitiesSchema:
                            data.responsibilitiesSchema || [],
                          extracurricularsSchema:
                            data.extracurricularsSchema || [],
                          outreachSchema: data.outreachSchema || [],
                        };

                        console.log("Payload being sent to API:", payload);

                        const response = await axios.post(
                          "/api/fac_reg_aca",
                          payload
                        );
                        if (response.status === 200) {
                          console.log(response.data);
                          alert("Form submitted successfully!");
                          router.push(
                            `/faculty/faculty_reg/research/${facultyId}`
                          );
                          reset();
                          setCurrentStep(0); // Restart the form
                        }
                      } catch (error) {
                        console.error(error);
                        alert("An error occurred while submitting the form.");
                      }
                    })}
                    className="bg-indigo-600 text-white px-6 py-2 rounded-md shadow-sm hover:bg-indigo-700"
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
