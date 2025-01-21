"use client";

import { useSearchParams, usePathname } from "next/navigation";
import Link from "next/link";

export function FacultyProfileNav() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const facultyId = sessionStorage.getItem("emp_id");

  if (!facultyId) {
    throw new Error("Faculty ID is missing in URL parameters.");
  }

  return (
    <nav className="flex items-center justify-end gap-4 mr-4 mt-2 text-xl text-blue-500 font-bold">
      <Link
        className={`link hover:underline underline-offset-3 ${
          pathname === "/mis_faculty/faculty_home" ? "text-purple-500" : ""
        }`}
        href={`/mis_faculty/faculty_home`}
      >
        Home
      </Link>
      <Link
        className={`link hover:underline underline-offset-3 ${
          pathname === "/mis_faculty/faculty_home" ? "text-purple-500" : ""
        }`}
        href={`/faculty/#personal-section`}
      >
        Personal Details
      </Link>
      <Link
        className={`link hover:underline underline-offset-3 ${
          pathname === "#academic-section" ? "text-purple-500" : ""
        }`}
        href={`/faculty/profile/academic-details?facultyId=${facultyId}`}
      >
        Academic Details
      </Link>
      <Link
        className={`link hover:underline underline-offset-3 ${
          pathname === "#research-section " ? "text-purple-500" : ""
        }`}
        href={`/faculty/profile/research-details?facultyId=${facultyId}`}
      >
        Research Details
      </Link>
    </nav>
  );
}
