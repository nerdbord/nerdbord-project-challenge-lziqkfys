"use client";
import { useEffect, useState } from "react";

export default function Footer() {
  const [year, setYear] = useState(new Date().getFullYear());
  useEffect(() => {
    // Update the year when the component mounts
    setYear(new Date().getFullYear());
  }, []);
  return (
    <footer className="mt-auto text-white bg-[#000000] text-center py-5 px-7">
      <small>&copy; {year}. All rights reserved.</small>
    </footer>
  );
}
