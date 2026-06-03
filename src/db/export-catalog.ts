/**
 * Build-time catalogue snapshot.
 *
 * The public site is a static export (no DB at request time), and PGlite's
 * WASM engine does not bundle cleanly into Next's server build. So instead of
 * querying the DB from inside `next build`, we run this script first (plain
 * Node via tsx, where PGlite works exactly as it does for seed/check), query
 * the GURA-3 database, and write a JSON snapshot the pages import.
 *
 * This runs in `prebuild`, so every build reflects the current database. On a
 * future server host the pages can query the DB live again — the data seam in
 * `src/lib/dogs.ts` is the only thing that would change back.
 *
 * Privacy: only public, safe fields are projected here — never credentials or
 * raw lister contact details (email/phone). See src/lib/dogs.ts.
 */

import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { desc, eq, inArray, sql } from 'drizzle-orm';
import { client, db } from './index';
import { dogs, listers, type Dog } from './schema';

const BROWSEABLE: Dog['status'][] = ['available', 'pending'];

const OUTPUT = join(process.cwd(), 'src', 'data', 'catalog.json');

async function main() {
  const rows = await db
    .select({
      slug: dogs.slug,
      name: dogs.name,
      breed: dogs.breed,
      size: dogs.size,
      ageMonths: dogs.ageMonths,
      sex: dogs.sex,
      temperament: dogs.temperament,
      photos: dogs.photos,
      description: dogs.description,
      status: dogs.status,
      city: dogs.city,
      area: dogs.area,
      listerName: listers.name,
      listerType: listers.type,
      listerArea: listers.area,
      listerCity: listers.city,
      listerAbout: listers.about,
      listerVerified: listers.verified,
    })
    .from(dogs)
    .innerJoin(listers, eq(dogs.listerId, listers.id))
    .where(inArray(dogs.status, BROWSEABLE))
    // Available before pending, then newest listings first.
    .orderBy(
      sql`case when ${dogs.status} = 'available' then 0 else 1 end`,
      desc(dogs.createdAt)
    );

  const catalog = {
    dogs: rows.map((r) => ({
      slug: r.slug,
      name: r.name,
      breed: r.breed,
      size: r.size,
      ageMonths: r.ageMonths,
      sex: r.sex,
      temperament: r.temperament,
      photos: r.photos,
      description: r.description,
      status: r.status,
      city: r.city,
      area: r.area,
      lister: {
        name: r.listerName,
        type: r.listerType,
        area: r.listerArea,
        city: r.listerCity,
        about: r.listerAbout,
        verified: r.listerVerified,
      },
    })),
  };

  mkdirSync(dirname(OUTPUT), { recursive: true });
  writeFileSync(OUTPUT, JSON.stringify(catalog, null, 2) + '\n');
  console.log(`Wrote ${catalog.dogs.length} dogs → ${OUTPUT}`);

  await client.close();
}

main().catch((err) => {
  console.error('Catalog export failed:', err);
  process.exit(1);
});
