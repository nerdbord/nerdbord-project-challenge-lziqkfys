import { useDynamicFormContext } from "@/context/DynamicFormContext";
import {
  FormElementType,
  FormSchema,
  FormType,
  generateSchema,
} from "@/types/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Input } from "../ui/input";

interface DisplayFormProps {
  formId: string;
}

const DisplayForm = ({ formId }: DisplayFormProps) => {
  const { dynamicForm } = useDynamicFormContext();
  const elements = dynamicForm.formData || [];
  const formSchema = generateSchema(dynamicForm);

  // const form = useForm<FormType>({
    const form = useForm({
    resolver: zodResolver(formSchema),
    // defaultValues: dynamicForm as FormType,
    defaultValues: dynamicForm,
  });

  // Początkowy kod:
  // const { register, handleSubmit } = useForm<FormType>({
  // resolver: zodResolver(formSchema),
  // defaultValues: dynamicForm as FormType,
  // });
  const { control, handleSubmit } = form;

  const onSubmit = async (data: any) => {
    try {
      // const response = await fetch(dynamicForm.webhookUrl as string, {
      const response = await fetch(dynamicForm.webhookUrl || "https://submit-form.com/kGteNP1Hj", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        //mode: "no-cors"
      });
      if (response.ok) {
        alert("Form submitted successfully!");
      } else {
        alert("Failed to submit the form.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while submitting the form.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center px-14 py-14">
      <h1 className="mb-8 mt-14 text-3xl font-semibold">
        To jest nazwa formularza: {dynamicForm.formName}
      </h1>
      <Form {...form}>
        <form className="w-full max-w-lg" onSubmit={handleSubmit(onSubmit)}>
          <Table>
            <TableCaption>Form ID: {formId}</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Pola formularza</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {elements.map((element: FormElementType, index: number) => (
                <TableRow key={index} className="border">
                  <TableCell className="font-medium">
                    <FormField
                      control={control}
                      name={element.fieldName}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{element.label}</FormLabel>
                          <FormControl>
                            <Input
                              type={element.type}
                              placeholder={element.placeholder || ""}
                              required={element.required}
                              {...field}  // Assigning field to input
                            />
                          </FormControl>
                          <FormDescription />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {/* {elements.map((element: FormElementType, index: number) => (
            <div key={index} className="mb-4 bg-orange-400">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                {element.label}
              </label>
              <input
                type={element.type}
                placeholder={element.placeholder || ""}
                required={element.required}
                // {...register(element.fieldName)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
          ))} */}
          <Button type="submit" className="mt-12">Wyślij</Button>
        </form>
      </Form>
    </div>
  );
};

export default DisplayForm;
