'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, UserPlus, Repeat, Calendar } from 'lucide-react'
import { usePatients } from '@/hooks/usePatients'

export function AdherenceMetrics() {
    const { metrics } = usePatients()

    const cards = [
        {
            title: "Total Pacientes",
            value: metrics.total.toString(),
            icon: Users,
            description: "Base de datos activa"
        },
        {
            title: "Nuevos (30 días)",
            value: metrics.new.toString(),
            icon: UserPlus,
            description: "Crecimiento reciente"
        },
        {
            title: "Tasa de Retención",
            value: "85%", // Placeholder for now, would require complex calculation
            icon: Repeat,
            description: "Pacientes recurrentes"
        },
        {
            title: "Frecuencia Media",
            value: "45 días", // Placeholder
            icon: Calendar,
            description: "Entre visitas"
        }
    ]

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {cards.map((card, i) => (
                <Card key={i}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            {card.title}
                        </CardTitle>
                        <card.icon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{card.value}</div>
                        <p className="text-xs text-muted-foreground">
                            {card.description}
                        </p>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
