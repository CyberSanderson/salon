import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "../../globals.css"; // Note the path is different here

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "Book an Appointment",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        {/* This layout is intentionally minimalist and has no header or footer. */}
        {children}
      </body>
    </html>
  );
}


