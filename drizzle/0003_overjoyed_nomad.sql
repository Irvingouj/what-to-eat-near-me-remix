DROP INDEX "key_type_idx";--> statement-breakpoint
ALTER TABLE "rate_limits" ADD COLUMN "path" text DEFAULT '/' NOT NULL;--> statement-breakpoint
CREATE INDEX "key_type_path_idx" ON "rate_limits" USING btree ("key","type","path");