/**
 * Display helpers for dog listings. Pure functions, safe in both server and
 * client components. The DB stores precise machine values (age in months,
 * enum codes); these turn them into human-friendly labels for the UI.
 */

import type { Dog } from '@/db/schema';

/** "4 months", "1 yr 2 mo", "5 years". Falls back gracefully when unknown. */
export function formatAge(ageMonths: number | null): string {
  if (ageMonths == null) return 'Age unknown';
  if (ageMonths < 12) {
    return `${ageMonths} ${ageMonths === 1 ? 'month' : 'months'}`;
  }
  const years = Math.floor(ageMonths / 12);
  const months = ageMonths % 12;
  if (months === 0) return `${years} ${years === 1 ? 'year' : 'years'}`;
  return `${years} yr ${months} mo`;
}

/** Coarse age bucket used by the browse filter. */
export type AgeBucket = 'puppy' | 'young' | 'adult' | 'senior';

export function ageBucket(ageMonths: number | null): AgeBucket | null {
  if (ageMonths == null) return null;
  if (ageMonths < 12) return 'puppy'; // < 1 yr
  if (ageMonths < 36) return 'young'; // 1–3 yrs
  if (ageMonths < 96) return 'adult'; // 3–8 yrs
  return 'senior'; // 8+ yrs
}

export const AGE_BUCKET_LABEL: Record<AgeBucket, string> = {
  puppy: 'Puppy (< 1 yr)',
  young: 'Young (1–3 yrs)',
  adult: 'Adult (3–8 yrs)',
  senior: 'Senior (8+ yrs)',
};

export const SIZE_LABEL: Record<Dog['size'], string> = {
  small: 'Small (< 10 kg)',
  medium: 'Medium (10–25 kg)',
  large: 'Large (25–40 kg)',
  xlarge: 'Extra large (> 40 kg)',
};

export const SIZE_SHORT: Record<Dog['size'], string> = {
  small: 'Small',
  medium: 'Medium',
  large: 'Large',
  xlarge: 'XL',
};

export const SEX_LABEL: Record<Dog['sex'], string> = {
  male: 'Male',
  female: 'Female',
  unknown: 'Unknown',
};

export const LISTER_TYPE_LABEL: Record<'shelter' | 'ngo' | 'rescuer', string> =
  {
    shelter: 'Shelter',
    ngo: 'NGO',
    rescuer: 'Independent rescuer',
  };

/** Badge label + Tailwind colour classes for a dog's listing status. */
export function statusBadge(status: Dog['status']): {
  label: string;
  className: string;
} {
  switch (status) {
    case 'available':
      return {
        label: 'Available',
        className: 'bg-green-100 text-green-800',
      };
    case 'pending':
      return {
        label: 'Application in progress',
        className: 'bg-amber-100 text-amber-800',
      };
    case 'adopted':
      return { label: 'Adopted', className: 'bg-gray-200 text-gray-700' };
    case 'withdrawn':
      return { label: 'Withdrawn', className: 'bg-gray-200 text-gray-700' };
  }
}

/** Turn a temperament tag ("good-with-kids") into a readable label. */
export function temperamentLabel(tag: string): string {
  return tag.replace(/-/g, ' ');
}
