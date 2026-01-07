import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { Database } from '@/types/database'
import { toast } from 'sonner'

type Transaction = Database['violeta_gest']['Tables']['transactions']['Row']
type TransactionInsert = Database['violeta_gest']['Tables']['transactions']['Insert']
type TransactionUpdate = Database['violeta_gest']['Tables']['transactions']['Update']

type TransactionsFilter = {
    dateFrom?: Date
    dateTo?: Date
    types?: string[]
    paymentMethods?: string[]
    patientId?: string
    minAmount?: number
    maxAmount?: number
}

export function useTransactions(filters?: TransactionsFilter) {
    const supabase = createClient()
    const queryClient = useQueryClient()

    const { data: transactions, isLoading, error } = useQuery({
        queryKey: ['transactions', filters],
        queryFn: async () => {
            let query = supabase
                .schema('violeta_gest')
                .from('transactions')
                .select(`
          *,
          patient:patients(name)
        `)
                .order('date', { ascending: false })

            if (filters?.dateFrom) {
                query = query.gte('date', filters.dateFrom.toISOString())
            }
            if (filters?.dateTo) {
                query = query.lte('date', filters.dateTo.toISOString())
            }
            if (filters?.patientId) {
                query = query.eq('patient_id', filters.patientId)
            }
            if (filters?.minAmount) {
                query = query.gte('total_amount', filters.minAmount)
            }
            if (filters?.maxAmount) {
                query = query.lte('total_amount', filters.maxAmount)
            }

            // Note: Types and Payment Methods filtering might need more complex logic 
            // or client-side filtering if not supported directly by simple column queries
            // For now, we'll assume basic filtering or handle it in the UI if needed.

            const { data, error } = await query

            if (error) throw error
            return data as (Transaction & { patient: { name: string } | null })[]
        },
    })

    const createTransaction = useMutation({
        mutationFn: async (newTransaction: TransactionInsert) => {
            const { data, error } = await supabase
                .schema('violeta_gest')
                .from('transactions')
                // @ts-ignore
                .insert(newTransaction)
                .select()
                .single()

            if (error) throw error
            return data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['transactions'] })
            toast.success('Transacción creada correctamente')
        },
        onError: (error) => {
            toast.error('Error al crear la transacción: ' + error.message)
        },
    })

    const updateTransaction = useMutation({
        mutationFn: async ({ id, ...updates }: TransactionUpdate & { id: string }) => {
            const { data, error } = await supabase
                .schema('violeta_gest')
                .from('transactions')
                // @ts-ignore
                .update(updates)
                .eq('id', id)
                .select()
                .single()

            if (error) throw error
            return data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['transactions'] })
            toast.success('Transacción actualizada correctamente')
        },
        onError: (error) => {
            toast.error('Error al actualizar la transacción: ' + error.message)
        },
    })

    const deleteTransaction = useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase
                .schema('violeta_gest')
                .from('transactions')
                .delete()
                .eq('id', id)

            if (error) throw error
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['transactions'] })
            toast.success('Transacción eliminada correctamente')
        },
        onError: (error) => {
            toast.error('Error al eliminar la transacción: ' + error.message)
        },
    })

    return {
        transactions,
        isLoading,
        error,
        createTransaction,
        updateTransaction,
        deleteTransaction,
    }
}
