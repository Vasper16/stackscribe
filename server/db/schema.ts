// server/db/schema.ts
import {
  pgTable, serial, varchar, text, timestamp, integer,
  uniqueIndex, index, primaryKey
} from "drizzle-orm/pg-core";

/** Posts table */
export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 200 }).notNull(),
  content: text("content"),
  slug: varchar("slug", { length: 220 }).notNull(),
  status: varchar("status", { length: 20 }).notNull().default("draft"), // 'draft' | 'published'
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
}, (t) => ({
  slugIdx: uniqueIndex("idx_posts_slug").on(t.slug),
  statusCreatedIdx: index("idx_posts_status_created_at").on(t.status, t.createdAt),
}));

/** Categories table */
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 120 }).notNull(),
  description: text("description"),
  slug: varchar("slug", { length: 140 }).notNull(),
}, (t) => ({
  slugIdx: uniqueIndex("idx_categories_slug").on(t.slug),
  nameIdx: uniqueIndex("idx_categories_name").on(t.name),
}));

/** Many-to-many: posts <-> categories */
export const postsToCategories = pgTable("posts_categories", {
  postId: integer("post_id").notNull()
    .references(() => posts.id, { onDelete: "cascade" }),
  categoryId: integer("category_id").notNull()
    .references(() => categories.id, { onDelete: "cascade" }),
}, (t) => ({
  pk: primaryKey({ columns: [t.postId, t.categoryId] }),
}));