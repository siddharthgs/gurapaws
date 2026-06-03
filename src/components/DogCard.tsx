import Link from 'next/link';
import type { PublicDog } from '@/lib/dogs';
import {
  SIZE_SHORT,
  SEX_LABEL,
  formatAge,
  statusBadge,
  temperamentLabel,
} from '@/lib/format';
import { DogPhoto } from './DogPhoto';

/** A single dog in the browse grid. Links to its detail page by slug. */
export function DogCard({ dog }: { dog: PublicDog }) {
  const badge = statusBadge(dog.status);
  return (
    <Link
      href={`/dogs/${dog.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md focus:outline-none focus:ring-2 focus:ring-amber-500"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <DogPhoto name={dog.name} photo={dog.photos[0]} />
        <span
          className={`absolute left-2 top-2 rounded-full px-2 py-0.5 text-xs font-medium ${badge.className}`}
        >
          {badge.label}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-amber-700">
            {dog.name}
          </h3>
          <span className="shrink-0 text-sm text-gray-500">
            {formatAge(dog.ageMonths)}
          </span>
        </div>
        <p className="mt-0.5 text-sm text-gray-600">
          {dog.breed ?? 'Indie / mixed'} · {SIZE_SHORT[dog.size]} ·{' '}
          {SEX_LABEL[dog.sex]}
        </p>
        <p className="mt-1 text-sm text-gray-500">
          📍 {dog.area ? `${dog.area}, ` : ''}
          {dog.city}
        </p>
        {dog.temperament.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {dog.temperament.slice(0, 3).map((t) => (
              <span
                key={t}
                className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600"
              >
                {temperamentLabel(t)}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
