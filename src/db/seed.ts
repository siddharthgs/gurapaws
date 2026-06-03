/**
 * Development seed: a handful of realistic Hyderabad listers, dogs, adopters,
 * and applications. Run with `npm run db:seed` (assumes migrations applied).
 *
 * Idempotent: it clears the four tables (FK-safe order) and re-inserts, so it
 * is safe to run repeatedly in dev. Never run against production.
 */

import { client, db } from './index';
import {
  adopters,
  applications,
  dogs,
  listers,
  type NewAdopter,
  type NewApplication,
  type NewDog,
  type NewLister,
} from './schema';

async function main() {
  console.log('Seeding development data ...');

  // Clear in FK-safe order (children first).
  await db.delete(applications);
  await db.delete(dogs);
  await db.delete(adopters);
  await db.delete(listers);

  // --- Listers (supply) ---------------------------------------------------
  const listerRows: NewLister[] = [
    {
      type: 'shelter',
      name: 'Blue Cross of Hyderabad',
      email: 'adopt@bluecrosshyd.example.org',
      phone: '+91 40 2355 4355',
      city: 'Hyderabad',
      area: 'Jubilee Hills',
      about:
        'One of Hyderabad’s oldest animal-welfare shelters, rehoming rescued dogs since 1993.',
      verified: true,
    },
    {
      type: 'ngo',
      name: 'People For Animals — Hyderabad',
      email: 'hello@pfa-hyd.example.org',
      phone: '+91 90000 11122',
      city: 'Hyderabad',
      area: 'Gachibowli',
      about: 'Volunteer-run NGO rescuing and rehabilitating street dogs.',
      verified: true,
    },
    {
      type: 'rescuer',
      name: 'Sahana Reddy',
      email: 'sahana.rescues@example.com',
      phone: '+91 98480 22233',
      city: 'Hyderabad',
      area: 'Madhapur',
      about:
        'Independent foster-and-rescue; usually has 3–4 indies looking for homes.',
      verified: false,
    },
  ];
  const insertedListers = await db
    .insert(listers)
    .values(listerRows)
    .returning();
  const byName = Object.fromEntries(insertedListers.map((l) => [l.name, l.id]));
  console.log(`  + ${insertedListers.length} listers`);

  // --- Dogs (listings) ----------------------------------------------------
  const dogRows: NewDog[] = [
    {
      slug: 'bujji-indie-jubilee-hills',
      listerId: byName['Blue Cross of Hyderabad'],
      name: 'Bujji',
      breed: 'Indie (Indian Pariah)',
      size: 'medium',
      ageMonths: 14,
      sex: 'female',
      temperament: ['friendly', 'good-with-kids', 'house-trained'],
      photos: [],
      description:
        'Gentle indie girl rescued near KBR Park. Loves walks and curling up at your feet.',
      status: 'available',
      area: 'Jubilee Hills',
    },
    {
      slug: 'rocky-labrador-gachibowli',
      listerId: byName['People For Animals — Hyderabad'],
      name: 'Rocky',
      breed: 'Labrador (mix)',
      size: 'large',
      ageMonths: 36,
      sex: 'male',
      temperament: ['energetic', 'loyal', 'needs-a-yard'],
      photos: [],
      description:
        'Surrendered when his family relocated. Well-trained, great with adults, needs daily exercise.',
      status: 'available',
      area: 'Gachibowli',
    },
    {
      slug: 'mishti-pup-madhapur',
      listerId: byName['Sahana Reddy'],
      name: 'Mishti',
      breed: 'Indie (Indian Pariah)',
      size: 'small',
      ageMonths: 4,
      sex: 'female',
      temperament: ['playful', 'curious'],
      photos: [],
      description:
        'Bottle-fed pup from a litter of five. Vaccinated, dewormed, ready in 2 weeks.',
      status: 'available',
      area: 'Madhapur',
    },
    {
      slug: 'kaalu-indie-gachibowli',
      listerId: byName['People For Animals — Hyderabad'],
      name: 'Kaalu',
      breed: 'Indie (Indian Pariah)',
      size: 'medium',
      ageMonths: 24,
      sex: 'male',
      temperament: ['calm', 'shy', 'good-with-other-dogs'],
      photos: [],
      description:
        'Quiet, dignified boy who warms up fast. Would suit a calm household.',
      status: 'pending',
      area: 'Gachibowli',
    },
    {
      slug: 'laila-beagle-jubilee-hills',
      listerId: byName['Blue Cross of Hyderabad'],
      name: 'Laila',
      breed: 'Beagle',
      size: 'small',
      ageMonths: 60,
      sex: 'female',
      temperament: ['affectionate', 'food-motivated', 'vocal'],
      photos: [],
      description:
        'Senior beagle whose owner passed away. Healthy, house-trained, deserves a cosy retirement.',
      status: 'available',
      area: 'Jubilee Hills',
    },
    {
      slug: 'simba-gsd-madhapur',
      listerId: byName['Sahana Reddy'],
      name: 'Simba',
      breed: 'German Shepherd (mix)',
      size: 'large',
      ageMonths: 18,
      sex: 'male',
      temperament: ['protective', 'smart', 'needs-training'],
      photos: [],
      description:
        'Found abandoned on ORR. Intelligent and eager to please; ideal for an active adopter.',
      status: 'available',
      area: 'Madhapur',
    },
  ];
  const insertedDogs = await db.insert(dogs).values(dogRows).returning();
  const dogBySlug = Object.fromEntries(insertedDogs.map((d) => [d.slug, d.id]));
  console.log(`  + ${insertedDogs.length} dogs`);

  // --- Adopters (demand) --------------------------------------------------
  const adopterRows: NewAdopter[] = [
    {
      name: 'Arjun Mehta',
      email: 'arjun.mehta@example.com',
      phone: '+91 99999 12345',
      city: 'Hyderabad',
      about:
        'Work-from-home, ground-floor flat in Kondapur with a small garden. First-time adopter.',
    },
    {
      name: 'Priya Nair',
      email: 'priya.nair@example.com',
      phone: '+91 99999 67890',
      city: 'Hyderabad',
      about:
        'Grew up with dogs; looking for a calm companion in Banjara Hills.',
    },
  ];
  const insertedAdopters = await db
    .insert(adopters)
    .values(adopterRows)
    .returning();
  const adopterByEmail = Object.fromEntries(
    insertedAdopters.map((a) => [a.email, a.id])
  );
  console.log(`  + ${insertedAdopters.length} adopters`);

  // --- Applications (the two-sided link) ----------------------------------
  const applicationRows: NewApplication[] = [
    {
      dogId: dogBySlug['kaalu-indie-gachibowli'],
      adopterId: adopterByEmail['arjun.mehta@example.com'],
      status: 'under_review',
      message:
        'Kaalu sounds perfect for my quiet home. I can visit the Gachibowli centre this weekend.',
    },
    {
      dogId: dogBySlug['laila-beagle-jubilee-hills'],
      adopterId: adopterByEmail['priya.nair@example.com'],
      status: 'submitted',
      message:
        'I would love to give Laila a gentle retirement home. Happy to share references.',
    },
  ];
  const insertedApplications = await db
    .insert(applications)
    .values(applicationRows)
    .returning();
  console.log(`  + ${insertedApplications.length} applications`);

  console.log('Seed complete.');
  await client.close();
}

main().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
