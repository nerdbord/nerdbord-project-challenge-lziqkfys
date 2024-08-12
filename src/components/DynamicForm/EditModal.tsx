import React, { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormElementSchema, FormElementType } from "@/types/types";

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
  const {
    register,
    handleSubmit,
    reset,
    watch,
    control,
    formState: { errors },
  } = useForm<FormElementType>({
    resolver: zodResolver(FormElementSchema),
    defaultValues: initialData,
  });

  const { fields, remove, insert } = useFieldArray<FormElementType>({
    control,
    name: "options",
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
          Edit Element "${watch("fieldName")}"
        </h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              {...register("fieldName")}
              className="mt-1 p-2 border rounded-md w-full"
            />
            {errors.fieldName && (
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
                        remove(index);
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
