"use client";

import { getFormDataByFormID } from "../db";
import { FormType } from "@/types/types";
import DisplayForm from "@/components/DisplayForm/DisplayForm";
import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useDynamicFormContext } from "@/context/DynamicFormContext";
import Spinner from "@/components/icons/Spinner";

interface FormIdPageProps {
  params: {
    formId: string;
  };
}

const FormIdPage = ({ params }: FormIdPageProps) => {
  const formID = params.formId;
  const { userId } = useAuth();
  const { dynamicForm, setDynamicForm } = useDynamicFormContext();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const fetchedFormData = await getFormDataByFormID(formID);
        if (!fetchedFormData || fetchedFormData.length === 0) {
          setError(new Error("Form not found"));
          setLoading(false);
          return;
        }

        const formDetails = fetchedFormData[0];

        setDynamicForm(formDetails as FormType);
        setLoading(false);
      } catch (err) {
        setError(err as Error);
        setLoading(false);
      }
    };

    fetchFormData();
  }, [formID]);

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

  return <DisplayForm formId={formID} />;
};

export default FormIdPage;
