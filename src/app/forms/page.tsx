"use client";
import { FormType } from "@/types/types";
import { useAuth, useClerk } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import {
  deleteFormByFormID,
  getFormDataByFormID,
  getFormsByUserID,
} from "../db";
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

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { redirect } from "next/navigation";
import PencilIcon from "@/components/icons/PencilIcon";
import TrashIcon from "@/components/icons/TrashIcon";
import ShareIcon from "@/components/icons/ShareIcon";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";

const FormsPage = () => {
  const { userId, isSignedIn } = useAuth();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [trashColour, setTrashColour] = useState(false);
  const [formsList, setFormsList] = useState<FormType[]>();
  // Przechowywanie ID formularza do usunięcia:
  const [selectedFormId, setSelectedFormId] = useState<string | null>(null);
  // Nowy stan:
  const [selectedFormName, setSelectedFormName] = useState<string | null>(null);

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
  }, [userId, deleteModal, isSignedIn]);

  // const handleDelete = (formID: string) => {
  //   setDeleteModal((prev) => !prev);
  //   deleteFormByFormID(formID);
  // };

  const handleDelete = async () => {
    if (selectedFormId) {
      await deleteFormByFormID(selectedFormId);
      setFormsList((prevForms) =>
        prevForms?.filter((form) => form.formId !== selectedFormId)
      );
      setSelectedFormId(null);
      setSelectedFormName(null); // Resetuj po usunięciu
    }
    setDeleteModal(false);
  };

  const handleCopyUrl = (formID: string) => {
    const copyUrl = `formatrix.com/${formID}`;
    navigator.clipboard.writeText(copyUrl);
    toast({
      title: "URL copied to clipboard.",
      description: copyUrl,
    });
  };

  return (
    <div className="p-16">
      <h1 className=" font-extrabold text-5xl mb-6 py-7">
        Zapisane formularze
      </h1>
      <AlertDialog>
        <Table>
          <TableCaption>Forms of {userId}</TableCaption>
          <TableBody className="border">
            {formsList?.map((form, i) => {
              return (
                <TableRow key={i}>
                  <TableCell className="font-medium hover:font-bold">
                    <a href={`/${form.formId}`}>{form.formName}</a>
                  </TableCell>
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
                      <div className="flex justify-center cursor-pointer">
                        <AlertDialogTrigger asChild>
                          <div
                            onClick={() => {
                              setSelectedFormId(form.formId);
                              setSelectedFormName(form.formName); // Ustaw nazwę formularza
                              setDeleteModal(true);
                            }}
                          >
                            <TrashIcon />
                          </div>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Delete{" "}
                              {selectedFormName
                                ? `form "${selectedFormName}"`
                                : "unnamed form"}
                              ?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will
                              permanently delete this form.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel
                              onClick={() => {
                                setDeleteModal(false);
                              }}
                            >
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              onClick={() => {
                                handleDelete();
                              }}
                            >
                              Continue
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </div>
                    }
                  </TableCell>
                  <TableCell>
                    {
                      <button
                        className="flex justify-start"
                        onClick={() => handleCopyUrl(form.formId)}
                      >
                        <ShareIcon />
                      </button>
                    }
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </AlertDialog>
    </div>
  );
};

export default FormsPage;
