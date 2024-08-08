"use client";
import { ChangeEvent, ChangeEventHandler, useState } from "react";
import generateForm from "../ai/generateForm";
import DynamicForm from "./DynamicForm";
import { FormType } from "../types/types";

export default function Page() {
  const [object, setObject] = useState<FormType>();
  const [prompt, setPrompt] = useState("");
  const handleClick = async () => {
    const formJSON = await generateForm(prompt);
    setObject(formJSON);
  };

  const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPrompt(event.target.value)
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <input type="text" value={prompt} onChange={handleOnChange}></input>
      <button onClick={handleClick}> click me</button>
      {object && <DynamicForm formData={object} />}
    </div>
  );
}
