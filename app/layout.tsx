import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'MUN ADMIN PANEL',
  description: "Created for Technicia'25",
  generator: 'Jatin Mittal',
  icons: {
    icon: '/cumun_logo.png', // or '/favicon.ico' based on your image type
  },
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
