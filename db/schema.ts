import { sql } from "drizzle-orm";
import { integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const expenseTrials = sqliteTable("expense_trials", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  visitorHash: text("visitor_hash").notNull(),
  ipHash: text("ip_hash").notNull(),
  stateJson: text("state_json"),
  startedAt: text("started_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  lastSeenAt: text("last_seen_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
  uniqueIndex("idx_expense_trials_visitor_hash").on(table.visitorHash),
  uniqueIndex("idx_expense_trials_ip_hash").on(table.ipHash),
]);
