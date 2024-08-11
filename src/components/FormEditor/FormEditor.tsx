// FormEditor.tsx
import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDynamicFormContext } from "@/context/DynamicFormContext"; 

const editSchema = z.object({
  name: z.string().min(1, "Name is required"),
  label: z.string().min(1, "Label is required"),
  placeholder: z.string().optional(),
  required: z.boolean(),
  type: z.string(),
  options: z.array(z.string()).optional(),
});

type EditSchemaType = z.infer<typeof editSchema>;

const FormEditor: React.FC = () => {
  const { dynamicForm, setDynamicForm } = useDynamicFormContext();
  const { elements } = dynamicForm;

  const {
    control,
    handleSubmit,
    setValue,
    register,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(editSchema),
    defaultValues: elements.reduce((acc, element) => {
      acc[element.name] = element;
      return acc;
    }, {} as Record<string, EditSchemaType>),
  });

  const onSubmit = (data: any) => {
    setDynamicForm({
      ...dynamicForm,
      elements: Object.values(data),
    });
  };

  const addField = () => {
    setDynamicForm({
      ...dynamicForm,
      elements: [
        ...dynamicForm.elements,
        {
          name: "",
          label: "",
          placeholder: "",
          required: false,
          type: "text",
          options: [],
        },
      ],
    });
  };

  const removeField = (name: string) => {
    setDynamicForm({
      ...dynamicForm,
      elements: dynamicForm.elements.filter((el) => el.name !== name),
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {elements.map((element) => (
        <div key={element.name} className="flex flex-col">
          <div className="flex flex-row justify-between">
            <label className="font-medium text-gray-700">{element.label}</label>
            <button type="button" onClick={() => removeField(element.name)}>
              Remove
            </button>
          </div>
          <Controller
            name={element.name}
            control={control}
            render={({ field }) => (
              <>
                <input
                  {...register(`${element.name}.name`)}
                  placeholder="Field Name"
                  className="mt-1 p-2 border rounded-md"
                />
                <input
                  {...register(`${element.name}.label`)}
                  placeholder="Field Label"
                  className="mt-1 p-2 border rounded-md"
                />
                <input
                  {...register(`${element.name}.placeholder`)}
                  placeholder="Placeholder (optional)"
                  className="mt-1 p-2 border rounded-md"
                />
                <select
                  {...register(`${element.name}.type`)}
                  className="mt-1 p-2 border rounded-md"
                >
                  <option value="text">Text</option>
                  <option value="number">Number</option>
                  <option value="email">Email</option>
                  <option value="password">Password</option>
                  <option value="select">Select</option>
                  {/* Add more field types if needed */}
                </select>
                <input
                  type="checkbox"
                  {...register(`${element.name}.required`)}
                  className="mt-1"
                />
                <span>Required</span>
                {element.type === "select" && (
                  <div>
                    <input
                      type="text"
                      placeholder="Option"
                      onBlur={(e) => {
                        const newOptions = [...(field.value.options || [])];
                        newOptions.push(e.target.value);
                        setValue(`${element.name}.options`, newOptions);
                      }}
                    />
                    {field.value && field.value.options && field.value.options.map((option: string, idx: number) => (
                      <div key={idx} className="mt-1 p-2 border rounded-md">
                        {option}
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          />
          {errors[element.name] && (
            <span className="text-red-500 text-sm">{errors[element.name]?.message}</span>
          )}
        </div>
      ))}
      <button
        type="button"
        onClick={addField}
        className="px-4 py-2 bg-green-600 text-white rounded-md"
      >
        Add Field
      </button>
      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded-md"
      >
        Save
      </button>
    </form>
  );
};

export default FormEditor;
