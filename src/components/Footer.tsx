"use client";
import { useEffect, useState } from "react";

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
        <div>Filip | Julia | Viera | Gosia</div>
      </div>
    </footer>
  );
}
