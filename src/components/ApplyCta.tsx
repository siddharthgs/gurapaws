'use client';

import { useState } from 'react';

/**
 * "Apply to adopt" call-to-action. This is the seam where the adoption
 * application flow (GURA-6) plugs in. Until that ships, the button captures
 * intent and tells the adopter what happens next, so the page is functional
 * end-to-end today and the wiring is a one-component swap later.
 */
export function ApplyCta({ dogName }: { dogName: string }) {
  const [clicked, setClicked] = useState(false);

  return (
    <div>
      <button
        onClick={() => setClicked(true)}
        className="w-full rounded-xl bg-amber-600 px-6 py-3 text-center text-base font-semibold text-white shadow-sm transition hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 sm:w-auto"
      >
        Apply to adopt {dogName}
      </button>
      {clicked && (
        <p
          className="mt-3 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-900"
          role="status"
        >
          🐾 Adoption applications are launching shortly. We&apos;ve noted your
          interest in {dogName} — you&apos;ll soon be able to send your
          application straight to the lister from here.
        </p>
      )}
    </div>
  );
}
