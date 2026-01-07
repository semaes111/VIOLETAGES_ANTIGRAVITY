'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { Database } from '@/types/database'
import { toast } from 'sonner'

type Patient = Database['violeta_gest']['Tables']['patients']['Row']
type PatientInsert = Database['violeta_gest']['Tables']['patients']['Insert']
type PatientUpdate = Database['violeta_gest']['Tables']['patients']['Update']

type PatientsFilter = {
    search?: string
    status?: string
}

export function usePatients(filters?: PatientsFilter) {
    const supabase = createClient()
    const queryClient = useQueryClient()

    const { data: patients, isLoading, error } = useQuery({
        queryKey: ['patients', filters],
        queryFn: async () => {
            let query = supabase
                .schema('violeta_gest')
                .from('patients')
                .select('*')
                .order('name')

            if (filters?.search) {
                query = query.ilike('name', `%${filters.search}%`)
            }
            if (filters?.status) {
                query = query.eq('status', filters.status)
            }

            const { data, error } = await query

            if (error) throw error
            return data as Patient[]
        },
    })

    // Calculate metrics
    const totalPatients = patients?.length || 0
    const activePatients = patients?.filter(p => p.status === 'active').length || 0

    // This is a simplified calculation. In a real app, you'd query transactions to find new patients
    // For now, we'll assume patients created in the last 30 days are "new"
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    const newPatients = patients?.filter(p => new Date(p.created_at) >= thirtyDaysAgo).length || 0

    const createPatient = useMutation({
        mutationFn: async (newPatient: PatientInsert) => {
            const { data, error } = await supabase
                .schema('violeta_gest')
                .from('patients')
                // @ts-ignore
                .insert(newPatient)
                .select()
                .single()

            if (error) throw error
            return data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['patients'] })
            toast.success('Paciente registrado correctamente')
        },
        onError: (error) => {
            toast.error('Error al registrar el paciente: ' + error.message)
        },
    })

    const updatePatient = useMutation({
        mutationFn: async ({ id, ...updates }: PatientUpdate & { id: string }) => {
            const { data, error } = await supabase
                .schema('violeta_gest')
                .from('patients')
                // @ts-ignore
                .update(updates)
                .eq('id', id)
                .select()
                .single()

            if (error) throw error
            return data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['patients'] })
            toast.success('Paciente actualizado correctamente')
        },
        onError: (error) => {
            toast.error('Error al actualizar el paciente: ' + error.message)
        },
    })

    const deletePatient = useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase
                .schema('violeta_gest')
                .from('patients')
                .delete()
                .eq('id', id)

            if (error) throw error
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['patients'] })
            toast.success('Paciente eliminado correctamente')
        },
        onError: (error) => {
            toast.error('Error al eliminar el paciente: ' + error.message)
        },
    })

    return {
        patients,
        isLoading,
        error,
        metrics: {
            total: totalPatients,
            active: activePatients,
            new: newPatients,
        },
        createPatient,
        updatePatient,
        deletePatient,
    }
}
