"use server";
import { generateObject } from "ai";
import { openaiClient } from "./openAI";
import { FormSchema, FormType } from "@/types/types";


export default async function generateForm(
  prompt: string
): Promise<FormType | null> {
  try {
    const result = await generateObject({
      model: openaiClient("gpt-4-turbo"),
      maxTokens: 512,
      schema: FormSchema,
      messages: [
        {
          role: "system",
          content: "Create an object containing data for a webform, based on user's prompt.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });    
    return result.object as FormType;
  } catch (error) {
    console.error("Error generating form:", error);

    return null;
  }
}
