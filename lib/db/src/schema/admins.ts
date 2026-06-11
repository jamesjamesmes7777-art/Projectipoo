import { pgTable, varchar, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./auth";

export const adminsTable = pgTable("admins", {
  id: varchar("id")
    .primaryKey()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  email: varchar("email"),
  role: text("role").notNull().default("admin"),
  created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertAdminSchema = createInsertSchema(adminsTable).omit({
  created_at: true,
});

export type InsertAdmin = z.infer<typeof insertAdminSchema>;
export type Admin = typeof adminsTable.$inferSelect;
