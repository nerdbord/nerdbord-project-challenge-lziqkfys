import { dataBase } from "../db";
import { forms } from "../db/schema";
import { eq } from "drizzle-orm";
import { FormType } from "@/types/types";


interface FormIdPageProps {
  params: {
    formId: string;
  };
}

const FormIdPage = async ({ params }: { params: FormIdPageProps }) => {

  if (!form) {
    return <div>Form not found</div>;
  }

  const { formId, userId, formData, webhookUrl, createdAt, published } = form;
  console.log("FORM: ", form)

  return (
    <div className="flex flex-col items-center justify-center">
      <h1>Form ID: {formId}</h1>
      <ul>
        <li>User ID: {userId}</li>
        <li>Webhook URL: {webhookUrl}</li>
        <li>Created At: {new Date(createdAt).toLocaleString()}</li>
        <li>Published: {published ? "Yes" : "No"}</li>
      </ul>
      <form className="w-full max-w-lg">
        {form?.elements.map((element: any, index: number) => (
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
      <pre></pre>
    </div>
  );
};

export default FormIdPage;
