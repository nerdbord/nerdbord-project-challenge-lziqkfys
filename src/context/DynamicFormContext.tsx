"use client";

// DynamicFormContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { FormType } from "@/types/types";

const DynamicFormContext = createContext<
  | {
      dynamicForm: FormType;
      setDynamicForm: React.Dispatch<React.SetStateAction<FormType>>;
    }
  | undefined
>(undefined);

export const DynamicFormProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [dynamicForm, setDynamicForm] = useState<FormType>(() => {
    if (typeof window !== "undefined") {
      const savedData = window.localStorage.getItem("dynamicFormState");
      return savedData ? JSON.parse(savedData) : { elements: [] };
    }
    return { elements: [] };
  });

  useEffect(() => {
    window.localStorage.setItem(
      "dynamicFormState",
      JSON.stringify(dynamicForm)
    );
  }, [dynamicForm]);

  return (
    <DynamicFormContext.Provider value={{ dynamicForm, setDynamicForm }}>
      {children}
    </DynamicFormContext.Provider>
  );
};

export const useDynamicFormContext = () => {
  const context = useContext(DynamicFormContext);
  if (context === undefined) {
    throw new Error(
      "useDynamicFormContext must be used within a DynamicFormProvider"
    );
  }
  return context;
};
