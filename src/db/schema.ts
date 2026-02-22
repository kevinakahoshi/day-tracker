import { date, integer, pgTable, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core'


export const dailyEntries = pgTable('daily_entries', {
  id: serial().primaryKey(),
  userId: varchar('user_id').notNull(),
  entryDate: date('entry_date').notNull(),
  rating: integer().notNull(), // 1-5 scale
  note: text(), // optional
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})
