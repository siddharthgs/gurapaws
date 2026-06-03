import type { Metadata } from 'next';
import { SiteHeader } from '@/components/SiteHeader';
import { DogBrowser } from '@/components/DogBrowser';
import { getBrowseDogs } from '@/lib/dogs';

export const metadata: Metadata = {
  title: 'Adoptable dogs in Hyderabad · Gurfan',
  description:
    'Browse real, adoptable dogs from Hyderabad shelters, NGOs, and rescuers. Filter by location, size, age, sex, and temperament.',
};

// Read the catalogue from the database at build time and bake it into static
// HTML (the site is a static export). Filtering runs client-side in the browser.
export default async function BrowsePage() {
  const dogs = await getBrowseDogs();

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="mb-6">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
            Adoptable dogs in Hyderabad
          </h1>
          <p className="mt-2 text-gray-600">
            Every dog here is real and looking for a home, listed by a local
            shelter, NGO, or rescuer. Find your new best friend.
          </p>
        </div>
        <DogBrowser dogs={dogs} />
      </main>
    </>
  );
}
