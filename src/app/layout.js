import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/Navigation/AppSidebar'
import { cookies } from 'next/headers'
import AppNavbar from '@/components/Navigation/AppNavbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Email Campaign Manager',
  description: 'Manage your email campaigns with ease',
}

export default async function RootLayout({ children }) {
  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get("sidebar:state")?.value === "true"

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <SidebarProvider defaultOpen={defaultOpen}>
            <AppSidebar />
            <main className='w-full'>

            <AppNavbar />
            {children}
            </main>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

