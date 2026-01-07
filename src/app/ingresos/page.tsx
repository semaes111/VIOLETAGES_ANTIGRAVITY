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
import { TransactionsTable } from '@/components/tables/TransactionsTable'
import { FilterPanel } from '@/components/dashboard/FilterPanel'
import { TransactionForm } from '@/components/forms/TransactionForm'
import { useTransactions } from '@/hooks/useTransactions'

export default function IncomePage() {
    const [filters, setFilters] = useState({})
    const [isSheetOpen, setIsSheetOpen] = useState(false)
    const { transactions, isLoading } = useTransactions(filters)

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Ingresos</h2>
                <div className="flex items-center space-x-2">
                    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                        <SheetTrigger asChild>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                Nueva Transacción
                            </Button>
                        </SheetTrigger>
                        <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
                            <SheetHeader>
                                <SheetTitle>Nueva Transacción</SheetTitle>
                                <SheetDescription>
                                    Registra un nuevo ingreso. Asegúrate de rellenar todos los campos obligatorios.
                                </SheetDescription>
                            </SheetHeader>
                            <div className="mt-6">
                                <TransactionForm onSuccess={() => setIsSheetOpen(false)} />
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
            <div className="space-y-4">
                <FilterPanel onFiltersChange={setFilters} />
                <TransactionsTable data={transactions || []} isLoading={isLoading} />
            </div>
        </div>
    )
}
