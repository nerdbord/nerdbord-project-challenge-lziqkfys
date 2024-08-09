'use server'
import { generateObject } from "ai";
import { openaiClient } from "./openAI";
import { FormSchema, FormType } from "../types/types";

export default async function generateForm(prompt: string): Promise<FormType> {
    //no clue whatsoever as to why do I have to JSON.stringify and JSON.parse in here for this to work
  const result = await generateObject({
    model: openaiClient("gpt-4-turbo"),
    maxTokens: 512,
    schema: FormSchema,
    messages: [
      {
        role: "system",
        // content: "Fill out the data for a form, based on the user's message.",
        content: "i would like to collect data from guests for my upcoming birthday party"
      },
      {
        role: "user",
        content: prompt,
      },
    ],
  })
  
    console.log("RESULT", result);
    
  return result.object as FormType
}