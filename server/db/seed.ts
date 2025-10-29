// server/db/seed.ts
import { db, schema } from "./index";
import { eq } from "drizzle-orm";
import slugify from "slugify";

async function main() {
  const base = ["Design", "Research", "Software", "Product"].map((name) => ({
    name,
    slug: slugify(name, { lower: true, strict: true }),
    description: `${name} articles`,
  }));

  for (const c of base) {
    const exists = await db
      .select()
      .from(schema.categories)
      .where(eq(schema.categories.slug, c.slug));

    if (exists.length === 0) {
      await db.insert(schema.categories).values(c);
    }
  }

  console.log("Seed complete.");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});