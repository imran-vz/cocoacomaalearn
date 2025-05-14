import { cuid2 } from "drizzle-cuid2/postgres";
import { relations } from "drizzle-orm";
import {
	boolean,
	integer,
	numeric,
	pgTable,
	timestamp,
	varchar,
} from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
	id: cuid2("id").defaultRandom().primaryKey(),
	name: varchar({ length: 255 }),
	phone: varchar({ length: 255 }),
	email: varchar({ length: 255 }).notNull(),
	emailVerified: boolean().notNull().default(false),
	password: varchar({ length: 255 }),
	profilePicture: varchar({ length: 512 }),
	provider: varchar({ length: 255 }),
	createdAt: timestamp().notNull().defaultNow(),
	updatedAt: timestamp().notNull().defaultNow(),
	role: varchar({ length: 255, enum: ["user", "admin"] })
		.notNull()
		.default("user"),
	isDeleted: boolean().notNull().default(false),
});

export const purchaseTable = pgTable("purchases", {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	userId: varchar().references(() => usersTable.id),
	productId: integer().references(() => productsTable.id),
	createdAt: timestamp().notNull().defaultNow(),
	updatedAt: timestamp().notNull().defaultNow(),
});

export const productsTable = pgTable("products", {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	name: varchar({ length: 255 }).notNull(),
	description: varchar({ length: 512 }),
	price: numeric({ precision: 10, scale: 2 }).notNull(),
	createdAt: timestamp().notNull().defaultNow(),
	updatedAt: timestamp().notNull().defaultNow(),
});

export const productPurchaseRelation = relations(productsTable, ({ many }) => ({
	purchases: many(purchaseTable),
}));

export const purchaseUserRelation = relations(purchaseTable, ({ one }) => ({
	user: one(usersTable, {
		fields: [purchaseTable.userId],
		references: [usersTable.id],
	}),
}));
