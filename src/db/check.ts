/**
 * Read-path proof that persistence works. Run with `npm run db:check` after
 * migrate + seed. Exercises the two queries the product is built on:
 *   1. The adopter browse feed  — available dogs joined to their lister.
 *   2. The lister applications inbox — applications joined to dog + adopter.
 * Exits non-zero if either query returns nothing, so CI/ops can rely on it.
 */

import { and, eq } from 'drizzle-orm';
import { client, db } from './index';
import { adopters, applications, dogs, listers } from './schema';

async function main() {
  // 1. Browse feed: what an adopter sees.
  const feed = await db
    .select({
      dog: dogs.name,
      breed: dogs.breed,
      size: dogs.size,
      area: dogs.area,
      listedBy: listers.name,
      listerType: listers.type,
      slug: dogs.slug,
    })
    .from(dogs)
    .innerJoin(listers, eq(dogs.listerId, listers.id))
    .where(eq(dogs.status, 'available'));

  console.log(`\n[Browse feed] ${feed.length} available dogs:`);
  for (const row of feed) {
    console.log(
      `  • ${row.dog} — ${row.breed}, ${row.size}, ${row.area} ` +
        `(by ${row.listedBy} / ${row.listerType})  →  /dogs/${row.slug}`
    );
  }

  // 2. Applications inbox: what a lister sees for one dog.
  const inbox = await db
    .select({
      dog: dogs.name,
      applicant: adopters.name,
      status: applications.status,
      message: applications.message,
    })
    .from(applications)
    .innerJoin(dogs, eq(applications.dogId, dogs.id))
    .innerJoin(adopters, eq(applications.adopterId, adopters.id));

  console.log(`\n[Applications] ${inbox.length} applications:`);
  for (const row of inbox) {
    console.log(
      `  • ${row.applicant} → ${row.dog} [${row.status}]: "${row.message}"`
    );
  }

  // 3. A filtered query (proves indexed/enum filters work): small available
  //    dogs only — the kind of filter the browse UI will expose.
  const smallDogs = await db
    .select({ name: dogs.name, size: dogs.size })
    .from(dogs)
    .where(and(eq(dogs.status, 'available'), eq(dogs.size, 'small')));
  console.log(
    `\n[Filter: small + available] ${smallDogs.length}: ` +
      smallDogs.map((d) => d.name).join(', ')
  );

  await client.close();

  if (feed.length === 0 || inbox.length === 0) {
    console.error('\nFAIL: expected seeded rows but got none.');
    process.exit(1);
  }
  console.log('\nOK: persistence verified (write → migrate → read).');
}

main().catch((err) => {
  console.error('Check failed:', err);
  process.exit(1);
});
