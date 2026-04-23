import type { Metadata } from "next";
import { Jost, Cherry_Bomb_One } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

const jost = Jost({
  variable: "--font-sans",
  subsets: ["latin"],
});

const cherryBomb = Cherry_Bomb_One({
  variable: "--font-heading",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SNAK!",
  description: "Social network for video playback",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${jost.variable} ${cherryBomb.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
