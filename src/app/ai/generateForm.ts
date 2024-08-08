'use server'
import { generateObject } from "ai";
import { openaiClient } from "./openai";
import { FormSchema, FormType } from "../types/types";

export default async function generateForm(prompt: string) {
    //no clue whatsoever as to why do I have to JSON.stringify and JSON.parse in here for this to work
  return JSON.parse(JSON.stringify(await generateObject({
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
  }))) as FormType
}
