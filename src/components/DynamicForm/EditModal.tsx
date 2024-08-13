import React, { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormElementSchema, FormElementType } from "@/types/types";
import { useDynamicFormContext } from "@/context/DynamicFormContext";

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRemove: () => void;
  onSave: (element: FormElementType) => void;
  initialData: FormElementType;
}

const EditModal: React.FC<EditModalProps> = ({
  isOpen,
  onClose,
  onRemove,
  onSave,
  initialData,
}) => {
  const { dynamicForm, setDynamicForm } = useDynamicFormContext();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    control,
    setError,
    formState: { errors },
  } = useForm<FormElementType>({
    resolver: zodResolver(FormElementSchema),
    defaultValues: initialData,
  });

  const { fields, remove, insert } = useFieldArray<FormElementType>({
    control,
    name: "options",
    rules: { minLength: 1 },
  });

  useEffect(() => {
    reset(initialData);
  }, [initialData, reset]);

  const onSubmit = (data: FormElementType) => {
    const exisingFieldNames = dynamicForm.elements.map(
      (element) => element.fieldName
    );

    const isDuplicate =
      exisingFieldNames.includes(data.fieldName) &&
      data.fieldName !== initialData.fieldName;

    if (isDuplicate) {
      setError("fieldName", {
        message: "fieldName cannot be the same as another element.",
      });
      return;
    }

    onSave(data);
    onClose();
  };

  const handleRemove = (index: number) => {
    if (fields.length == 1) {
      setError("options", { message: "At least one option required!" });
    } else {
      remove(index);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-md shadow-md">
        <h2 className="text-xl font-semibold mb-4">
          Edit Element "{initialData.fieldName}"
        </h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Field Name
            </label>
            <input
              {...register("fieldName")}
              className="mt-1 p-2 border rounded-md w-full"
            />
            {errors.fieldName && (
              <span className="text-red-500 text-sm">
                {errors.fieldName.message}
              </span>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Label
            </label>
            <input
              {...register("label")}
              className="mt-1 p-2 border rounded-md w-full"
            />
            {errors.label && (
              <span className="text-red-500 text-sm">
                {errors.label.message}
              </span>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Placeholder
            </label>
            <input
              {...register("placeholder")}
              className="mt-1 p-2 border rounded-md w-full"
            />
            {errors.placeholder && (
              <span className="text-red-500 text-sm">
                {errors.placeholder.message}
              </span>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Type
            </label>
            <select
              {...register("type")}
              className="mt-1 p-2 border rounded-md w-full"
            >
              <option value="text">Text</option>
              <option value="number">Number</option>
              <option value="select">Select</option>
              <option value="checkbox">Checkbox</option>
              <option value="range">Range</option>
              <option value="color">Color</option>
              <option value="email">Email</option>
              <option value="password">Password</option>
              <option value="date">Date</option>
              <option value="time">Time</option>
              <option value="url">Url</option>
              <option value="week">Week</option>
              <option value="month">Month</option>
              <option value="tel">Telephone</option>
            </select>
          </div>

          {watch("type") === "select" && (
            <div className="mb-4">
              <div className="flex flex-row justify-between">
                <label className="block text-sm font-medium text-gray-700">
                  Options
                </label>
                <button
                  type="button"
                  onClick={() => {
                    insert(0, { option: "" });
                  }}
                >
                  add
                </button>
              </div>
              {fields.map((option: { option: string }, index) => {
                return (
                  <div className="flex flex-row" key={index}>
                    <input
                      className="mt-1 p-2 border rounded-md w-full"
                      {...register(`options.${index}.option`)}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        handleRemove(index);
                      }}
                    >
                      del
                    </button>
                  </div>
                );
              })}
              {errors.options && (
                <span className="text-red-500 text-sm">
                  At least one option is required
                </span>
              )}
            </div>
          )}

          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                {...register("required")}
                className="mr-2"
              />
              Required
            </label>
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onRemove}
              className="px-4 py-2 bg-red-500 text-white rounded-md"
            >
              Remove
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditModal;
