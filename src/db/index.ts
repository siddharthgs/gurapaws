/**
 * Database client.
 *
 * Local/dev runs on PGlite — an embedded Postgres (WASM), so there is zero
 * infra to install and the SQL dialect is genuine Postgres. The data dir is
 * gitignored at `.pglite/`.
 *
 * In production we point at a managed Postgres (Neon / Vercel Postgres /
 * Supabase) by swapping this client for `drizzle-orm/node-postgres` driven by
 * `DATABASE_URL`. The schema and migrations are unchanged — same dialect.
 * That swap lands with the server-hosting ticket (see README "Deploy").
 */

import { PGlite } from '@electric-sql/pglite';
import { drizzle } from 'drizzle-orm/pglite';
import * as schema from './schema';

const dataDir = process.env.PGLITE_DATA_DIR ?? '.pglite';

export const client = new PGlite(dataDir);
export const db = drizzle(client, { schema });
