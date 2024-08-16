"use client";
import { FormType } from "@/types/types";
import { useAuth, useClerk } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { getFormDataByFormID, getFormsByUserID } from "../db";



const FormsPage = () => {
  const {userId, isSignedIn} = useAuth()

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [formsList, setFormsList] = useState<FormType[]>()

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const dbFormData = await getFormsByUserID(userId) as FormType[];
        setFormsList(dbFormData)

        console.log("ASDASDASD",formsList);
        
        setLoading(false);
      } catch (err) {
        setError(err as Error);
        setLoading(false);
      }
    };

    fetchFormData();
  }, [userId]);


  return <div></div>;
};

export default FormsPage;
