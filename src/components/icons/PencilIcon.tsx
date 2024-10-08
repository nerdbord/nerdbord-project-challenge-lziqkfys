import { useState } from "react";

export default function PencilIcon() {
  const [isMouseOver, setIsMouseOver] = useState(false);
  const stroke = isMouseOver ? "pink" : "black";
  return (
    <svg
      onMouseEnter={() => setIsMouseOver(true)}
      onMouseLeave={() => setIsMouseOver(false)}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M18 2L22 6"
        stroke={stroke}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.5 20.5L19 9L15 5L3.5 16.5L2 22L7.5 20.5Z"
        stroke={stroke}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
