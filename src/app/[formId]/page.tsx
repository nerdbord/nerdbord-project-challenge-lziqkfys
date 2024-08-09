import { db } from "../db";
import { forms } from "../db/schema";
import { eq } from "drizzle-orm";
import { FormType } from "../types/types";
import DynamicForm from "../generator/DynamicForm";


interface FormIdPageProps {
  formId: string;
  params: {
    formId: string;
  };
}

export async function getFormDataById(formId: string): Promise<FormType | null> {
  const form = await db
  .select({
    formData: forms.formData
  })
  .from(forms)
  .where(eq(forms.formId, formId))
  .limit(1);

return form.length > 0 ? form[0].formData as FormType : null;
}

const FormIdPage = async ({ params }: { params: FormIdPageProps }) => {
  const formData = await getFormDataById(params.formId);

  if (!formData) {
    return <div>Form not found</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <h1>Form ID: {params.formId}</h1>
      <DynamicForm formData={formData} />
    </div>
  );
};

export default FormIdPage;
