import './globals.css'

export const metadata = {
  title: 'LaunchPard | 11+ Rocket Science',
  description: 'Gamified AI learning for future scholars. Turn screen time into a moonshot.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}