// src/components/Footer.tsx
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-white border-t">
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left">
          {/* Brand Name and Copyright */}
          <div>
            <Link href="/" className="text-2xl font-bold text-gray-800">
              Local Lead Bot
            </Link>
            <p className="mt-2 text-sm text-gray-500">
              &copy; 2025 Local Lead Bot. All Rights Reserved.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="mt-6 md:mt-0">
            <Link
              href="/#pricing" // Example link, can be changed later
              className="text-gray-600 hover:text-teal-500 mx-3"
            >
              Pricing
            </Link>
            <Link
              href="/#features" // Example link
              className="text-gray-600 hover:text-teal-500 mx-3"
            >
              Features
            </Link>
            <Link
              href="/privacy-policy" // Example link
              className="text-gray-600 hover:text-teal-500 mx-3"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}