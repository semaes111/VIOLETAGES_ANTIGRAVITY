-- ============================================================================
-- VIOLETAEST - SCHEMA COMPLETO PARA SUPABASE
-- Ejecutar este script en Supabase Dashboard > SQL Editor
-- ============================================================================

-- Crear schema
CREATE SCHEMA IF NOT EXISTS violeta_gest;

-- ============================================================================
-- TABLA: patients (Pacientes)
-- ============================================================================
CREATE TABLE violeta_gest.patients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(255),
    first_visit_date DATE,
    referred_by VARCHAR(255),
    notes TEXT,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_patients_name ON violeta_gest.patients(name);
CREATE INDEX idx_patients_first_visit ON violeta_gest.patients(first_visit_date);
CREATE INDEX idx_patients_status ON violeta_gest.patients(status);

-- ============================================================================
-- TABLA: categories (Categorías de tratamientos)
-- ============================================================================
CREATE TABLE violeta_gest.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    type VARCHAR(20) NOT NULL CHECK (type IN ('medical', 'aesthetic', 'cosmetic')),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

INSERT INTO violeta_gest.categories (name, type, description) VALUES
('Toxina Botulínica', 'medical', 'Tratamientos con botox: Bocouture, Azzalure, Vistabell'),
('Ácido Hialurónico', 'medical', 'Rellenos: RHA, DUO, Aliaxin, Kiss, Maili'),
('Bioestimuladores', 'medical', 'Profhilo, Radiesse, Lenisna'),
('Mesoterapia', 'medical', 'ACP, PRP, Purasomes'),
('Corporal Médico', 'medical', 'Adipozon, tratamientos lipolíticos'),
('Cirugía Menor', 'medical', 'Blefaroplastia, Nanofat, Lipofilling'),
('Aparatología Facial', 'aesthetic', 'Morpheus8, Dermapen, Plexr'),
('Aparatología Corporal', 'aesthetic', 'Bodytite, Forma, tratamientos reafirmantes'),
('Cosmética', 'cosmetic', 'Productos de venta: cremas, protectores');

-- ============================================================================
-- TABLA: suppliers (Casas comerciales/Proveedores)
-- ============================================================================
CREATE TABLE violeta_gest.suppliers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL UNIQUE,
    contact_name VARCHAR(255),
    phone VARCHAR(20),
    email VARCHAR(255),
    address TEXT,
    payment_terms VARCHAR(100),
    notes TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

INSERT INTO violeta_gest.suppliers (name) VALUES
('Fidia Farmaceutici'),
('Galderma'),
('Merz'),
('IBSA'),
('Teoxane'),
('Revitacare'),
('Allergan'),
('Sinclair'),
('InMode');

-- ============================================================================
-- TABLA: products (Productos con costes)
-- ============================================================================
CREATE TABLE violeta_gest.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    supplier_id UUID REFERENCES violeta_gest.suppliers(id),
    category_id UUID REFERENCES violeta_gest.categories(id),
    cost_price DECIMAL(10,2) NOT NULL,
    cost_iva DECIMAL(10,2) DEFAULT 0,
    sale_price DECIMAL(10,2) NOT NULL,
    margin_pct DECIMAL(5,2) GENERATED ALWAYS AS 
        (CASE WHEN sale_price > 0 THEN ((sale_price - cost_price) / sale_price * 100) ELSE 0 END) STORED,
    units_per_box INTEGER DEFAULT 1,
    min_stock INTEGER DEFAULT 5,
    current_stock INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_products_supplier ON violeta_gest.products(supplier_id);
CREATE INDEX idx_products_category ON violeta_gest.products(category_id);

