import { useDynamicFormContext } from "@/context/DynamicFormContext";
import {
  FormElementType,
  generateSchema,
} from "@/types/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import {
  Table,
  TableBody,
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
import { redirectToSubmitted } from "@/app/db";

interface DisplayFormProps {
  formId: string;
}

const DisplayForm = ({ formId }: DisplayFormProps) => {
  const { dynamicForm } = useDynamicFormContext();
  const elements = dynamicForm.formData || [];
  const formSchema = generateSchema(dynamicForm);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: dynamicForm,
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = form;

  const onSubmit = async (data: any) => {
    console.log(data);

    try {
      const response = await fetch(dynamicForm.webhookUrl as string, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        console.log("RESPONSE: ", response);
        //alert("Form submitted successfully!");
        redirectToSubmitted(dynamicForm.formId)
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
        <form className="w-full max-w-lg flex flex-col items-center" onSubmit={handleSubmit(onSubmit)}>
          <Table>
            <TableBody>
              {elements.map(
                (element: FormElementType, elementsIndex: number) => (
                  <TableRow key={elementsIndex} className="border">
                    <TableCell className="font-medium">
                      <FormField
                        control={control}
                        name={element.fieldName as any}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              {element.label}
                              {element.required ? (
                                <span className="text-red-500"> *</span>
                              ) : (
                                <></>
                              )}
                            </FormLabel>
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
                                    element.options.map(
                                      (option, optionIndex) => (
                                        <SelectItem
                                          value={option.option}
                                          key={optionIndex}
                                        >
                                          {option.option}
                                        </SelectItem>
                                      )
                                    )}
                                </SelectContent>
                              </Select>
                            ) : (
                              <FormControl>
                                <Input
                                  type={element.type}
                                  placeholder={element.placeholder || ""}
                                  required={element.required}
                                  value={field.value}
                                  onChange={field.onChange}
                                />
                              </FormControl>
                            )}
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
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
