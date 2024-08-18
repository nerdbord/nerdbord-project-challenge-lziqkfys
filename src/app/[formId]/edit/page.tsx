"use client";
import { getFormDataByFormID } from "@/app/db";
import EditForm from "@/components/EditForm/EditForm";
import Spinner from "@/components/icons/Spinner";
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
  const { userId, isSignedIn } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

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
    setLoading(true)
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
    <div className="grid grid-cols-1">
      <EditForm formId={formID} />
    </div>
  );
};

export default EditPage;
