"use client";
import { FormType } from "@/types/types";
import { useAuth, useClerk } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { getFormDataByFormID, getFormsByUserID } from "../db";
import { nullable } from "zod";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const FormsPage = () => {
  const { userId, isSignedIn } = useAuth();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [formsList, setFormsList] = useState<FormType[]>();

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        if (!userId) {
          return null;
        }
        const dbFormData = (await getFormsByUserID(userId)) as FormType[];
        setFormsList(dbFormData);
        setLoading(false);
      } catch (err) {
        setError(err as Error);
        setLoading(false);
      }
    };

    fetchFormData();
  }, [userId]);

  return (
    <div>
      <Table>
        <TableCaption>Forms of {userId}</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Form</TableHead>
            <TableHead >Edit</TableHead>
            <TableHead >Delete</TableHead>
            <TableHead >Share</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {formsList?.map((form) => {
            return (
              <TableRow>
                <TableCell className="font-medium">{form.formName}</TableCell>
                <TableCell >{<a href={`/${form.formId}/edit`}>edit</a>}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default FormsPage;
