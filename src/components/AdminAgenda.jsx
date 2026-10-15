import React, { useState } from 'react';
import { 
  Calendar, Clock, CheckCircle, AlertCircle, FileText, 
  ExternalLink, MessageCircle, Eye, Check, X, Search, Filter, Plus, ChevronRight, User, DollarSign, Image as ImageIcon
} from 'lucide-react';
import { clinicInfo } from '../data/bankData';

export default function AdminAgenda({ appointments, onUpdateAppointment, onNewAppointmentClick }) {
  const [filterStatus, setFilterStatus] = useState('todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAppointmentForFicha, setSelectedAppointmentForFicha] = useState(null);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [evolutionNote, setEvolutionNote] = useState('');

  // Filtered appointments
  const filtered = appointments.filter(app => {
    const matchesStatus = filterStatus === 'todos' || app.status === filterStatus;
    const matchesSearch = 
      app.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Metrics
  const totalDepositCollected = appointments
    .filter(a => a.status === 'confirmada' || a.status === 'completada')
    .reduce((sum, a) => sum + (a.deposit || 0), 0);

  const pendingVerificationCount = appointments.filter(a => a.status === 'pendiente_verificacion').length;
  const confirmedCount = appointments.filter(a => a.status === 'confirmada').length;

  const handleStatusChange = (appId, newStatus) => {
    const target = appointments.find(a => a.id === appId);
    if (target) {
      onUpdateAppointment({ ...target, status: newStatus });
    }
  };

  const handleSaveEvolutionNote = (appId) => {
    const target = appointments.find(a => a.id === appId);
    if (target) {
      const updatedNotes = target.notes 
        ? `${target.notes} | [Nota ${new Date().toLocaleDateString()}]: ${evolutionNote}`
        : `[Nota ${new Date().toLocaleDateString()}]: ${evolutionNote}`;
      onUpdateAppointment({ ...target, notes: updatedNotes });
      setEvolutionNote('');
      setSelectedAppointmentForFicha({ ...target, notes: updatedNotes });
    }
  };

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-left">
      
      {/* Top Banner & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-[#D4C4A3]">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#183728]/10 border border-[#C4A45B]/60 text-[#183728] text-xs font-bold uppercase tracking-wider mb-2">
            <Calendar className="w-3.5 h-3.5 text-[#9E7F36]" />
            <span>Panel de Gestión • Katherine Encarnación</span>
          </div>
          <h1 className="text-3xl font-serif font-bold text-[#183728]">
            Agenda de Cabina & Fichas Técnicas
          </h1>
          <p className="text-xs text-stone-600 mt-1">
            Valida los comprobantes de transferencia en pesos dominicanos (RD$) y consulta el historial clínico de cada clienta.
          </p>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={onNewAppointmentClick}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#183728] text-[#E8D9B0] border border-[#C4A45B] hover:bg-[#0f241a] text-xs font-bold uppercase tracking-wider shadow-md transition-all"
          >
            <Plus className="w-4 h-4 text-[#C4A45B]" />
            <span>Agendar Cita Manual</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-8">
        <div className="bg-white p-5 rounded-3xl border border-[#D4C4A3] shadow-sm">
          <span className="text-xs text-stone-500 font-bold uppercase tracking-wider">Citas Totales</span>
          <p className="text-3xl font-serif font-bold text-[#183728] mt-1">{appointments.length}</p>
          <span className="text-[11px] text-stone-400">Registradas en el sistema</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-amber-300 bg-amber-50/40 shadow-sm">
          <span className="text-xs text-amber-900 font-bold uppercase tracking-wider">Por Verificar Pago</span>
          <p className="text-3xl font-serif font-bold text-amber-900 mt-1">{pendingVerificationCount}</p>
          <span className="text-[11px] text-amber-700">Comprobantes por cotejar</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-emerald-300 bg-emerald-50/40 shadow-sm">
          <span className="text-xs text-emerald-900 font-bold uppercase tracking-wider">Citas Confirmadas</span>
          <p className="text-3xl font-serif font-bold text-emerald-900 mt-1">{confirmedCount}</p>
          <span className="text-[11px] text-emerald-700">Abono recibido y espacio asegurado</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#C4A45B] bg-[#183728] text-white shadow-sm">
          <span className="text-xs text-[#E8D9B0] font-bold uppercase tracking-wider">Abonos Recaudados</span>
          <p className="text-3xl font-serif font-bold text-[#FAF7F0] mt-1">RD${totalDepositCollected.toLocaleString()}</p>
          <span className="text-[11px] text-[#E8D9B0]/80">Abonos en cuenta bancaria</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#D4C4A3] shadow-sm mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por clienta o tratamiento..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#D4C4A3] text-xs focus:outline-none focus:ring-2 focus:ring-[#183728]"
          />
        </div>

        {/* Status Filter Buttons */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {[
            { id: 'todos', label: 'Todas' },
            { id: 'pendiente_verificacion', label: 'Por Validar Pago' },
            { id: 'confirmada', label: 'Confirmadas' },
            { id: 'completada', label: 'Completadas' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterStatus === tab.id
                  ? 'bg-[#183728] text-[#E8D9B0] border border-[#C4A45B] shadow-sm'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

      </div>

      {/* Appointments List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-3xl border border-[#D4C4A3] p-12 text-center text-stone-500 text-xs">
            No se encontraron citas con los filtros seleccionados.
          </div>
        ) : (
          filtered.map((app) => (
            <div
              key={app.id}
              className="bg-white rounded-3xl border border-[#D4C4A3] p-5 shadow-sm hover:shadow-md transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-5"
            >
              
              {/* Left Info */}
              <div className="flex items-start gap-4">
                
                <div className="w-16 h-16 rounded-2xl bg-[#183728] border-2 border-[#C4A45B] flex flex-col items-center justify-center text-center shrink-0 text-white">
                  <span className="text-[10px] uppercase font-bold text-[#E8D9B0]">
                    {app.date.split('-')[1]}/{app.date.split('-')[2]}
                  </span>
                  <span className="text-xs font-bold font-serif text-[#FAF7F0] mt-0.5">{app.time}</span>
                </div>

                <div className="space-y-1 text-left">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-stone-400">#{app.id}</span>
                    <h3 className="text-base font-serif font-bold text-[#183728]">{app.clientName}</h3>
                    
                    {app.status === 'confirmada' && (
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                        Confirmada
                      </span>
                    )}
                    {app.status === 'pendiente_verificacion' && (
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                        Validar Comprobante
                      </span>
                    )}
                    {app.status === 'completada' && (
                      <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-bold">
                        Atendida
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-[#9E7F36] font-semibold">{app.serviceName}</p>
                  
                  <div className="flex flex-wrap items-center gap-3 text-xs text-stone-600 pt-0.5">
                    <span>Tel: {app.clientPhone}</span>
                    <span>•</span>
                    <span>Total: <strong>RD${app.price.toLocaleString()}</strong></span>
                    <span>•</span>
                    <span className="text-emerald-800 font-bold">Abono: RD${app.deposit.toLocaleString()}</span>
                  </div>
                </div>

              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center gap-2 border-t lg:border-t-0 pt-3 lg:pt-0 border-stone-100">
                
                {/* View Ficha Técnica button */}
                <button
                  onClick={() => setSelectedAppointmentForFicha(app)}
                  className="px-3.5 py-2 rounded-xl border border-[#D4C4A3] hover:border-[#183728] bg-[#FAF7F0] text-[#183728] text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <FileText className="w-3.5 h-3.5 text-[#C4A45B]" />
                  <span>Ficha Técnica</span>
                </button>

                {/* View Payment Receipt */}
                {app.paymentReceipt ? (
                  <button
                    onClick={() => setSelectedReceipt(app.paymentReceipt)}
                    className="px-3.5 py-2 rounded-xl border border-amber-300 bg-amber-50 text-amber-900 text-xs font-bold flex items-center gap-1.5 hover:bg-amber-100 transition-colors"
                  >
                    <ImageIcon className="w-3.5 h-3.5 text-amber-700" />
                    <span>Ver Transferencia</span>
                  </button>
                ) : (
                  <span className="text-[11px] text-stone-400 italic px-2">Sin comprobante</span>
                )}

                {/* WhatsApp button */}
                <a
                  href={`https://wa.me/${app.clientPhone.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100 transition-colors"
                  title="Contactar por WhatsApp"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-700" />
                </a>

                {/* Status action toggle */}
                {app.status === 'pendiente_verificacion' && (
                  <button
                    onClick={() => handleStatusChange(app.id, 'confirmada')}
                    className="px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-1 shadow-sm transition-all"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Aprobar Pago</span>
                  </button>
                )}

                {app.status === 'confirmada' && (
                  <button
                    onClick={() => handleStatusChange(app.id, 'completada')}
                    className="px-3.5 py-2 rounded-xl bg-[#183728] hover:bg-[#0f241a] text-[#E8D9B0] border border-[#C4A45B] text-xs font-bold flex items-center gap-1 transition-all"
                  >
                    <CheckCircle className="w-3.5 h-3.5 text-[#C4A45B]" />
                    <span>Marcar Atendida</span>
                  </button>
                )}

              </div>

            </div>
          ))
        )}
      </div>

      {/* MODAL: Ficha Técnica Detallada */}
      {selectedAppointmentForFicha && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#FAF7F0] rounded-3xl max-w-xl w-full p-6 sm:p-8 overflow-y-auto max-h-[90vh] shadow-2xl border-2 border-[#C4A45B] text-left relative">
            
            <button
              onClick={() => setSelectedAppointmentForFicha(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white border border-[#D4C4A3] text-stone-600 hover:bg-stone-100 flex items-center justify-center text-sm font-bold transition-colors"
            >
              ✕
            </button>

            <div className="pr-8">
              <span className="text-[11px] uppercase tracking-widest text-[#9E7F36] font-bold">
                EDAM Sthetic • Expediente Clínico de Cabina
              </span>
              <h3 className="text-2xl font-serif font-bold text-[#183728] mt-1">
                Ficha Técnica: {selectedAppointmentForFicha.clientName}
              </h3>
              <p className="text-xs text-stone-600 mt-1">
                Tratamiento: <strong>{selectedAppointmentForFicha.serviceName}</strong> • Fecha: {selectedAppointmentForFicha.date} a las {selectedAppointmentForFicha.time}
              </p>
            </div>

            {/* Ficha Details */}
            <div className="mt-6 space-y-4 text-xs">
              
              <div className="bg-white p-4 rounded-2xl border border-[#D4C4A3] space-y-2.5 shadow-sm">
                <div className="flex justify-between border-b border-[#F2ECE0] pb-2">
                  <span className="text-stone-500 font-medium">Tipo de Piel:</span>
                  <span className="font-bold text-[#183728]">{selectedAppointmentForFicha.fichaTecnica?.skinType}</span>
                </div>
                <div className="flex justify-between border-b border-[#F2ECE0] pb-2">
                  <span className="text-stone-500 font-medium">Alergias:</span>
                  <span className="font-bold text-[#183728]">{selectedAppointmentForFicha.fichaTecnica?.allergies}</span>
                </div>
                <div className="flex justify-between border-b border-[#F2ECE0] pb-2">
                  <span className="text-stone-500 font-medium">Embarazo:</span>
                  <span className="font-bold text-[#183728]">{selectedAppointmentForFicha.fichaTecnica?.isPregnant}</span>
                </div>
                <div className="flex justify-between border-b border-[#F2ECE0] pb-2">
                  <span className="text-stone-500 font-medium">Uso de Retinol / Ácidos:</span>
                  <span className="font-bold text-[#183728]">{selectedAppointmentForFicha.fichaTecnica?.usesRetinol}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500 font-medium">Condiciones Médicas:</span>
                  <span className="font-bold text-[#183728]">{selectedAppointmentForFicha.fichaTecnica?.hasMedicalConditions}</span>
                </div>
              </div>

              {/* Consent status */}
              <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-2xl text-emerald-900 flex items-center justify-between">
                <span>Consentimiento firmado digitalmente</span>
                <span className="font-bold text-[11px]">{selectedAppointmentForFicha.fichaTecnica?.signatureDate}</span>
              </div>

              {/* Evolution Notes */}
              <div className="pt-2">
                <label className="block text-xs font-bold text-[#183728] uppercase tracking-wider mb-1.5">
                  Notas de Evolución en Cabina (Por Katherine)
                </label>
                <div className="p-3 rounded-2xl bg-white text-stone-700 text-xs min-h-[60px] whitespace-pre-line border border-[#D4C4A3]">
                  {selectedAppointmentForFicha.notes || 'No hay notas registradas para esta sesión.'}
                </div>
              </div>

              {/* Add New Note */}
              <div className="pt-2 space-y-2">
                <textarea
                  rows="2"
                  value={evolutionNote}
                  onChange={(e) => setEvolutionNote(e.target.value)}
                  placeholder="Agregar nueva observación clínica (activos aplicados, tolerancia de la piel, recomendación para casa)..."
                  className="w-full p-3 rounded-xl border border-[#D4C4A3] bg-white text-xs focus:ring-2 focus:ring-[#183728] focus:outline-none"
                />
                <button
                  onClick={() => handleSaveEvolutionNote(selectedAppointmentForFicha.id)}
                  disabled={!evolutionNote.trim()}
                  className="px-4 py-2 rounded-xl bg-[#183728] hover:bg-[#0f241a] text-[#E8D9B0] border border-[#C4A45B] text-xs font-bold disabled:opacity-50"
                >
                  Guardar Nota en la Ficha
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* MODAL: Ver Comprobante */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#FAF7F0] rounded-3xl max-w-md w-full p-6 shadow-2xl border-2 border-[#C4A45B] text-left relative">
            <button
              onClick={() => setSelectedReceipt(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white border border-[#D4C4A3] text-stone-600 flex items-center justify-center text-sm font-bold"
            >
              ✕
            </button>
            <h4 className="text-base font-serif font-bold text-[#183728] mb-4">
              Comprobante de Transferencia Bancaria
            </h4>
            <div className="rounded-2xl overflow-hidden border border-[#D4C4A3] max-h-[70vh] bg-white flex items-center justify-center">
              <img
                src={selectedReceipt}
                alt="Comprobante de pago"
                className="w-full h-auto object-contain"
              />
            </div>
            <div className="mt-4 text-center">
              <button
                onClick={() => setSelectedReceipt(null)}
                className="px-5 py-2 rounded-xl bg-[#183728] text-[#E8D9B0] text-xs font-bold"
              >
                Cerrar Visor
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
