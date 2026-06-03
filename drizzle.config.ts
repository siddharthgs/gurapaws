import { defineConfig } from 'drizzle-kit';

// Postgres dialect. `drizzle-kit generate` produces dialect-correct SQL from
// src/db/schema.ts into ./drizzle; those migrations run unchanged on PGlite
// (local) and managed Postgres (prod).
export default defineConfig({
  dialect: 'postgresql',
  schema: './src/db/schema.ts',
  out: './drizzle',
});
