"use client";

import { ChangeEvent, useState } from "react";
import generateForm from "../ai/generateForm";
import DynamicForm from "../components/DynamicForm/DynamicForm";
import { useDynamicFormContext } from "@/context/DynamicFormContext";
import { redirect } from "next/dist/server/api-utils";
import { dataBase, insertFormData } from "./db";
import { useRouter } from "next/router";
import { error } from "console";
import UserFormsList from "@/components/UserFormsList/UserFormsList";

export default function Home() {
  const { dynamicForm, setDynamicForm } = useDynamicFormContext();
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    try {
      const formJSON = await generateForm(prompt);
      if (!formJSON) {
        throw new Error("Couldn't generate a form.");
      }
      await insertFormData(formJSON);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPrompt(event.target.value);
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <input type="text" value={prompt} onChange={handleOnChange}></input>

      <button
        onClick={handleClick}
        className={`px-5 py-2.5 rounded-full text-white text-sm tracking-wider font-medium border border-current outline-none bg-purple-700 hover:bg-purple-800 active:bg-purple-700 ${
          isLoading ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={isLoading}
      >
        {isLoading ? "Loading..." : "Generate Form"}
      </button>
      <UserFormsList />
    </div>
  );
}
