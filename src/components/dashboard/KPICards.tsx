'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowDown, ArrowUp, DollarSign, Users, CreditCard, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'

interface KPICardProps {
    title: string
    value: string
    change: string
    trend: 'up' | 'down' | 'neutral'
    icon: React.ElementType
    description: string
}

function KPICard({ title, value, change, trend, icon: Icon, description }: KPICardProps) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                    {title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                <p className="text-xs text-muted-foreground">
                    <span className={cn(
                        "inline-flex items-center mr-1",
                        trend === 'up' ? "text-emerald-500" : trend === 'down' ? "text-rose-500" : "text-muted-foreground"
                    )}>
                        {trend === 'up' ? <ArrowUp className="mr-1 h-3 w-3" /> : trend === 'down' ? <ArrowDown className="mr-1 h-3 w-3" /> : null}
                        {change}
                    </span>
                    {description}
                </p>
            </CardContent>
        </Card>
    )
}

export function KPICards() {
    // TODO: Fetch real data
    const kpis = [
        {
            title: "Ingresos del Período",
            value: "45.231,89 €",
            change: "+20.1%",
            trend: "up" as const,
            icon: DollarSign,
            description: "vs mes anterior"
        },
        {
            title: "Pacientes Atendidos",
            value: "2350",
            change: "+180.1%",
            trend: "up" as const,
            icon: Users,
            description: "vs mes anterior"
        },
        {
            title: "Ticket Medio",
            value: "145,00 €",
            change: "-4.5%",
            trend: "down" as const,
            icon: CreditCard,
            description: "vs mes anterior"
        },
        {
            title: "Tasa de Retorno",
            value: "24.5%",
            change: "+2.4%",
            trend: "up" as const,
            icon: RefreshCw,
            description: "vs mes anterior"
        }
    ]

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {kpis.map((kpi, i) => (
                <KPICard key={i} {...kpi} />
            ))}
        </div>
    )
}
