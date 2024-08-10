'use client'

import React, { createContext, useContext, useState, ReactNode } from "react";
import { FormType } from "../types/types";

interface DynamicFormContextType {
  dynamicForm: FormType | null;
  setDynamicForm: React.Dispatch<React.SetStateAction<FormType | null>>;
}

const DynamicFormContext = createContext<DynamicFormContextType | undefined>(undefined);

export const DynamicFormProvider = ({ children }: { children: ReactNode }) => {
  const [dynamicForm, setDynamicForm] = useState<FormType | null>(null);

  return (
    <DynamicFormContext.Provider value={{ dynamicForm: dynamicForm, setDynamicForm }}>
      {children}
    </DynamicFormContext.Provider>
  );
};

export const useDynamicFormContext = (): DynamicFormContextType => {
  const context = useContext(DynamicFormContext);
  if (context === undefined) {
    throw new Error("useFormContext must be used within a FormProvider");
  }
  return context;
};
