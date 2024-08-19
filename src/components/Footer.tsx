"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const footerLinks = [
  {
    href: "https://github.com/filwas",
    label: "Filip",
  },
  {
    href: "https://www.linkedin.com/in/wu-kortas/",
    label: "Viera",
  },
  {
    href: "https://www.linkedin.com/in/julia-dutka-532a3a207",
    label: "Julia",
  },
  {
    href: "https://github.com/transcendence12",
    label: "Gosia",
  },
];

export default function Footer() {
  const pathname = usePathname();
  const [year, setYear] = useState(new Date().getFullYear());
  useEffect(() => {
    // Update the year when the component mounts
    setYear(new Date().getFullYear());
  }, []);
  return (
    <footer className=" sticky bottom-0 mt-auto text-[#94A3B8] border-t text-center text-sm py-4 w-full z-50 bg-white">
      <div className="w-[280px] mx-auto leading-6 flex-col">
        <div>&copy; {year} Fromatrix | All Rights Reserved</div>
        <ul className="flex text-[14px] justify-around align-center">
          {footerLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`${
                  pathname === link.href ? "text-slate-900" : "text-[#94A3B8]"
                }  hover:text-blue-600 focus:text-blue-600`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
