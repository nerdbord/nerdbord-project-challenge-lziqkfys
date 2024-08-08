"use client";
import { useState } from "react";
import generateForm from "../ai/generateForm";

export default function Page() {
    const [object, setObject] = useState<any>(null)
  const handleClick = async () => {
    const formJSON = await generateForm(
      "i want to collect guest data for my upcoming birthday, additionally i want to know what country they're coming from"
    );
    console.log(formJSON);
    setObject(formJSON)
  };

  return (
    <div className="flex flex-col">
      hello there {`\n\n\n\n`}
      <button onClick={handleClick}> click me</button>
    </div>
  );
}
