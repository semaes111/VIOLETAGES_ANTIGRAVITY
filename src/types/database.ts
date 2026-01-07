export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    violeta_gest: {
        Tables: {
            patients: {
                Row: {
                    id: string
                    name: string
                    phone: string | null
                    email: string | null
                    first_visit_date: string | null
                    referred_by: string | null
                    notes: string | null
                    status: string
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    phone?: string | null
                    email?: string | null
                    first_visit_date?: string | null
                    referred_by?: string | null
                    notes?: string | null
                    status?: string
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    phone?: string | null
                    email?: string | null
                    first_visit_date?: string | null
                    referred_by?: string | null
                    notes?: string | null
                    status?: string
                    created_at?: string
                    updated_at?: string
                }
            }
            categories: {
                Row: {
                    id: string
                    name: string
                    type: string
                    description: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    type: string
                    description?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    type?: string
                    description?: string | null
                    created_at?: string
                }
            }
            suppliers: {
                Row: {
                    id: string
                    name: string
                    contact_name: string | null
                    phone: string | null
                    email: string | null
                    address: string | null
                    payment_terms: string | null
                    notes: string | null
                    is_active: boolean
                    created_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    contact_name?: string | null
                    phone?: string | null
                    email?: string | null
                    address?: string | null
                    payment_terms?: string | null
                    notes?: string | null
                    is_active?: boolean
                    created_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    contact_name?: string | null
                    phone?: string | null
                    email?: string | null
                    address?: string | null
                    payment_terms?: string | null
                    notes?: string | null
                    is_active?: boolean
                    created_at?: string
                }
            }
            products: {
                Row: {
                    id: string
                    name: string
                    supplier_id: string | null
                    category_id: string | null
                    cost_price: number
                    cost_iva: number
                    sale_price: number
                    margin_pct: number
                    units_per_box: number
                    min_stock: number
                    current_stock: number
                    is_active: boolean
                    notes: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    supplier_id?: string | null
                    category_id?: string | null
                    cost_price: number
                    cost_iva?: number
                    sale_price: number
                    units_per_box?: number
                    min_stock?: number
                    current_stock?: number
                    is_active?: boolean
                    notes?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    supplier_id?: string | null
                    category_id?: string | null
                    cost_price?: number
                    cost_iva?: number
                    sale_price?: number
                    units_per_box?: number
                    min_stock?: number
                    current_stock?: number
                    is_active?: boolean
                    notes?: string | null
                    created_at?: string
                    updated_at?: string
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
                    follow_up_required: boolean
                    follow_up_notes: string | null
                    is_active: boolean
                    created_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    code?: string | null
                    category_id?: string | null
                    type: string
                    base_price: number
                    base_time_mins?: number
                    complexity_score?: number
                    follow_up_required?: boolean
                    follow_up_notes?: string | null
                    is_active?: boolean
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
                    follow_up_required?: boolean
                    follow_up_notes?: string | null
                    is_active?: boolean
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
                    is_first_visit: boolean
                    notes: string | null
                    original_description: string | null
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
                    is_first_visit?: boolean
                    notes?: string | null
                    original_description?: string | null
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
                    is_first_visit?: boolean
                    notes?: string | null
                    original_description?: string | null
                    created_at?: string
                }
            }
            transaction_items: {
                Row: {
                    id: string
                    transaction_id: string
                    treatment_id: string | null
                    product_id: string | null
                    quantity: number
                    unit_price: number
                    unit_cost: number
                    subtotal: number
                    profit: number
                    notes: string | null
                }
                Insert: {
                    id?: string
                    transaction_id: string
                    treatment_id?: string | null
                    product_id?: string | null
                    quantity?: number
                    unit_price: number
                    unit_cost?: number
                    notes?: string | null
                }
                Update: {
                    id?: string
                    transaction_id?: string
                    treatment_id?: string | null
                    product_id?: string | null
                    quantity?: number
                    unit_price?: number
                    unit_cost?: number
                    notes?: string | null
                }
            }
            expenses: {
                Row: {
                    id: string
                    date: string
                    supplier_id: string | null
                    category: string
                    subcategory: string | null
                    amount: number
                    iva_amount: number
                    total_amount: number
                    description: string | null
                    invoice_number: string | null
                    is_recurring: boolean
                    recurrence_type: string | null
                    payment_method: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    date: string
                    supplier_id?: string | null
                    category: string
                    subcategory?: string | null
                    amount: number
                    iva_amount?: number
                    description?: string | null
                    invoice_number?: string | null
                    is_recurring?: boolean
                    recurrence_type?: string | null
                    payment_method?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    date?: string
                    supplier_id?: string | null
                    category?: string
                    subcategory?: string | null
                    amount?: number
                    iva_amount?: number
                    description?: string | null
                    invoice_number?: string | null
                    is_recurring?: boolean
                    recurrence_type?: string | null
                    payment_method?: string | null
                    created_at?: string
                }
            }
        }
    }
}
