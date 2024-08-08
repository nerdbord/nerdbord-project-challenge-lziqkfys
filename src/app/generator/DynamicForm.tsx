import { useForm } from "react-hook-form";
import { FormSchema, FormType } from "../types/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

interface DynamicFormProps {
  formData: FormType
}

const DynamicForm: React.FC<DynamicFormProps> = ({ formData }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(FormSchema),
  });

  const onSubmit = (data: any) => {
    console.log("Form Data:", data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {formData.elements.map((element) => (
        <div key={element.name} className="flex flex-col">
          <label className="font-medium text-gray-700">{element.label}</label>
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
              {...register(element.name, { required: element.required })}
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
