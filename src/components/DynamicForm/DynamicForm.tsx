import { useForm } from "react-hook-form";
import { FormType, generateSchema } from "../../types/types";
import { zodResolver } from "@hookform/resolvers/zod";

interface DynamicFormProps {
  formData: FormType;
}

const DynamicForm: React.FC<DynamicFormProps> = ({ formData }) => {
  const formSchema = generateSchema(formData);

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

  const handleEdit = () => {};

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {formData.elements.map((element) => (
        <div key={element.name} className="flex flex-col">
          <div className="flex flex-row justify-between">
            <label className="font-medium text-gray-700">
              {element.label}{" "}
              {element.required && <span className="text-red-500">*</span>}
            </label>
            <button type="button" onClick={handleEdit}>
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
            <span className="text-red-500 text-sm">This field is required</span>
          )}
        </div>
      ))}
      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded-md"
      >
        Submit
      </button>
    </form>
  );
};

export default DynamicForm;
