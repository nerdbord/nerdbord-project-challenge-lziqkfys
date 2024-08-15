"use client";
import { getFormDataByFormID } from "@/app/db";
import DynamicForm from "@/components/DynamicForm/DynamicForm";
import { useDynamicFormContext } from "@/context/DynamicFormContext";
import { FormType } from "@/types/types";
import { useEffect, useState } from "react";

interface FormIdPageProps {
  params: {
    formId: string;
  };
}

const EditPage = ({ params }: FormIdPageProps) => {
  const { dynamicForm, setDynamicForm } = useDynamicFormContext();
  const formID = params.formId;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const formData = await getFormDataByFormID(formID);
        setDynamicForm(formData[0].formData as FormType);
        setLoading(false);
      } catch (err) {
        setError(err as Error);
        setLoading(false);
      }
    };

    fetchFormData();
  }, [formID, setDynamicForm]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return <div>{dynamicForm && <DynamicForm />}</div>;
};

export default EditPage;
