'use client'

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const data = [
    {
        name: 'Ene',
        medical: 4000,
        aesthetic: 2400,
        cosmetic: 2400,
    },
    {
        name: 'Feb',
        medical: 3000,
        aesthetic: 1398,
        cosmetic: 2210,
    },
    {
        name: 'Mar',
        medical: 2000,
        aesthetic: 9800,
        cosmetic: 2290,
    },
    {
        name: 'Abr',
        medical: 2780,
        aesthetic: 3908,
        cosmetic: 2000,
    },
    {
        name: 'May',
        medical: 1890,
        aesthetic: 4800,
        cosmetic: 2181,
    },
    {
        name: 'Jun',
        medical: 2390,
        aesthetic: 3800,
        cosmetic: 2500,
    },
    {
        name: 'Jul',
        medical: 3490,
        aesthetic: 4300,
        cosmetic: 2100,
    },
]

export function RevenueChart() {
    return (
        <Card className="col-span-4">
            <CardHeader>
                <CardTitle>Ingresos</CardTitle>
                <CardDescription>
                    Evolución de ingresos por tipo de servicio
                </CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={350}>
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorMedical" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorAesthetic" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorCosmetic" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#f97316" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <XAxis
                            dataKey="name"
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `${value}€`}
                        />
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <Tooltip
                            contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}
                            itemStyle={{ color: 'hsl(var(--foreground))' }}
                        />
                        <Area
                            type="monotone"
                            dataKey="medical"
                            name="Médico"
                            stroke="#2563eb"
                            fillOpacity={1}
                            fill="url(#colorMedical)"
                        />
                        <Area
                            type="monotone"
                            dataKey="aesthetic"
                            name="Estético"
                            stroke="#10b981"
                            fillOpacity={1}
                            fill="url(#colorAesthetic)"
                        />
                        <Area
                            type="monotone"
                            dataKey="cosmetic"
                            name="Cosmética"
                            stroke="#f97316"
                            fillOpacity={1}
                            fill="url(#colorCosmetic)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}
