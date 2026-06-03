CREATE TYPE "public"."application_status" AS ENUM('submitted', 'under_review', 'approved', 'rejected', 'withdrawn');--> statement-breakpoint
CREATE TYPE "public"."dog_sex" AS ENUM('male', 'female', 'unknown');--> statement-breakpoint
CREATE TYPE "public"."dog_size" AS ENUM('small', 'medium', 'large', 'xlarge');--> statement-breakpoint
CREATE TYPE "public"."dog_status" AS ENUM('available', 'pending', 'adopted', 'withdrawn');--> statement-breakpoint
CREATE TYPE "public"."lister_type" AS ENUM('shelter', 'ngo', 'rescuer');--> statement-breakpoint
CREATE TABLE "adopters" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text,
	"city" text DEFAULT 'Hyderabad' NOT NULL,
	"about" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "adopters_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "applications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"dog_id" uuid NOT NULL,
	"adopter_id" uuid NOT NULL,
	"status" "application_status" DEFAULT 'submitted' NOT NULL,
	"message" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "dogs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"lister_id" uuid NOT NULL,
	"name" text NOT NULL,
	"breed" text,
	"size" "dog_size" NOT NULL,
	"age_months" integer,
	"sex" "dog_sex" DEFAULT 'unknown' NOT NULL,
	"temperament" text[] DEFAULT '{}' NOT NULL,
	"photos" text[] DEFAULT '{}' NOT NULL,
	"description" text,
	"status" "dog_status" DEFAULT 'available' NOT NULL,
	"city" text DEFAULT 'Hyderabad' NOT NULL,
	"area" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "dogs_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "listers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"type" "lister_type" NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text,
	"city" text DEFAULT 'Hyderabad' NOT NULL,
	"area" text,
	"about" text,
	"verified" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "listers_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "applications" ADD CONSTRAINT "applications_dog_id_dogs_id_fk" FOREIGN KEY ("dog_id") REFERENCES "public"."dogs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "applications" ADD CONSTRAINT "applications_adopter_id_adopters_id_fk" FOREIGN KEY ("adopter_id") REFERENCES "public"."adopters"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dogs" ADD CONSTRAINT "dogs_lister_id_listers_id_fk" FOREIGN KEY ("lister_id") REFERENCES "public"."listers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "applications_dog_adopter_unique" ON "applications" USING btree ("dog_id","adopter_id");