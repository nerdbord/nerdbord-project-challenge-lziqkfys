
import { loadEnvConfig } from "@next/env";
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { migrate } from 'drizzle-orm/neon-http/migrator';
// import * as dotenv from "dotenv";

// Read the .env file if it exists, or a file specified by the
// dotenv_config_path parameter that's passed to Node.js
// dotenv.config();


loadEnvConfig(process.cwd());

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

const main = async () => {
  try {
    await migrate(db, { migrationsFolder: 'drizzle' });
    console.log('Migration completed');
  } catch (error) {
    console.error('Error during migration:', error);
    process.exit(1);
  }
};

main();