import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'MUN ADMIN PANEL',
  description: "Created for Technicia'25",
  generator: 'Jatin Mittal',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
