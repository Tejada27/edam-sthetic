import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'https://your-project.supabase.co'
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Initial inventory products for offline / local mode
export const initialProducts = [
  {
    id: 'prod-1',
    nombre: 'Protector Solar Toque Seco FPS 50+ (La Roche-Posay)',
    categoria: 'Protección Solar',
    costo: 1200,
    precio_venta: 1850,
    stock_actual: 8,
    stock_minimo: 3
  },
  {
    id: 'prod-2',
    nombre: 'Sérum Ácido Hialurónico B5 Puro',
    categoria: 'Sérums',
    costo: 1500,
    precio_venta: 2300,
    stock_actual: 4,
    stock_minimo: 2
  },
  {
    id: 'prod-3',
    nombre: 'Gel Limpiador Purificante Espumoso',
    categoria: 'Limpiadores',
    costo: 850,
    precio_venta: 1350,
    stock_actual: 6,
    stock_minimo: 2
  },
  {
    id: 'prod-4',
    nombre: 'Sérum Vitamina C 15% Iluminador',
    categoria: 'Sérums',
    costo: 1800,
    precio_venta: 2700,
    stock_actual: 2, // low stock warning
    stock_minimo: 3
  },
  {
    id: 'prod-5',
    nombre: 'Mascarilla Hidroplástica Calmante Botánica',
    categoria: 'Mascarillas',
    costo: 450,
    precio_venta: 900,
    stock_actual: 12,
    stock_minimo: 4
  }
];

// Initial mock sales for October 2026 to showcase calculations
export const initialSales = [
  {
    id: 'sale-1',
    producto_id: 'prod-1',
    producto_nombre: 'Protector Solar Toque Seco FPS 50+',
    cantidad: 2,
    costo_unitario: 1200,
    precio_unitario: 1850,
    total_venta: 3700,
    ganancia_neta: 1300,
    fecha: '2026-10-12T16:20:00Z',
    metodo_pago: 'Transferencia'
  },
  {
    id: 'sale-2',
    producto_id: 'prod-2',
    producto_nombre: 'Sérum Ácido Hialurónico B5 Puro',
    cantidad: 1,
    costo_unitario: 1500,
    precio_unitario: 2300,
    total_venta: 2300,
    ganancia_neta: 800,
    fecha: '2026-10-14T11:45:00Z',
    metodo_pago: 'Efectivo'
  }
];

// Initial mock completed services for October 2026
export const initialCompletedServices = [
  {
    id: 'serv-1',
    cliente_nombre: 'Yomaira Castillo',
    servicio_nombre: 'Limpieza Facial Profunda',
    monto_cobrado: 2000,
    fecha: '2026-10-14T11:30:00Z',
    metodo_pago: 'Transferencia'
  },
  {
    id: 'serv-2',
    cliente_nombre: 'Ana Patricia Santana',
    servicio_nombre: 'Evaluación y Diagnóstico',
    monto_cobrado: 500,
    fecha: '2026-10-14T16:15:00Z',
    metodo_pago: 'Efectivo'
  },
  {
    id: 'serv-3',
    cliente_nombre: 'Elena Morales',
    servicio_nombre: 'Facial Efecto Lifting',
    monto_cobrado: 1800,
    fecha: '2026-10-15T15:00:00Z',
    metodo_pago: 'Transferencia'
  }
];
