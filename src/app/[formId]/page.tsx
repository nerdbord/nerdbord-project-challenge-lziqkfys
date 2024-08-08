import { db } from "../db";
import { forms } from "../db/schema";
import { eq } from "drizzle-orm";

const FormIdPage = async ({ params }: { params: { formId: string } }) => {
  const formId = params.formId;
  console.log("formId: ", formId)

  if (!formId) {
    return <div>Form not found</div>;
  }

  const form = await db.query.forms.findFirst({
    where: eq(forms.id, parseInt(formId)),
  });

  if(!form){
    return <div>Form not found</div>
  }
};

export default FormIdPage;
