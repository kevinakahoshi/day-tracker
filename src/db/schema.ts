import {
	pgTable,
	serial,
	text,
	timestamp,
	date,
	integer,
} from "drizzle-orm/pg-core";

export const todos = pgTable("todos", {
	id: serial().primaryKey(),
	title: text().notNull(),
	createdAt: timestamp("created_at").defaultNow(),
});

export const day_ratings = pgTable("day_ratings", {
	day: date("day").primaryKey(),
	rating: integer("rating"),
	note: text("note"),
	createdAt: timestamp("created_at").defaultNow(),
	updatedAt: timestamp("updated_at").defaultNow(),
});
