import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Header } from '@/components/header'
import { StoreHydration } from '@/components/store-hydration'
import { LoginModal } from '@/components/login-modal'
import './globals.css'

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: 'Nebula - Sua Loja de Jogos Digitais',
  description: 'Descubra e compre os melhores jogos. Ofertas exclusivas, biblioteca pessoal e uma comunidade ativa de jogadores.',
  generator: 'v0.app',
  keywords: ['jogos', 'games', 'loja digital', 'steam', 'pc gaming'],
}

export const viewport: Viewport = {
  themeColor: '#0a0a0f',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className="bg-background" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased min-h-screen`} suppressHydrationWarning>
        <StoreHydration />
        <LoginModal />
        <Header />
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
