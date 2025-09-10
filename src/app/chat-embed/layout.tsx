import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "../globals.css"; // We still need the base Tailwind styles

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "Ariah Desk Assistant",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        {/* This layout is intentionally minimalist. It has no Header or Footer. */}
        {children}
      </body>
    </html>
  );
}