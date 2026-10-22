import { sql } from "drizzle-orm";
import { check, date, index, integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { usersTable } from "./user.schema.js";

export const loansTable = pgTable("loans", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    created_at: timestamp({ withTimezone: true }).notNull().defaultNow(),
    user_id: integer().notNull().references(() => usersTable.id, { onDelete: "cascade" }),
    friend_name: text().notNull(),
    amount: integer().notNull(),
    lent_on: date().notNull().default(sql`CURRENT_DATE`),
    due_date: date(),
    repaid_at: timestamp({ withTimezone: true }),
    receipt_url: text(),
}, (table) => [
    check("loans_amount_positive", sql`${table.amount} > 0`),
    index("loans_user_id_idx").on(table.user_id)
]);