-- Insertar productos del catálogo
INSERT INTO violeta_gest.products (name, cost_price, cost_iva, sale_price) VALUES
('ACP', 73.15, 12.69, 250),
('DUO', 76.20, 13.23, 250),
('Hyal System Lips', 61.95, 10.75, 300),
('Bocouture 2*100', 95.98, 0, 325),
('Bocouture 50u', 90.00, 0, 300),
('Vistabell', 122.50, 49.00, 350),
('Azzalure', 111.76, 44.70, 325),
('Redensity 2', 117.37, 20.37, 420),
('RHA1', 70.79, 14.86, 350),
('RHA2', 90.14, 18.92, 350),
('RHA3', 89.54, 15.54, 350),
('RHA4', 94.38, 16.38, 350),
('Ultra Deep', 88.94, 15.43, 350),
('Kiss', 81.07, 14.07, 350),
('RHA Kiss', 71.96, 12.49, 350),
('Maili Volume', 73.05, 15.30, 350),
('Maili Extreme', 76.23, 13.23, 350),
('Aliaxin SV', 85.91, 14.91, 350),
('Aliaxin EV', 56.87, 9.87, 350),
('Viscoderm Hydrobooster', 60.05, 10.50, 200),
('Profhilo face', 96.80, 16.08, 410),
('Profhilo estructura', 121.00, 21.00, 450),
('Profhilo kit', 284.35, 49.35, 800),
('Radiesse', 148.50, 25.77, 420),
('Lenisna', 160.93, 33.80, 450),
('Purasomes Hair & Scalp', 145.20, 25.20, 300),
('Purasomes Nutricomplex', 116.97, 20.30, 250),
('Purasomes SGC100', 145.20, 25.20, 250),
('Adipozon (6ml)', 24.20, 4.20, 120),
('Polinucleótidos ojos', 90.75, 15.75, 250),
('Kit Nanofat Plus Fidia', 391.31, 67.91, 1350),
('Kit PRP Fidia', 102.85, 17.85, 275),
('Kit PRP Unisthetic', 42.35, 7.35, 275);

-- ============================================================================
-- TABLA: treatments (Catálogo de tratamientos)
-- ============================================================================
CREATE TABLE violeta_gest.treatments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE,
    category_id UUID REFERENCES violeta_gest.categories(id),
    type VARCHAR(20) NOT NULL CHECK (type IN ('medical', 'aesthetic', 'cosmetic')),
    base_price DECIMAL(10,2),
    base_time_mins INTEGER DEFAULT 30,
    complexity_score INTEGER DEFAULT 1 CHECK (complexity_score BETWEEN 1 AND 5),
    follow_up_required BOOLEAN DEFAULT FALSE,
    follow_up_notes TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_treatments_category ON violeta_gest.treatments(category_id);
CREATE INDEX idx_treatments_type ON violeta_gest.treatments(type);

-- Insertar tratamientos comunes
INSERT INTO violeta_gest.treatments (name, code, type, base_price, base_time_mins, complexity_score) VALUES
('Botox facial completo', 'BTX-FC', 'medical', 350, 30, 2),
('Botox entrecejo', 'BTX-EC', 'medical', 200, 15, 1),
('Botox patas de gallo', 'BTX-PG', 'medical', 200, 15, 1),
('Botox bruxismo', 'BTX-BRX', 'medical', 500, 30, 2),
('Relleno labios', 'AH-LAB', 'medical', 350, 30, 2),
('Relleno nasogeniano', 'AH-NSG', 'medical', 350, 30, 2),
('Relleno ojeras', 'AH-OJR', 'medical', 420, 45, 3),
('Rinomodelación', 'AH-RINO', 'medical', 350, 30, 3),
('Perfilado mandibular', 'AH-MAND', 'medical', 700, 45, 3),
('Profhilo facial', 'PF-FAC', 'medical', 410, 30, 2),
('Profhilo estructura', 'PF-STR', 'medical', 450, 30, 2),
('Profhilo body', 'PF-BODY', 'medical', 800, 45, 2),
('Radiesse', 'RAD', 'medical', 420, 30, 2),
('PRP facial', 'PRP-FAC', 'medical', 275, 45, 2),
('ACP facial', 'ACP-FAC', 'medical', 250, 30, 2),
('Adipozon', 'ADIPO', 'medical', 120, 30, 1),
('Nanofat + Lipofilling', 'NF-LF', 'medical', 1350, 120, 4),
('Blefaroplastia', 'BLEF', 'medical', 1500, 90, 4),
('Morpheus8 facial', 'MP8-FAC', 'aesthetic', 500, 60, 3),
('Morpheus8 corporal', 'MP8-CORP', 'aesthetic', 800, 90, 3),
('Dermapen facial', 'DP-FAC', 'aesthetic', 150, 45, 2),
('Dermapen + exosomas', 'DP-EXO', 'aesthetic', 250, 60, 2),
('Plexr blefaroplastia', 'PLEXR-BL', 'aesthetic', 400, 60, 3),
('Bodytite', 'BDTITE', 'aesthetic', 2000, 120, 4),
('Forma facial', 'FORMA-F', 'aesthetic', 100, 30, 1),
('Forma corporal', 'FORMA-C', 'aesthetic', 150, 45, 1),
('Protector solar', 'COS-PS', 'cosmetic', 45, 0, 1),
('Crema exosomas', 'COS-EXO', 'cosmetic', 100, 0, 1);

