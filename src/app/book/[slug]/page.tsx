import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "../../globals.css"; // adjust path if needed

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "Book an Appointment",
};

export default function BookPage() {
  return (
    <div className={poppins.className}>
      {/* Your page content goes here */}
      <h1>Book an Appointment</h1>
    </div>
  );
}
