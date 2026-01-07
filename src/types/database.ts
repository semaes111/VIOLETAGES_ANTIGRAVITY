export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            patients: {
                Row: {
                    id: string
                    name: string
                    phone: string | null
                    email: string | null
                    first_visit_date: string | null
                    status: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    phone?: string | null
                    email?: string | null
                    first_visit_date?: string | null
                    status?: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    phone?: string | null
                    email?: string | null
                    first_visit_date?: string | null
                    status?: string
                    created_at?: string
                }
            }
            transactions: {
                Row: {
                    id: string
                    date: string
                    patient_id: string
                    total_amount: number
                    cash_amount: number
                    card_amount: number
                    transfer_amount: number
                    medical_amount: number
                    aesthetic_amount: number
                    cosmetic_amount: number
                    created_at: string
                }
                Insert: {
                    id?: string
                    date: string
                    patient_id: string
                    total_amount: number
                    cash_amount?: number
                    card_amount?: number
                    transfer_amount?: number
                    medical_amount?: number
                    aesthetic_amount?: number
                    cosmetic_amount?: number
                    created_at?: string
                }
                Update: {
                    id?: string
                    date?: string
                    patient_id?: string
                    total_amount?: number
                    cash_amount?: number
                    card_amount?: number
                    transfer_amount?: number
                    medical_amount?: number
                    aesthetic_amount?: number
                    cosmetic_amount?: number
                    created_at?: string
                }
            }
            treatments: {
                Row: {
                    id: string
                    name: string
                    code: string | null
                    category_id: string | null
                    type: string
                    base_price: number
                    base_time_mins: number
                    complexity_score: number
                    created_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    code?: string | null
                    category_id?: string | null
                    type: string
                    base_price: number
                    base_time_mins: number
                    complexity_score: number
                    created_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    code?: string | null
                    category_id?: string | null
                    type?: string
                    base_price?: number
                    base_time_mins?: number
                    complexity_score?: number
                    created_at?: string
                }
            }
            products: {
                Row: {
                    id: string
                    name: string
                    supplier_id: string | null
                    cost_price: number
                    sale_price: number
                    margin_pct: number
                    created_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    supplier_id?: string | null
                    cost_price: number
                    sale_price: number
                    margin_pct: number
                    created_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    supplier_id?: string | null
                    cost_price?: number
                    sale_price?: number
                    margin_pct?: number
                    created_at?: string
                }
            }
            expenses: {
                Row: {
                    id: string
                    date: string
                    supplier_id: string | null
                    category: string
                    amount: number
                    iva_amount: number
                    created_at: string
                }
                Insert: {
                    id?: string
                    date: string
                    supplier_id?: string | null
                    category: string
                    amount: number
                    iva_amount: number
                    created_at?: string
                }
                Update: {
                    id?: string
                    date?: string
                    supplier_id?: string | null
                    category?: string
                    amount?: number
                    iva_amount?: number
                    created_at?: string
                }
            }
        }
    }
}
