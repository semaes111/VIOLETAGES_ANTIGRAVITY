'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { CalendarIcon, FileText, Download } from 'lucide-react'
import { DateRange } from 'react-day-picker'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import { generatePDF } from '@/lib/pdf-generator'
import { useTransactions } from '@/hooks/useTransactions'
import { useExpenses } from '@/hooks/useExpenses'

export function ReportGenerator() {
    const [date, setDate] = useState<DateRange | undefined>({
        from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        to: new Date(),
    })
    const [reportType, setReportType] = useState<string>('income')

    // Fetch data (we fetch all and filter in memory for the report for simplicity in this version)
    // In a real app, we would pass the date range to the hooks
    const { transactions } = useTransactions({
        dateFrom: date?.from,
        dateTo: date?.to
    })
    const { expenses } = useExpenses({
        dateFrom: date?.from,
        dateTo: date?.to
    })

    const handleGenerate = () => {
        if (!date?.from || !date?.to) return

        if (reportType === 'income') {
            const rows = transactions?.map(t => [
                format(new Date(t.date), 'dd/MM/yyyy'),
                t.patient?.name || 'Anónimo',
                new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(t.medical_amount),
                new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(t.aesthetic_amount),
                new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(t.cosmetic_amount),
                new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(t.total_amount)
            ]) || []

            const total = transactions?.reduce((acc, t) => acc + t.total_amount, 0) || 0

            generatePDF({
                title: 'Informe de Ingresos',
                dateRange: { from: date.from, to: date.to },
                headers: ['Fecha', 'Paciente', 'Médico', 'Estético', 'Cosmética', 'Total'],
                rows,
                summary: [{ label: 'Total Ingresos', value: new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(total) }]
            })
        } else if (reportType === 'expenses') {
            const rows = expenses?.map(e => [
                format(new Date(e.date), 'dd/MM/yyyy'),
                e.category,
                new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(e.amount)
            ]) || []

            const total = expenses?.reduce((acc, e) => acc + e.amount, 0) || 0

            generatePDF({
                title: 'Informe de Gastos',
                dateRange: { from: date.from, to: date.to },
                headers: ['Fecha', 'Categoría', 'Importe'],
                rows,
                summary: [{ label: 'Total Gastos', value: new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(total) }]
            })
        }
    }

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle>Generador de Informes</CardTitle>
                <CardDescription>
                    Selecciona el tipo de informe y el rango de fechas.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Tipo de Informe</label>
                    <Select value={reportType} onValueChange={setReportType}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="income">Ingresos</SelectItem>
                            <SelectItem value="expenses">Gastos</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Rango de Fechas</label>
                    <div className="grid gap-2">
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    id="date"
                                    variant={"outline"}
                                    className={cn(
                                        "w-full justify-start text-left font-normal",
                                        !date && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {date?.from ? (
                                        date.to ? (
                                            <>
                                                {format(date.from, "LLL dd, y", { locale: es })} -{" "}
                                                {format(date.to, "LLL dd, y", { locale: es })}
                                            </>
                                        ) : (
                                            format(date.from, "LLL dd, y", { locale: es })
                                        )
                                    ) : (
                                        <span>Seleccionar fechas</span>
                                    )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    initialFocus
                                    mode="range"
                                    defaultMonth={date?.from}
                                    selected={date}
                                    onSelect={setDate}
                                    numberOfMonths={2}
                                    locale={es}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>
            </CardContent>
            <CardFooter>
                <Button className="w-full" onClick={handleGenerate} disabled={!date?.from || !date?.to}>
                    <Download className="mr-2 h-4 w-4" />
                    Generar PDF
                </Button>
            </CardFooter>
        </Card>
    )
}
