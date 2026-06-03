/**
 * Apply committed migrations from ./drizzle to the local PGlite database.
 * Run with `npm run db:migrate`. Idempotent — already-applied migrations are
 * skipped via drizzle's migration journal.
 */

import { migrate } from 'drizzle-orm/pglite/migrator';
import { client, db } from './index';

async function main() {
  console.log('Applying migrations from ./drizzle ...');
  await migrate(db, { migrationsFolder: 'drizzle' });
  console.log('Migrations applied.');
  await client.close();
}

main().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
