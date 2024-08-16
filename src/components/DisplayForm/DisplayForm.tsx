import { FormType } from "@/types/types";


interface DisplayFormProps {
    formData: FormType;
    formId: string;
}

const DisplayForm = ({formData, formId}: DisplayFormProps) => {
    const {elements} = formData;
  
    return (
      <div className="flex flex-col items-center justify-center">
        <h1>Form ID: {formId}</h1>
        <form className="w-full max-w-lg">
          {elements.map((element: any, index: number) => (
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

}

export default DisplayForm