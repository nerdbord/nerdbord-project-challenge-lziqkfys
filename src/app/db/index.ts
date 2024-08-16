"use server";
import { loadEnvConfig } from "@next/env";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";
import { eq } from "drizzle-orm";
import {
  FormElementSchema,
  FormElementType,
  FormSchema,
  FormType,
} from "@/types/types";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

loadEnvConfig(process.cwd());

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be a Neon postgres connection string");
}

const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql, { schema });

export const dataBase = async () => {
  return db.select().from(schema.forms);
};

export const getFormsByUserID = async (userID: string) => {
  return await db
    .select()
    .from(schema.forms)
    .where(eq(schema.forms.userId, userID));
};

export const getFormDataByFormID = async (formID: string) => {
  return await db
    .select()
    .from(schema.forms)
    .where(eq(schema.forms.formId, formID));
};

export const insertFormData = async (formData: FormType) => {
  const { userId } = auth();
  const serverResponse = await db
    .insert(schema.forms)
    .values({
      formData: formData.formData,
      formName: formData.formName ? formData.formName : null,
      userId: userId ? userId : null,
    })
    .returning({
      insertedID: schema.forms.formId,
    });
  redirect(`/${serverResponse[0].insertedID}/edit`);
};

export const updateFormDataWithNewUserID = async (
  formData: FormElementType[],
  userID: string,
  formID: string,
  webhookURL: string,
  formName: string
) => {
  return db
    .update(schema.forms)
    .set({
      formData: formData,
      userId: userID,
      webhookUrl: webhookURL,
      formName: formName,
    })
    .where(eq(schema.forms.formId, formID));
};
