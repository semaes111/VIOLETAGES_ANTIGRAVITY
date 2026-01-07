'use client'

import * as React from 'react'
import { CalendarIcon, X } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { DateRange } from 'react-day-picker'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import { Badge } from '@/components/ui/badge'
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from '@/components/ui/command'
import { Separator } from '@/components/ui/separator'

interface FilterPanelProps {
    onFiltersChange: (filters: any) => void
}

export function FilterPanel({ onFiltersChange }: FilterPanelProps) {
    const [date, setDate] = React.useState<DateRange | undefined>()
    const [selectedTypes, setSelectedTypes] = React.useState<string[]>([])
    const [selectedMethods, setSelectedMethods] = React.useState<string[]>([])

    const types = [
        { label: 'Médico', value: 'medical' },
        { label: 'Estético', value: 'aesthetic' },
        { label: 'Cosmética', value: 'cosmetic' },
    ]

    const methods = [
        { label: 'Efectivo', value: 'cash' },
        { label: 'Tarjeta', value: 'card' },
        { label: 'Transferencia', value: 'transfer' },
    ]

    React.useEffect(() => {
        onFiltersChange({
            dateFrom: date?.from,
            dateTo: date?.to,
            types: selectedTypes,
            paymentMethods: selectedMethods,
        })
    }, [date, selectedTypes, selectedMethods, onFiltersChange])

    const clearFilters = () => {
        setDate(undefined)
        setSelectedTypes([])
        setSelectedMethods([])
    }

    return (
        <div className="flex flex-col gap-4 p-4 border rounded-lg bg-card text-card-foreground shadow-sm">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Filtros</h3>
                {(date || selectedTypes.length > 0 || selectedMethods.length > 0) && (
                    <Button
                        variant="ghost"
                        onClick={clearFilters}
                        className="h-8 px-2 lg:px-3"
                    >
                        Limpiar filtros
                        <X className="ml-2 h-4 w-4" />
                    </Button>
                )}
            </div>
            <div className="flex flex-wrap gap-4">
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            id="date"
                            variant={"outline"}
                            className={cn(
                                "w-[260px] justify-start text-left font-normal",
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

                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="outline" className="border-dashed">
                            <PlusCircledIcon className="mr-2 h-4 w-4" />
                            Tipo
                            {selectedTypes.length > 0 && (
                                <>
                                    <Separator orientation="vertical" className="mx-2 h-4" />
                                    <Badge
                                        variant="secondary"
                                        className="rounded-sm px-1 font-normal lg:hidden"
                                    >
                                        {selectedTypes.length}
                                    </Badge>
                                    <div className="hidden space-x-1 lg:flex">
                                        {selectedTypes.length > 2 ? (
                                            <Badge
                                                variant="secondary"
                                                className="rounded-sm px-1 font-normal"
                                            >
                                                {selectedTypes.length} seleccionados
                                            </Badge>
                                        ) : (
                                            types
                                                .filter((type) => selectedTypes.includes(type.value))
                                                .map((type) => (
                                                    <Badge
                                                        variant="secondary"
                                                        key={type.value}
                                                        className="rounded-sm px-1 font-normal"
                                                    >
                                                        {type.label}
                                                    </Badge>
                                                ))
                                        )}
                                    </div>
                                </>
                            )}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0" align="start">
                        <Command>
                            <CommandInput placeholder="Tipo de ingreso" />
                            <CommandList>
                                <CommandEmpty>No se encontraron resultados.</CommandEmpty>
                                <CommandGroup>
                                    {types.map((type) => {
                                        const isSelected = selectedTypes.includes(type.value)
                                        return (
                                            <CommandItem
                                                key={type.value}
                                                onSelect={() => {
                                                    if (isSelected) {
                                                        setSelectedTypes(selectedTypes.filter((t) => t !== type.value))
                                                    } else {
                                                        setSelectedTypes([...selectedTypes, type.value])
                                                    }
                                                }}
                                            >
                                                <div
                                                    className={cn(
                                                        "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                                                        isSelected
                                                            ? "bg-primary text-primary-foreground"
                                                            : "opacity-50 [&_svg]:invisible"
                                                    )}
                                                >
                                                    <CheckIcon className={cn("h-4 w-4")} />
                                                </div>
                                                {type.label}
                                            </CommandItem>
                                        )
                                    })}
                                </CommandGroup>
                                {selectedTypes.length > 0 && (
                                    <>
                                        <CommandSeparator />
                                        <CommandGroup>
                                            <CommandItem
                                                onSelect={() => setSelectedTypes([])}
                                                className="justify-center text-center"
                                            >
                                                Limpiar filtros
                                            </CommandItem>
                                        </CommandGroup>
                                    </>
                                )}
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>

                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="outline" className="border-dashed">
                            <PlusCircledIcon className="mr-2 h-4 w-4" />
                            Método de Pago
                            {selectedMethods.length > 0 && (
                                <>
                                    <Separator orientation="vertical" className="mx-2 h-4" />
                                    <Badge
                                        variant="secondary"
                                        className="rounded-sm px-1 font-normal lg:hidden"
                                    >
                                        {selectedMethods.length}
                                    </Badge>
                                    <div className="hidden space-x-1 lg:flex">
                                        {selectedMethods.length > 2 ? (
                                            <Badge
                                                variant="secondary"
                                                className="rounded-sm px-1 font-normal"
                                            >
                                                {selectedMethods.length} seleccionados
                                            </Badge>
                                        ) : (
                                            methods
                                                .filter((method) => selectedMethods.includes(method.value))
                                                .map((method) => (
                                                    <Badge
                                                        variant="secondary"
                                                        key={method.value}
                                                        className="rounded-sm px-1 font-normal"
                                                    >
                                                        {method.label}
                                                    </Badge>
                                                ))
                                        )}
                                    </div>
                                </>
                            )}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0" align="start">
                        <Command>
                            <CommandInput placeholder="Método de pago" />
                            <CommandList>
                                <CommandEmpty>No se encontraron resultados.</CommandEmpty>
                                <CommandGroup>
                                    {methods.map((method) => {
                                        const isSelected = selectedMethods.includes(method.value)
                                        return (
                                            <CommandItem
                                                key={method.value}
                                                onSelect={() => {
                                                    if (isSelected) {
                                                        setSelectedMethods(selectedMethods.filter((m) => m !== method.value))
                                                    } else {
                                                        setSelectedMethods([...selectedMethods, method.value])
                                                    }
                                                }}
                                            >
                                                <div
                                                    className={cn(
                                                        "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                                                        isSelected
                                                            ? "bg-primary text-primary-foreground"
                                                            : "opacity-50 [&_svg]:invisible"
                                                    )}
                                                >
                                                    <CheckIcon className={cn("h-4 w-4")} />
                                                </div>
                                                {method.label}
                                            </CommandItem>
                                        )
                                    })}
                                </CommandGroup>
                                {selectedMethods.length > 0 && (
                                    <>
                                        <CommandSeparator />
                                        <CommandGroup>
                                            <CommandItem
                                                onSelect={() => setSelectedMethods([])}
                                                className="justify-center text-center"
                                            >
                                                Limpiar filtros
                                            </CommandItem>
                                        </CommandGroup>
                                    </>
                                )}
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
            </div>
        </div>
    )
}

function PlusCircledIcon({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <circle cx="12" cy="12" r="10" />
            <path d="M8 12h8" />
            <path d="M12 8v8" />
        </svg>
    )
}

function CheckIcon({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <polyline points="20 6 9 17 4 12" />
        </svg>
    )
}
