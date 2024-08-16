import { dataBase, getFormDataByFormID } from "../db";
import { forms } from "../db/schema";
import { eq } from "drizzle-orm";
import { FormType } from "@/types/types";


interface FormIdPageProps {
  params: {
    formId: string;
  };
}

const FormIdPage = async ({ params} : FormIdPageProps ) => {

  const formID = params.formId;
  const formData = await getFormDataByFormID(formID)

  if (!formData || formData.length === 0) {
    return <div>Form not found</div>;
  }

  const { userId, formData: formElements, webhookUrl, createdAt} = formData[0];
  console.log("FORM: ", formData[0].formData)

  return (
    <div className="flex flex-col items-center justify-center">
      <h1>Form ID: {formID}</h1>
      <ul>
        <li>User ID: {userId}</li>
        <li>Webhook URL: {webhookUrl}</li>
        <li>Created At: {createdAt?.toLocaleString()}</li>
      </ul>
      <form className="w-full max-w-lg">
        {formElements?.elements?.map((element: any, index: number) => (
          <div key={index} className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              {element.label}
            </label>
            <input
              type={element.type}
              placeholder={element.placeholder}
              required={element.required}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
        ))}
      </form>
    </div>
  );
};

export default FormIdPage;
