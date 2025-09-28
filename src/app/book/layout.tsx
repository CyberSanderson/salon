import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "../globals.css"; // This correctly points to your global styles

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "Book an Appointment | Ariah Desk",
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
