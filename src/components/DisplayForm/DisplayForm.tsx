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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

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
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = form;

  const onSubmit = async (data: any) => {
    console.log(data);

    try {
      const response = await fetch(dynamicForm.webhookUrl as string, {
        //const response = await fetch("https://submit-form.com/YKEFWFXpa", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(data),
        //mode: "no-cors"
      });
      if (response.ok) {
        console.log("RESPONSE: ", response);
        alert("Form submitted successfully!");
      } else {
        console.error("Bad response: ", response);
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
                          {element.type === "select" ? (
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value?.toString()}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select option" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {element.options &&
                                  element.options.map((option) => (
                                    <SelectItem value={option.option}>
                                      {option.option}
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>
                          ) : (
                            <FormControl>
                              <Input
                                type={element.type}
                                placeholder={element.placeholder || ""}
                                required={element.required}
                                {...field} // Assigning field to input
                              />
                            </FormControl>
                          )}
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
          <Button
            type="submit"
            className="mt-12"
            onClick={() => console.log(errors)}
          >
            Wyślij
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default DisplayForm;
