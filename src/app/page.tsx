"use client";

import { ChangeEvent, useEffect, useState } from "react";
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
      {dynamicForm.elements.length == 0 && (
        <input type="text" value={prompt} onChange={handleOnChange}></input>
      )}
      {dynamicForm.elements.length == 0 && (
        <button
          onClick={handleClick}
          className="px-5 py-2.5 rounded-full text-white text-sm tracking-wider font-medium border border-current outline-none bg-purple-700 hover:bg-purple-800 active:bg-purple-700"
        >
          generate form
        </button>
      )}
      {dynamicForm && <DynamicForm />}
    </div>
  );
}
