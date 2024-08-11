import React, { useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormElementSchema, FormElementType, FormType } from "@/types/types";
import { useDynamicFormContext } from "@/context/DynamicFormContext";

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (element: FormElementType) => void;
  initialData: FormElementType;
}

const EditModal: React.FC<EditModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  console.log("INITIALDATA: ", initialData);

  const [isSelect, setIsSelect] = useState(initialData.type === "select");
  const { dynamicForm, setDynamicForm } = useDynamicFormContext();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormElementType>({
    resolver: zodResolver(FormElementSchema),
    defaultValues: initialData,
  });

  useEffect(() => {
    reset(initialData);
  }, [initialData, reset]);

  const onSubmit = (data: FormElementType) => {
    onSave(data);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-md shadow-md">
        <h2 className="text-xl font-semibold mb-4">
          Edit Element "${initialData.name}"
        </h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              {...register("name")}
              className="mt-1 p-2 border rounded-md w-full"
            />
            {errors.name && (
              <span className="text-red-500 text-sm">
                This field is required
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
                This field is required
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
              <option value="checkbox">Checkbox</option>
              <option value="select">Select</option>
              {/* Add other types as necessary */}
            </select>
          </div>

          {initialData.type === "select" && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Options (comma separated)
              </label>
              <input
                {...register("options")}
                className="mt-1 p-2 border rounded-md w-full"
              />
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
