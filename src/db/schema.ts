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

export const users = pgTable("users", {
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
	token: varchar({ length: 255 }),
	isDeleted: boolean().notNull().default(false),
});

export const purchases = pgTable("purchases", {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	userId: varchar().references(() => users.id),
	productId: integer().references(() => products.id),
	createdAt: timestamp().notNull().defaultNow(),
	updatedAt: timestamp().notNull().defaultNow(),
});

export const products = pgTable("products", {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	name: varchar({ length: 255 }).notNull(),
	description: varchar({ length: 512 }),
	price: numeric({ precision: 10, scale: 2 }).notNull(),
	createdAt: timestamp().notNull().defaultNow(),
	updatedAt: timestamp().notNull().defaultNow(),
});

export const productPurchaseRelation = relations(products, ({ many }) => ({
	purchases: many(purchases),
}));

export const purchaseUserRelation = relations(purchases, ({ one }) => ({
	user: one(users, {
		fields: [purchases.userId],
		references: [users.id],
	}),
}));
