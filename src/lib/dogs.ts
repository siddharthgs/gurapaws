/**
 * Read-side data access for the public browse + detail pages (GURA-4).
 *
 * The site is a static export (see next.config.mjs). PGlite's WASM engine does
 * not bundle into Next's server build, so we do not query it from inside the
 * pages. Instead `prebuild` runs `src/db/export-catalog.ts`, which queries the
 * GURA-3 database in plain Node and writes `src/data/catalog.json`. These
 * functions read that build-time snapshot. The catalogue therefore always
 * reflects the real database at the moment of the build.
 *
 * When we move to a server host (the GURA "Deploy" ticket), these functions
 * can swap back to live per-request DB queries with no call-site changes —
 * this module is the single data seam.
 *
 * Privacy: the snapshot only contains public, safe fields — never lister
 * credentials or raw contact details (email/phone). Adopters reach a lister
 * through the application flow (GURA-6), not by scraping these pages.
 */

import type { Dog } from '@/db/schema';
import catalog from '@/data/catalog.json';

/** Public, serialisable view of a lister shown alongside a dog. */
export type PublicLister = {
  name: string;
  type: 'shelter' | 'ngo' | 'rescuer';
  area: string | null;
  city: string;
  about: string | null;
  verified: boolean;
};

/** Public, serialisable view of a dog listing for browse + detail. */
export type PublicDog = {
  slug: string;
  name: string;
  breed: string | null;
  size: Dog['size'];
  ageMonths: number | null;
  sex: Dog['sex'];
  temperament: string[];
  photos: string[];
  description: string | null;
  status: Dog['status'];
  city: string;
  area: string | null;
  lister: PublicLister;
};

// The JSON import is widened by TypeScript (e.g. `string` for enums); the
// snapshot is produced from the typed schema in export-catalog.ts, so this
// cast is safe.
const DOGS = (catalog as { dogs: PublicDog[] }).dogs;

/** Every browseable dog, available first then newest (order baked at export). */
export async function getBrowseDogs(): Promise<PublicDog[]> {
  return DOGS;
}

/** One dog by its shareable slug, or null if it is not publicly browseable. */
export async function getDogBySlug(slug: string): Promise<PublicDog | null> {
  return DOGS.find((d) => d.slug === slug) ?? null;
}

/** Slugs to pre-render as static detail pages (generateStaticParams). */
export async function getBrowseDogSlugs(): Promise<string[]> {
  return DOGS.map((d) => d.slug);
}
