import { useDynamicFormContext } from "@/context/DynamicFormContext";
import { useState } from "react";


interface DisplayFormProps {
    formId: string;
}

const DisplayForm = (props: DisplayFormProps) => {
    const { dynamicForm, setDynamicForm } = useDynamicFormContext();
    const [endpointURL, setEndpointURL] = useState<string>();
    const [formName, setFormName] = useState<string>();

}

export default DisplayForm