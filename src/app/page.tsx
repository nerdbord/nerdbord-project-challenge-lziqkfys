"use client";

import { ChangeEvent, useState } from "react";
import generateForm from "../ai/generateForm";
import { useDynamicFormContext } from "@/context/DynamicFormContext";
import { insertFormData } from "./db";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

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

  const handleOnChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(event.target.value);
  };

  return (
    <main className="flex flex-col items-center justify-center px-[348px] pt-[138px] pb-[130px]">
      <section className="flex flex-col items-start justify-center max-w-[743px]">
        <h1 className="text-5xl font-extrabold mb-10">
          Twórz formularze z pomocą prostego polecenia!
        </h1>
        <h3 className="text-2xl leading-8 font-semibold text-[#6B7280] mb-6">
          Napisz, co Twój formularz ma zawierać.
        </h3>
        <div className="flex w-full items-center justify-between gap-16">
          <Textarea
            className="resize-none"
            placeholder="Przykład prompta: Jako organizator spotkania chcę dowiedzieć się kto przyjdzie, kto będzie pił alkohol, kto nie je mięsa."
            value={prompt}
            onChange={handleOnChange}
            rows={2}
          />

          <Button
            type="submit"
            onClick={handleClick}
            className="px-4 py-2 w-[166px]"
            // className={`px-5 py-2.5 rounded-full text-white text-sm tracking-wider font-medium border border-current outline-none bg-purple-700 hover:bg-purple-800 active:bg-purple-700 ${
            //   isLoading ? "opacity-50 cursor-not-allowed" : ""
            // }`}
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Wygeneruj"}
          </Button>
        </div>
      </section>
    </main>
  );
}
