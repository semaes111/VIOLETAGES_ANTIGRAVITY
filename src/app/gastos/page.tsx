'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet'
import { ExpensesTable } from '@/components/tables/ExpensesTable'
import { ExpenseForm } from '@/components/forms/ExpenseForm'
import { SupplierChart } from '@/components/expenses/SupplierChart'
import { useExpenses } from '@/hooks/useExpenses'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function ExpensesPage() {
    const [isSheetOpen, setIsSheetOpen] = useState(false)
    const { expenses, isLoading, totalExpenses, totalIVA } = useExpenses()

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Gastos</h2>
                <div className="flex items-center space-x-2">
                    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                        <SheetTrigger asChild>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                Nuevo Gasto
                            </Button>
                        </SheetTrigger>
                        <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
                            <SheetHeader>
                                <SheetTitle>Nuevo Gasto</SheetTitle>
                                <SheetDescription>
                                    Registra un nuevo gasto. Asegúrate de rellenar todos los campos obligatorios.
                                </SheetDescription>
                            </SheetHeader>
                            <div className="mt-6">
                                <ExpenseForm onSuccess={() => setIsSheetOpen(false)} />
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Gastos</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(totalExpenses)}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total IVA Soportado</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(totalIVA)}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <div className="col-span-4 lg:col-span-5">
                    <ExpensesTable data={expenses || []} isLoading={isLoading} />
                </div>
                <SupplierChart />
            </div>
        </div>
    )
}
