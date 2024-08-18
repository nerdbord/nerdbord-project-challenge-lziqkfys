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
    href: "",
    label: "Viera",
  },
  {
    href: "",
    label: "Julia",
  },
  {
    href: "https://github.com/transcendence12",
    label: "Gosia",
  },
];

export default function Footer() {
  const [year, setYear] = useState(new Date().getFullYear());
  useEffect(() => {
    // Update the year when the component mounts
    setYear(new Date().getFullYear());
  }, []);
  return (
    <footer className="mt-auto text-[#94A3B8] border-t text-center text-sm py-14 w-full">
      <div className="w-[280px] mx-auto leading-6 flex-col">
        <div>&copy; {year} Fromulatrix | All Rights Reserved</div>
        <ul className="flex gap-x-5 text-[14px]">Filip | Julia | Viera | Gosia</ul>
      </div>
    </footer>
  );
}
