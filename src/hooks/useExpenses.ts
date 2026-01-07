'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { Database } from '@/types/database'
import { toast } from 'sonner'

type Expense = Database['violeta_gest']['Tables']['expenses']['Row']
type ExpenseInsert = Database['violeta_gest']['Tables']['expenses']['Insert']
type ExpenseUpdate = Database['violeta_gest']['Tables']['expenses']['Update']

type ExpensesFilter = {
    dateFrom?: Date
    dateTo?: Date
    category?: string
    supplierId?: string
}

export function useExpenses(filters?: ExpensesFilter) {
    const supabase = createClient()
    const queryClient = useQueryClient()

    const { data: expenses, isLoading, error } = useQuery({
        queryKey: ['expenses', filters],
        queryFn: async () => {
            let query = supabase
                .schema('violeta_gest')
                .from('expenses')
                .select('*')
                .order('date', { ascending: false })

            if (filters?.dateFrom) {
                query = query.gte('date', filters.dateFrom.toISOString())
            }
            if (filters?.dateTo) {
                query = query.lte('date', filters.dateTo.toISOString())
            }
            if (filters?.category) {
                query = query.eq('category', filters.category)
            }
            if (filters?.supplierId) {
                query = query.eq('supplier_id', filters.supplierId)
            }

            const { data, error } = await query

            if (error) throw error
            return data as Expense[]
        },
    })

    // Calculate totals
    const totalExpenses = expenses?.reduce((acc, curr) => acc + curr.amount, 0) || 0
    const totalIVA = expenses?.reduce((acc, curr) => acc + curr.iva_amount, 0) || 0

    const createExpense = useMutation({
        mutationFn: async (newExpense: ExpenseInsert) => {
            const { data, error } = await supabase
                .schema('violeta_gest')
                .from('expenses')
                // @ts-ignore
                .insert(newExpense)
                .select()
                .single()

            if (error) throw error
            return data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['expenses'] })
            toast.success('Gasto registrado correctamente')
        },
        onError: (error) => {
            toast.error('Error al registrar el gasto: ' + error.message)
        },
    })

    const updateExpense = useMutation({
        mutationFn: async ({ id, ...updates }: ExpenseUpdate & { id: string }) => {
            const { data, error } = await supabase
                .schema('violeta_gest')
                .from('expenses')
                // @ts-ignore
                .update(updates)
                .eq('id', id)
                .select()
                .single()

            if (error) throw error
            return data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['expenses'] })
            toast.success('Gasto actualizado correctamente')
        },
        onError: (error) => {
            toast.error('Error al actualizar el gasto: ' + error.message)
        },
    })

    const deleteExpense = useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase
                .schema('violeta_gest')
                .from('expenses')
                .delete()
                .eq('id', id)

            if (error) throw error
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['expenses'] })
            toast.success('Gasto eliminado correctamente')
        },
        onError: (error) => {
            toast.error('Error al eliminar el gasto: ' + error.message)
        },
    })

    return {
        expenses,
        isLoading,
        error,
        totalExpenses,
        totalIVA,
        createExpense,
        updateExpense,
        deleteExpense,
    }
}
