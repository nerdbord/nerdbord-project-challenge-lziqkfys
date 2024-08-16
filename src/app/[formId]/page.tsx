"use client";

import { getFormDataByFormID } from "../db";
import { FormType } from "@/types/types";
import DisplayForm from "@/components/DisplayForm/DisplayForm";
import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";

interface FormIdPageProps {
  params: {
    formId: string;
  };
}

const FormIdPage = ({ params }: FormIdPageProps) => {

  const formID = params.formId;
  const { userId } = useAuth();
  const [formData, setFormData] = useState<FormType | null>(null)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const fetchedFormData = await getFormDataByFormID(formID);
        if (!fetchedFormData || fetchedFormData.length === 0) {
          setError(new Error("Form not found"));
          setLoading(false);
          return
        }

        const formDetails = fetchedFormData[0]

        if (formDetails.userId && userId !== formDetails.userId) {
          setError(
            new Error(
              "This form does not belong to you."
            )
          );
          setLoading(false);
          return;
        }
        setFormData(formDetails.formData as FormType);
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

  return formData ? <DisplayForm formData={formData} formId={formID} /> : null
};

export default FormIdPage;
