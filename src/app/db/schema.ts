// import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

// export const UserMessages = pgTable("user_messages", {
//   user_id: text("user_id").primaryKey().notNull(),
//   createTs: timestamp("create_ts").defaultNow().notNull(),
//   message: text("message").notNull(),
// });
import {
  pgTable,
  text,
  serial,
  boolean,
  jsonb,
  timestamp,
  uuid
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Tabela users będzie przechowywać informacje o użytkownikach.
// Clerk będzie dostarczać dane o użytkownikach, więc tabela ta będzie raczej prostą referencją do danych użytkownika.

export const users = pgTable("users", {
  id: text("id").notNull().primaryKey(), // Clerk user ID
  email: text("email").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Tabela forms przechowuje informacje o formularzach, które zostały stworzone przez użytkowników.
// Formularz będzie przechowywany jako JSON w polu formData.
export const forms = pgTable("forms", {
  id: serial("id").primaryKey(),
  formId: uuid("form_id").defaultRandom().notNull().unique(), // Unique form identifier of type UUID, used in URLs
  userId: text("user_id").references(() => users.id, { onDelete: "cascade" }),
  formData: jsonb("form_data").notNull(), // JSON representing the form schema
  webhookUrl: text("webhook_url"),
  createdAt: timestamp("created_at").defaultNow(),
  published: boolean("published").default(false),
});

export const formsRelations = relations(forms, ({ one }) => ({
  user: one(users, {
    fields: [forms.userId],
    references: [users.id],
  }),
}));

//   Tabela submissions przechowuje dane, które zostały przesłane za pomocą formularzy.
// Każde zgłoszenie jest powiązane z określonym formularzem.

export const submissions = pgTable("submissions", {
  id: serial("id").primaryKey(),
  formId: uuid("form_id").references(() => forms.formId, {
    onDelete: "cascade",
  }),
  submissionData: jsonb("submission_data").notNull(), // JSON representing the submitted data
  createdAt: timestamp("created_at").defaultNow(),
});

export const submissionsRelations = relations(submissions, ({ one }) => ({
  form: one(forms, {
    fields: [submissions.formId],
    references: [forms.formId],
  }),
}));
