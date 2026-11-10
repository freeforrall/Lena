import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "The Shared Space",
  description: "A private shared routine and check-in space",
  manifest: "/manifest.json",
  themeColor: "#171321"
};
export default function RootLayout({ children }: Readonly<{children: React.ReactNode}>) {
  return <html lang="en"><body>{children}</body></html>;
}