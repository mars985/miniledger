CREATE TABLE "loans" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "loans_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"user_id" integer NOT NULL,
	"friend_name" text NOT NULL,
	"amount" integer NOT NULL,
	"lent_on" date DEFAULT CURRENT_DATE NOT NULL,
	"due_date" date,
	"repaid_at" timestamp with time zone,
	"receipt_url" text,
	CONSTRAINT "loans_amount_positive" CHECK ("loans"."amount" > 0)
);
--> statement-breakpoint
CREATE TABLE "otps" (
	"phone" varchar(10) PRIMARY KEY NOT NULL,
	"code" varchar(4) NOT NULL,
	"expires_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "users_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255) NOT NULL,
	"phone" varchar(10) NOT NULL,
	CONSTRAINT "users_phone_unique" UNIQUE("phone")
);
--> statement-breakpoint
ALTER TABLE "loans" ADD CONSTRAINT "loans_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "loans_user_id_idx" ON "loans" USING btree ("user_id");