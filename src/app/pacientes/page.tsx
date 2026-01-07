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
import { PatientsTable } from '@/components/tables/PatientsTable'
import { PatientForm } from '@/components/forms/PatientForm'
import { AdherenceMetrics } from '@/components/patients/AdherenceMetrics'
import { usePatients } from '@/hooks/usePatients'

export default function PatientsPage() {
    const [isSheetOpen, setIsSheetOpen] = useState(false)
    const { patients, isLoading } = usePatients()

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Pacientes</h2>
                <div className="flex items-center space-x-2">
                    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                        <SheetTrigger asChild>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                Nuevo Paciente
                            </Button>
                        </SheetTrigger>
                        <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
                            <SheetHeader>
                                <SheetTitle>Nuevo Paciente</SheetTitle>
                                <SheetDescription>
                                    Registra un nuevo paciente.
                                </SheetDescription>
                            </SheetHeader>
                            <div className="mt-6">
                                <PatientForm onSuccess={() => setIsSheetOpen(false)} />
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>

            <AdherenceMetrics />

            <div className="border rounded-md">
                <PatientsTable data={patients || []} isLoading={isLoading} />
            </div>
        </div>
    )
}
