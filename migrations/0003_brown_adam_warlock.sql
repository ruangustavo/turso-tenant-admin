PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_tenant_users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`username` text NOT NULL,
	`password` text NOT NULL,
	`tenant_id` integer NOT NULL,
	FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_tenant_users`("id", "username", "password", "tenant_id") SELECT "id", "username", "password", "tenant_id" FROM `tenant_users`;--> statement-breakpoint
DROP TABLE `tenant_users`;--> statement-breakpoint
ALTER TABLE `__new_tenant_users` RENAME TO `tenant_users`;--> statement-breakpoint
PRAGMA foreign_keys=ON;