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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
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

interface EditFormProps {
  formId: string;
}

const EditForm = (props: EditFormProps) => {
  const { dynamicForm, setDynamicForm } = useDynamicFormContext();
  const initialForm: FormType = JSON.parse(JSON.stringify(dynamicForm));

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedElement, setSelectedElement] = useState<
    FormType["formData"][number] | null
  >(null);

  const formSchema = generateSchema(dynamicForm);

  const { isLoaded, userId, sessionId, isSignedIn } = useAuth();
  const { openSignIn } = useClerk();

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
    console.log("DYNADYNADYNADYNA", dynamicForm);
    console.log("DATADATADATADATA", data);
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

  // const handleEdit = (chosenElement: FormType["formData"][number]) => {
  //   setSelectedElement(chosenElement);
  // };

  // const handleSaveForm = async () => {
  //   if (!isSignedIn) {
  //     openSignIn();
  //   }
  //   if (userId && endpointURL && formName) {
  //     try {
  //       await updateFormDataWithNewUserID(
  //         dynamicForm.formData,
  //         userId,
  //         props.formId,
  //         endpointURL,
  //         formName
  //       );
  //     } catch (error) {
  //       console.error("Failed to update form data:", error);
  //     }
  //   }
  // };
  // const handleSaveElement = (updatedElement: FormType["formData"][number]) => {
  //   const updatedElements = dynamicForm.formData.map((el) =>
  //     el.fieldName === selectedElement?.fieldName ? updatedElement : el
  //   );
  //   setDynamicForm({ ...dynamicForm, formData: updatedElements });
  // };
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
  // const handleRemoveElement = () => {
  //   if (!selectedElement) return;

  //   const updatedElements = dynamicForm.formData.filter((el) => {
  //     return el.fieldName !== selectedElement.fieldName;
  //   });
  //   setDynamicForm({ ...dynamicForm, formData: updatedElements });
  //   setIsModalOpen(false);
  // };

  return (
    <div className="justify-self-center w-full max-w-4xl">
      <h1 className="mb-16">Edytujesz formularz "{dynamicForm.formName}"</h1>

      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Table>
            <TableCaption>Form {dynamicForm.formId}</TableCaption>
            <TableBody>
              <TableRow className="border">
                <TableCell className="font-medium">
                  <FormField
                    control={control}
                    name="formName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Form Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder=""
                            {...field}
                            value={field.value || undefined}
                          />
                        </FormControl>
                        <FormDescription>This is Form Name</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TableCell>
                <TableCell>
                  <FormField
                    control={control}
                    name="webhookUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Webhook URL</FormLabel>
                        <FormControl>
                          <Input
                            placeholder=""
                            {...field}
                            value={field.value || undefined}
                          />
                        </FormControl>
                        <FormDescription>This is WEBHOOK URL</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TableCell>
              </TableRow>
              {fields.map((thisField, i) => (
                <TableRow className="border">
                  {
                    <div className="grid grid-cols-2">
                      <TableCell>
                        <FormField
                          control={control}
                          name={`formData.${i}.fieldName`}
                          render={({ field }) => (
                            <FormItem>
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
                                  {formElementVariants.map((variant, i) => (
                                    <SelectItem value={variant}>
                                      {variant}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormItem>
                          )}
                        />
                      </TableCell>
                      <TableCell>
                        <div>
                          <FormField
                            control={control}
                            name={`formData.${i}.label`}
                            render={({ field }) => (
                              <FormItem>
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
                              <FormItem>
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onChange={field.onChange}
                                  />
                                </FormControl>
                                <FormLabel className="ml-2">
                                  Field required?
                                </FormLabel>
                              </FormItem>
                            )}
                          />
                        </div>
                        {watch(`formData.${i}.type`) === "select" && (
                          <FormField
                            control={control}
                            name={`formData.${i}.options`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input
                                  {...field}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        )}
                      </TableCell>
                    </div>
                  }
                </TableRow>
              ))}

              {/* <TableRow>
                <FormField
                  control={control}
                  name="formData"
                  render={({ field }) => (
                    <TableCell>
                      {field.value.map((formElement, i) => {
                        return (
                          <FormItem key={i}>
                            <FormLabel>{formElement.fieldName}</FormLabel>
                            <FormControl>
                              <Input
                                placeholder=""
                                {...field}
                                value={formElement.fieldName || undefined}
                              />
                            </FormControl>
                          </FormItem>
                        );
                      })}
                    </TableCell>
                  )}
                />
              </TableRow> */}
            </TableBody>
          </Table>
          <Button
            type="submit"
            onClick={() => {
              console.log(errors);
            }}
          >
            SAVE FORM
          </Button>
          <Button
            onClick={() => {
              handleAddElement();
            }}
          >
            ADD
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default EditForm;

// <div className="justify-self-center w-full max-w-4xl">
// <h1 className="mb-16">Edytujesz formularz "{dynamicForm.formName}"</h1>
// <form onSubmit={handleSubmit(onSubmit)} noValidate>
//   <Table>
//     <TableCaption>Form {dynamicForm.formId}</TableCaption>
//     <TableBody>
//       <TableRow className="border">
//         <TableCell className="font-medium">
//           <div className="flex flex-col">
//             Form name
//             <Input
//               type="text"
//               {...register("formName")}
//               placeholder="Please enter your form name."
//               value={watch("formName") || ""}
//             />
//             {errors.formName && (
//               <span className="text-red-600">
//                 {errors.formName.message}
//               </span>
//             )}
//           </div>
//         </TableCell>
//         <TableCell>
//           <div className="flex flex-col">
//             Webhook URL
//             <Input
//               type="url"
//               {...register("webhookUrl")}
//               placeholder="Please enter endpoint URL"
//               value={watch("webhookUrl") || ""}
//             />
//             {errors.webhookUrl && (
//               <span className="text-red-600">
//                 {errors.webhookUrl.message}
//               </span>
//             )}
//           </div>
//         </TableCell>
//       </TableRow>
//       {fields.map((field, i) => {
//         return (
//           <TableRow key={i} className="border">
//             <TableCell>
//               <div className="flex flex-row justify-between my-4">
//                 <div className="flex flex-col">
//                   <Label className="mb-2">Field Name</Label>
//                   <Input
//                     type="text"
//                     placeholder="Field element name"
//                     {...register(`formData.${i}.fieldName`)}
//                     // onChange={(e) => {
//                     //   handleFieldChange(i, "fieldName", e.target.value);
//                     // }}
//                     value={watch(`formData.${i}.fieldName`)}
//                   />
//                   {errors.formData?.[i]?.fieldName && (
//                     <span className="text-red-600">
//                       {errors.formData[i].fieldName?.message}
//                     </span>
//                   )}
//                 </div>
//                 <div className="flex flex-col">
//                   <Label className="mb-2">Field type</Label>
//                   {/* <DropdownMenu>
//                     <DropdownMenuTrigger>
//                       <Button variant="outline">
//                         {watch(`formData.${i}.type`)}
//                       </Button>
//                     </DropdownMenuTrigger>
//                     <DropdownMenuContent>
//                       {formElementVariants.map((typeVariant) => {
//                         return (
//                           <DropdownMenuItem
//                             key={typeVariant}
//                             onClick={() => {
//                               handleFieldChange(i, "type", typeVariant);
//                             }}
//                           >
//                             {typeVariant}
//                           </DropdownMenuItem>
//                         );
//                       })}
//                     </DropdownMenuContent>
//                   </DropdownMenu> */}
//                   <Select>
//                     <SelectTrigger className="w-[180px]">
//                       <Button variant="outline">
//                         <SelectValue
//                           placeholder={watch(`formData.${i}.type`)}
//                         />
//                       </Button>
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectGroup>
//                         <SelectLabel>Form element types</SelectLabel>
//                         {formElementVariants.map((typeVariant) => {
//                           return (
//                             <SelectItem value={typeVariant}>
//                               {typeVariant}
//                             </SelectItem>
//                           );
//                         })}
//                       </SelectGroup>
//                     </SelectContent>
//                   </Select>
//                 </div>
//               </div>
//               <div className="flex flex-row justify-between">
//                 <div className="flex flex-col">
//                   <Label className="mb-2">Field label</Label>
//                   <Input
//                     placeholder="Field element label"
//                     value={watch(`formData.${i}.label`)}
//                     {...register(`formData.${i}.label`)}
//                   />
//                 </div>
//                 <div className="flex flex-col items-center">
//                   <Label className="mb-4">Is required?</Label>
//                   <Checkbox
//                     checked={watch(`formData.${i}.required`)}
//                   ></Checkbox>
//                 </div>
//               </div>
//             </TableCell>
//             <TableCell></TableCell>
//           </TableRow>
//         );
//       })}
//     </TableBody>
//   </Table>
//   <Button
//     type="submit"
//     onClick={() => {
//       console.log(errors);
//     }}
//   >
//     SAVE FORM
//   </Button>
//   <Button
//     onClick={() => {
//       handleAddElement();
//     }}
//   >
//     ADD
//   </Button>
// </form>
// </div>
