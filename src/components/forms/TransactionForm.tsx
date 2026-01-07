'use client'

import { useState, useEffect } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { CalendarIcon, Check, ChevronsUpDown, Plus, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import { Input } from '@/components/ui/input'
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useTransactions } from '@/hooks/useTransactions'
import { createClient } from '@/lib/supabase/client'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Database } from '@/types/database'

const transactionSchema = z.object({
    date: z.date(),
    patient_id: z.string(),
    treatments: z.array(z.object({
        id: z.string(),
        name: z.string(),
        quantity: z.number().min(1),
        price: z.number().min(0),
        type: z.string(),
    })).min(1, "Debe añadir al menos un tratamiento"),
    cash_amount: z.number().min(0),
    card_amount: z.number().min(0),
    transfer_amount: z.number().min(0),
    notes: z.string().optional(),
}).refine((data) => {
    const total = data.treatments.reduce((acc, t) => acc + (t.price * t.quantity), 0)
    const payments = data.cash_amount + data.card_amount + data.transfer_amount
    return Math.abs(total - payments) < 0.01
}, {
    message: "La suma de los pagos debe coincidir con el total",
    path: ["cash_amount"], // Attach error to cash_amount
})

type TransactionFormValues = z.infer<typeof transactionSchema>

export function TransactionForm({ onSuccess }: { onSuccess?: () => void }) {
    const supabase = createClient()
    const { createTransaction } = useTransactions()
    const [openPatient, setOpenPatient] = useState(false)
    const [openTreatment, setOpenTreatment] = useState(false)

    // Fetch patients
    const { data: patients } = useQuery({
        queryKey: ['patients'],
        queryFn: async () => {
            const { data } = await supabase.from('patients').select('id, name').order('name')
            return (data || []) as { id: string; name: string }[]
        }
    })

    // Fetch treatments
    const { data: treatmentsList } = useQuery({
        queryKey: ['treatments'],
        queryFn: async () => {
            const { data } = await supabase.from('treatments').select('*').order('name')
            return (data || []) as Database['public']['Tables']['treatments']['Row'][]
        }
    })

    const form = useForm<TransactionFormValues>({
        resolver: zodResolver(transactionSchema),
        defaultValues: {
            date: new Date(),
            treatments: [],
            cash_amount: 0,
            card_amount: 0,
            transfer_amount: 0,
        },
    })

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "treatments",
    })

    const watchTreatments = form.watch("treatments")
    const totalAmount = watchTreatments.reduce((acc, t) => acc + (t.price * t.quantity), 0)

    // Update payments when total changes (simple logic: put everything in cash if 0)
    useEffect(() => {
        const currentPayments = form.getValues("cash_amount") + form.getValues("card_amount") + form.getValues("transfer_amount")
        if (currentPayments === 0 && totalAmount > 0) {
            form.setValue("cash_amount", totalAmount)
        }
    }, [totalAmount, form])

    async function onSubmit(data: TransactionFormValues) {
        try {
            // Calculate amounts by type
            let medical = 0
            let aesthetic = 0
            let cosmetic = 0

            data.treatments.forEach(t => {
                const amount = t.price * t.quantity
                if (t.type === 'medical') medical += amount
                else if (t.type === 'aesthetic') aesthetic += amount
                else if (t.type === 'cosmetic') cosmetic += amount
            })

            await createTransaction.mutateAsync({
                date: data.date.toISOString(),
                patient_id: data.patient_id,
                total_amount: totalAmount,
                cash_amount: data.cash_amount,
                card_amount: data.card_amount,
                transfer_amount: data.transfer_amount,
                medical_amount: medical,
                aesthetic_amount: aesthetic,
                cosmetic_amount: cosmetic,
            })

            form.reset()
            onSuccess?.()
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="date"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Fecha</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-full pl-3 text-left font-normal",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                            >
                                                {field.value ? (
                                                    format(field.value, "PPP", { locale: es })
                                                ) : (
                                                    <span>Seleccionar fecha</span>
                                                )}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={field.value}
                                            onSelect={field.onChange}
                                            disabled={(date) =>
                                                date > new Date() || date < new Date("1900-01-01")
                                            }
                                            initialFocus
                                            locale={es}
                                        />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="patient_id"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Paciente</FormLabel>
                                <Popover open={openPatient} onOpenChange={setOpenPatient}>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant="outline"
                                                role="combobox"
                                                aria-expanded={openPatient}
                                                className={cn(
                                                    "w-full justify-between",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                            >
                                                {field.value
                                                    ? patients?.find((patient) => patient.id === field.value)?.name
                                                    : "Seleccionar paciente..."}
                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[300px] p-0">
                                        <Command>
                                            <CommandInput placeholder="Buscar paciente..." />
                                            <CommandList>
                                                <CommandEmpty>No encontrado.</CommandEmpty>
                                                <CommandGroup>
                                                    {patients?.map((patient) => (
                                                        <CommandItem
                                                            value={patient.name}
                                                            key={patient.id}
                                                            onSelect={() => {
                                                                form.setValue("patient_id", patient.id)
                                                                setOpenPatient(false)
                                                            }}
                                                        >
                                                            <Check
                                                                className={cn(
                                                                    "mr-2 h-4 w-4",
                                                                    patient.id === field.value
                                                                        ? "opacity-100"
                                                                        : "opacity-0"
                                                                )}
                                                            />
                                                            {patient.name}
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <Separator />

                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium">Tratamientos</h3>
                        <Popover open={openTreatment} onOpenChange={setOpenTreatment}>
                            <PopoverTrigger asChild>
                                <Button variant="outline" size="sm">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Añadir Tratamiento
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[300px] p-0" align="end">
                                <Command>
                                    <CommandInput placeholder="Buscar tratamiento..." />
                                    <CommandList>
                                        <CommandEmpty>No encontrado.</CommandEmpty>
                                        <CommandGroup>
                                            {treatmentsList?.map((treatment) => (
                                                <CommandItem
                                                    value={treatment.name}
                                                    key={treatment.id}
                                                    onSelect={() => {
                                                        append({
                                                            id: treatment.id,
                                                            name: treatment.name,
                                                            quantity: 1,
                                                            price: treatment.base_price,
                                                            type: treatment.type,
                                                        })
                                                        setOpenTreatment(false)
                                                    }}
                                                >
                                                    {treatment.name} - {treatment.base_price}€
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                    </div>

                    {fields.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground border border-dashed rounded-lg">
                            No hay tratamientos seleccionados
                        </div>
                    )}

                    <div className="space-y-2">
                        {fields.map((field, index) => (
                            <Card key={field.id} className="p-4">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="md:col-span-1">
                                            <span className="text-sm font-medium">{field.name}</span>
                                            <p className="text-xs text-muted-foreground capitalize">{field.type}</p>
                                        </div>
                                        <FormField
                                            control={form.control}
                                            name={`treatments.${index}.quantity`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-xs text-muted-foreground">Cant:</span>
                                                            <Input type="number" min="1" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} className="h-8 w-20" />
                                                        </div>
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name={`treatments.${index}.price`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-xs text-muted-foreground">Precio:</span>
                                                            <Input type="number" min="0" step="0.01" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} className="h-8 w-24" />
                                                        </div>
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <Button variant="ghost" size="icon" onClick={() => remove(index)} className="text-destructive">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </Card>
                        ))}
                    </div>

                    <div className="flex justify-end text-lg font-bold">
                        Total: {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(totalAmount)}
                    </div>
                </div>

                <Separator />

                <div className="space-y-4">
                    <h3 className="text-lg font-medium">Desglose de Pago</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormField
                            control={form.control}
                            name="cash_amount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Efectivo</FormLabel>
                                    <FormControl>
                                        <Input type="number" min="0" step="0.01" {...field} onChange={e => field.onChange(parseFloat(e.target.value || "0"))} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="card_amount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tarjeta</FormLabel>
                                    <FormControl>
                                        <Input type="number" min="0" step="0.01" {...field} onChange={e => field.onChange(parseFloat(e.target.value || "0"))} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="transfer_amount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Transferencia</FormLabel>
                                    <FormControl>
                                        <Input type="number" min="0" step="0.01" {...field} onChange={e => field.onChange(parseFloat(e.target.value || "0"))} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    {form.formState.errors.cash_amount && (
                        <p className="text-sm font-medium text-destructive">{form.formState.errors.cash_amount.message}</p>
                    )}
                </div>

                <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Notas</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Notas adicionales..." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" className="w-full" disabled={createTransaction.isPending}>
                    {createTransaction.isPending ? "Guardando..." : "Guardar Transacción"}
                </Button>
            </form>
        </Form>
    )
}
