'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
    LayoutDashboard,
    Wallet,
    Receipt,
    Stethoscope,
    Users,
    FileText,
    Settings,
    LogOut,
    Menu,
    X
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/providers/auth-provider'
import { useState } from 'react'
import { ThemeToggle } from '@/components/ui/theme-toggle'

const routes = [
    {
        label: 'Dashboard',
        icon: LayoutDashboard,
        href: '/dashboard',
        color: 'text-sky-500',
    },
    {
        label: 'Ingresos',
        icon: Wallet,
        href: '/ingresos',
        color: 'text-violet-500',
    },
    {
        label: 'Gastos',
        icon: Receipt,
        href: '/gastos',
        color: 'text-pink-700',
    },
    {
        label: 'Tratamientos',
        icon: Stethoscope,
        href: '/tratamientos',
        color: 'text-orange-700',
    },
    {
        label: 'Pacientes',
        icon: Users,
        href: '/pacientes',
        color: 'text-emerald-500',
    },
    {
        label: 'Informes',
        icon: FileText,
        href: '/informes',
        color: 'text-green-700',
    },
    {
        label: 'Configuración',
        icon: Settings,
        href: '/configuracion',
    },
]

export function Sidebar() {
    const pathname = usePathname()
    const { signOut, user } = useAuth()
    const [isOpen, setIsOpen] = useState(false)

    return (
        <>
            <div className="md:hidden fixed top-4 left-4 z-50">
                <Button variant="outline" size="icon" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                </Button>
            </div>

            <div className={cn(
                "space-y-4 py-4 flex flex-col h-full bg-slate-900 text-white transition-transform duration-300 ease-in-out fixed md:relative z-40 w-72 md:translate-x-0",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="px-3 py-2 flex-1">
                    <Link href="/dashboard" className="flex items-center pl-3 mb-14">
                        <div className="relative w-8 h-8 mr-4">
                            {/* Logo placeholder */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-violet-500 to-fuchsia-500 rounded-lg opacity-75 blur-sm" />
                            <div className="relative w-full h-full bg-slate-900 rounded-lg border border-slate-800 flex items-center justify-center">
                                <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">V</span>
                            </div>
                        </div>
                        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                            VioletaGest
                        </h1>
                    </Link>
                    <div className="space-y-1">
                        {routes.map((route) => (
                            <Link
                                key={route.href}
                                href={route.href}
                                onClick={() => setIsOpen(false)}
                                className={cn(
                                    "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition",
                                    pathname === route.href ? "text-white bg-white/10" : "text-zinc-400"
                                )}
                            >
                                <div className="flex items-center flex-1">
                                    <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                                    {route.label}
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
                <div className="px-3 py-2 border-t border-slate-800">
                    <div className="flex items-center justify-between p-3 mb-2">
                        <div className="flex items-center gap-x-2">
                            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center">
                                <span className="text-sm font-medium text-white">
                                    {user?.email?.charAt(0).toUpperCase() || 'U'}
                                </span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs font-medium text-white truncate max-w-[120px]">
                                    {user?.email || 'Usuario'}
                                </span>
                                <span className="text-[10px] text-zinc-400">Online</span>
                            </div>
                        </div>
                        <ThemeToggle />
                    </div>
                    <Button
                        onClick={() => signOut()}
                        variant="ghost"
                        className="w-full justify-start text-zinc-400 hover:text-white hover:bg-white/10"
                    >
                        <LogOut className="h-5 w-5 mr-3" />
                        Cerrar sesión
                    </Button>
                </div>
            </div>

            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </>
    )
}
