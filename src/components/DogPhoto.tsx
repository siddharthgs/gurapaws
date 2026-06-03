/**
 * Dog cover photo with a graceful fallback. Seed listings (and many real
 * rescues) have no photos yet, so we render a warm, deterministic placeholder
 * built from the dog's name instead of a broken image. When a real photo URL
 * exists we render it (unoptimized — the site is a static export).
 */

const PLACEHOLDER_BG = [
  'bg-amber-100',
  'bg-rose-100',
  'bg-sky-100',
  'bg-emerald-100',
  'bg-violet-100',
  'bg-orange-100',
];

function pickBg(seed: string): string {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0;
  return PLACEHOLDER_BG[Math.abs(h) % PLACEHOLDER_BG.length];
}

export function DogPhoto({
  name,
  photo,
  className = '',
}: {
  name: string;
  photo?: string;
  className?: string;
}) {
  if (photo) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={photo}
        alt={name}
        className={`h-full w-full object-cover ${className}`}
      />
    );
  }
  return (
    <div
      className={`flex h-full w-full flex-col items-center justify-center ${pickBg(
        name
      )} ${className}`}
      aria-label={`${name} — photo coming soon`}
      role="img"
    >
      <span className="text-4xl" aria-hidden>
        🐾
      </span>
      <span className="mt-1 text-sm font-medium text-gray-600">
        Photo coming soon
      </span>
    </div>
  );
}