-- ============================================================================
-- TABLA: transactions (Pagos/Ingresos)
-- ============================================================================
CREATE TABLE violeta_gest.transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date DATE NOT NULL,
    patient_id UUID REFERENCES violeta_gest.patients(id),
    total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    cash_amount DECIMAL(10,2) DEFAULT 0,
    card_amount DECIMAL(10,2) DEFAULT 0,
    transfer_amount DECIMAL(10,2) DEFAULT 0,
    medical_amount DECIMAL(10,2) DEFAULT 0,
    aesthetic_amount DECIMAL(10,2) DEFAULT 0,
    cosmetic_amount DECIMAL(10,2) DEFAULT 0,
    is_first_visit BOOLEAN DEFAULT FALSE,
    notes TEXT,
    original_description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT check_payment_sum CHECK (
        ABS(total_amount - (cash_amount + card_amount + transfer_amount)) < 0.01
    ),
    CONSTRAINT check_type_sum CHECK (
        ABS(total_amount - (medical_amount + aesthetic_amount + cosmetic_amount)) < 0.01
    )
);

CREATE INDEX idx_transactions_date ON violeta_gest.transactions(date);
CREATE INDEX idx_transactions_patient ON violeta_gest.transactions(patient_id);
CREATE INDEX idx_transactions_date_type ON violeta_gest.transactions(date, medical_amount, aesthetic_amount);

-- ============================================================================
-- TABLA: transaction_items (Detalle de transacciones)
-- ============================================================================
CREATE TABLE violeta_gest.transaction_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_id UUID NOT NULL REFERENCES violeta_gest.transactions(id) ON DELETE CASCADE,
    treatment_id UUID REFERENCES violeta_gest.treatments(id),
    product_id UUID REFERENCES violeta_gest.products(id),
    quantity INTEGER DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL,
    unit_cost DECIMAL(10,2) DEFAULT 0,
    subtotal DECIMAL(10,2) GENERATED ALWAYS AS (quantity * unit_price) STORED,
    profit DECIMAL(10,2) GENERATED ALWAYS AS ((quantity * unit_price) - (quantity * unit_cost)) STORED,
    notes TEXT
);

CREATE INDEX idx_trans_items_transaction ON violeta_gest.transaction_items(transaction_id);
CREATE INDEX idx_trans_items_treatment ON violeta_gest.transaction_items(treatment_id);

