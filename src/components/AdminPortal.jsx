import React, { useState, useEffect, useMemo } from 'react';
import { 
  Lock, DollarSign, Package, Calendar, TrendingUp, AlertTriangle, 
  Plus, ShoppingBag, CheckCircle2, ArrowLeft, RefreshCw, Trash2, 
  Search, Eye, LogOut, Sparkles, Filter, CreditCard
} from 'lucide-react';
import { 
  supabase, 
  isSupabaseConfigured, 
  initialProducts, 
  initialSales, 
  initialCompletedServices 
} from '../lib/supabaseClient';
import { servicesData } from '../data/servicesData';
import { clinicInfo } from '../data/bankData';

export default function AdminPortal({ 
  onClose, 
  appointments, 
  onUpdateAppointment 
}) {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('edam_admin_auth') === 'true';
  });
  const [pinInput, setPinInput] = useState('');
  const [loginError, setLoginError] = useState('');

  // Active view tab inside admin
  const [activeTab, setActiveTab] = useState('finanzas'); // 'finanzas' | 'inventario' | 'servicios' | 'agenda'

  // Data states
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('edam_products_data');
    return saved ? JSON.parse(saved) : initialProducts;
  });

  const [sales, setSales] = useState(() => {
    const saved = localStorage.getItem('edam_sales_data');
    return saved ? JSON.parse(saved) : initialSales;
  });

  const [completedServices, setCompletedServices] = useState(() => {
    const saved = localStorage.getItem('edam_services_data');
    return saved ? JSON.parse(saved) : initialCompletedServices;
  });

  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });

  // Modal dialog states
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isRecordSaleOpen, setIsRecordSaleOpen] = useState(false);
  const [isRecordServiceOpen, setIsRecordServiceOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Forms
  const [newProductForm, setNewProductForm] = useState({
    nombre: '',
    categoria: 'Cuidado Facial',
    costo: '',
    precio_venta: '',
    stock_actual: '',
    stock_minimo: '2'
  });

  const [newSaleForm, setNewSaleForm] = useState({
    producto_id: '',
    cantidad: 1,
    metodo_pago: 'Efectivo',
    notas: ''
  });

  const [newServiceForm, setNewServiceForm] = useState({
    cliente_nombre: '',
    servicio_nombre: servicesData[0]?.name || '',
    monto_cobrado: servicesData[0]?.price || 2000,
    metodo_pago: 'Transferencia',
    notas: ''
  });

  // Save to localStorage when states update (offline persistent store)
  useEffect(() => {
    localStorage.setItem('edam_products_data', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('edam_sales_data', JSON.stringify(sales));
  }, [sales]);

  useEffect(() => {
    localStorage.setItem('edam_services_data', JSON.stringify(completedServices));
  }, [completedServices]);

  // Load from Supabase if configured
  useEffect(() => {
    if (isSupabaseConfigured && supabase) {
      const fetchData = async () => {
        try {
          const { data: pData } = await supabase.from('productos').select('*');
          if (pData && pData.length > 0) setProducts(pData);

          const { data: sData } = await supabase.from('ventas_productos').select('*');
          if (sData) setSales(sData);

          const { data: cData } = await supabase.from('servicios_realizados').select('*');
          if (cData) setCompletedServices(cData);
        } catch (err) {
          console.error('Error fetching from Supabase, using local cache', err);
        }
      };
      fetchData();
    }
  }, []);

  // Login handler
  const handleLogin = (e) => {
    e.preventDefault();
    // Master access password for Katherine
    if (pinInput.trim() === 'katherine2026' || pinInput.trim() === 'edam2026') {
      setIsAuthenticated(true);
      sessionStorage.setItem('edam_admin_auth', 'true');
      setLoginError('');
    } else {
      setLoginError('Contraseña incorrecta. Por favor verifícala.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('edam_admin_auth');
  };

  // Filtered sales and services for selected month
  const monthlySales = useMemo(() => {
    return sales.filter(s => s.fecha && s.fecha.startsWith(selectedMonth));
  }, [sales, selectedMonth]);

  const monthlyServices = useMemo(() => {
    return completedServices.filter(s => s.fecha && s.fecha.startsWith(selectedMonth));
  }, [completedServices, selectedMonth]);

  // Financial calculations for the selected month
  const totalSalesRevenue = useMemo(() => {
    return monthlySales.reduce((sum, s) => sum + Number(s.total_venta || 0), 0);
  }, [monthlySales]);

  const totalSalesProfit = useMemo(() => {
    return monthlySales.reduce((sum, s) => sum + Number(s.ganancia_neta || 0), 0);
  }, [monthlySales]);

  const totalServicesRevenue = useMemo(() => {
    return monthlyServices.reduce((sum, s) => sum + Number(s.monto_cobrado || 0), 0);
  }, [monthlyServices]);

  const grandTotalRevenue = totalSalesRevenue + totalServicesRevenue;

  // Filtered products for search
  const filteredProducts = useMemo(() => {
    if (!searchTerm.trim()) return products;
    const term = searchTerm.toLowerCase();
    return products.filter(p => 
      p.nombre.toLowerCase().includes(term) || 
      (p.categoria && p.categoria.toLowerCase().includes(term))
    );
  }, [products, searchTerm]);

  // Add Product Action
  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!newProductForm.nombre || !newProductForm.precio_venta) return;

    const costo = Number(newProductForm.costo) || 0;
    const precio_venta = Number(newProductForm.precio_venta) || 0;
    const stock_actual = Number(newProductForm.stock_actual) || 0;
    const stock_minimo = Number(newProductForm.stock_minimo) || 2;

    const newProd = {
      id: `prod-${Date.now()}`,
      nombre: newProductForm.nombre.trim(),
      categoria: newProductForm.categoria,
      costo,
      precio_venta,
      stock_actual,
      stock_minimo
    };

    setProducts(prev => [newProd, ...prev]);

    if (isSupabaseConfigured && supabase) {
      await supabase.from('productos').insert([newProd]);
    }

    setNewProductForm({
      nombre: '',
      categoria: 'Cuidado Facial',
      costo: '',
      precio_venta: '',
      stock_actual: '',
      stock_minimo: '2'
    });
    setIsAddProductOpen(false);
  };

  // Adjust stock quickly (+1 or -1)
  const handleAdjustStock = async (prodId, delta) => {
    setProducts(prev => prev.map(p => {
      if (p.id === prodId) {
        const updatedStock = Math.max(0, Number(p.stock_actual || 0) + delta);
        if (isSupabaseConfigured && supabase) {
          supabase.from('productos').update({ stock_actual: updatedStock }).eq('id', prodId);
        }
        return { ...p, stock_actual: updatedStock };
      }
      return p;
    }));
  };

  // Delete product
  const handleDeleteProduct = async (prodId) => {
    if (window.confirm('¿Segura que deseas eliminar este producto del inventario?')) {
      setProducts(prev => prev.filter(p => p.id !== prodId));
      if (isSupabaseConfigured && supabase) {
        await supabase.from('productos').delete().eq('id', prodId);
      }
    }
  };

  // Record Sale Action (Deducts stock automatically)
  const handleRecordSale = async (e) => {
    e.preventDefault();
    const prod = products.find(p => p.id === newSaleForm.producto_id);
    if (!prod) return;

    const qty = Number(newSaleForm.cantidad) || 1;
    if (prod.stock_actual < qty) {
      alert(`Stock insuficiente. Solo quedan ${prod.stock_actual} unidades.`);
      return;
    }

    const costoUnitario = Number(prod.costo || 0);
    const precioUnitario = Number(prod.precio_venta || 0);
    const totalVenta = precioUnitario * qty;
    const gananciaNeta = (precioUnitario - costoUnitario) * qty;

    const newSale = {
      id: `sale-${Date.now()}`,
      producto_id: prod.id,
      producto_nombre: prod.nombre,
      cantidad: qty,
      costo_unitario: costoUnitario,
      precio_unitario: precioUnitario,
      total_venta: totalVenta,
      ganancia_neta: gananciaNeta,
      metodo_pago: newSaleForm.metodo_pago,
      fecha: new Date().toISOString(),
      notas: newSaleForm.notas
    };

    // Update sales list
    setSales(prev => [newSale, ...prev]);

    // Deduct stock from product
    setProducts(prev => prev.map(p => {
      if (p.id === prod.id) {
        const updated = { ...p, stock_actual: p.stock_actual - qty };
        if (isSupabaseConfigured && supabase) {
          supabase.from('productos').update({ stock_actual: updated.stock_actual }).eq('id', p.id);
        }
        return updated;
      }
      return p;
    }));

    if (isSupabaseConfigured && supabase) {
      await supabase.from('ventas_productos').insert([newSale]);
    }

    setIsRecordSaleOpen(false);
    setNewSaleForm({ producto_id: '', cantidad: 1, metodo_pago: 'Efectivo', notas: '' });
  };

  // Record Completed Service
  const handleRecordService = async (e) => {
    e.preventDefault();
    if (!newServiceForm.cliente_nombre || !newServiceForm.monto_cobrado) return;

    const newServ = {
      id: `serv-${Date.now()}`,
      cliente_nombre: newServiceForm.cliente_nombre.trim(),
      servicio_nombre: newServiceForm.servicio_nombre,
      monto_cobrado: Number(newServiceForm.monto_cobrado) || 0,
      metodo_pago: newServiceForm.metodo_pago,
      fecha: new Date().toISOString(),
      notas: newServiceForm.notas
    };

    setCompletedServices(prev => [newServ, ...prev]);

    if (isSupabaseConfigured && supabase) {
      await supabase.from('servicios_realizados').insert([newServ]);
    }

    setIsRecordServiceOpen(false);
    setNewServiceForm({
      cliente_nombre: '',
      servicio_nombre: servicesData[0]?.name || '',
      monto_cobrado: servicesData[0]?.price || 2000,
      metodo_pago: 'Transferencia',
      notas: ''
    });
  };

  // If NOT authenticated, show the login screen
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in text-left">
        <div className="bg-[#FAF7F0] rounded-3xl max-w-md w-full p-8 border-2 border-[#C4A45B] shadow-2xl space-y-6">
          
          <div className="text-center space-y-3">
            <div className="w-16 h-16 rounded-full overflow-hidden mx-auto border-2 border-[#C4A45B] bg-black shadow-lg">
              <img src="/logo_ea_black.png" alt="EA" className="w-full h-full object-cover" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#9E7F36] font-bold block">
                EDAM Sthetic • Área Privada
              </span>
              <h2 className="text-2xl font-serif font-bold text-[#183728]">
                Panel de Administración
              </h2>
              <p className="text-xs text-stone-600 mt-1">
                Acceso exclusivo para Katherine Encarnación
              </p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#183728] mb-1.5">
                Contraseña de Acceso
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  placeholder="Introduce tu contraseña..."
                  className="w-full px-4 py-3 rounded-xl border border-[#D4C4A3] bg-white text-sm focus:ring-2 focus:ring-[#183728] focus:outline-none"
                  autoFocus
                />
                <Lock className="w-4 h-4 text-stone-400 absolute right-3.5 top-3.5" />
              </div>
              <p className="text-[10px] text-stone-400 mt-1 italic">
                * Clave por defecto: <code className="text-[#183728] font-bold">katherine2026</code>
              </p>
            </div>

            {loginError && (
              <p className="text-xs text-red-600 font-semibold p-2.5 rounded-lg bg-red-50 border border-red-200">
                {loginError}
              </p>
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 rounded-xl border border-[#D4C4A3] bg-white text-stone-700 text-xs font-bold uppercase tracking-wider hover:bg-[#F2ECE0] transition-colors"
              >
                Volver
              </button>
              <button
                type="submit"
                className="flex-1 py-3 rounded-xl bg-[#183728] text-[#FAF7F0] border border-[#C4A45B] text-xs font-bold uppercase tracking-wider hover:bg-[#0f241a] transition-all shadow-md"
              >
                Ingresar
              </button>
            </div>
          </form>

        </div>
      </div>
    );
  }

  // Once Authenticated: Full Management Portal
  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#FAF7F0] text-stone-900 overflow-hidden text-left animate-fade-in">
      
      {/* Top Admin Header */}
      <header className="bg-[#0A0F0D] text-[#FAF7F0] px-4 sm:px-8 py-3.5 border-b-2 border-[#C4A45B] flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full overflow-hidden border border-[#C4A45B] bg-black shrink-0">
            <img src="/logo_ea_black.png" alt="EA" className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-serif font-bold text-[#FAF7F0] tracking-wider">
                EDAM <span className="text-[#C4A45B] text-xs uppercase font-normal">Sthetic</span>
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#183728] border border-[#C4A45B]/60 text-[#E8D9B0] font-semibold">
                Gestión & Finanzas
              </span>
            </div>
            <p className="text-[10px] text-stone-400">
              Cosmiatra: <strong>Katherine Encarnación</strong> • Santo Domingo Este
            </p>
          </div>
        </div>

        {/* Database status and actions */}
        <div className="flex items-center gap-3">
          <span 
            className={`text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 ${
              isSupabaseConfigured 
                ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/50' 
                : 'bg-amber-950/80 text-amber-300 border border-amber-500/50'
            }`}
            title={isSupabaseConfigured ? 'Conectado a PostgreSQL en Supabase' : 'Guardando en Almacenamiento Local Seguro'}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${isSupabaseConfigured ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
            <span>{isSupabaseConfigured ? 'Supabase Activo' : 'Modo Local Seguro'}</span>
          </span>

          <button
            onClick={handleLogout}
            title="Cerrar Sesión"
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-[#FAF7F0] transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>

          <button
            onClick={onClose}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#C4A45B] hover:bg-[#b5954c] text-[#183728] text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Ver Sitio Web</span>
          </button>
        </div>
      </header>

      {/* Navigation Sub-bar */}
      <div className="bg-[#183728] text-[#FAF7F0] px-4 sm:px-8 border-b border-[#C4A45B]/40 flex items-center justify-between gap-4 overflow-x-auto shrink-0">
        <nav className="flex items-center gap-1 sm:gap-2 py-2">
          <button
            onClick={() => setActiveTab('finanzas')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all ${
              activeTab === 'finanzas'
                ? 'bg-[#C4A45B] text-[#183728] shadow-sm'
                : 'text-[#FAF7F0]/80 hover:text-white hover:bg-white/10'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Contabilidad Mensual</span>
          </button>

          <button
            onClick={() => setActiveTab('inventario')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all ${
              activeTab === 'inventario'
                ? 'bg-[#C4A45B] text-[#183728] shadow-sm'
                : 'text-[#FAF7F0]/80 hover:text-white hover:bg-white/10'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Inventario ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('servicios')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all ${
              activeTab === 'servicios'
                ? 'bg-[#C4A45B] text-[#183728] shadow-sm'
                : 'text-[#FAF7F0]/80 hover:text-white hover:bg-white/10'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Servicios Cobrados</span>
          </button>
        </nav>

        {/* Month Picker for Accounting */}
        <div className="flex items-center gap-2 py-2 shrink-0 text-xs">
          <span className="text-stone-300 hidden md:inline">Mes a Consultar:</span>
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-black/40 border border-[#C4A45B]/60 text-xs text-[#FAF7F0] focus:outline-none"
          />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-8 max-w-7xl mx-auto w-full space-y-6">
        
        {/* TAB 1: FINANZAS Y CONTABILIDAD MENSUAL */}
        {activeTab === 'finanzas' && (
          <div className="space-y-6">
            
            {/* Header Title */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#D4C4A3] pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#9E7F36]">
                  Reporte Financiero Oficial
                </span>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#183728]">
                  Contabilidad: {new Date(selectedMonth + '-02').toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }).toUpperCase()}
                </h2>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsRecordSaleOpen(true)}
                  className="px-3.5 py-2 rounded-xl bg-[#183728] text-[#FAF7F0] text-xs font-bold uppercase tracking-wider hover:bg-[#0f241a] transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5 text-[#C4A45B]" />
                  <span>Venta Producto</span>
                </button>
                <button
                  onClick={() => setIsRecordServiceOpen(true)}
                  className="px-3.5 py-2 rounded-xl bg-[#C4A45B] text-[#183728] text-xs font-bold uppercase tracking-wider hover:bg-[#b5954c] transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Cobro Servicio</span>
                </button>
              </div>
            </div>

            {/* 4 Financial Highlight Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Grand Total */}
              <div className="p-5 rounded-2xl bg-[#0A0F0D] text-[#FAF7F0] border-2 border-[#C4A45B] shadow-xl">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C4A45B]">
                    Facturación Total
                  </span>
                  <DollarSign className="w-5 h-5 text-[#C4A45B]" />
                </div>
                <h3 className="text-3xl font-serif font-bold text-[#FAF7F0] mt-2">
                  RD${grandTotalRevenue.toLocaleString()}
                </h3>
                <p className="text-[11px] text-stone-400 mt-1">
                  Faciales + Productos en el mes
                </p>
              </div>

              {/* Facial & Massage Services Total */}
              <div className="p-5 rounded-2xl bg-white border border-[#D4C4A3] shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#9E7F36]">
                    Ingresos Faciales & Cabina
                  </span>
                  <Sparkles className="w-5 h-5 text-[#183728]" />
                </div>
                <h3 className="text-2xl font-serif font-bold text-[#183728] mt-2">
                  RD${totalServicesRevenue.toLocaleString()}
                </h3>
                <p className="text-[11px] text-stone-500 mt-1">
                  {monthlyServices.length} servicios realizados
                </p>
              </div>

              {/* Product Sales Total */}
              <div className="p-5 rounded-2xl bg-white border border-[#D4C4A3] shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#9E7F36]">
                    Ventas de Productos
                  </span>
                  <ShoppingBag className="w-5 h-5 text-[#9E7F36]" />
                </div>
                <h3 className="text-2xl font-serif font-bold text-[#183728] mt-2">
                  RD${totalSalesRevenue.toLocaleString()}
                </h3>
                <p className="text-[11px] text-stone-500 mt-1">
                  {monthlySales.length} transacciones registradas
                </p>
              </div>

              {/* Net Profit in Products */}
              <div className="p-5 rounded-2xl bg-emerald-900/10 border border-emerald-500/30 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-800">
                    Ganancia Neta en Productos
                  </span>
                  <TrendingUp className="w-5 h-5 text-emerald-700" />
                </div>
                <h3 className="text-2xl font-serif font-bold text-emerald-900 mt-2">
                  RD${totalSalesProfit.toLocaleString()}
                </h3>
                <p className="text-[11px] text-emerald-700 mt-1">
                  Ganancia libre tras costo de compra
                </p>
              </div>

            </div>

            {/* Transactions Split Table */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Left: Monthly Product Sales Table */}
              <div className="bg-white rounded-2xl border border-[#D4C4A3] p-5 shadow-sm space-y-3">
                <div className="flex items-center justify-between border-b border-[#F2ECE0] pb-2">
                  <h4 className="text-sm font-serif font-bold text-[#183728] flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-[#C4A45B]" />
                    <span>Productos Vendidos ({monthlySales.length})</span>
                  </h4>
                  <span className="text-xs font-bold text-[#183728]">RD${totalSalesRevenue.toLocaleString()}</span>
                </div>

                {monthlySales.length === 0 ? (
                  <p className="text-xs text-stone-500 py-6 text-center italic">
                    No hay ventas de productos registradas en este mes.
                  </p>
                ) : (
                  <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                    {monthlySales.map((sale) => (
                      <div key={sale.id} className="p-3 rounded-xl bg-[#FAF7F0] border border-[#E2D8C3] flex items-center justify-between text-xs">
                        <div>
                          <p className="font-bold text-[#183728]">{sale.producto_nombre}</p>
                          <span className="text-[10px] text-stone-500">
                            {new Date(sale.fecha).toLocaleDateString('es-ES')} • {sale.cantidad} unidad(es) • {sale.metodo_pago}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-[#183728]">RD${sale.total_venta.toLocaleString()}</span>
                          <p className="text-[10px] text-emerald-700 font-semibold">+RD${sale.ganancia_neta.toLocaleString()} neta</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Right: Monthly Services Performed Table */}
              <div className="bg-white rounded-2xl border border-[#D4C4A3] p-5 shadow-sm space-y-3">
                <div className="flex items-center justify-between border-b border-[#F2ECE0] pb-2">
                  <h4 className="text-sm font-serif font-bold text-[#183728] flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#C4A45B]" />
                    <span>Faciales & Masajes Cobrados ({monthlyServices.length})</span>
                  </h4>
                  <span className="text-xs font-bold text-[#183728]">RD${totalServicesRevenue.toLocaleString()}</span>
                </div>

                {monthlyServices.length === 0 ? (
                  <p className="text-xs text-stone-500 py-6 text-center italic">
                    No hay servicios registrados en este mes.
                  </p>
                ) : (
                  <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                    {monthlyServices.map((serv) => (
                      <div key={serv.id} className="p-3 rounded-xl bg-[#FAF7F0] border border-[#E2D8C3] flex items-center justify-between text-xs">
                        <div>
                          <p className="font-bold text-[#183728]">{serv.servicio_nombre}</p>
                          <span className="text-[10px] text-stone-500">
                            {serv.cliente_nombre} • {new Date(serv.fecha).toLocaleDateString('es-ES')} • {serv.metodo_pago}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-[#183728]">RD${serv.monto_cobrado.toLocaleString()}</span>
                          <span className="block text-[10px] text-[#9E7F36]">Cobrado</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

          </div>
        )}

        {/* TAB 2: INVENTARIO DE PRODUCTOS */}
        {activeTab === 'inventario' && (
          <div className="space-y-6">
            
            {/* Header & Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D4C4A3] pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#9E7F36]">
                  Control de Almacén & Cabina
                </span>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#183728]">
                  Inventario de Productos
                </h2>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setIsRecordSaleOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-[#183728] text-[#FAF7F0] text-xs font-bold uppercase tracking-wider hover:bg-[#0f241a] transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <ShoppingBag className="w-4 h-4 text-[#C4A45B]" />
                  <span>Registrar Venta</span>
                </button>
                <button
                  onClick={() => setIsAddProductOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-[#C4A45B] text-[#183728] text-xs font-bold uppercase tracking-wider hover:bg-[#b5954c] transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Nuevo Producto</span>
                </button>
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por nombre de producto o categoría..."
                className="w-full pl-10 pr-4 py-3 rounded-2xl border border-[#D4C4A3] bg-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#183728]"
              />
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
            </div>

            {/* Low Stock Warning Banner if applicable */}
            {products.some(p => p.stock_actual <= (p.stock_minimo || 2)) && (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 flex items-center gap-3 text-xs">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                <div>
                  <strong className="block font-bold">Atención: Productos con poco inventario</strong>
                  <span>Hay artículos que han alcanzado el stock mínimo para venta o uso en cabina.</span>
                </div>
              </div>
            )}

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducts.map((prod) => {
                const isLow = prod.stock_actual <= (prod.stock_minimo || 2);
                const gananciaUnidad = Number(prod.precio_venta || 0) - Number(prod.costo || 0);

                return (
                  <div
                    key={prod.id}
                    className={`p-5 rounded-2xl bg-white border transition-all space-y-3 relative flex flex-col justify-between ${
                      isLow ? 'border-amber-400 shadow-md ring-1 ring-amber-300' : 'border-[#D4C4A3] shadow-sm'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">
                          {prod.categoria}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isLow 
                              ? 'bg-amber-100 text-amber-800 border border-amber-300' 
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          Stock: {prod.stock_actual} uds
                        </span>
                      </div>

                      <h4 className="font-serif font-bold text-base text-[#183728] mt-1">
                        {prod.nombre}
                      </h4>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-[#F2ECE0] text-xs">
                      <div className="flex justify-between text-stone-600">
                        <span>Costo de compra:</span>
                        <span>RD${Number(prod.costo || 0).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between font-bold text-[#183728]">
                        <span>Precio de venta:</span>
                        <span>RD${Number(prod.precio_venta || 0).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-emerald-700 text-[11px] font-semibold">
                        <span>Margen de ganancia:</span>
                        <span>+RD${gananciaUnidad.toLocaleString()} / ud</span>
                      </div>
                    </div>

                    {/* Quick Stock Controls */}
                    <div className="pt-3 border-t border-[#F2ECE0] flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleAdjustStock(prod.id, -1)}
                          title="Restar 1 unidad"
                          className="w-7 h-7 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold flex items-center justify-center text-xs"
                        >
                          -
                        </button>
                        <span className="text-xs font-bold px-2 text-[#183728]">{prod.stock_actual}</span>
                        <button
                          onClick={() => handleAdjustStock(prod.id, 1)}
                          title="Sumar 1 unidad (Reabastecer)"
                          className="w-7 h-7 rounded-lg bg-[#183728] text-white hover:bg-[#0f241a] font-bold flex items-center justify-center text-xs"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => handleDeleteProduct(prod.id)}
                        className="text-stone-400 hover:text-red-600 p-1.5 transition-colors"
                        title="Eliminar producto"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>

          </div>
        )}

        {/* TAB 3: SERVICIOS COBRADOS */}
        {activeTab === 'servicios' && (
          <div className="space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D4C4A3] pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#9E7F36]">
                  Registro de Procedimientos
                </span>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#183728]">
                  Faciales y Masajes Realizados
                </h2>
              </div>
              <button
                onClick={() => setIsRecordServiceOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-[#C4A45B] text-[#183728] text-xs font-bold uppercase tracking-wider hover:bg-[#b5954c] transition-all flex items-center gap-1.5 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Registrar Cobro</span>
              </button>
            </div>

            {/* List */}
            <div className="bg-white rounded-3xl border border-[#D4C4A3] p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-[#F2ECE0] pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                  Historial de Servicios ({completedServices.length})
                </span>
                <span className="text-xs font-bold text-[#183728]">
                  Total Acumulado: RD${completedServices.reduce((acc, s) => acc + Number(s.monto_cobrado || 0), 0).toLocaleString()}
                </span>
              </div>

              {completedServices.length === 0 ? (
                <p className="text-xs text-stone-500 py-8 text-center italic">
                  Aún no hay servicios registrados.
                </p>
              ) : (
                <div className="divide-y divide-[#F2ECE0] space-y-2">
                  {completedServices.map((serv) => (
                    <div key={serv.id} className="pt-3 pb-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                      <div>
                        <p className="font-serif font-bold text-sm text-[#183728]">{serv.servicio_nombre}</p>
                        <p className="text-stone-600 mt-0.5">
                          Paciente: <strong>{serv.cliente_nombre}</strong> • {new Date(serv.fecha).toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                        {serv.notas && <p className="text-[11px] text-stone-400 italic mt-0.5">{serv.notas}</p>}
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-base font-serif font-bold text-[#183728]">RD${Number(serv.monto_cobrado).toLocaleString()}</span>
                        <span className="block text-[10px] text-[#9E7F36] uppercase font-bold">{serv.metodo_pago}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

      </div>

      {/* ============================================================== */}
      {/* MODAL 1: AGREGAR NUEVO PRODUCTO                                */}
      {/* ============================================================== */}
      {isAddProductOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in text-left">
          <div className="bg-[#FAF7F0] rounded-3xl max-w-md w-full p-6 border-2 border-[#C4A45B] shadow-2xl space-y-4">
            <h3 className="text-lg font-serif font-bold text-[#183728]">
              Agregar Producto al Inventario
            </h3>

            <form onSubmit={handleAddProduct} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-[#183728] mb-1">Nombre del Producto *</label>
                <input
                  type="text"
                  required
                  value={newProductForm.nombre}
                  onChange={(e) => setNewProductForm({ ...newProductForm, nombre: e.target.value })}
                  placeholder="Ej: Sérum Vitamina C 15%"
                  className="w-full p-2.5 rounded-xl border border-[#D4C4A3] bg-white focus:ring-2 focus:ring-[#183728] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-[#183728] mb-1">Categoría</label>
                <select
                  value={newProductForm.categoria}
                  onChange={(e) => setNewProductForm({ ...newProductForm, categoria: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-[#D4C4A3] bg-white focus:ring-2 focus:ring-[#183728] focus:outline-none"
                >
                  <option value="Protección Solar">Protección Solar</option>
                  <option value="Sérums">Sérums</option>
                  <option value="Limpiadores">Limpiadores</option>
                  <option value="Mascarillas">Mascarillas</option>
                  <option value="Cremas & Emulsiones">Cremas & Emulsiones</option>
                  <option value="Aceites & Maderoterapia">Aceites & Maderoterapia</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#183728] mb-1">Costo de Compra (RD$)</label>
                  <input
                    type="number"
                    min="0"
                    value={newProductForm.costo}
                    onChange={(e) => setNewProductForm({ ...newProductForm, costo: e.target.value })}
                    placeholder="1200"
                    className="w-full p-2.5 rounded-xl border border-[#D4C4A3] bg-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#183728] mb-1">Precio de Venta (RD$) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={newProductForm.precio_venta}
                    onChange={(e) => setNewProductForm({ ...newProductForm, precio_venta: e.target.value })}
                    placeholder="1850"
                    className="w-full p-2.5 rounded-xl border border-[#D4C4A3] bg-white font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#183728] mb-1">Cantidad Inicial</label>
                  <input
                    type="number"
                    min="0"
                    value={newProductForm.stock_actual}
                    onChange={(e) => setNewProductForm({ ...newProductForm, stock_actual: e.target.value })}
                    placeholder="5"
                    className="w-full p-2.5 rounded-xl border border-[#D4C4A3] bg-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#183728] mb-1">Alerta Stock Mínimo</label>
                  <input
                    type="number"
                    min="1"
                    value={newProductForm.stock_minimo}
                    onChange={(e) => setNewProductForm({ ...newProductForm, stock_minimo: e.target.value })}
                    placeholder="2"
                    className="w-full p-2.5 rounded-xl border border-[#D4C4A3] bg-white"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddProductOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-[#D4C4A3] bg-white font-bold uppercase tracking-wider text-stone-600"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#183728] text-white font-bold uppercase tracking-wider border border-[#C4A45B]"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 2: REGISTRAR VENTA DE PRODUCTO (Descuenta stock)         */}
      {/* ============================================================== */}
      {isRecordSaleOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in text-left">
          <div className="bg-[#FAF7F0] rounded-3xl max-w-md w-full p-6 border-2 border-[#C4A45B] shadow-2xl space-y-4">
            <h3 className="text-lg font-serif font-bold text-[#183728]">
              Registrar Venta de Producto
            </h3>
            <p className="text-xs text-stone-600">
              El stock se descontará automáticamente y sumará a la contabilidad del mes.
            </p>

            <form onSubmit={handleRecordSale} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-[#183728] mb-1">Producto a Vender *</label>
                <select
                  required
                  value={newSaleForm.producto_id}
                  onChange={(e) => setNewSaleForm({ ...newSaleForm, producto_id: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-[#D4C4A3] bg-white focus:outline-none"
                >
                  <option value="">-- Seleccionar producto --</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id} disabled={p.stock_actual <= 0}>
                      {p.nombre} (Stock: {p.stock_actual} | RD${p.precio_venta})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#183728] mb-1">Cantidad *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={newSaleForm.cantidad}
                    onChange={(e) => setNewSaleForm({ ...newSaleForm, cantidad: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-[#D4C4A3] bg-white font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#183728] mb-1">Método de Pago</label>
                  <select
                    value={newSaleForm.metodo_pago}
                    onChange={(e) => setNewSaleForm({ ...newSaleForm, metodo_pago: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-[#D4C4A3] bg-white"
                  >
                    <option value="Efectivo">Efectivo</option>
                    <option value="Transferencia">Transferencia</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#183728] mb-1">Notas / Clienta (Opcional)</label>
                <input
                  type="text"
                  value={newSaleForm.notas}
                  onChange={(e) => setNewSaleForm({ ...newSaleForm, notas: e.target.value })}
                  placeholder="Ej: Vendido a paciente María Gómez"
                  className="w-full p-2.5 rounded-xl border border-[#D4C4A3] bg-white"
                />
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsRecordSaleOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-[#D4C4A3] bg-white font-bold uppercase tracking-wider text-stone-600"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={!newSaleForm.producto_id}
                  className="flex-1 py-2.5 rounded-xl bg-[#183728] text-white font-bold uppercase tracking-wider border border-[#C4A45B] disabled:opacity-50"
                >
                  Cobrar y Descontar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 3: REGISTRAR COBRO DE SERVICIO / FACIAL                  */}
      {/* ============================================================== */}
      {isRecordServiceOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in text-left">
          <div className="bg-[#FAF7F0] rounded-3xl max-w-md w-full p-6 border-2 border-[#C4A45B] shadow-2xl space-y-4">
            <h3 className="text-lg font-serif font-bold text-[#183728]">
              Registrar Cobro de Procedimiento
            </h3>

            <form onSubmit={handleRecordService} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-[#183728] mb-1">Nombre de la Paciente *</label>
                <input
                  type="text"
                  required
                  value={newServiceForm.cliente_nombre}
                  onChange={(e) => setNewServiceForm({ ...newServiceForm, cliente_nombre: e.target.value })}
                  placeholder="Ej: Laura Mercedes"
                  className="w-full p-2.5 rounded-xl border border-[#D4C4A3] bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-[#183728] mb-1">Tratamiento Realizado</label>
                <select
                  value={newServiceForm.servicio_nombre}
                  onChange={(e) => {
                    const match = servicesData.find(s => s.name === e.target.value);
                    setNewServiceForm({
                      ...newServiceForm,
                      servicio_nombre: e.target.value,
                      monto_cobrado: match ? match.price : newServiceForm.monto_cobrado
                    });
                  }}
                  className="w-full p-2.5 rounded-xl border border-[#D4C4A3] bg-white"
                >
                  {servicesData.map((s) => (
                    <option key={s.id} value={s.name}>
                      {s.name} (RD${s.price})
                    </option>
                  ))}
                  <option value="Otro Tratamiento Personalizado">Otro Tratamiento Personalizado</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#183728] mb-1">Monto Cobrado (RD$) *</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={newServiceForm.monto_cobrado}
                    onChange={(e) => setNewServiceForm({ ...newServiceForm, monto_cobrado: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-[#D4C4A3] bg-white font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#183728] mb-1">Método de Pago</label>
                  <select
                    value={newServiceForm.metodo_pago}
                    onChange={(e) => setNewServiceForm({ ...newServiceForm, metodo_pago: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-[#D4C4A3] bg-white"
                  >
                    <option value="Transferencia">Transferencia</option>
                    <option value="Efectivo">Efectivo</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#183728] mb-1">Notas (Opcional)</label>
                <input
                  type="text"
                  value={newServiceForm.notas}
                  onChange={(e) => setNewServiceForm({ ...newServiceForm, notas: e.target.value })}
                  placeholder="Detalle o abono completado..."
                  className="w-full p-2.5 rounded-xl border border-[#D4C4A3] bg-white"
                />
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsRecordServiceOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-[#D4C4A3] bg-white font-bold uppercase tracking-wider text-stone-600"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#183728] text-white font-bold uppercase tracking-wider border border-[#C4A45B]"
                >
                  Guardar Cobro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
