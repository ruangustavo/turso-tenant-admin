ALTER TABLE `admin_users` ALTER COLUMN "username" TO "username" text NOT NULL;--> statement-breakpoint
ALTER TABLE `admin_users` ALTER COLUMN "password" TO "password" text NOT NULL;--> statement-breakpoint
ALTER TABLE `settings` ALTER COLUMN "ddl" TO "ddl" text NOT NULL;--> statement-breakpoint
ALTER TABLE `tenant_users` ALTER COLUMN "username" TO "username" text NOT NULL;--> statement-breakpoint
ALTER TABLE `tenant_users` ALTER COLUMN "password" TO "password" text NOT NULL;--> statement-breakpoint
ALTER TABLE `tenants` ALTER COLUMN "name" TO "name" text NOT NULL;