import { useFieldArray, useForm } from "react-hook-form";
import { FormElementType, FormType, generateSchema } from "@/types/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDynamicFormContext } from "@/context/DynamicFormContext";
import { ChangeEvent, useState } from "react";
import EditModal from "./EditModal";
import generateUniqueId from "generate-unique-id";
import { useAuth, useClerk } from "@clerk/nextjs";
import { updateFormDataWithNewUserID } from "@/app/db";

interface DynamicFormProps {
  formId: string;
}

const DynamicForm = (props: DynamicFormProps) => {
  const { dynamicForm, setDynamicForm } = useDynamicFormContext();
  const [endpointURL, setEndpointURL] = useState<string>();
  const [formName, setFormName] = useState<string>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedElement, setSelectedElement] = useState<
    FormType["elements"][number] | null
  >(null);
  const formSchema = generateSchema(dynamicForm);

  const { isLoaded, userId, sessionId, isSignedIn } = useAuth();
  const { openSignIn } = useClerk();

  const { handleSubmit } = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues: dynamicForm as FormType,
  });

  const onSubmit = async (data: any) => {
    try {
      const response = await fetch("https://submit-form.com/YKEFWFXpa", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        alert("Form submitted successfully!");
      } else {
        alert("Failed to submit the form.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while submitting the form.");
    }
  };

  const handleEdit = (element: FormType["elements"][number]) => {
    setSelectedElement(element);
    setIsModalOpen(true);
  };

  const handleSaveForm = async () => {
    if (!isSignedIn) {
      openSignIn();
    }
    if (userId && endpointURL && formName) {
      try {
        await updateFormDataWithNewUserID(
          dynamicForm,
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

  const handleSaveElement = (updatedElement: FormType["elements"][number]) => {
    const updatedElements = dynamicForm.elements.map((el) =>
      el.fieldName === selectedElement?.fieldName ? updatedElement : el
    );
    setDynamicForm({ ...dynamicForm, elements: updatedElements });
  };

  const handleRemoveElement = () => {
    if (!selectedElement) return;

    const updatedElements = dynamicForm.elements.filter((el) => {
      return el.fieldName !== selectedElement.fieldName;
    });
    setDynamicForm({ ...dynamicForm, elements: updatedElements });
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

    const updatedElements = [...dynamicForm.elements, newElement];

    setDynamicForm({ ...dynamicForm, elements: updatedElements });
  };

  const handleFormName = (event: ChangeEvent<HTMLInputElement>) => {
    setFormName(event.target.value);
  };

  const handleEndpointUrl = (event: ChangeEvent<HTMLInputElement>) => {
    setEndpointURL(event.target.value);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Form title
          </label>
          <input
            type="text"
            placeholder="Enter form title"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            value={formName}
            onChange={handleFormName}
          />
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {dynamicForm.elements.map((element: FormElementType, i) => (
            <div
              key={i}
              className="p-4 border border-gray-300 rounded-md mb-2 flex items-center"
            >
              <div className="flex-grow">
                <div className="flex items-center mb-2">
                  <span className="mr-2">{i + 1}.</span>
                  <input
                    type="text"
                    className="mr-2 w-full p-2 border border-gray-300 rounded-md"
                    value={element.label}
                    placeholder="Enter your label"
                    onChange={(e) => {
                      const updatedElements = [...dynamicForm.elements];
                      updatedElements[i].label = e.target.value;
                      setDynamicForm({ ...dynamicForm, elements: updatedElements });
                    }}
                  />
                </div>
                <select
                  className="block w-full p-2 border border-gray-300 rounded-md"
                  value={element.type}
                  onChange={(e) => {
                    const updatedElements = [...dynamicForm.elements];
                    updatedElements[i].type = e.target.value as FormElementType["type"];
                    setDynamicForm({ ...dynamicForm, elements: updatedElements });
                  }}
                >
                  <option value="">Choose type</option>
                  <option value="text">Text</option>
                  <option value="select">Select</option>
                </select>
              </div>
              <button
                type="button"
                className="ml-4 text-red-500 hover:text-red-700"
                onClick={() => handleEdit(element)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          ))}
        </form>

        <div className="flex justify-center space-x-4 mt-6">
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleAddElement}
          >
            Add Element
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleSaveForm}
          >
            Save Form
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => alert("Preview not implemented yet")}
          >
            Preview
          </button>
        </div>
      </div>
    </div>
  );
};

export default DynamicForm;


// export default DynamicForm;
// import { useFieldArray, useForm } from "react-hook-form";
// import { FormElementType, FormType, generateSchema } from "@/types/types";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useDynamicFormContext } from "@/context/DynamicFormContext";
// import { ChangeEvent, useState } from "react";
// import EditModal from "./EditModal";
// import generateUniqueId from "generate-unique-id";
// import { auth, clerkClient, clerkMiddleware } from "@clerk/nextjs/server";
// import { useAuth, useClerk } from "@clerk/nextjs";
// import { redirect } from "next/dist/server/api-utils";
// import { table } from "console";
// import { forms } from "@/app/db/schema";
// import { updateFormDataWithNewUserID } from "@/app/db";

// interface DynamicFormProps {
//   formId: string;
// }

// const DynamicForm = (props: DynamicFormProps) => {
//   const { dynamicForm, setDynamicForm } = useDynamicFormContext();
//   const [endpointURL, setEndpointURL] = useState<string>();
//   const [formName, setFormName] = useState<string>();
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedElement, setSelectedElement] = useState<
//     FormType["elements"][number] | null
//   >(null);
//   const formSchema = generateSchema(dynamicForm);

//   const { isLoaded, userId, sessionId, isSignedIn } = useAuth();
//   const { openSignIn } = useClerk();

//   // const data = await db.select().from(forms);

//   const { handleSubmit } = useForm<FormType>({
//     resolver: zodResolver(formSchema),
//     defaultValues: dynamicForm as FormType,
//   });

//   const onSubmit = async (data: any) => {
//     try {
//       const response = await fetch("https://submit-form.com/YKEFWFXpa", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(data),
//         //mode: "no-cors"
//       });
//       if (response.ok) {
//         alert("Form submitted successfully!");
//       } else {
//         alert("Failed to submit the form.");
//       }
//     } catch (error) {
//       console.error("Error:", error);
//       alert("An error occurred while submitting the form.");
//     }
//   };

//   const handleEdit = (element: FormType["elements"][number]) => {
//     setSelectedElement(element);
//     setIsModalOpen(true);
//   };

//   const handleSaveForm = async () => {
//     if (!isSignedIn) {
//       openSignIn();
//     }
//     if (userId && endpointURL && formName) {
//       try {
//         await updateFormDataWithNewUserID(
//           dynamicForm,
//           userId,
//           props.formId,
//           endpointURL,
//           formName
//         );
//       } catch (error) {
//         console.error("Failed to update form data:", error);
//       }
//     }
//   };

//   const handleSaveElement = (updatedElement: FormType["elements"][number]) => {
//     const updatedElements = dynamicForm.elements.map((el) =>
//       el.fieldName === selectedElement?.fieldName ? updatedElement : el
//     );
//     setDynamicForm({ ...dynamicForm, elements: updatedElements });
//   };

//   const handleRemoveElement = () => {
//     if (!selectedElement) return;

//     const updatedElements = dynamicForm.elements.filter((el) => {
//       return el.fieldName !== selectedElement.fieldName;
//     });
//     setDynamicForm({ ...dynamicForm, elements: updatedElements });
//     setIsModalOpen(false);
//   };

//   const handleAddElement = () => {
//     const newElementName = generateUniqueId({
//       length: 10,
//       includeSymbols: ["@", "#"],
//     });
//     const newElement: FormElementType = {
//       fieldName: newElementName,
//       type: "text",
//       label: "Element label",
//       placeholder: "Element placeholder",
//       required: false,
//       options: [{ option: "" }],
//     };

//     const updatedElements = [...dynamicForm.elements, newElement];

//     setDynamicForm({ ...dynamicForm, elements: updatedElements });
//   };

//   const handleFormName = (event: ChangeEvent<HTMLInputElement>) => {
//     setFormName(event.target.value);
//   };

//   const handleEndpointUrl = (event: ChangeEvent<HTMLInputElement>) => {
//     setEndpointURL(event.target.value);
//   };

//   return (
//     <div>
//       <div className="flex flex-row">
//         <input
//           type="text"
//           placeholder="Please enter form name."
//           className="mt-1 p-2 border rounded-md"
//           value={formName}
//           onChange={handleFormName}
//         />
//         <input
//           type="text"
//           placeholder="Please enter endpoint URL."
//           className="mt-1 p-2 border rounded-md"
//           value={endpointURL}
//           onChange={handleEndpointUrl}
//         />
//       </div>
//       <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//         {dynamicForm.elements.map((element: FormElementType, i) => (
//           <div key={i} className="flex flex-col">
//             <div className="flex flex-row justify-between">
//               <label className="font-medium text-gray-700">
//                 {element.label}{" "}
//                 {element.required && <span className="text-red-500">*</span>}
//               </label>
//               <button
//                 type="button"
//                 onClick={() => {
//                   handleEdit(element);
//                 }}
//               >
//                 edit
//               </button>
//             </div>
//             {element.type === "select" && element.options ? (
//               <select className="mt-1 p-2 border rounded-md">
//                 {element.options.map((option, idx) => (
//                   <option key={idx} value={option.option}>
//                     {option.option}
//                   </option>
//                 ))}
//               </select>
//             ) : (
//               <input
//                 type={element.type}
//                 placeholder={element.placeholder}
//                 className="mt-1 p-2 border rounded-md"
//               />
//             )}
//           </div>
//         ))}
//       </form>

//       {
//         <button
//           type="button"
//           className="px-5 py-2.5 rounded-full text-white text-sm tracking-wider font-medium border border-current outline-none bg-green-700 hover:bg-green-800 active:bg-green-700"
//           onClick={handleAddElement}
//         >
//           Add element
//         </button>
//       }

//       {dynamicForm.elements.length > 0 && (
//         <button
//           type="button"
//           onClick={handleSaveForm}
//           className="px-5 py-2.5 rounded-full text-white text-sm tracking-wider font-medium border border-current outline-none bg-green-700 hover:bg-green-800 active:bg-green-700"
//         >
//           Save form
//         </button>
//       )}

//       {selectedElement && (
//         <EditModal
//           isOpen={isModalOpen}
//           onClose={() => setIsModalOpen(false)}
//           onSave={handleSaveElement}
//           onRemove={handleRemoveElement}
//           initialData={selectedElement}
//         />
//       )}
//     </div>
//   );
// };

// export default DynamicForm;
