import './globals.css'
import { SpeedInsights } from '@vercel/speed-insights/next'

export const metadata = {
  title: 'Quest Academy',
  description: '11+ Learning Platform',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <SpeedInsights />
      </body>
    </html>
  )
}
