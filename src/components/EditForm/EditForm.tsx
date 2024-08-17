"use client";

import {
  useFieldArray,
  useForm,
  Controller,
  FieldElement,
} from "react-hook-form";
import {
  FormElementSchema,
  FormElementType,
  formElementVariants,
  FormSchema,
  FormType,
  generateSchema,
} from "@/types/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDynamicFormContext } from "@/context/DynamicFormContext";
import { ChangeEvent, useEffect, useState } from "react";
import EditModal from "../DynamicForm/EditModal";
import generateUniqueId from "generate-unique-id";
import { auth, clerkClient, clerkMiddleware } from "@clerk/nextjs/server";
import { useAuth, useClerk } from "@clerk/nextjs";
import { redirect } from "next/dist/server/api-utils";
import { table } from "console";
import { forms } from "@/app/db/schema";
import { updateFormDataWithNewUserID } from "@/app/db";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Input } from "../ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";

interface EditFormProps {
  formId: string;
}

const EditForm = (props: EditFormProps) => {
  const { dynamicForm, setDynamicForm } = useDynamicFormContext();
  const [endpointURL, setEndpointURL] = useState<string>(
    dynamicForm.webhookUrl ? dynamicForm.webhookUrl : ""
  );
  const [formName, setFormName] = useState<string>(
    dynamicForm.formName ? dynamicForm.formName : ""
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedElement, setSelectedElement] = useState<
    FormType["formData"][number] | null
  >(null);

  const formSchema = generateSchema(dynamicForm);

  const { isLoaded, userId, sessionId, isSignedIn } = useAuth();
  const { openSignIn } = useClerk();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    control,
    setError,
    formState: { errors },
  } = useForm<FormType>({
    resolver: zodResolver(FormSchema),
    defaultValues: dynamicForm,
  });

  const onSubmit = (data: any) => {    
    console.log("ASDASDASD");
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

  const handleEdit = (chosenElement: FormType["formData"][number]) => {
    setSelectedElement(chosenElement);
  };

  const handleSaveForm = async () => {
    if (!isSignedIn) {
      openSignIn();
    }
    if (userId && endpointURL && formName) {
      try {
        await updateFormDataWithNewUserID(
          dynamicForm.formData,
          userId,
          props.formId,
          endpointURL,
          formName
        );
      } catch (error) {
        console.error("Failed to update form data:", error);
      }
    }
  };
  const handleSaveElement = (updatedElement: FormType["formData"][number]) => {
    const updatedElements = dynamicForm.formData.map((el) =>
      el.fieldName === selectedElement?.fieldName ? updatedElement : el
    );
    setDynamicForm({ ...dynamicForm, formData: updatedElements });
  };
  const handleFieldChange = (index: number, field: string, newData: string) => {
    setDynamicForm((prevForm) => {
      const updatedFormData = [...prevForm.formData];
      updatedFormData[index] = {
        ...updatedFormData[index],
        [field]: newData,
      };
      return { ...prevForm, formData: updatedFormData };
    });
  };
  const handleRemoveElement = () => {
    if (!selectedElement) return;

    const updatedElements = dynamicForm.formData.filter((el) => {
      return el.fieldName !== selectedElement.fieldName;
    });
    setDynamicForm({ ...dynamicForm, formData: updatedElements });
    setIsModalOpen(false);
  };
  const handleFormName = (event: ChangeEvent<HTMLInputElement>) => {
    setFormName(event.target.value);
  };
  const handleEndpointUrl = (event: ChangeEvent<HTMLInputElement>) => {
    setEndpointURL(event.target.value);
  };

  return (
    <div className="justify-self-center w-full max-w-4xl">
      <h1 className="mb-16">Edytujesz formularz "{dynamicForm.formName}"</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Table>
          <TableCaption>Form {dynamicForm.formId}</TableCaption>
          <TableBody>
            <TableRow className="border">
              <TableCell className="font-medium">
                <div className="flex flex-col">
                  Form name
                  <Input
                    type="text"
                    {...register("formName")}
                    placeholder="Please enter your form name."
                    value={formName}
                    onChange={handleFormName}
                  />
                  {errors.formName && <span>{errors.formName.message}</span>}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  Webhook URL
                  <Input
                    type="text"
                    {...register("webhookUrl")}
                    placeholder="Please enter endpoint URL"
                    value={endpointURL}
                    onChange={handleEndpointUrl}
                  />
                  {errors.webhookUrl && (
                    <span>{errors.webhookUrl.message}</span>
                  )}
                </div>
              </TableCell>
            </TableRow>
            {fields.map((field, i) => {
              return (
                <TableRow key={i} className="border">
                  <TableCell>
                    <div className="flex flex-row justify-between my-4">
                      <div className="flex flex-col">
                        <Label className="mb-2">Field Name</Label>
                        <Input
                          type="text"
                          placeholder="Field element name"
                          {...register(`formData.${i}.fieldName`)}
                          onChange={(e) => {
                            handleFieldChange(i, "fieldName", e.target.value);
                          }}
                        />
                        {errors.formData?.[i]?.fieldName && (
                          <span className="text-red-500">
                            {errors.formData[i].fieldName?.message}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-col">
                        <Label className="mb-2">Field type</Label>
                        <DropdownMenu>
                          <DropdownMenuTrigger>
                            <Button variant="outline">{field.type}</Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            {formElementVariants.map((typeVariant) => {
                              return (
                                <DropdownMenuItem
                                  key={typeVariant}
                                  onClick={() => {
                                    handleFieldChange(i, "type", typeVariant);
                                  }}
                                >
                                  {typeVariant}
                                </DropdownMenuItem>
                              );
                            })}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                    <div className="flex flex-row justify-between">
                      <div className="flex flex-col">
                        <Label className="mb-2">Field label</Label>
                        <Input
                          placeholder="Field element label"
                          value={field.label}
                          onChange={(e) => {
                            handleFieldChange(i, "label", e.target.value);
                          }}
                        />
                      </div>
                      <div className="flex flex-col items-center">
                        <Label className="mb-4">Is required?</Label>
                        <Checkbox></Checkbox>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell></TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        <Button type="button" onClick={() => {console.log(errors);
        }}>SAVE FORM</Button>
        <Button
          onClick={() => {
            handleAddElement();
          }}
        >
          ADD
        </Button>
      </form>
    </div>
  );
};

export default EditForm;
