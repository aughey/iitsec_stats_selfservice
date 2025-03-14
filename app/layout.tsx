import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "IITSEC Data Analyzer",
  description: "Analyze IITSEC submission data with cross-tabulations and visualizations",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/iitsec_stats_selfservice/favicon.ico" />
      </head>
      <body>{children}</body>
    </html>
  );
}
