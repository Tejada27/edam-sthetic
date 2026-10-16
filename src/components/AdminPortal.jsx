import React, { useState, useEffect, useMemo } from 'react';
import { 
  DollarSign, Package, TrendingUp, AlertTriangle, 
  Plus, ShoppingBag, ArrowLeft, Trash2, 
  Search, Eye, EyeOff, LogOut, Sparkles, Shield, Clock, RefreshCw
} from 'lucide-react';
import { 
  supabase, 
  isSupabaseConfigured, 
  initialProducts, 
  initialSales, 
  initialCompletedServices 
} from '../lib/supabaseClient';
import { servicesData } from '../data/servicesData';

export default function AdminPortal({ 
  onClose, 
  appointments, 
  onUpdateAppointment 
}) {
  // Lock background scroll when Admin Portal is active to improve performance
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('edam_admin_auth') === 'true';
  });
  const [pinInput, setPinInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [lockoutRemaining, setLockoutRemaining] = useState(0);
  const [sessionExpiredNotice, setSessionExpiredNotice] = useState(false);

  // Active view tab inside admin
  const [activeTab, setActiveTab] = useState('finanzas'); // 'finanzas' | 'inventario' | 'servicios'

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

  // Save to localStorage when states update (offline persistent cache)
  useEffect(() => {
    localStorage.setItem('edam_products_data', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('edam_sales_data', JSON.stringify(sales));
  }, [sales]);

  useEffect(() => {
    localStorage.setItem('edam_services_data', JSON.stringify(completedServices));
  }, [completedServices]);

  const [isSyncing, setIsSyncing] = useState(false);

  // Synchronize data from Supabase (Single source of truth)
  const fetchData = async () => {
    if (!isSupabaseConfigured || !supabase) return;
    try {
      setIsSyncing(true);
      const [pRes, sRes, cRes] = await Promise.all([
        supabase.from('productos').select('*').order('created_at', { ascending: true }),
        supabase.from('ventas_productos').select('*').order('fecha', { ascending: false }),
        supabase.from('servicios_realizados').select('*').order('fecha', { ascending: false })
      ]);

      if (pRes.data) {
        setProducts(pRes.data);
        localStorage.setItem('edam_products_data', JSON.stringify(pRes.data));
      }
      if (sRes.data) {
        setSales(sRes.data);
        localStorage.setItem('edam_sales_data', JSON.stringify(sRes.data));
      }
      if (cRes.data) {
        setCompletedServices(cRes.data);
        localStorage.setItem('edam_services_data', JSON.stringify(cRes.data));
      }
    } catch (err) {
      console.error('Error al sincronizar con Supabase, usando caché local', err);
    } finally {
      setIsSyncing(false);
    }
  };

  // 1. Initial load on mount
  useEffect(() => {
    fetchData();
  }, []);

  // 2. Auto-sync whenever the user switches back to this browser tab or focuses window
  useEffect(() => {
    const handleSyncOnFocus = () => {
      if (document.visibilityState === 'visible') {
        fetchData();
      }
    };

    window.addEventListener('focus', handleSyncOnFocus);
    document.addEventListener('visibilitychange', handleSyncOnFocus);

    return () => {
      window.removeEventListener('focus', handleSyncOnFocus);
      document.removeEventListener('visibilitychange', handleSyncOnFocus);
    };
  }, []);

  // 3. Supabase Realtime: Instant WebSocket push updates from other devices (e.g. phone to PC)
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;

    const channel = supabase
      .channel('edam-realtime-admin')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'productos' }, () => {
        fetchData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'ventas_productos' }, () => {
        fetchData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'servicios_realizados' }, () => {
        fetchData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Brute-force lockout timer check (only runs when unauthenticated)
  useEffect(() => {
    if (isAuthenticated) return;

    const checkLockout = () => {
      const lockoutUntil = parseInt(sessionStorage.getItem('edam_admin_lockout_until') || '0', 10);
      const now = Date.now();
      if (lockoutUntil > now) {
        setLockoutRemaining(Math.ceil((lockoutUntil - now) / 1000));
      } else {
        setLockoutRemaining(0);
      }
    };

    checkLockout();
    const interval = setInterval(checkLockout, 1000);
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  // Auto-logout after 20 minutes of user inactivity (lightweight events only)
  useEffect(() => {
    if (!isAuthenticated) return;

    let lastActivity = Date.now();
    const INACTIVITY_TIMEOUT = 20 * 60 * 1000; // 20 minutes

    const updateActivity = () => {
      lastActivity = Date.now();
    };

    const events = ['pointerdown', 'keydown'];
    events.forEach(event => window.addEventListener(event, updateActivity, { passive: true }));

    const checkInactivity = setInterval(() => {
      if (Date.now() - lastActivity > INACTIVITY_TIMEOUT) {
        setIsAuthenticated(false);
        sessionStorage.removeItem('edam_admin_auth');
        setSessionExpiredNotice(true);
      }
    }, 30000);

    return () => {
      events.forEach(event => window.removeEventListener(event, updateActivity));
      clearInterval(checkInactivity);
    };
  }, [isAuthenticated]);

  // Login handler with brute-force throttling
  const handleLogin = (e) => {
    e.preventDefault();
    if (lockoutRemaining > 0) return;

    const validPassword = (import.meta.env.VITE_ADMIN_PASSWORD || 'katherine2026').trim();

    if (pinInput.trim() === validPassword) {
      setIsAuthenticated(true);
      sessionStorage.setItem('edam_admin_auth', 'true');
      sessionStorage.removeItem('edam_admin_failed_attempts');
      sessionStorage.removeItem('edam_admin_lockout_until');
      setLoginError('');
      setSessionExpiredNotice(false);
      setPinInput('');
    } else {
      const attempts = parseInt(sessionStorage.getItem('edam_admin_failed_attempts') || '0', 10) + 1;
      sessionStorage.setItem('edam_admin_failed_attempts', attempts.toString());

      if (attempts >= 5) {
        const lockoutTime = Date.now() + 3 * 60 * 1000; // 3 minutes lockout
        sessionStorage.setItem('edam_admin_lockout_until', lockoutTime.toString());
        setLockoutRemaining(180);
        setLoginError('Demasiados intentos incorrectos. Acceso bloqueado temporalmente por 3 minutos por seguridad.');
      } else {
        const remainingAttempts = 5 - attempts;
        setLoginError(`Contraseña incorrecta. Te quedan ${remainingAttempts} intento${remainingAttempts === 1 ? '' : 's'}.`);
      }
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
    const tempId = `prod-${Date.now()}`;

    const newProd = {
      id: tempId,
      nombre: newProductForm.nombre.trim(),
      categoria: newProductForm.categoria,
      costo,
      precio_venta,
      stock_actual,
      stock_minimo
    };

    setProducts(prev => [newProd, ...prev]);

    setNewProductForm({
      nombre: '',
      categoria: 'Cuidado Facial',
      costo: '',
      precio_venta: '',
      stock_actual: '',
      stock_minimo: '2'
    });
    setIsAddProductOpen(false);

    if (isSupabaseConfigured && supabase) {
      try {
        const { data } = await supabase.from('productos').insert([{
          nombre: newProd.nombre,
          categoria: newProd.categoria,
          costo,
          precio_venta,
          stock_actual,
          stock_minimo
        }]).select();
        if (data && data[0]) {
          setProducts(prev => prev.map(p => p.id === tempId ? data[0] : p));
        }
      } catch (err) {
        console.error('Error al guardar producto en Supabase', err);
      }
    }
  };

  // Adjust stock quickly (+1 or -1)
  const handleAdjustStock = async (prod, delta) => {
    let updatedStock = 0;
    setProducts(prev => prev.map(p => {
      if (p.id === prod.id) {
        updatedStock = Math.max(0, Number(p.stock_actual || 0) + delta);
        return { ...p, stock_actual: updatedStock };
      }
      return p;
    }));

    if (isSupabaseConfigured && supabase) {
      try {
        if (prod.id && !prod.id.startsWith('prod-')) {
          await supabase.from('productos').update({ stock_actual: updatedStock }).eq('id', prod.id);
        } else {
          await supabase.from('productos').update({ stock_actual: updatedStock }).eq('nombre', prod.nombre);
        }
      } catch (err) {
        console.error('Error al actualizar stock en Supabase', err);
      }
    }
  };

  // Delete product
  const handleDeleteProduct = async (prod) => {
    if (window.confirm(`¿Deseas eliminar "${prod.nombre}" del inventario?`)) {
      setProducts(prev => prev.filter(p => p.id !== prod.id));
      if (isSupabaseConfigured && supabase) {
        try {
          if (prod.id && !prod.id.startsWith('prod-')) {
            await supabase.from('productos').delete().eq('id', prod.id);
          } else {
            await supabase.from('productos').delete().eq('nombre', prod.nombre);
          }
        } catch (err) {
          console.error('Error al eliminar producto en Supabase', err);
        }
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
      alert(`Stock insuficiente. Solo quedan ${prod.stock_actual} unidades disponibles.`);
      return;
    }

    const costoUnitario = Number(prod.costo || 0);
    const precioUnitario = Number(prod.precio_venta || 0);
    const totalVenta = precioUnitario * qty;
    const gananciaNeta = (precioUnitario - costoUnitario) * qty;
    const tempId = `sale-${Date.now()}`;
    const buyerNote = newSaleForm.notas ? newSaleForm.notas.trim() : '';

    const newSale = {
      id: tempId,
      producto_id: prod.id,
      producto_nombre: prod.nombre,
      cantidad: qty,
      costo_unitario: costoUnitario,
      precio_unitario: precioUnitario,
      total_venta: totalVenta,
      ganancia_neta: gananciaNeta,
      metodo_pago: newSaleForm.metodo_pago,
      fecha: new Date().toISOString(),
      notas: buyerNote
    };

    // Update sales list immediately
    setSales(prev => [newSale, ...prev]);

    // Deduct stock from product immediately
    const updatedStock = prod.stock_actual - qty;
    setProducts(prev => prev.map(p => {
      if (p.id === prod.id) {
        return { ...p, stock_actual: updatedStock };
      }
      return p;
    }));

    setIsRecordSaleOpen(false);
    setNewSaleForm({ producto_id: '', cantidad: 1, metodo_pago: 'Efectivo', notas: '' });

    // Sync to Supabase
    if (isSupabaseConfigured && supabase) {
      try {
        const dbPayload = {
          producto_id: prod.id.startsWith('prod-') ? null : prod.id,
          producto_nombre: prod.nombre,
          cantidad: qty,
          costo_unitario: costoUnitario,
          precio_unitario: precioUnitario,
          total_venta: totalVenta,
          ganancia_neta: gananciaNeta,
          metodo_pago: newSaleForm.metodo_pago,
          fecha: newSale.fecha,
          notas: buyerNote
        };

        const { data: insertedData } = await supabase.from('ventas_productos').insert([dbPayload]).select();
        if (insertedData && insertedData[0]) {
          setSales(prev => prev.map(s => s.id === tempId ? insertedData[0] : s));
        }

        if (!prod.id.startsWith('prod-')) {
          await supabase.from('productos').update({ stock_actual: updatedStock }).eq('id', prod.id);
        }
      } catch (err) {
        console.error('Error al sincronizar venta con Supabase', err);
      }
    }
  };

  // Delete recorded sale and restore inventory stock
  const handleDeleteSale = async (sale) => {
    if (!window.confirm(`¿Deseas eliminar la venta de "${sale.producto_nombre}"? El stock será restaurado (+${sale.cantidad} ud).`)) {
      return;
    }

    const restoredQty = Number(sale.cantidad) || 1;
    let newStock = null;

    // Restore product stock locally
    setProducts(prev => prev.map(p => {
      if (p.id === sale.producto_id) {
        newStock = (Number(p.stock_actual) || 0) + restoredQty;
        return { ...p, stock_actual: newStock };
      }
      return p;
    }));

    // Remove sale locally
    setSales(prev => prev.filter(s => s.id !== sale.id));

    // Sync deletion to Supabase
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('ventas_productos').delete().eq('id', sale.id);
        if (newStock !== null && sale.producto_id && !sale.producto_id.startsWith('prod-')) {
          await supabase.from('productos').update({ stock_actual: newStock }).eq('id', sale.producto_id);
        }
      } catch (err) {
        console.error('Error al eliminar venta en Supabase', err);
      }
    }
  };

  // Record Completed Service
  const handleRecordService = async (e) => {
    e.preventDefault();
    if (!newServiceForm.cliente_nombre || !newServiceForm.monto_cobrado) return;

    const tempId = `serv-${Date.now()}`;
    const newServ = {
      id: tempId,
      cliente_nombre: newServiceForm.cliente_nombre.trim(),
      servicio_nombre: newServiceForm.servicio_nombre,
      monto_cobrado: Number(newServiceForm.monto_cobrado) || 0,
      metodo_pago: newServiceForm.metodo_pago,
      fecha: new Date().toISOString(),
      notas: newServiceForm.notas ? newServiceForm.notas.trim() : ''
    };

    setCompletedServices(prev => [newServ, ...prev]);

    setIsRecordServiceOpen(false);
    setNewServiceForm({
      cliente_nombre: '',
      servicio_nombre: servicesData[0]?.name || '',
      monto_cobrado: servicesData[0]?.price || 2000,
      metodo_pago: 'Transferencia',
      notas: ''
    });

    if (isSupabaseConfigured && supabase) {
      try {
        const dbPayload = {
          cliente_nombre: newServ.cliente_nombre,
          servicio_nombre: newServ.servicio_nombre,
          monto_cobrado: newServ.monto_cobrado,
          metodo_pago: newServ.metodo_pago,
          fecha: newServ.fecha,
          notas: newServ.notas
        };

        const { data: insertedData } = await supabase.from('servicios_realizados').insert([dbPayload]).select();
        if (insertedData && insertedData[0]) {
          setCompletedServices(prev => prev.map(s => s.id === tempId ? insertedData[0] : s));
        }
      } catch (err) {
        console.error('Error al registrar servicio en Supabase', err);
      }
    }
  };

  // Delete recorded completed service
  const handleDeleteService = async (serviceId, serviceName) => {
    if (!window.confirm(`¿Deseas eliminar el registro de cobro de "${serviceName}"?`)) {
      return;
    }

    setCompletedServices(prev => prev.filter(s => s.id !== serviceId));

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('servicios_realizados').delete().eq('id', serviceId);
      } catch (err) {
        console.error('Error al eliminar servicio en Supabase', err);
      }
    }
  };

  // =========================================================================
  // VIEW: AUTHENTICATION SCREEN
  // =========================================================================
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/85 text-left font-sans">
        <div className="bg-white rounded-2xl max-w-sm w-full p-8 border border-stone-200 shadow-2xl space-y-6">
          
          <div className="text-center space-y-2.5">
            <div className="w-14 h-14 rounded-full overflow-hidden mx-auto border border-[#C4A45B]/50 bg-black shadow-md">
              <img src="/logo_ea_black.png" alt="EA" className="w-full h-full object-cover" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#9E7F36] font-semibold block">
                Acceso Privado
              </span>
              <h2 className="text-xl font-serif font-bold text-[#183728]">
                Panel de Administración
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                EDAM Sthetic • Katherine Encarnación
              </p>
            </div>
          </div>

          {sessionExpiredNotice && (
            <div className="p-3 rounded-xl bg-stone-100 border border-stone-200 text-stone-600 text-xs flex items-center gap-2">
              <Clock className="w-4 h-4 text-stone-500 shrink-0" />
              <span>Tu sesión se cerró por inactividad. Ingresa nuevamente.</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1.5">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  placeholder="Introduce tu contraseña..."
                  disabled={lockoutRemaining > 0}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-stone-50/50 text-sm focus:ring-2 focus:ring-[#183728] focus:bg-white focus:outline-none pr-10 disabled:opacity-50"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-stone-400 hover:text-stone-600 absolute right-3 top-3 p-0.5 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {lockoutRemaining > 0 && (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2">
                <Shield className="w-4 h-4 text-amber-700 shrink-0" />
                <span>Bloqueado por seguridad. Espera <strong>{lockoutRemaining}s</strong> para reintentar.</span>
              </div>
            )}

            {loginError && lockoutRemaining === 0 && (
              <p className="text-xs text-red-600 font-medium p-2.5 rounded-lg bg-red-50 border border-red-200">
                {loginError}
              </p>
            )}

            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl border border-stone-300 bg-white text-stone-700 text-xs font-semibold hover:bg-stone-50 transition-colors"
              >
                Volver
              </button>
              <button
                type="submit"
                disabled={lockoutRemaining > 0}
                className="flex-1 py-2.5 rounded-xl bg-[#183728] text-white text-xs font-semibold hover:bg-[#0f241a] transition-all shadow-sm disabled:opacity-50"
              >
                Ingresar
              </button>
            </div>
          </form>

          <div className="pt-2 border-t border-stone-100 text-center">
            <span className="text-[11px] text-stone-400 flex items-center justify-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-stone-400" />
              Seguridad protegida mediante Vercel
            </span>
          </div>

        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW: AUTHENTICATED MANAGEMENT PORTAL
  // =========================================================================
  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#FAF7F0] text-stone-900 overflow-hidden text-left font-sans">
      
      {/* Top Header */}
      <header className="bg-[#0D1410] text-[#FAF7F0] px-4 sm:px-8 py-3.5 border-b border-stone-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-full overflow-hidden border border-[#C4A45B]/60 bg-black shrink-0">
            <img src="/logo_ea_black.png" alt="EA" className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-serif font-bold text-white tracking-wider">
                EDAM <span className="text-[#C4A45B] text-xs font-normal">STHETIC</span>
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-stone-800 text-stone-300 font-medium">
                Panel de Gestión
              </span>
            </div>
            <p className="text-[10px] text-stone-400">
              Katherine Encarnación • Santo Domingo Este
            </p>
          </div>
        </div>

        {/* Database status and actions */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchData}
            disabled={isSyncing}
            title="Sincronizar cambios desde la nube"
            className="px-2.5 py-1 rounded-full bg-stone-800/80 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors flex items-center gap-1.5 text-[11px]"
          >
            <RefreshCw className={`w-3 h-3 text-[#C4A45B] ${isSyncing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">{isSyncing ? 'Sincronizando...' : 'Actualizar'}</span>
          </button>

          <span 
            className={`text-[11px] font-medium px-2.5 py-1 rounded-full flex items-center gap-1.5 ${
              isSupabaseConfigured 
                ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/60' 
                : 'bg-stone-800 text-stone-300 border border-stone-700'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${isSupabaseConfigured ? 'bg-emerald-400 animate-pulse' : 'bg-stone-400'}`}></span>
            <span>{isSupabaseConfigured ? 'Conectado a Supabase' : 'Modo Local'}</span>
          </span>

          <button
            onClick={handleLogout}
            title="Cerrar Sesión"
            className="p-2 rounded-xl bg-stone-800/80 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>

          <button
            onClick={onClose}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#C4A45B] hover:bg-[#b5954c] text-[#0D1410] text-xs font-semibold transition-colors shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Ver Web</span>
          </button>
        </div>
      </header>

      {/* Navigation Sub-bar */}
      <div className="bg-[#121A15] text-[#FAF7F0] px-4 sm:px-8 border-b border-stone-800 flex items-center justify-between gap-4 overflow-x-auto shrink-0">
        <nav className="flex items-center gap-1.5 py-2">
          <button
            onClick={() => setActiveTab('finanzas')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium tracking-wide flex items-center gap-2 transition-all ${
              activeTab === 'finanzas'
                ? 'bg-white/15 text-white shadow-xs'
                : 'text-stone-400 hover:text-stone-200 hover:bg-white/5'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5 text-[#C4A45B]" />
            <span>Contabilidad Mensual</span>
          </button>

          <button
            onClick={() => setActiveTab('inventario')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium tracking-wide flex items-center gap-2 transition-all ${
              activeTab === 'inventario'
                ? 'bg-white/15 text-white shadow-xs'
                : 'text-stone-400 hover:text-stone-200 hover:bg-white/5'
            }`}
          >
            <Package className="w-3.5 h-3.5 text-[#C4A45B]" />
            <span>Inventario ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('servicios')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium tracking-wide flex items-center gap-2 transition-all ${
              activeTab === 'servicios'
                ? 'bg-white/15 text-white shadow-xs'
                : 'text-stone-400 hover:text-stone-200 hover:bg-white/5'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#C4A45B]" />
            <span>Servicios Realizados</span>
          </button>
        </nav>

        {/* Month Picker for Accounting */}
        <div className="flex items-center gap-2 py-2 shrink-0 text-xs">
          <span className="text-stone-400 hidden md:inline">Período:</span>
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-2.5 py-1 rounded-md bg-stone-900 border border-stone-700 text-xs text-stone-200 focus:outline-none focus:border-[#C4A45B]"
          />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-8 max-w-7xl mx-auto w-full space-y-6">
        
        {/* ================================================================ */}
        {/* TAB 1: FINANZAS Y CONTABILIDAD MENSUAL                           */}
        {/* ================================================================ */}
        {activeTab === 'finanzas' && (
          <div className="space-y-6">
            
            {/* Header & Quick Action Buttons */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 pb-4">
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-stone-500">
                  Resumen de Ingresos & Ventas
                </span>
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#183728] capitalize">
                  {new Date(selectedMonth + '-02').toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
                </h2>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsRecordSaleOpen(true)}
                  className="px-3.5 py-2 rounded-xl bg-[#183728] text-white text-xs font-semibold hover:bg-[#122b1f] transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5 text-[#C4A45B]" />
                  <span>Venta Producto</span>
                </button>
                <button
                  onClick={() => setIsRecordServiceOpen(true)}
                  className="px-3.5 py-2 rounded-xl bg-white text-[#183728] border border-stone-300 text-xs font-semibold hover:bg-stone-50 transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5 text-stone-500" />
                  <span>Cobro Servicio</span>
                </button>
              </div>
            </div>

            {/* 4 Financial Metric Cards (Harmonious Minimalist Design) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Card 1: Grand Total Revenue */}
              <div className="p-5 rounded-2xl bg-white border border-stone-200/90 shadow-sm flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold tracking-wider text-stone-500 uppercase">
                    Facturación Total
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center text-[#9E7F36]">
                    <DollarSign className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-3">
                  <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#183728]">
                    RD${grandTotalRevenue.toLocaleString()}
                  </h3>
                  <p className="text-xs text-stone-500 mt-1">
                    Servicios y productos del mes
                  </p>
                </div>
              </div>

              {/* Card 2: Facial & Cabin Services */}
              <div className="p-5 rounded-2xl bg-white border border-stone-200/90 shadow-sm flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold tracking-wider text-stone-500 uppercase">
                    Faciales & Cabina
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center text-[#183728]">
                    <Sparkles className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-3">
                  <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#183728]">
                    RD${totalServicesRevenue.toLocaleString()}
                  </h3>
                  <p className="text-xs text-stone-500 mt-1">
                    {monthlyServices.length} servicios realizados
                  </p>
                </div>
              </div>

              {/* Card 3: Product Sales */}
              <div className="p-5 rounded-2xl bg-white border border-stone-200/90 shadow-sm flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold tracking-wider text-stone-500 uppercase">
                    Ventas Productos
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center text-stone-700">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-3">
                  <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#183728]">
                    RD${totalSalesRevenue.toLocaleString()}
                  </h3>
                  <p className="text-xs text-stone-500 mt-1">
                    {monthlySales.length} transacciones registradas
                  </p>
                </div>
              </div>

              {/* Card 4: Net Profit on Products */}
              <div className="p-5 rounded-2xl bg-white border border-stone-200/90 shadow-sm flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold tracking-wider text-stone-500 uppercase">
                    Ganancia Neta
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center text-emerald-700">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-3">
                  <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#183728]">
                    RD${totalSalesProfit.toLocaleString()}
                  </h3>
                  <p className="text-xs text-stone-500 mt-1">
                    Margen libre en productos
                  </p>
                </div>
              </div>

            </div>

            {/* Split Breakdown Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Left: Product Sales */}
              <div className="bg-white rounded-2xl border border-stone-200/90 p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                  <h4 className="text-sm font-semibold text-[#183728] flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-stone-500" />
                    <span>Productos Vendidos ({monthlySales.length})</span>
                  </h4>
                  <span className="text-xs font-semibold text-stone-700">RD${totalSalesRevenue.toLocaleString()}</span>
                </div>

                {monthlySales.length === 0 ? (
                  <p className="text-xs text-stone-400 py-8 text-center">
                    No hay ventas registradas en este período.
                  </p>
                ) : (
                  <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                    {monthlySales.map((sale) => (
                      <div key={sale.id} className="p-3 rounded-xl bg-stone-50/70 border border-stone-200/70 flex items-center justify-between gap-3 text-xs hover:bg-stone-50 transition-colors">
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-stone-900 truncate">{sale.producto_nombre}</p>
                          <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-stone-500 mt-1">
                            {sale.notas && (
                              <span className="font-semibold text-[#183728] bg-[#F2ECE0] px-2 py-0.5 rounded-md border border-[#D4C4A3]">
                                Clienta: {sale.notas}
                              </span>
                            )}
                            <span>{new Date(sale.fecha).toLocaleDateString('es-ES')}</span>
                            <span>•</span>
                            <span>{sale.cantidad} ud.</span>
                            <span>•</span>
                            <span>{sale.metodo_pago}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <div className="text-right">
                            <span className="font-semibold text-stone-900 block">RD${sale.total_venta.toLocaleString()}</span>
                            <p className="text-[10px] text-emerald-700 font-medium">+RD${sale.ganancia_neta.toLocaleString()} neta</p>
                          </div>
                          <button
                            onClick={() => handleDeleteSale(sale)}
                            title="Eliminar venta y reponer stock"
                            className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Right: Performed Services */}
              <div className="bg-white rounded-2xl border border-stone-200/90 p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                  <h4 className="text-sm font-semibold text-[#183728] flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-stone-500" />
                    <span>Servicios Realizados ({monthlyServices.length})</span>
                  </h4>
                  <span className="text-xs font-semibold text-stone-700">RD${totalServicesRevenue.toLocaleString()}</span>
                </div>

                {monthlyServices.length === 0 ? (
                  <p className="text-xs text-stone-400 py-8 text-center">
                    No hay servicios registrados en este período.
                  </p>
                ) : (
                  <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                    {monthlyServices.map((serv) => (
                      <div key={serv.id} className="p-3 rounded-xl bg-stone-50/70 border border-stone-200/70 flex items-center justify-between gap-3 text-xs hover:bg-stone-50 transition-colors">
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-stone-900 truncate">{serv.servicio_nombre}</p>
                          <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-stone-500 mt-1">
                            <span className="font-semibold text-stone-700">
                              Paciente: {serv.cliente_nombre}
                            </span>
                            <span>•</span>
                            <span>{new Date(serv.fecha).toLocaleDateString('es-ES')}</span>
                            <span>•</span>
                            <span>{serv.metodo_pago}</span>
                          </div>
                          {serv.notas && <p className="text-[11px] text-stone-400 italic mt-0.5">{serv.notas}</p>}
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <div className="text-right">
                            <span className="font-semibold text-stone-900 block">RD${serv.monto_cobrado.toLocaleString()}</span>
                            <span className="text-[10px] text-stone-400">Cobrado</span>
                          </div>
                          <button
                            onClick={() => handleDeleteService(serv.id, serv.servicio_nombre)}
                            title="Eliminar registro de servicio"
                            className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

          </div>
        )}

        {/* ================================================================ */}
        {/* TAB 2: INVENTARIO DE PRODUCTOS                                  */}
        {/* ================================================================ */}
        {activeTab === 'inventario' && (
          <div className="space-y-6">
            
            {/* Header & Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-stone-500">
                  Control de Almacén
                </span>
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#183728]">
                  Inventario de Productos
                </h2>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setIsRecordSaleOpen(true)}
                  className="px-3.5 py-2 rounded-xl bg-[#183728] text-white text-xs font-semibold hover:bg-[#122b1f] transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <ShoppingBag className="w-3.5 h-3.5 text-[#C4A45B]" />
                  <span>Registrar Venta</span>
                </button>
                <button
                  onClick={() => setIsAddProductOpen(true)}
                  className="px-3.5 py-2 rounded-xl bg-white text-[#183728] border border-stone-300 text-xs font-semibold hover:bg-stone-50 transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
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
                placeholder="Buscar por nombre o categoría..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-stone-300 bg-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#183728]"
              />
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
            </div>

            {/* Low Stock Warning */}
            {products.some(p => p.stock_actual <= (p.stock_minimo || 2)) && (
              <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200 text-amber-900 flex items-center gap-2.5 text-xs">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Hay productos con inventario igual o inferior al stock mínimo.</span>
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
                      isLow ? 'border-amber-300 ring-1 ring-amber-200' : 'border-stone-200/90 shadow-xs'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-[10px] uppercase font-semibold text-stone-400 tracking-wider">
                          {prod.categoria}
                        </span>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                            isLow 
                              ? 'bg-amber-100 text-amber-800' 
                              : 'bg-stone-100 text-stone-700'
                          }`}
                        >
                          Stock: {prod.stock_actual}
                        </span>
                      </div>

                      <h4 className="font-semibold text-sm text-stone-900 mt-1">
                        {prod.nombre}
                      </h4>
                    </div>

                    <div className="space-y-1.5 pt-2 border-t border-stone-100 text-xs">
                      <div className="flex justify-between text-stone-500">
                        <span>Costo de compra:</span>
                        <span>RD${Number(prod.costo || 0).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between font-semibold text-stone-900">
                        <span>Precio de venta:</span>
                        <span>RD${Number(prod.precio_venta || 0).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-emerald-700 text-[11px] font-medium">
                        <span>Margen de ganancia:</span>
                        <span>+RD${gananciaUnidad.toLocaleString()} / ud</span>
                      </div>
                    </div>

                    {/* Stock Controls */}
                    <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleAdjustStock(prod, -1)}
                          title="Restar 1 unidad"
                          className="w-7 h-7 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold flex items-center justify-center text-xs transition-colors"
                        >
                          -
                        </button>
                        <span className="text-xs font-semibold px-2 text-stone-800">{prod.stock_actual}</span>
                        <button
                          onClick={() => handleAdjustStock(prod, 1)}
                          title="Sumar 1 unidad"
                          className="w-7 h-7 rounded-lg bg-[#183728] text-white hover:bg-[#0f241a] font-bold flex items-center justify-center text-xs transition-colors"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => handleDeleteProduct(prod)}
                        className="text-stone-300 hover:text-red-600 p-1.5 transition-colors"
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

        {/* ================================================================ */}
        {/* TAB 3: SERVICIOS REALIZADOS                                     */}
        {/* ================================================================ */}
        {activeTab === 'servicios' && (
          <div className="space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-stone-500">
                  Registro de Procedimientos
                </span>
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#183728]">
                  Faciales y Masajes Realizados
                </h2>
              </div>
              <button
                onClick={() => setIsRecordServiceOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-[#183728] text-white text-xs font-semibold hover:bg-[#122b1f] transition-all flex items-center gap-1.5 shadow-sm"
              >
                <Plus className="w-3.5 h-3.5 text-[#C4A45B]" />
                <span>Registrar Cobro</span>
              </button>
            </div>

            {/* List */}
            <div className="bg-white rounded-2xl border border-stone-200/90 p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <span className="text-xs font-medium text-stone-500">
                  Historial de Servicios ({completedServices.length})
                </span>
                <span className="text-xs font-semibold text-stone-900">
                  Total Acumulado: RD${completedServices.reduce((acc, s) => acc + Number(s.monto_cobrado || 0), 0).toLocaleString()}
                </span>
              </div>

              {completedServices.length === 0 ? (
                <p className="text-xs text-stone-400 py-8 text-center">
                  Aún no hay servicios registrados.
                </p>
              ) : (
                <div className="divide-y divide-stone-100 space-y-2">
                  {completedServices.map((serv) => (
                    <div key={serv.id} className="pt-3 pb-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-stone-900">{serv.servicio_nombre}</p>
                        <p className="text-stone-500 mt-0.5">
                          Paciente: <strong className="text-stone-700">{serv.cliente_nombre}</strong> • {new Date(serv.fecha).toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                        {serv.notas && <p className="text-[11px] text-stone-400 italic mt-0.5">{serv.notas}</p>}
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <div className="text-right">
                          <span className="text-sm font-semibold text-stone-900 block">RD${Number(serv.monto_cobrado).toLocaleString()}</span>
                          <span className="text-[10px] text-stone-400 font-medium">{serv.metodo_pago}</span>
                        </div>
                        <button
                          onClick={() => handleDeleteService(serv.id, serv.servicio_nombre)}
                          title="Eliminar registro de servicio"
                          className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 text-left">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-stone-200 shadow-2xl space-y-4">
            <h3 className="text-base font-serif font-bold text-[#183728]">
              Agregar Producto al Inventario
            </h3>

            <form onSubmit={handleAddProduct} className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-stone-700 mb-1">Nombre del Producto *</label>
                <input
                  type="text"
                  required
                  value={newProductForm.nombre}
                  onChange={(e) => setNewProductForm({ ...newProductForm, nombre: e.target.value })}
                  placeholder="Ej: Sérum Vitamina C 15%"
                  className="w-full p-2.5 rounded-xl border border-stone-300 bg-stone-50/50 focus:bg-white focus:ring-2 focus:ring-[#183728] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">Categoría</label>
                <select
                  value={newProductForm.categoria}
                  onChange={(e) => setNewProductForm({ ...newProductForm, categoria: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-stone-300 bg-white focus:ring-2 focus:ring-[#183728] focus:outline-none"
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
                  <label className="block font-medium text-stone-700 mb-1">Costo de Compra (RD$)</label>
                  <input
                    type="number"
                    min="0"
                    value={newProductForm.costo}
                    onChange={(e) => setNewProductForm({ ...newProductForm, costo: e.target.value })}
                    placeholder="1200"
                    className="w-full p-2.5 rounded-xl border border-stone-300 bg-white"
                  />
                </div>
                <div>
                  <label className="block font-medium text-stone-700 mb-1">Precio de Venta (RD$) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={newProductForm.precio_venta}
                    onChange={(e) => setNewProductForm({ ...newProductForm, precio_venta: e.target.value })}
                    placeholder="1850"
                    className="w-full p-2.5 rounded-xl border border-stone-300 bg-white font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-stone-700 mb-1">Cantidad Inicial</label>
                  <input
                    type="number"
                    min="0"
                    value={newProductForm.stock_actual}
                    onChange={(e) => setNewProductForm({ ...newProductForm, stock_actual: e.target.value })}
                    placeholder="5"
                    className="w-full p-2.5 rounded-xl border border-stone-300 bg-white"
                  />
                </div>
                <div>
                  <label className="block font-medium text-stone-700 mb-1">Alerta Stock Mínimo</label>
                  <input
                    type="number"
                    min="1"
                    value={newProductForm.stock_minimo}
                    onChange={(e) => setNewProductForm({ ...newProductForm, stock_minimo: e.target.value })}
                    placeholder="2"
                    className="w-full p-2.5 rounded-xl border border-stone-300 bg-white"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddProductOpen(false)}
                  className="flex-1 py-2 rounded-xl border border-stone-300 bg-white font-medium text-stone-600 hover:bg-stone-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-[#183728] text-white font-medium hover:bg-[#0f241a]"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 2: REGISTRAR VENTA DE PRODUCTO                           */}
      {/* ============================================================== */}
      {isRecordSaleOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 text-left">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-stone-200 shadow-2xl space-y-4">
            <h3 className="text-base font-serif font-bold text-[#183728]">
              Registrar Venta de Producto
            </h3>
            <p className="text-xs text-stone-500">
              El stock se descontará automáticamente y sumará a la contabilidad del mes.
            </p>

            <form onSubmit={handleRecordSale} className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-stone-700 mb-1">Producto a Vender *</label>
                <select
                  required
                  value={newSaleForm.producto_id}
                  onChange={(e) => setNewSaleForm({ ...newSaleForm, producto_id: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-stone-300 bg-white focus:outline-none"
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
                  <label className="block font-medium text-stone-700 mb-1">Cantidad *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={newSaleForm.cantidad}
                    onChange={(e) => setNewSaleForm({ ...newSaleForm, cantidad: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-stone-300 bg-white font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-medium text-stone-700 mb-1">Método de Pago</label>
                  <select
                    value={newSaleForm.metodo_pago}
                    onChange={(e) => setNewSaleForm({ ...newSaleForm, metodo_pago: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-stone-300 bg-white"
                  >
                    <option value="Efectivo">Efectivo</option>
                    <option value="Transferencia">Transferencia</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">
                  Nombre de la Clienta / Compradora (Opcional)
                </label>
                <input
                  type="text"
                  value={newSaleForm.notas}
                  onChange={(e) => setNewSaleForm({ ...newSaleForm, notas: e.target.value })}
                  placeholder="Ej: María Gómez"
                  className="w-full p-2.5 rounded-xl border border-stone-300 bg-white"
                />
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsRecordSaleOpen(false)}
                  className="flex-1 py-2 rounded-xl border border-stone-300 bg-white font-medium text-stone-600 hover:bg-stone-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={!newSaleForm.producto_id}
                  className="flex-1 py-2 rounded-xl bg-[#183728] text-white font-medium hover:bg-[#0f241a] disabled:opacity-50"
                >
                  Cobrar y Descontar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 3: REGISTRAR COBRO DE SERVICIO                           */}
      {/* ============================================================== */}
      {isRecordServiceOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 text-left">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-stone-200 shadow-2xl space-y-4">
            <h3 className="text-base font-serif font-bold text-[#183728]">
              Registrar Cobro de Servicio
            </h3>

            <form onSubmit={handleRecordService} className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-stone-700 mb-1">Nombre de la Paciente *</label>
                <input
                  type="text"
                  required
                  value={newServiceForm.cliente_nombre}
                  onChange={(e) => setNewServiceForm({ ...newServiceForm, cliente_nombre: e.target.value })}
                  placeholder="Ej: Laura Mercedes"
                  className="w-full p-2.5 rounded-xl border border-stone-300 bg-white"
                />
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">Tratamiento Realizado</label>
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
                  className="w-full p-2.5 rounded-xl border border-stone-300 bg-white"
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
                  <label className="block font-medium text-stone-700 mb-1">Monto Cobrado (RD$) *</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={newServiceForm.monto_cobrado}
                    onChange={(e) => setNewServiceForm({ ...newServiceForm, monto_cobrado: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-stone-300 bg-white font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-medium text-stone-700 mb-1">Método de Pago</label>
                  <select
                    value={newServiceForm.metodo_pago}
                    onChange={(e) => setNewServiceForm({ ...newServiceForm, metodo_pago: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-stone-300 bg-white"
                  >
                    <option value="Transferencia">Transferencia</option>
                    <option value="Efectivo">Efectivo</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">Notas (Opcional)</label>
                <input
                  type="text"
                  value={newServiceForm.notas}
                  onChange={(e) => setNewServiceForm({ ...newServiceForm, notas: e.target.value })}
                  placeholder="Detalle o abono completado..."
                  className="w-full p-2.5 rounded-xl border border-stone-300 bg-white"
                />
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsRecordServiceOpen(false)}
                  className="flex-1 py-2 rounded-xl border border-stone-300 bg-white font-medium text-stone-600 hover:bg-stone-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-[#183728] text-white font-medium hover:bg-[#0f241a]"
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
