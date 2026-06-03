import Link from 'next/link';

/** Minimal public site header. Logo links home; CTA goes to the browse feed. */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-10 border-b border-gray-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="text-xl font-extrabold tracking-tight">
          Gur<span className="text-amber-600">fan</span>
        </Link>
        <nav>
          <Link
            href="/dogs"
            className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-amber-700"
          >
            Browse dogs
          </Link>
        </nav>
      </div>
    </header>
  );
}
