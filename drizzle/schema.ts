import { pgTable, serial, varchar, date, integer, text, timestamp } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const dailyEntries = pgTable("daily_entries", {
	id: serial().primaryKey().notNull(),
	userId: varchar("user_id").notNull(),
	entryDate: date("entry_date").notNull(),
	rating: integer().notNull(),
	note: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
});
