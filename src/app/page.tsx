'use client'

import { ChangeEvent, useState } from 'react';
import { FormType } from './types/types';
import generateForm from './ai/generateForm';
import DynamicForm from './components/DynamicForm/DynamicForm';

export default function Home() {
  const [formJSON, setFormJSON] = useState<FormType>()
  const [prompt, setPrompt] = useState("");

  
  const handleClick = async () => {
    const formJSON = await generateForm(prompt);
    setFormJSON(formJSON);
  };

  const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPrompt(event.target.value)
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <input type="text" value={prompt} onChange={handleOnChange}></input>
      <button onClick={handleClick}> click me</button>
      {formJSON && <DynamicForm formData={formJSON} />}
    </div>
  );
}
