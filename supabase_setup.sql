-- ==============================================================
-- EDAM STHETIC: ESQUEMA DE BASE DE DATOS EN SUPABASE (POSTGRESQL)
-- Panel de Administración: Inventario, Ventas y Contabilidad Mensual
-- ==============================================================

-- 1. TABLA DE INVENTARIO DE PRODUCTOS
CREATE TABLE IF NOT EXISTS public.productos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre TEXT NOT NULL,
    categoria TEXT DEFAULT 'Cuidado Facial',
    costo NUMERIC(10,2) NOT NULL DEFAULT 0,          -- Costo de compra en RD$
    precio_venta NUMERIC(10,2) NOT NULL DEFAULT 0,   -- Precio de venta al público en RD$
    stock_actual INT NOT NULL DEFAULT 0,             -- Cantidad disponible en cabina
    stock_minimo INT NOT NULL DEFAULT 2,             -- Umbral de alerta para reabastecer
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. TABLA DE VENTAS DE PRODUCTOS (CONTABILIDAD DE TIENDA)
CREATE TABLE IF NOT EXISTS public.ventas_productos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    producto_id UUID REFERENCES public.productos(id) ON DELETE SET NULL,
    producto_nombre TEXT NOT NULL,
    cantidad INT NOT NULL DEFAULT 1,
    costo_unitario NUMERIC(10,2) NOT NULL DEFAULT 0,
    precio_unitario NUMERIC(10,2) NOT NULL DEFAULT 0,
    total_venta NUMERIC(10,2) NOT NULL DEFAULT 0,     -- cantidad * precio_unitario
    ganancia_neta NUMERIC(10,2) NOT NULL DEFAULT 0,   -- total_venta - (costo_unitario * cantidad)
    metodo_pago TEXT DEFAULT 'Efectivo',              -- 'Efectivo', 'Transferencia'
    fecha TIMESTAMPTZ DEFAULT now(),
    notas TEXT
);

-- 3. TABLA DE SERVICIOS REALIZADOS (CONTABILIDAD DE CABINA)
CREATE TABLE IF NOT EXISTS public.servicios_realizados (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cliente_nombre TEXT NOT NULL,
    servicio_nombre TEXT NOT NULL,
    monto_cobrado NUMERIC(10,2) NOT NULL DEFAULT 0,  -- Total cobrado en RD$
    metodo_pago TEXT DEFAULT 'Transferencia',         -- 'Transferencia', 'Efectivo'
    fecha TIMESTAMPTZ DEFAULT now(),
    notas TEXT
);

-- HABILITAR ROW LEVEL SECURITY (RLS)
ALTER TABLE public.productos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ventas_productos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.servicios_realizados ENABLE ROW LEVEL SECURITY;

-- POLÍTICAS DE LECTURA Y ESCRITURA PERMISIVAS (Acceso anónimo controlado por el panel)
CREATE POLICY "Permitir todo en productos" ON public.productos FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir todo en ventas_productos" ON public.ventas_productos FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir todo en servicios_realizados" ON public.servicios_realizados FOR ALL USING (true) WITH CHECK (true);

-- DATOS INICIALES DE EJEMPLO
INSERT INTO public.productos (nombre, categoria, costo, precio_venta, stock_actual, stock_minimo) VALUES
('Protector Solar Toque Seco FPS 50+ (La Roche-Posay)', 'Protección Solar', 1200, 1850, 8, 3),
('Sérum Ácido Hialurónico B5 Puro', 'Sérums', 1500, 2300, 4, 2),
('Gel Limpiador Purificante Espumoso', 'Limpiadores', 850, 1350, 6, 2),
('Sérum Vitamina C 15% Iluminador', 'Sérums', 1800, 2700, 2, 3),
('Mascarilla Hidroplástica Calmante Botánica', 'Mascarillas', 450, 900, 12, 4)
ON CONFLICT DO NOTHING;
