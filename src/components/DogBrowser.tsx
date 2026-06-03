'use client';

/**
 * Client-side browse + filter for the public dog catalogue.
 *
 * The full dataset is baked into the page at build time (static export), so
 * all filtering happens in the browser — instant, no round trips. Filters:
 * location (default Hyderabad), size, age bucket, sex, and temperament.
 */

import { useMemo, useState } from 'react';
import type { PublicDog } from '@/lib/dogs';
import {
  AGE_BUCKET_LABEL,
  SEX_LABEL,
  SIZE_LABEL,
  ageBucket,
  temperamentLabel,
  type AgeBucket,
} from '@/lib/format';
import { DogCard } from './DogCard';

const ANY = 'any';

export function DogBrowser({ dogs }: { dogs: PublicDog[] }) {
  const [city, setCity] = useState('Hyderabad');
  const [size, setSize] = useState<string>(ANY);
  const [age, setAge] = useState<string>(ANY);
  const [sex, setSex] = useState<string>(ANY);
  const [temperaments, setTemperaments] = useState<string[]>([]);

  // Filter option lists derived from the real data, so they never drift.
  const cities = useMemo(
    () => Array.from(new Set(dogs.map((d) => d.city))).sort(),
    [dogs]
  );
  const allTemperaments = useMemo(
    () => Array.from(new Set(dogs.flatMap((d) => d.temperament))).sort(),
    [dogs]
  );

  const filtered = useMemo(() => {
    return dogs.filter((d) => {
      if (city !== ANY && d.city !== city) return false;
      if (size !== ANY && d.size !== size) return false;
      if (sex !== ANY && d.sex !== sex) return false;
      if (age !== ANY && ageBucket(d.ageMonths) !== (age as AgeBucket))
        return false;
      if (
        temperaments.length > 0 &&
        !temperaments.every((t) => d.temperament.includes(t))
      )
        return false;
      return true;
    });
  }, [dogs, city, size, age, sex, temperaments]);

  function toggleTemperament(tag: string) {
    setTemperaments((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }

  function reset() {
    setCity('Hyderabad');
    setSize(ANY);
    setAge(ANY);
    setSex(ANY);
    setTemperaments([]);
  }

  const hasFilters =
    city !== 'Hyderabad' ||
    size !== ANY ||
    age !== ANY ||
    sex !== ANY ||
    temperaments.length > 0;

  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      {/* Filters */}
      <aside className="lg:w-64 lg:shrink-0">
        <div className="rounded-xl border border-gray-200 bg-white p-4 lg:sticky lg:top-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Filters</h2>
            {hasFilters && (
              <button
                onClick={reset}
                className="text-sm text-amber-700 hover:underline"
              >
                Reset
              </button>
            )}
          </div>

          <div className="mt-4 space-y-4">
            <Select
              label="Location"
              value={city}
              onChange={setCity}
              options={[
                { value: ANY, label: 'All cities' },
                ...cities.map((c) => ({ value: c, label: c })),
              ]}
            />
            <Select
              label="Size"
              value={size}
              onChange={setSize}
              options={[
                { value: ANY, label: 'Any size' },
                ...(['small', 'medium', 'large', 'xlarge'] as const).map(
                  (s) => ({ value: s, label: SIZE_LABEL[s] })
                ),
              ]}
            />
            <Select
              label="Age"
              value={age}
              onChange={setAge}
              options={[
                { value: ANY, label: 'Any age' },
                ...(['puppy', 'young', 'adult', 'senior'] as const).map(
                  (a) => ({ value: a, label: AGE_BUCKET_LABEL[a] })
                ),
              ]}
            />
            <Select
              label="Sex"
              value={sex}
              onChange={setSex}
              options={[
                { value: ANY, label: 'Any' },
                ...(['male', 'female', 'unknown'] as const).map((s) => ({
                  value: s,
                  label: SEX_LABEL[s],
                })),
              ]}
            />

            {allTemperaments.length > 0 && (
              <div>
                <span className="block text-sm font-medium text-gray-700">
                  Temperament
                </span>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {allTemperaments.map((t) => {
                    const on = temperaments.includes(t);
                    return (
                      <button
                        key={t}
                        onClick={() => toggleTemperament(t)}
                        aria-pressed={on}
                        className={`rounded-full px-2.5 py-1 text-xs transition ${
                          on
                            ? 'bg-amber-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {temperamentLabel(t)}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Results */}
      <section className="flex-1">
        <p className="mb-4 text-sm text-gray-600" aria-live="polite">
          Showing <span className="font-semibold">{filtered.length}</span> of{' '}
          {dogs.length} {dogs.length === 1 ? 'dog' : 'dogs'}
        </p>
        {filtered.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center">
            <p className="text-3xl" aria-hidden>
              🐕
            </p>
            <p className="mt-2 font-medium text-gray-700">
              No dogs match these filters
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Try widening your search.
            </p>
            <button
              onClick={reset}
              className="mt-4 rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((d) => (
              <DogCard key={d.slug} dog={d} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-gray-700">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