-- ============================================================================
-- TABLA: expenses (Gastos)
-- ============================================================================
CREATE TABLE violeta_gest.expenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date DATE NOT NULL,
    supplier_id UUID REFERENCES violeta_gest.suppliers(id),
    category VARCHAR(100) NOT NULL,
    subcategory VARCHAR(100),
    amount DECIMAL(10,2) NOT NULL,
    iva_amount DECIMAL(10,2) DEFAULT 0,
    total_amount DECIMAL(10,2) GENERATED ALWAYS AS (amount + iva_amount) STORED,
    description TEXT,
    invoice_number VARCHAR(100),
    is_recurring BOOLEAN DEFAULT FALSE,
    recurrence_type VARCHAR(20) CHECK (recurrence_type IN ('monthly', 'quarterly', 'yearly')),
    payment_method VARCHAR(20) CHECK (payment_method IN ('cash', 'card', 'transfer')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_expenses_date ON violeta_gest.expenses(date);
CREATE INDEX idx_expenses_supplier ON violeta_gest.expenses(supplier_id);
CREATE INDEX idx_expenses_category ON violeta_gest.expenses(category);

-- ============================================================================
-- VISTAS MATERIALIZADAS
-- ============================================================================

-- Vista: Resumen diario
CREATE MATERIALIZED VIEW violeta_gest.daily_summary AS
SELECT 
    date,
    COUNT(DISTINCT patient_id) as patients_count,
    COUNT(*) as transactions_count,
    SUM(total_amount) as total_revenue,
    SUM(cash_amount) as cash_revenue,
    SUM(card_amount) as card_revenue,
    SUM(transfer_amount) as transfer_revenue,
    SUM(medical_amount) as medical_revenue,
    SUM(aesthetic_amount) as aesthetic_revenue,
    SUM(cosmetic_amount) as cosmetic_revenue,
    COUNT(*) FILTER (WHERE is_first_visit = TRUE) as first_visits
FROM violeta_gest.transactions
GROUP BY date
ORDER BY date DESC;

CREATE UNIQUE INDEX idx_daily_summary_date ON violeta_gest.daily_summary(date);

-- Vista: Resumen mensual
CREATE MATERIALIZED VIEW violeta_gest.monthly_summary AS
SELECT 
    DATE_TRUNC('month', date)::DATE as month,
    COUNT(DISTINCT patient_id) as unique_patients,
    COUNT(*) as transactions_count,
    SUM(total_amount) as total_revenue,
    SUM(cash_amount) as cash_revenue,
    SUM(card_amount) as card_revenue,
    SUM(transfer_amount) as transfer_revenue,
    SUM(medical_amount) as medical_revenue,
    SUM(aesthetic_amount) as aesthetic_revenue,
    SUM(cosmetic_amount) as cosmetic_revenue,
    COUNT(*) FILTER (WHERE is_first_visit = TRUE) as first_visits,
    AVG(total_amount) as avg_ticket
FROM violeta_gest.transactions
GROUP BY DATE_TRUNC('month', date)
ORDER BY month DESC;

CREATE UNIQUE INDEX idx_monthly_summary_month ON violeta_gest.monthly_summary(month);

-- Vista: Rentabilidad por tratamiento
CREATE MATERIALIZED VIEW violeta_gest.treatment_profitability AS
SELECT 
    t.id as treatment_id,
    t.name as treatment_name,
    t.type,
    c.name as category_name,
    COUNT(ti.id) as times_performed,
    COALESCE(SUM(ti.quantity), 0) as total_units,
    COALESCE(SUM(ti.subtotal), 0) as total_revenue,
    COALESCE(SUM(ti.profit), 0) as total_profit,
    COALESCE(AVG(ti.subtotal / NULLIF(ti.quantity, 0)), 0) as avg_price,
    COALESCE(AVG(ti.profit / NULLIF(ti.quantity, 0)), 0) as avg_profit_per_unit,
    CASE WHEN SUM(ti.subtotal) > 0 
        THEN (SUM(ti.profit) / SUM(ti.subtotal) * 100)::DECIMAL(5,2) 
        ELSE 0 END as profit_margin_pct,
    t.base_time_mins,
    t.complexity_score,
    CASE WHEN SUM(ti.quantity * t.base_time_mins) > 0 
        THEN (SUM(ti.profit) / SUM(ti.quantity * t.base_time_mins))::DECIMAL(10,2) 
        ELSE 0 END as profit_per_minute
FROM violeta_gest.treatments t
LEFT JOIN violeta_gest.transaction_items ti ON ti.treatment_id = t.id
LEFT JOIN violeta_gest.categories c ON t.category_id = c.id
GROUP BY t.id, t.name, t.type, c.name, t.base_time_mins, t.complexity_score;

CREATE UNIQUE INDEX idx_treatment_prof_id ON violeta_gest.treatment_profitability(treatment_id);

-- Vista: Gasto por proveedor
CREATE MATERIALIZED VIEW violeta_gest.supplier_spending AS
SELECT 
    s.id as supplier_id,
    s.name as supplier_name,
    DATE_TRUNC('month', e.date)::DATE as month,
    DATE_TRUNC('year', e.date)::DATE as year,
    COALESCE(SUM(e.total_amount), 0) as total_spent,
    COUNT(e.id) as invoice_count,
    COALESCE(AVG(e.total_amount), 0) as avg_invoice_amount
FROM violeta_gest.suppliers s
LEFT JOIN violeta_gest.expenses e ON e.supplier_id = s.id
GROUP BY s.id, s.name, DATE_TRUNC('month', e.date), DATE_TRUNC('year', e.date);

-- Vista: Adherencia de pacientes
CREATE MATERIALIZED VIEW violeta_gest.patient_adherence AS
WITH first_visits AS (
    SELECT 
        patient_id,
        MIN(date) as first_visit_date
    FROM violeta_gest.transactions
    WHERE is_first_visit = TRUE
    GROUP BY patient_id
),
return_visits AS (
    SELECT 
        t.patient_id,
        fv.first_visit_date,
        COUNT(*) as total_visits,
        MAX(t.date) as last_visit_date,
        SUM(t.total_amount) as lifetime_value
    FROM violeta_gest.transactions t
    JOIN first_visits fv ON t.patient_id = fv.patient_id
    GROUP BY t.patient_id, fv.first_visit_date
)
SELECT 
    DATE_TRUNC('month', first_visit_date)::DATE as cohort_month,
    COUNT(DISTINCT patient_id) as first_visit_count,
    COUNT(DISTINCT CASE WHEN total_visits > 1 THEN patient_id END) as returned_count,
    CASE WHEN COUNT(DISTINCT patient_id) > 0 
        THEN (COUNT(DISTINCT CASE WHEN total_visits > 1 THEN patient_id END)::DECIMAL / 
              COUNT(DISTINCT patient_id) * 100)::DECIMAL(5,2) 
        ELSE 0 END as return_rate_pct,
    AVG(total_visits) as avg_visits,
    AVG(lifetime_value) as avg_lifetime_value
FROM return_visits
GROUP BY DATE_TRUNC('month', first_visit_date);

-- Vista: Tendencias estacionales
CREATE MATERIALIZED VIEW violeta_gest.seasonal_trends AS
SELECT 
    EXTRACT(MONTH FROM tr.date)::INTEGER as month_number,
    TO_CHAR(tr.date, 'Month') as month_name,
    t.name as treatment_name,
    c.name as category_name,
    COUNT(*) as times_performed,
    COALESCE(SUM(ti.subtotal), 0) as total_revenue,
    COALESCE(AVG(ti.subtotal), 0) as avg_revenue
FROM violeta_gest.transactions tr
JOIN violeta_gest.transaction_items ti ON tr.id = ti.transaction_id
JOIN violeta_gest.treatments t ON ti.treatment_id = t.id
LEFT JOIN violeta_gest.categories c ON t.category_id = c.id
GROUP BY EXTRACT(MONTH FROM tr.date), TO_CHAR(tr.date, 'Month'), t.name, c.name
ORDER BY month_number, total_revenue DESC;

-- ============================================================================
-- FUNCIONES DE UTILIDAD
-- ============================================================================

-- Función para refrescar todas las vistas materializadas
CREATE OR REPLACE FUNCTION violeta_gest.refresh_all_views()
RETURNS void AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY violeta_gest.daily_summary;
    REFRESH MATERIALIZED VIEW CONCURRENTLY violeta_gest.monthly_summary;
    REFRESH MATERIALIZED VIEW violeta_gest.treatment_profitability;
    REFRESH MATERIALIZED VIEW violeta_gest.supplier_spending;
    REFRESH MATERIALIZED VIEW violeta_gest.patient_adherence;
    REFRESH MATERIALIZED VIEW violeta_gest.seasonal_trends;
END;
$$ LANGUAGE plpgsql;

-- Función trigger para actualizar updated_at
CREATE OR REPLACE FUNCTION violeta_gest.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger a tablas con updated_at
CREATE TRIGGER trigger_patients_updated_at
    BEFORE UPDATE ON violeta_gest.patients
    FOR EACH ROW EXECUTE FUNCTION violeta_gest.update_updated_at();

CREATE TRIGGER trigger_products_updated_at
    BEFORE UPDATE ON violeta_gest.products
    FOR EACH ROW EXECUTE FUNCTION violeta_gest.update_updated_at();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Habilitar RLS en todas las tablas
ALTER TABLE violeta_gest.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE violeta_gest.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE violeta_gest.transaction_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE violeta_gest.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE violeta_gest.treatments ENABLE ROW LEVEL SECURITY;
ALTER TABLE violeta_gest.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE violeta_gest.suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE violeta_gest.categories ENABLE ROW LEVEL SECURITY;

-- Políticas básicas (permitir todo a usuarios autenticados)
-- En producción, ajustar según roles
CREATE POLICY "Allow authenticated access" ON violeta_gest.patients
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated access" ON violeta_gest.transactions
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated access" ON violeta_gest.transaction_items
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated access" ON violeta_gest.expenses
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated access" ON violeta_gest.treatments
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated access" ON violeta_gest.products
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated access" ON violeta_gest.suppliers
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated access" ON violeta_gest.categories
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ============================================================================
-- FIN DEL SCRIPT
-- ============================================================================

-- Ejecutar refresh inicial de vistas (descomentar tras tener datos)
-- SELECT violeta_gest.refresh_all_views();

COMMENT ON SCHEMA violeta_gest IS 'Schema para VioletaGest - Sistema de Gestión de Clínica de Estética';
