import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'sumit_humblx',
  description: 'dynamic button overflow',
  generator: 'sumit',
}

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
