CREATE TABLE `expense_trials` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`visitor_hash` text NOT NULL,
	`ip_hash` text NOT NULL,
	`state_json` text,
	`started_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`last_seen_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_expense_trials_visitor_hash` ON `expense_trials` (`visitor_hash`);--> statement-breakpoint
CREATE UNIQUE INDEX `idx_expense_trials_ip_hash` ON `expense_trials` (`ip_hash`);
--> statement-breakpoint
PRAGMA optimize;
