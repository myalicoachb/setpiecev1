'use client'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { Button, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@setpiece/ui'
import { Menu, BookOpen, Video, Palette, LayoutDashboard, LogOut, User } from 'lucide-react'
import { useState } from 'react'

const navItems = [
  { href: '/videos', label: 'الفيديوهات', icon: Video },
  { href: '/courses', label: 'الدورات', icon: BookOpen },
  { href: '/pitch-editor', label: 'محرر الملعب', icon: Palette },
]

export function Header() {
  const { data: session } = useSession()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-800 bg-black/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold text-white">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold">S</span>
          ست بيس
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-400 transition-colors hover:bg-gray-800 hover:text-white">
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-lg border border-gray-700 px-3 py-1.5 text-sm text-gray-300 hover:bg-gray-800">
                  <User className="h-4 w-4" />
                  {session.user?.name}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>{session.user?.email}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard" className="flex items-center gap-2"><LayoutDashboard className="h-4 w-4" /> لوحة التحكم</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()} className="flex items-center gap-2 text-red-400">
                  <LogOut className="h-4 w-4" /> تسجيل خروج
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/login">
              <Button variant="primary" size="sm">تسجيل الدخول</Button>
            </Link>
          )}
          <button onClick={() => setMobileOpen(!mobileOpen)} className="rounded-lg p-2 text-gray-400 hover:bg-gray-800 md:hidden">
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  )
}
