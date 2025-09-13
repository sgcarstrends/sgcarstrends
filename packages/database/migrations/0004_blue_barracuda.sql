ALTER TABLE "posts"
    ADD COLUMN "month" text NOT NULL;--> statement-breakpoint
ALTER TABLE "posts"
    ADD COLUMN "data_type" text NOT NULL;--> statement-breakpoint
ALTER TABLE "posts"
    ADD CONSTRAINT "posts_month_dataType_unique" UNIQUE ("month", "data_type");
