import { defineConfig } from "drizzle-kit";
// import type { Config } from 'drizzle-kit';
// import { loadEnvConfig } from "@next/env";
import * as dotenv from "dotenv";

// Read the .env file if it exists, or a file specified by the
// dotenv_config_path parameter that's passed to Node.js
dotenv.config();

// loadEnvConfig(process.cwd());

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be a Neon postgres connection string; DATABASE_URL not found in environment");
}

// export default {
//   schema: './src/app/db/schema.ts',
//   out: './drizzle',
//   dialect: "postgresql",
//   driver: 'pg',
//   dbCredentials: {
//     connectionString: process.env.DATABASE_URL,
//   },
//   strict: true,
// } satisfies Config;

export default defineConfig({
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
  schema: "./src/app/db/schema.ts",
  out: "./drizzle",
  verbose: true,
  strict: true,
});