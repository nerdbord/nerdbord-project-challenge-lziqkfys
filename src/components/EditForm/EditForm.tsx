import { useFieldArray, useForm } from "react-hook-form";
import {
  FormElementType,
  formElementVariants,
  FormType,
  generateSchema,
} from "@/types/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDynamicFormContext } from "@/context/DynamicFormContext";
import { ChangeEvent, useState } from "react";
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

  // const data = await db.select().from(forms);

  const { handleSubmit } = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues: dynamicForm as FormType,
  });

  const onSubmit = async (data: any) => {
    // try {
    //   const response = await fetch("https://submit-form.com/YKEFWFXpa", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify(data),
    //     //mode: "no-cors"
    //   });
    //   if (response.ok) {
    //     alert("Form submitted successfully!");
    //   } else {
    //     alert("Failed to submit the form.");
    //   }
    // } catch (error) {
    //   console.error("Error:", error);
    //   alert("An error occurred while submitting the form.");
    // }
  };

  const handleEdit = (updatedElement: FormType["formData"][number]) => {
    const updatedElements = dynamicForm.formData.map((el) =>
      el.fieldName === selectedElement?.fieldName ? updatedElement : el
    );
    setDynamicForm({ ...dynamicForm, formData: updatedElements });
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

  const handleRemoveElement = () => {
    if (!selectedElement) return;

    const updatedElements = dynamicForm.formData.filter((el) => {
      return el.fieldName !== selectedElement.fieldName;
    });
    setDynamicForm({ ...dynamicForm, formData: updatedElements });
    setIsModalOpen(false);
  };

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

    const updatedElements = [...dynamicForm.formData, newElement];

    setDynamicForm({ ...dynamicForm, formData: updatedElements });
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

      <Table>
        <TableCaption>Form {dynamicForm.formId}</TableCaption>
        <TableBody>
          <TableRow className="border">
            <TableCell className="font-medium">
              <div className="flex flex-col">
                Form name
                <Input
                  type="text"
                  placeholder="Please enter your form name."
                  value={formName}
                  onChange={handleFormName}
                />
              </div>
            </TableCell>
            <TableCell>
              <div className="flex flex-col">
                Webhook URL
                <Input
                  type="text"
                  placeholder="Please enter endpoint URL"
                  className="mt-1 p-2 border rounded-md"
                  value={endpointURL}
                  onChange={handleEndpointUrl}
                />
              </div>
            </TableCell>
          </TableRow>
          {dynamicForm.formData.map((element, i) => {
            return (
              <TableRow key={i} className="border">
                <TableCell className="w-full">
                  <div className="flex flex-row justify-between">
                    <div className="flex flex-col">
                      Field Name
                      <Input placeholder={element.fieldName} />
                    </div>
                    <div className="flex flex-col">
                      Field type
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          {element.type}
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          {formElementVariants.map((typeVariant) => {
                            return (
                              <DropdownMenuItem
                                key={typeVariant}
                                onClick={() => {
                                  console.log("AHsdjahsdjhasjdhj", typeVariant);
                                  
                                  handleEdit(element);
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
                      Field label
                      <Input placeholder={element.label} />
                    </div>
                    <div>
                      Is required?
                      <Input type="checkbox" placeholder={element.type} />
                    </div>
                  </div>
                  {element.type === "select" && (
                    <div className="flex flex-row justify-between">
                      <div className="flex flex-col">
                        Field label
                        <Input placeholder={element.label} />
                      </div>
                      <div>
                        Is required?
                        <Input type="checkbox" placeholder={element.type} />
                      </div>
                    </div>
                  )}
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {/* <div className="flex flex-row mt-16">
        <input
          type="text"
          placeholder="Please enter endpoint URL."
          className="mt-1 p-2 border rounded-md"
          value={endpointURL}
          onChange={handleEndpointUrl}
        />
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {dynamicForm.formData.map((element: FormElementType, i) => (
          <div key={i} className="flex flex-col">
            <div className="flex flex-row justify-between">
              <label className="font-medium text-gray-700">
                {element.label}{" "}
                {element.required && <span className="text-red-500">*</span>}
              </label>
              <button
                type="button"
                onClick={() => {
                  handleEdit(element);
                }}
              >
                edit
              </button>
            </div>
            {element.type === "select" && element.options ? (
              <select className="mt-1 p-2 border rounded-md">
                {element.options.map((option, idx) => (
                  <option key={idx} value={option.option}>
                    {option.option}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={element.type}
                placeholder={element.placeholder || undefined}
                className="mt-1 p-2 border rounded-md"
              />
            )}
          </div>
        ))}
      </form>

      {
        <button
          type="button"
          className="px-5 py-2.5 rounded-full text-white text-sm tracking-wider font-medium border border-current outline-none bg-green-700 hover:bg-green-800 active:bg-green-700"
          onClick={handleAddElement}
        >
          Add element
        </button>
      }

      {dynamicForm.formData.length > 0 && (
        <button
          type="button"
          onClick={handleSaveForm}
          className="px-5 py-2.5 rounded-full text-white text-sm tracking-wider font-medium border border-current outline-none bg-green-700 hover:bg-green-800 active:bg-green-700"
        >
          Save form
        </button>
      )}

      {selectedElement && (
        <EditModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveElement}
          onRemove={handleRemoveElement}
          initialData={selectedElement}
        />
      )} */}
    </div>
  );
};

export default EditForm;
