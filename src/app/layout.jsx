import './globals.css'
import { Analytics } from '@vercel/analytics/next'

export const metadata = {
  title: 'Quest Academy',
  description: '11+ Learning Platform',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
