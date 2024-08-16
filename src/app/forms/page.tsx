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
import { redirect } from "next/navigation";
import PencilIcon from "@/components/icons/PencilIcon";
import TrashIcon from "@/components/icons/TrashIcon";
import ShareIcon from "@/components/icons/ShareIcon";

const FormsPage = () => {
  const { userId, isSignedIn } = useAuth();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [formsList, setFormsList] = useState<FormType[]>();

  useEffect(() => {
    if (!isSignedIn) {
      redirect("/");
    }
    const fetchFormData = async () => {
      try {
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
      <h1>Zapisane formularze</h1>
      <Table>
        <TableCaption>Forms of {userId}</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Form</TableHead>
            <TableHead className="text-right">Edit</TableHead>
            <TableHead className="text-center">Delete</TableHead>
            <TableHead className="text-left">Share</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {formsList?.map((form, i) => {
            return (
              <TableRow key={i}>
                <TableCell className="font-medium">{form.formName}</TableCell>
                <TableCell>
                  {
                    <a
                      className="flex justify-end"
                      href={`/${form.formId}/edit`}
                    >
                      <PencilIcon />
                    </a>
                  }
                </TableCell>
                <TableCell>
                  {
                    <a
                      className="flex justify-center"
                      href={`/${form.formId}/edit`}
                    >
                      <TrashIcon />
                    </a>
                  }
                </TableCell>
                <TableCell>
                  {
                    <a className="flex justify-start" href={`/${form.formId}`}>
                      <ShareIcon />
                    </a>
                  }
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default FormsPage;
