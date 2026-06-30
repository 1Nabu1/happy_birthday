import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Төрсөн өдрийн мэнд, My Gurl! 🎉",
  description: "Чамд зориулсан нэгэн онцгой баяр.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="mn">
      <body>{children}</body>
    </html>
  );
}
