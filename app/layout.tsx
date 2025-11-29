import { NextAuthProvider } from "./providers"; // We will create this file
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Roast Lab",
  description: "Get roasted by AI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <NextAuthProvider>{children}</NextAuthProvider>
      </body>
    </html>
  );
}