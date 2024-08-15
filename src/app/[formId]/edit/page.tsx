"use client";
import { getFormDataByFormID } from "@/app/db";
import DynamicForm from "@/components/DynamicForm/DynamicForm";
import { useDynamicFormContext } from "@/context/DynamicFormContext";
import { FormType } from "@/types/types";
import { useAuth, useClerk } from "@clerk/nextjs";
import { isNull } from "drizzle-orm";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

interface FormIdPageProps {
  params: {
    formId: string;
  };
}

const EditPage = ({ params }: FormIdPageProps) => {
  const { dynamicForm, setDynamicForm } = useDynamicFormContext();
  const formID = params.formId;
  const {userId, isSignedIn} = useAuth()
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const formData = await getFormDataByFormID(formID);       
        if (formData[0].userId && userId !== formData[0].userId.toString()) {
            
            setError(new Error("You're trying to edit a form which does not belong to you."))
            setLoading(false)
            return;
        }
        setDynamicForm(formData[0].formData as FormType);
        setLoading(false);
      } catch (err) {
        setError(err as Error);
        setLoading(false);
      }
    };

    fetchFormData();
  }, [userId, formID]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return <div>{dynamicForm && <DynamicForm formId={formID} />}</div>;
};

export default EditPage;
