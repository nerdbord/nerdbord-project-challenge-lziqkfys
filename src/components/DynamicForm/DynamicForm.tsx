import { useForm } from "react-hook-form";
import { FormType, generateSchema } from "@/types/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDynamicFormContext } from "@/context/DynamicFormContext";
import { useState } from "react";
import EditModal from "./EditModal";

const DynamicForm: React.FC = () => {
  const { dynamicForm, setDynamicForm } = useDynamicFormContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedElement, setSelectedElement] = useState<
    FormType["elements"][number] | null
  >(null);

  const formSchema = generateSchema(dynamicForm);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
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
    setIsModalOpen(true);
    setSelectedElement(element);
  };

  const handleSave = (updatedElement: FormType["elements"][number]) => {
    const updatedElements = dynamicForm.elements.map((el) =>
      el.name === selectedElement?.name ? updatedElement : el
    );
    setDynamicForm({ ...dynamicForm, elements: updatedElements });
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {dynamicForm.elements.map((element, i) => (
          <div key={i} className="flex flex-col">
            <div className="flex flex-row justify-between">
              <label className="font-medium text-gray-700">
                {element.label}{" "}
                {element.required && <span className="text-red-500">*</span>}
              </label>
              <button type="button" onClick={() => {handleEdit(element)}}>
                edit
              </button>
            </div>
            {element.type === "select" && element.options ? (
              <select
                {...register(element.name, { required: element.required })}
                className="mt-1 p-2 border rounded-md"
              >
                {element.options.map((option, idx) => (
                  <option key={idx} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={element.type}
                placeholder={element.placeholder}
                {...register(element.name, {
                  required: element.required,
                  valueAsNumber: element.type === "number" ? true : false,
                })}
                className="mt-1 p-2 border rounded-md"
              />
            )}
            {errors[element.name] && (
              <span className="text-red-500 text-sm">
                This field is required
              </span>
            )}
          </div>
        ))}
      </form>

      {selectedElement && (
        <EditModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
          initialData={selectedElement}
        />
      )}
    </div>
  );
};

export default DynamicForm;
