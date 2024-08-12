"use client";

import { ChangeEvent, useState } from "react";
import generateForm from "../ai/generateForm";
import DynamicForm from "../components/DynamicForm/DynamicForm";
import { useDynamicFormContext } from "@/context/DynamicFormContext";



export default function Home() {
  const { dynamicForm, setDynamicForm } = useDynamicFormContext();
  const [prompt, setPrompt] = useState("");

  const handleClick = async () => {
    const formJSON = await generateForm(prompt);
    formJSON && setDynamicForm(formJSON);
  };

  const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPrompt(event.target.value);
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <input type="text" value={prompt} onChange={handleOnChange}></input>
      <button onClick={handleClick}> click me</button>
      {dynamicForm && <DynamicForm />}
    </div>
  );
}
