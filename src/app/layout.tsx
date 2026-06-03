import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Gurfan — Adopt a dog in Hyderabad',
  description:
    'A digital-native dog adoption platform connecting Hyderabad shelters, rescuers, and adopters. Find a friend; give a home.',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
