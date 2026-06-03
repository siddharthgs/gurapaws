import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { SiteHeader } from '@/components/SiteHeader';
import { DogPhoto } from '@/components/DogPhoto';
import { ApplyCta } from '@/components/ApplyCta';
import { getBrowseDogSlugs, getDogBySlug } from '@/lib/dogs';
import {
  LISTER_TYPE_LABEL,
  SEX_LABEL,
  SIZE_LABEL,
  formatAge,
  statusBadge,
  temperamentLabel,
} from '@/lib/format';

// Pre-render one static page per browseable dog. Unknown slugs 404.
export const dynamicParams = false;

export async function generateStaticParams() {
  const slugs = await getBrowseDogSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const dog = await getDogBySlug(slug);
  if (!dog) return { title: 'Dog not found · GuraPaws' };
  const where = dog.area ? `${dog.area}, ${dog.city}` : dog.city;
  return {
    title: `${dog.name} · Adopt in ${dog.city} · GuraPaws`,
    description:
      dog.description ??
      `Meet ${dog.name}, a ${dog.breed ?? 'rescue dog'} looking for a home in ${where}.`,
  };
}

export default async function DogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const dog = await getDogBySlug(slug);
  if (!dog) notFound();

  const badge = statusBadge(dog.status);
  const where = dog.area ? `${dog.area}, ${dog.city}` : dog.city;
  const adoptable = dog.status === 'available' || dog.status === 'pending';

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
        <Link
          href="/dogs"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-amber-700"
        >
          ← Back to all dogs
        </Link>

        <div className="mt-4 grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Photos */}
          <div>
            <div className="aspect-[4/3] w-full overflow-hidden rounded-2xl border border-gray-200">
              <DogPhoto name={dog.name} photo={dog.photos[0]} />
            </div>
            {dog.photos.length > 1 && (
              <div className="mt-3 grid grid-cols-4 gap-2">
                {dog.photos.slice(1, 5).map((p, i) => (
                  <div
                    key={i}
                    className="aspect-square overflow-hidden rounded-lg border border-gray-200"
                  >
                    <DogPhoto name={dog.name} photo={p} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Profile */}
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
                {dog.name}
              </h1>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${badge.className}`}
              >
                {badge.label}
              </span>
            </div>
            <p className="mt-1 text-gray-600">📍 {where}</p>

            <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 text-sm sm:grid-cols-4">
              <Fact label="Breed" value={dog.breed ?? 'Indie / mixed'} />
              <Fact label="Age" value={formatAge(dog.ageMonths)} />
              <Fact label="Size" value={SIZE_LABEL[dog.size]} />
              <Fact label="Sex" value={SEX_LABEL[dog.sex]} />
            </dl>

            {dog.temperament.length > 0 && (
              <div className="mt-5">
                <h2 className="text-sm font-medium text-gray-700">
                  Temperament
                </h2>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {dog.temperament.map((t) => (
                    <span
                      key={t}
                      className="rounded-full bg-gray-100 px-2.5 py-1 text-sm text-gray-700"
                    >
                      {temperamentLabel(t)}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {dog.description && (
              <div className="mt-5">
                <h2 className="text-sm font-medium text-gray-700">
                  About {dog.name}
                </h2>
                <p className="mt-1 whitespace-pre-line text-gray-700">
                  {dog.description}
                </p>
              </div>
            )}

            {/* Lister / trust signal */}
            <div className="mt-6 rounded-xl border border-gray-200 bg-gray-50 p-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-gray-900">
                  {dog.lister.name}
                </span>
                {dog.lister.verified && (
                  <span className="rounded-full bg-sky-100 px-2 py-0.5 text-xs font-medium text-sky-800">
                    ✓ Verified
                  </span>
                )}
              </div>
              <p className="text-xs uppercase tracking-wide text-gray-500">
                {LISTER_TYPE_LABEL[dog.lister.type]}
                {dog.lister.area ? ` · ${dog.lister.area}` : ''}
              </p>
              {dog.lister.about && (
                <p className="mt-2 text-sm text-gray-600">{dog.lister.about}</p>
              )}
            </div>

            {/* Apply CTA — wires into GURA-6 */}
            <div className="mt-6">
              {adoptable ? (
                <ApplyCta dogName={dog.name} />
              ) : (
                <p className="rounded-xl bg-gray-100 px-4 py-3 text-sm text-gray-600">
                  {dog.name} is no longer available for adoption.
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-gray-500">{label}</dt>
      <dd className="mt-0.5 font-medium text-gray-900">{value}</dd>
    </div>
  );
}
