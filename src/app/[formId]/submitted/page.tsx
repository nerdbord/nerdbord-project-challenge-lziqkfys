"use client";
import generateForm from "@/ai/generateForm";
import { getFormDataByFormID, insertFormData } from "@/app/db";
import EditForm from "@/components/EditForm/EditForm";
import Spinner from "@/components/icons/Spinner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useDynamicFormContext } from "@/context/DynamicFormContext";
import { FormType } from "@/types/types";
import { useAuth, useClerk } from "@clerk/nextjs";
import { isNull } from "drizzle-orm";
import { redirect } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";

interface FormIdPageProps {
  params: {
    formId: string;
  };
}

const SubmittedPage = ({ params }: FormIdPageProps) => {
  const { dynamicForm, setDynamicForm } = useDynamicFormContext();
  const formID = params.formId;
  const { userId, isSignedIn } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

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

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const form = await getFormDataByFormID(formID);
        if (form[0].userId && userId !== form[0].userId.toString()) {
          setError(
            new Error(
              "You're trying to edit a form which does not belong to you."
            )
          );
          setLoading(false);
          return;
        }
        setDynamicForm(form[0] as FormType);
        setLoading(false);
      } catch (err) {
        setError(err as Error);
        setLoading(false);
      }
    };
    setLoading(true);
    fetchFormData();
  }, [userId, formID]);

  if (loading) {
    return (
      <div className="text-center my-20">
        <Spinner />
        <h1 className=" mt-5 text-4xl font-extrabold">Loading...</h1>
      </div>
    );
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="text-center my-20">
      <h1 className=" mt-5 text-4xl font-extrabold">Dziękujemy za wypełnienie ankiety!</h1>
      <h2 className="mt-4 text-xl font-semibold mb-16">
        Teraz stwórz swoją własną!
      </h2>
      <div className="flex flex-col w-full items-center justify-between ">
        <Textarea
          className="resize-none max-w-screen-sm mb-10"
          placeholder="Przykład prompta: Jako organizator spotkania chcę dowiedzieć się kto przyjdzie, kto będzie pił alkohol, kto nie je mięsa."
          value={prompt}
          onChange={handleOnChange}
          rows={2}
        />

        <Button
          type="submit"
          onClick={handleClick}
          className="px-4 w-[166px]"
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Wygeneruj"}
        </Button>
      </div>
    </div>
  );
};

export default SubmittedPage;
