import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 py-16 text-center">
      <div className="max-w-2xl">
        <span className="mb-6 inline-block rounded-full bg-amber-100 px-4 py-1 text-sm font-medium text-amber-800">
          🐾 Hyderabad
        </span>
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl">
          Gur<span className="text-amber-600">fan</span>
        </h1>
        <p className="mt-6 text-lg text-gray-600 sm:text-xl">
          Every adoptable dog in Hyderabad, in one place. We are building the
          fastest way for shelters and rescuers to list dogs — and for adopters
          to find their new best friend.
        </p>
        <div className="mt-10 flex justify-center">
          <Link
            href="/dogs"
            className="rounded-xl bg-amber-600 px-8 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
          >
            Browse adoptable dogs →
          </Link>
        </div>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/dogs"
            className="rounded-lg border border-gray-200 bg-white px-6 py-4 shadow-sm transition hover:border-amber-300 hover:shadow"
          >
            <p className="text-2xl font-bold text-amber-600">For adopters</p>
            <p className="mt-1 text-sm text-gray-500">
              Browse real, adoptable dogs near you.
            </p>
          </Link>
          <div className="rounded-lg border border-gray-200 bg-white px-6 py-4 shadow-sm">
            <p className="text-2xl font-bold text-amber-600">For shelters</p>
            <p className="mt-1 text-sm text-gray-500">
              List a rescue in minutes, manage applications.
            </p>
          </div>
        </div>
        <p className="mt-12 text-sm text-gray-400">
          A digital-native dog adoption charity · Built to scale across India
        </p>
      </div>
    </main>
  );
}
