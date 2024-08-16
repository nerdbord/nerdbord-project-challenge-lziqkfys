"use client";

// DynamicFormContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { FormElementSchema, FormType } from "@/types/types";

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
  const [dynamicForm, setDynamicForm] = useState<FormType>({
    id: 0,
    formId: "",
    formName: null,
    formData: [],
    userId: null,
    webhookUrl: null,
    createdAt: null
  });

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
