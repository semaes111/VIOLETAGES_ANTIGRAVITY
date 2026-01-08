-- ============================================================================
-- SCRIPT DE IMPORTACIÓN DE PRODUCTOS PARA VIOLETAGEST
-- Ejecutar en Supabase Dashboard > SQL Editor
-- 
-- ORDEN DE IMPORTACIÓN:
-- 1. categories_supabase.csv → violeta_gest.categories
-- 2. suppliers_supabase.csv → violeta_gest.suppliers
-- 3. products_supabase.csv → violeta_gest.products
-- ============================================================================

-- ============================================================================
-- VERIFICACIÓN POST-IMPORTACIÓN
-- ============================================================================

-- Verificar categorías
SELECT name, type, description FROM violeta_gest.categories ORDER BY type, name;

-- Verificar proveedores
SELECT name, is_active FROM violeta_gest.suppliers ORDER BY name;

-- Verificar productos con margen calculado
SELECT 
    p.name,
    c.name as categoria,
    s.name as proveedor,
    p.cost_price,
    p.cost_iva,
    p.sale_price,
    p.margin_pct
FROM violeta_gest.products p
LEFT JOIN violeta_gest.categories c ON p.category_id = c.id
LEFT JOIN violeta_gest.suppliers s ON p.supplier_id = s.id
ORDER BY c.name, p.margin_pct DESC;

-- Resumen por categoría
SELECT 
    c.name as categoria,
    COUNT(*) as productos,
    ROUND(AVG(p.cost_price), 2) as coste_medio,
    ROUND(AVG(p.sale_price), 2) as pvp_medio,
    ROUND(AVG(p.margin_pct), 1) as margen_medio_pct
FROM violeta_gest.products p
JOIN violeta_gest.categories c ON p.category_id = c.id
GROUP BY c.name
ORDER BY margen_medio_pct DESC;

-- Productos con menor margen (oportunidad de ajuste)
SELECT 
    p.name,
    c.name as categoria,
    p.cost_price,
    p.sale_price,
    p.margin_pct
FROM violeta_gest.products p
JOIN violeta_gest.categories c ON p.category_id = c.id
WHERE p.margin_pct < 60
ORDER BY p.margin_pct;

-- ============================================================================
-- RESUMEN FINAL
-- ============================================================================
-- Productos: 33 referencias
-- Categorías: 9 tipos (médico, estético, cosmético)
-- Proveedores: 9 casas comerciales
-- Margen promedio: 70.7%
-- ============================================================================
