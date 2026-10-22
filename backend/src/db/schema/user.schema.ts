import { integer, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({ length: 255 }).notNull(),
    phone: varchar({ length: 10 }).notNull().unique()
})

export const otpsTable = pgTable("otps", {
    phone: varchar({ length: 10 }).primaryKey(),
    code: varchar({ length: 4 }).notNull(),
    expires_at: timestamp({ withTimezone: true }).notNull(),
});
