'use server'
import { generateObject } from "ai";
import { openaiClient } from "./openAI";
import { FormSchema, FormType } from "../types/types";

export default async function generateForm(prompt: string): Promise<FormType> {
  const result = await generateObject({
    model: openaiClient("gpt-4-turbo"),
    maxTokens: 512,
    schema: FormSchema,
    messages: [
      {
        role: "system",
         content: "Fill out the data for a form, based on the user's message.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
  })
    
  return result.object as FormType
}