import { useFieldArray, useForm } from "react-hook-form";
import { FormElementType, FormType, generateSchema } from "@/types/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDynamicFormContext } from "@/context/DynamicFormContext";
import { useState } from "react";
import EditModal from "./EditModal";
import generateUniqueId from "generate-unique-id";

const DynamicForm: React.FC = () => {
  const { dynamicForm, setDynamicForm } = useDynamicFormContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedElement, setSelectedElement] = useState<
    FormType["elements"][number] | null
  >(null);
  const formSchema = generateSchema(dynamicForm);

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
        //mode: "no-cors"
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

  const handleSaveForm = () => {};

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

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {dynamicForm.elements.map((element: FormElementType, i) => (
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
                placeholder={element.placeholder}
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

      {dynamicForm.elements.length > 0 && (
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
      )}
    </div>
  );
};

export default DynamicForm;
