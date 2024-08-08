import { loadEnvConfig } from "@next/env";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
// import { users, forms, formsRelations, submissions, submissionsRelations  } from "./schema";
import * as schema from "./schema"; // Zawiera tabele users, forms, submissions

loadEnvConfig(process.cwd());

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be a Neon postgres connection string");
}

const sql = neon(process.env.DATABASE_URL);
export const db = drizzle(sql, { schema });
