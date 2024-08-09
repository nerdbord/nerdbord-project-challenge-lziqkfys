// import "dotenv/config";
// import * as dotenv from "dotenv";
import { loadEnvConfig } from "@next/env";
import {
  users,
  forms,
  formsRelations,
  submissions,
  submissionsRelations,
} from "./schema";
import * as schema from "./schema"; // Zawiera tabele users, forms, submissions

import { db } from "./index";

// Read the .env file if it exists, or a file specified by the
// dotenv_config_path parameter that's passed to Node.js
// dotenv.config();
loadEnvConfig(process.cwd());

async function main() {
  const user = {
    id: "fd9e17b4-40e1-4c18-9703-e52eb8c9e592",
    email: "example@example.com",
    createdAt: new Date(),
  };
  console.log("seed data...");
  const [insertedUser] = await db
    .insert(users)
    .values({
      id: user.id,
      email: user.email,
      createdAt: user.createdAt,
    })
    .onConflictDoNothing()
    .returning();

  console.log("Inserted user:", insertedUser);

  // Przykładowe formularze do wstawienia
  const exampleForms = [
    {
      userId: user.id, // Powiązanie formularza z wstawionym użytkownikiem
      formData: {
        elements: [
          {
            name: "name",
            label: "Name",
            placeholder: "Enter your name",
            required: true,
            type: "text",
          },
          {
            name: "email",
            label: "Email",
            placeholder: "Enter your email",
            required: true,
            type: "email",
          },
        ],
      },
      webhookUrl: "https://example.com/webhook",
      published: true,
    },
    {
      userId: user.id,
      formData: {
        elements: [
          {
            name: "feedback",
            label: "Feedback",
            placeholder: "Enter your feedback",
            required: true,
            type: "text",
          },
          {
            name: "cats",
            label: "Cats",
            placeholder: "How many cats do you have?",
            required: true,
            type: "number",
          },
        ],
      },
      webhookUrl: "https://example.com/feedback-webhook",
      published: false,
    },
  ];

  console.log("Seeding form data...");
  const insertedForms = await db.insert(forms).values(exampleForms).returning();
  console.log("Inserted forms:", insertedForms);
}

main().catch((error) => {
  console.error("Error seeding data:", error);
});
