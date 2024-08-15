
import {
  pgTable,
  text,
  serial,
  jsonb,
  timestamp,
  uuid
} from "drizzle-orm/pg-core";


export const forms = pgTable("forms", {
  id: serial("id").primaryKey(),
  formId: uuid("form_id").defaultRandom().notNull().unique(),
  userId: text("user_id"),
  formName: text("form_name"),
  formData: jsonb("form_data").notNull(),
  webhookUrl: text("webhook_url"),
  createdAt: timestamp("created_at").defaultNow(),
});
