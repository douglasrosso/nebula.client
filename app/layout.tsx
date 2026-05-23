import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/components/theme-provider'
import { ConditionalHeader } from '@/components/conditional-header'
import { StoreHydration } from '@/components/store-hydration'
import { SignalRInitializer } from '@/components/signalr-initializer'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: 'Nebula - Sua Loja de Jogos Digitais',
  description: 'Descubra e compre os melhores jogos. Ofertas exclusivas, biblioteca pessoal e uma comunidade ativa de jogadores.',
  keywords: ['jogos', 'games', 'loja digital', 'steam', 'pc gaming'],
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased min-h-screen bg-background text-foreground`} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <StoreHydration />
          <SignalRInitializer>
            <ConditionalHeader />
            {children}
          </SignalRInitializer>
          <Toaster richColors position="top-right" />
          {process.env.NODE_ENV === 'production' && <Analytics />}
        </ThemeProvider>
      </body>
    </html>
  )
}
