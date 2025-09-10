import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-white border-t">
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left">
          {/* Brand Name and Copyright */}
          <div>
            <Link href="/" className="text-2xl font-bold text-gray-800">
              Ariah Desk
            </Link>
            <p className="mt-2 text-sm text-gray-500">
              &copy; 2025 Ariah Desk. All Rights Reserved.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="mt-6 md:mt-0">
            <Link
              href="/#pricing"
              className="text-gray-600 hover:text-teal-500 mx-3"
            >
              Pricing
            </Link>
            <Link
              href="/affiliates"
              className="text-gray-600 hover:text-teal-500 mx-3"
            >
              Affiliates
            </Link>
            <Link
              href="/terms-of-service"
              className="text-gray-600 hover:text-teal-500 mx-3"
            >
              Terms of Service
            </Link>
            <Link
              href="/privacy-policy"
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