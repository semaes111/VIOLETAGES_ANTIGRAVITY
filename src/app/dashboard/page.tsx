'use client'

import { CalendarDateRangePicker } from '@/components/dashboard/date-range-picker'
import { KPICards } from '@/components/dashboard/KPICards'
import { RevenueChart } from '@/components/dashboard/RevenueChart'
import { PaymentMethodsChart } from '@/components/dashboard/PaymentMethodsChart'
import { TopTreatmentsChart } from '@/components/dashboard/TopTreatmentsChart'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function DashboardPage() {
    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                <div className="flex items-center space-x-2">
                    <CalendarDateRangePicker />
                    <Button>Descargar Informe</Button>
                </div>
            </div>
            <Tabs defaultValue="overview" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="overview">Resumen</TabsTrigger>
                    <TabsTrigger value="analytics" disabled>
                        Analítica
                    </TabsTrigger>
                    <TabsTrigger value="reports" disabled>
                        Informes
                    </TabsTrigger>
                    <TabsTrigger value="notifications" disabled>
                        Notificaciones
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="space-y-4">
                    <KPICards />
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                        <RevenueChart />
                        <div className="col-span-4 lg:col-span-3 grid gap-4">
                            <PaymentMethodsChart />
                            <TopTreatmentsChart />
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}
