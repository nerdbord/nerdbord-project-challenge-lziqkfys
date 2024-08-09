ALTER TABLE "forms" ALTER COLUMN "form_id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "forms" ALTER COLUMN "form_id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "submissions" ALTER COLUMN "form_id" SET DATA TYPE uuid;