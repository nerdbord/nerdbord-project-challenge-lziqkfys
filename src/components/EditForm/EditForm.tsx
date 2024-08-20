"use client";
import { useFieldArray, useForm } from "react-hook-form";
import {
  FormElementType,
  formElementVariants,
  FormSchema,
  FormType,
} from "@/types/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDynamicFormContext } from "@/context/DynamicFormContext";
import { useState } from "react";
import { useRouter } from "next/navigation";
import generateUniqueId from "generate-unique-id";
import { useAuth, useClerk } from "@clerk/nextjs";
import { updateFormDataWithNewUserID } from "@/app/db";
import { Table, TableBody, TableCell, TableRow } from "../ui/table";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import OptionsFieldArray from "./OptionsFieldArray";
import TrashIcon from "../icons/TrashIcon";
import React from "react";
import ArrowIconLeft from "../icons/ArrowIconLeft";
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
} from "../ui/alert-dialog";
import PlusCircleIcon from "../icons/PlusCircleIcon";
import Spinner from "../icons/Spinner";

interface EditFormProps {
  formId: string;
}

const EditForm = (props: EditFormProps) => {
  const { dynamicForm, setDynamicForm } = useDynamicFormContext();
  const [isLoading, setIsLoading] = useState(false);
  const { userId, isSignedIn } = useAuth();
  const { openSignIn } = useClerk();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const form = useForm<FormType>({
    resolver: zodResolver(FormSchema),
    defaultValues: dynamicForm,
  });

  const {
    register,
    handleSubmit,
    reset,
    watch,
    control,
    setError,
    formState: { errors },
  } = form;

  const onSubmit = (data: FormType) => {
    setIsLoading(true);
    const handleSaveDataToServer = async () => {
      if (!isSignedIn) {
        openSignIn();
      }
      if (userId && data.webhookUrl && data.formName) {
        try {
          await updateFormDataWithNewUserID(
            data.formData,
            userId,
            props.formId,
            data.webhookUrl,
            data.formName
          );
          setIsModalOpen(true);
        } catch (error) {
          console.error("Failed to update form data:", error);
        }
      }
      setIsLoading(false);
    };

    handleSaveDataToServer();
  };
  const handleCopyLink = () => {
    const linkToCopy = `${window.location.origin}/forms/${props.formId}`;
    navigator.clipboard.writeText(linkToCopy).then(() => {
      alert("Link został skopiowany!");
    });
  };

  const handleExit = () => {
    router.push("/forms"); // Przekierowanie do zapisanych formularzy
  };

  const { fields, remove, insert } = useFieldArray<FormType>({
    control,
    name: "formData",
    rules: { minLength: 1 },
  });

  const handleAddElement = () => {
    const newElementName = generateUniqueId({
      length: 10,
      includeSymbols: ["@", "#"],
    });
    const newElement: FormElementType = {
      fieldName: newElementName,
      type: "text",
      label: "Element label",
      placeholder: "Element placeholder",
      required: false,
      options: [{ option: "" }],
    };

    insert(fields.length + 1, newElement);
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="justify-self-center w-full max-w-4xl">
      <h1 className="pt-8 mb-16 text-4xl text-center font-extrabold">
        <Button variant="outline" className="m-5">
          <a href="/forms">
            <ArrowIconLeft />
          </a>
        </Button>
        Edytujesz formularz &quot;{dynamicForm.formName}&quot;
      </h1>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Table>
            <TableBody>
              <TableRow className="border">
                <TableCell className="font-medium pt-8 pl-11">
                  <FormField
                    control={control}
                    name="formName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xl pb-4">
                          Form Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder=""
                            {...field}
                            value={field.value || undefined}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TableCell>
                <TableCell className="font-medium pt-8 pr-11">
                  <FormField
                    control={control}
                    name="webhookUrl"
                    render={({ field }) => (
                      <FormItem>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger type="button">
                              <FormLabel className="text-xl">
                                Webhook URL
                              </FormLabel>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>
                                Webhook URL służy do automatycznego przesyłania
                                danych formularza do wskazanego adresu URL.
                                Dowiedz się więcej na&nbsp;
                                <a
                                  href="https://www.formspark.io/"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="underline text-blue-500"
                                >
                                  Formspark
                                </a>
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <FormControl>
                          <Input
                            placeholder=""
                            {...field}
                            value={field.value || undefined}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TableCell>
              </TableRow>
              {fields.map((thisField, i) => (
                <React.Fragment key={thisField.id}>
                  {" "}
                  {/* Zmieniono z `i` na `thisField.id` */}
                  <AlertDialog>
                    <TableRow
                      className={`border-l border-r border-t ${
                        watch(`formData.${i}.type`) === "select" && "border-b-0"
                      }`}
                    >
                      <TableCell className="w-1/2 align-top pt-8 pl-11">
                        <h1 className="text-xl mb-8">{i + 1}.</h1>
                        <FormField
                          control={control}
                          name={`formData.${i}.fieldName`}
                          render={({ field }) => (
                            <FormItem className="mb-8">
                              <FormLabel>Field element name</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder=""
                                  {...field}
                                  value={field.value}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={control}
                          name={`formData.${i}.type`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Field element type</FormLabel>
                              <Select
                                value={field.value}
                                onValueChange={field.onChange}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Form element type.">
                                      {field.value}
                                    </SelectValue>
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {formElementVariants.map(
                                    (variant, variantIndex) => (
                                      <SelectItem
                                        value={variant}
                                        key={variantIndex}
                                      >
                                        {variant}
                                      </SelectItem>
                                    )
                                  )}
                                </SelectContent>
                              </Select>
                            </FormItem>
                          )}
                        />
                      </TableCell>
                      <TableCell className="w-1/2 align-top pt-8 pr-11">
                        <div className="flex flex-row justify-end mb-8 pr-11">
                          <AlertDialogTrigger>
                            <div className="cursor-pointer mt-1">
                              <TrashIcon />
                            </div>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Are you absolutely sure?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                This will remove the form field.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-red-500 hover:bg-red-300"
                                onClick={() => remove(i)}
                              >
                                Continue
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </div>
                        <FormField
                          control={control}
                          name={`formData.${i}.label`}
                          render={({ field }) => (
                            <FormItem className=" mb-8 pr-11">
                              <FormLabel>Field label</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder=""
                                  {...field}
                                  value={field.value}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={control}
                          name={`formData.${i}.required`}
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <FormLabel className="mb-2">
                                Field required?
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="checkbox"
                                  className="accent-black"
                                  checked={field.value}
                                  onChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </TableCell>
                    </TableRow>
                    {watch(`formData.${i}.type`) === "select" && (
                      <TableRow className="border-l border-r border-b">
                        <TableCell colSpan={2}>
                          <OptionsFieldArray control={control} index={i} />
                        </TableCell>
                      </TableRow>
                    )}
                  </AlertDialog>
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
          <div className="flex flex-col items-center">
            <div
              className="m-5 cursor-pointer"
              onClick={() => {
                handleAddElement();
              }}
            >
              <PlusCircleIcon />
            </div>
            <Button
              className="m-5"
              disabled={isLoading}
              type="submit"
              onClick={() => {
                console.log(errors);
              }}
            >
              SAVE FORM
            </Button>
          </div>
        </form>
      </Form>
      {/* Modal który pojawi się po zapisaniu formularza */}
      {isModalOpen && (
        <AlertDialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <AlertDialogContent>
            <div className="flex justify-between items-center font-semibold">
              <AlertDialogTitle>
                Twój formularz został zapisany!
              </AlertDialogTitle>
              <button onClick={() => setIsModalOpen(false)} className="text-xl">
                &times; {/* Ikona krzyżyka */}
              </button>
            </div>
            <AlertDialogDescription>
              Jeśli chcesz go udostępnić, skopiuj poniższy link.
              <div className="mt-4">
                <Input
                  readOnly
                  value={`${window.location.origin}/forms/${props.formId}`} // Link do skopiowania
                />
              </div>
            </AlertDialogDescription>

            <AlertDialogFooter className="flex justify-between">
              <Button variant="outline" onClick={handleExit}>
                Wyjdź
              </Button>
              <Button type="button" onClick={handleCopyLink}>
                Skopiuj link
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
};

export default EditForm;
