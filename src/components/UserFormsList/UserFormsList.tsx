"use client";

import { getFormsByUserID } from "@/app/db";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Form {
  formId: string;
  formName: string | null;
  createdAt: Date | null;
}

const UserFormsList = () => {
  const { userId } = useAuth();
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchForms = async () => {
      try {
        if (userId) {
          const userForms = await getFormsByUserID(userId);
          setForms(userForms);
        }
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };
    fetchForms();
  }, [userId]);

  if (loading) {
    return <div>Loading your forms</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (forms.length === 0) {
    return <div>No forms found.</div>;
  }

  return (
    <div>
      <h2>Your forms</h2>
      <ul>
        {forms.map((form) => (
          <li key={form.formId} className="mb-4">
            <Link href={`/${form.formId}/edit`}>
              {form.formName || "Untitled form"}
              {new Date(form.createdAt).toLocaleDateString()}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserFormsList;
