/**
 * GuraPaws core data model (R0.2).
 *
 * The whole product runs on four entities:
 *   listers   — the supply side (shelters, NGOs, independent rescuers)
 *   adopters  — the demand side
 *   dogs      — the listings, owned by a lister
 *   applications — links an adopter to a dog they want, with a status
 *
 * Design notes (see GURA-3 task update for the full rationale):
 *  - Postgres dialect. Verified locally on PGlite (embedded Postgres); the
 *    same migrations run unchanged on managed Postgres (Neon/Vercel/Supabase)
 *    in production — a connection-string swap, not a rewrite.
 *  - UUID primary keys: non-enumerable (safe to expose in shareable URLs) and
 *    distribution-friendly as we scale across India.
 *  - Every dog has a unique `slug` already, so shareable public profiles
 *    (a later network-effect hook) slot in with no schema change.
 *  - Arrays (`photos`, `temperament`) use native Postgres text[] — simple now,
 *    normalisable later if either grows its own entity.
 *  - Future hooks (stories, foster/volunteer/donate intent) are NEW tables
 *    that reference these — nothing here has to change to add them.
 */

import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';

// --- Enums ----------------------------------------------------------------

/** Who is listing the dog. One table, discriminated by type. */
export const listerType = pgEnum('lister_type', ['shelter', 'ngo', 'rescuer']);

export const dogSize = pgEnum('dog_size', [
  'small', // < 10 kg
  'medium', // 10–25 kg
  'large', // 25–40 kg
  'xlarge', // > 40 kg
]);

export const dogSex = pgEnum('dog_sex', ['male', 'female', 'unknown']);

/** Lifecycle of a listing. */
export const dogStatus = pgEnum('dog_status', [
  'available',
  'pending', // an application is in progress
  'adopted',
  'withdrawn', // pulled by the lister
]);

/** Lifecycle of an adoption application. */
export const applicationStatus = pgEnum('application_status', [
  'submitted',
  'under_review',
  'approved',
  'rejected',
  'withdrawn',
]);

// --- Tables ---------------------------------------------------------------

/** Supply side: shelters, NGOs, and independent rescuers. */
export const listers = pgTable('listers', {
  id: uuid('id').primaryKey().defaultRandom(),
  type: listerType('type').notNull(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  phone: text('phone'),
  city: text('city').notNull().default('Hyderabad'),
  area: text('area'),
  about: text('about'),
  // Trust signal for adopters; verification flow comes later.
  verified: boolean('verified').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/** Demand side: people who want to adopt. */
export const adopters = pgTable('adopters', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  phone: text('phone'),
  city: text('city').notNull().default('Hyderabad'),
  // Short free-text intro shown to listers alongside an application.
  about: text('about'),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/** The listings — the heart of the marketplace. */
export const dogs = pgTable('dogs', {
  id: uuid('id').primaryKey().defaultRandom(),
  // Stable, human-readable, shareable identifier (future public profiles).
  slug: text('slug').notNull().unique(),
  listerId: uuid('lister_id')
    .notNull()
    .references(() => listers.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  breed: text('breed'), // many rescues are indies / mixed
  size: dogSize('size').notNull(),
  // Age stored in months for precision (puppies); display rounds to years.
  ageMonths: integer('age_months'),
  sex: dogSex('sex').notNull().default('unknown'),
  // Tags, e.g. {friendly, good-with-kids, house-trained}.
  temperament: text('temperament').array().notNull().default([]),
  // Ordered list of photo URLs; first is the cover.
  photos: text('photos').array().notNull().default([]),
  description: text('description'),
  status: dogStatus('status').notNull().default('available'),
  city: text('city').notNull().default('Hyderabad'),
  area: text('area'),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/** The core two-sided link: an adopter applies for a dog. */
export const applications = pgTable(
  'applications',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    dogId: uuid('dog_id')
      .notNull()
      .references(() => dogs.id, { onDelete: 'cascade' }),
    adopterId: uuid('adopter_id')
      .notNull()
      .references(() => adopters.id, { onDelete: 'cascade' }),
    status: applicationStatus('status').notNull().default('submitted'),
    // The adopter's note to the lister.
    message: text('message'),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    // One application per adopter per dog.
    uniqueIndex('applications_dog_adopter_unique').on(
      table.dogId,
      table.adopterId
    ),
  ]
);

// --- Inferred types (use across the app for end-to-end type safety) -------

export type Lister = typeof listers.$inferSelect;
export type NewLister = typeof listers.$inferInsert;
export type Adopter = typeof adopters.$inferSelect;
export type NewAdopter = typeof adopters.$inferInsert;
export type Dog = typeof dogs.$inferSelect;
export type NewDog = typeof dogs.$inferInsert;
export type Application = typeof applications.$inferSelect;
export type NewApplication = typeof applications.$inferInsert;
