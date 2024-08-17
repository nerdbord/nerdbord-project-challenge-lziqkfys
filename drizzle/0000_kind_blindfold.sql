CREATE TABLE IF NOT EXISTS "forms" (
	"id" serial PRIMARY KEY NOT NULL,
	"form_id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text,
	"form_name" text,
	"form_data" jsonb NOT NULL,
	"webhook_url" text,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "forms_form_id_unique" UNIQUE("form_id")
);
