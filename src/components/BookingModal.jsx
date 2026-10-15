import React, { useState } from 'react';
import { servicesData } from '../data/servicesData';
import { bankInfo, clinicInfo } from '../data/bankData';
import { 
  X, Check, Calendar as CalendarIcon, Clock, 
  CreditCard, Copy, CheckCircle2, MessageCircle, FileText, ArrowRight, ArrowLeft 
} from 'lucide-react';

export default function BookingModal({ isOpen, onClose, preselectedService, onAppointmentCreated, existingAppointments }) {
  if (!isOpen) return null;

  // Simple, lightweight 3-step wizard:
  // Step 1: Tratamiento, Fecha y Hora
  // Step 2: Datos de Contacto y Ficha Breve
  // Step 3: Confirmación y Abono por Transferencia / WhatsApp
  const [currentStep, setCurrentStep] = useState(preselectedService ? 2 : 1);
  const [selectedService, setSelectedService] = useState(preselectedService || servicesData[0]);

  // Available dates (next 10 days)
  const availableDates = Array.from({ length: 8 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1);
    return {
      iso: d.toISOString().split('T')[0],
      dayName: d.toLocaleDateString('es-ES', { weekday: 'short' }),
      dayNumber: d.getDate(),
      month: d.toLocaleDateString('es-ES', { month: 'short' })
    };
  });

  const [selectedDate, setSelectedDate] = useState(availableDates[0]?.iso);
  const timeSlots = ['09:00 AM', '10:30 AM', '12:00 PM', '02:00 PM', '03:30 PM', '05:00 PM'];
  const [selectedTime, setSelectedTime] = useState(timeSlots[0]);

  // Essential client data
  const [clientData, setClientData] = useState({
    name: '',
    phone: '',
    notesOrAllergies: ''
  });

  const [copiedAccount, setCopiedAccount] = useState(false);
  const [confirmedAppointment, setConfirmedAppointment] = useState(null);

  const isSlotBooked = (date, time) => {
    return existingAppointments?.some(app => app.date === date && app.time === time && app.status !== 'cancelada');
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedAccount(true);
    setTimeout(() => setCopiedAccount(false), 2000);
  };

  const handleFinishBooking = () => {
    const newAppointment = {
      id: `CITA-${Math.floor(100 + Math.random() * 900)}`,
      clientName: clientData.name,
      clientPhone: clientData.phone,
      serviceId: selectedService.id,
      serviceName: selectedService.name,
      date: selectedDate,
      time: selectedTime,
      price: selectedService.price,
      deposit: selectedService.deposit,
      status: 'pendiente_verificacion',
      paymentReceipt: null,
      notes: clientData.notesOrAllergies ? `Observación: ${clientData.notesOrAllergies}` : 'Cita agendada desde la web.',
      createdAt: new Date().toISOString(),
      fichaTecnica: {
        skinType: 'Evaluación en cabina',
        allergies: clientData.notesOrAllergies || 'Ninguna indicada',
        signatureDate: new Date().toLocaleDateString('es-ES')
      }
    };

    onAppointmentCreated(newAppointment);
    setConfirmedAppointment(newAppointment);
    setCurrentStep(3);
  };

  // Pre-formatted WhatsApp message for instant 1-click booking confirmation
  const whatsappBookingUrl = `https://wa.me/${bankInfo.whatsappNumber}?text=${encodeURIComponent(
    `¡Hola Katherine! Quiero confirmar mi cita en EDAM Sthetic:\n\n` +
    `• Tratamiento: ${selectedService.name}\n` +
    `• Fecha: ${selectedDate}\n` +
    `• Hora: ${selectedTime}\n` +
    `• Paciente: ${clientData.name || 'Cliente'}\n` +
    `• Teléfono: ${clientData.phone || ''}\n` +
    (clientData.notesOrAllergies ? `• Nota médica/alergias: ${clientData.notesOrAllergies}\n` : '') +
    `• Abono a transferir: RD$${selectedService.deposit.toLocaleString()}\n\n` +
    `Adjunto mi comprobante de transferencia para apartar mi turno.`
  )}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#FAF7F0] rounded-3xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl border-2 border-[#C4A45B] overflow-hidden text-left">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#D4C4A3] flex items-center justify-between bg-[#183728] text-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full overflow-hidden border border-[#C4A45B] bg-black shrink-0">
              <img src="/logo_ea_black.png" alt="EA" className="w-full h-full object-cover" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C4A45B] block">
                EDAM Sthetic • Citas
              </span>
              <h3 className="text-base font-serif font-bold text-[#FAF7F0]">
                {currentStep === 1 && '1. Elige Tratamiento & Horario'}
                {currentStep === 2 && '2. Tus Datos para la Cita'}
                {currentStep === 3 && '3. Confirmar Abono de Reserva'}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-[#FAF7F0] flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 overflow-y-auto flex-1 space-y-5">
          
          {/* STEP 1: Service + Date & Time (Fast & Direct) */}
          {currentStep === 1 && (
            <div className="space-y-4">
              
              {/* Select Service Dropdown or Compact Cards */}
              <div>
                <label className="block text-xs font-bold text-[#183728] uppercase tracking-wider mb-1.5">
                  Procedimiento
                </label>
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {servicesData.map((svc) => (
                    <div
                      key={svc.id}
                      onClick={() => setSelectedService(svc)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                        selectedService?.id === svc.id
                          ? 'border-[#183728] bg-white ring-2 ring-[#C4A45B] shadow-sm'
                          : 'border-[#D4C4A3] hover:border-[#183728] bg-white/80'
                      }`}
                    >
                      <div className="pr-2">
                        <p className="text-xs font-serif font-bold text-[#183728]">{svc.name}</p>
                        <span className="text-[10px] text-stone-500 font-medium">{svc.category}</span>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-xs font-bold text-[#183728]">RD${svc.price.toLocaleString()}</span>
                        <p className="text-[10px] text-[#9E7F36] font-semibold">Abono: RD${svc.deposit.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Date Selection */}
              <div>
                <label className="block text-xs font-bold text-[#183728] uppercase tracking-wider mb-1.5">
                  Fecha Disponible
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {availableDates.slice(0, 4).map((d) => (
                    <button
                      key={d.iso}
                      type="button"
                      onClick={() => setSelectedDate(d.iso)}
                      className={`py-2 px-1 rounded-xl border text-center transition-all ${
                        selectedDate === d.iso
                          ? 'border-[#183728] bg-[#183728] text-[#FAF7F0] shadow-sm'
                          : 'border-[#D4C4A3] bg-white text-[#183728] hover:bg-[#F2ECE0]'
                      }`}
                    >
                      <span className="block text-[9px] uppercase font-bold">{d.dayName}</span>
                      <span className="block text-base font-bold font-serif my-0.5">{d.dayNumber}</span>
                      <span className="block text-[9px] uppercase">{d.month}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Hour Slots */}
              <div>
                <label className="block text-xs font-bold text-[#183728] uppercase tracking-wider mb-1.5">
                  Hora en Cabina
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {timeSlots.map((slot) => {
                    const booked = isSlotBooked(selectedDate, slot);
                    return (
                      <button
                        key={slot}
                        type="button"
                        disabled={booked}
                        onClick={() => setSelectedTime(slot)}
                        className={`py-2 px-2 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                          booked
                            ? 'bg-stone-200 text-stone-400 border-stone-300 cursor-not-allowed line-through'
                            : selectedTime === slot
                            ? 'border-[#C4A45B] bg-[#183728] text-[#FAF7F0] shadow-sm'
                            : 'border-[#D4C4A3] bg-white text-[#183728] hover:bg-[#F2ECE0]'
                        }`}
                      >
                        <Clock className="w-3 h-3 text-[#C4A45B]" />
                        <span>{slot}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

          {/* STEP 2: Client Info & Simple Intake */}
          {currentStep === 2 && (
            <div className="space-y-4">
              
              {/* Service summary badge */}
              <div className="bg-white p-3 rounded-2xl border border-[#D4C4A3] flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-stone-400 block">Cita seleccionada</span>
                  <p className="font-serif font-bold text-sm text-[#183728]">{selectedService.name}</p>
                  <p className="text-[11px] text-stone-600">{selectedDate} a las {selectedTime}</p>
                </div>
                <div className="text-right">
                  <span className="font-bold text-[#183728]">RD${selectedService.price.toLocaleString()}</span>
                  <p className="text-[10px] text-[#9E7F36] font-semibold">Abono: RD${selectedService.deposit.toLocaleString()}</p>
                </div>
              </div>

              {/* Form fields: strictly essential */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-[#183728] mb-1">Nombre Completo *</label>
                  <input
                    type="text"
                    required
                    value={clientData.name}
                    onChange={(e) => setClientData({ ...clientData, name: e.target.value })}
                    placeholder="Ej. María Gómez"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#D4C4A3] bg-white text-xs focus:ring-2 focus:ring-[#183728] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#183728] mb-1">WhatsApp / Teléfono *</label>
                  <input
                    type="tel"
                    required
                    value={clientData.phone}
                    onChange={(e) => setClientData({ ...clientData, phone: e.target.value })}
                    placeholder="Ej. 809-555-0192"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#D4C4A3] bg-white text-xs focus:ring-2 focus:ring-[#183728] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#183728] mb-1">
                    ¿Alergias o condiciones de salud? (Opcional)
                  </label>
                  <input
                    type="text"
                    value={clientData.notesOrAllergies}
                    onChange={(e) => setClientData({ ...clientData, notesOrAllergies: e.target.value })}
                    placeholder="Ej. Alergia a la aspirina, piel sensible o ninguna"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#D4C4A3] bg-white text-xs focus:ring-2 focus:ring-[#183728] outline-none"
                  />
                  <p className="text-[10px] text-stone-500 mt-1">
                    Tu cosmiatra evaluará los detalles de tu piel en cabina antes de iniciar.
                  </p>
                </div>
              </div>

            </div>
          )}

          {/* STEP 3: Bank Transfer & Direct WhatsApp Confirmation */}
          {currentStep === 3 && (
            <div className="space-y-4">
              
              {/* Deposit Card */}
              <div className="bg-[#183728] p-4 rounded-2xl border-2 border-[#C4A45B] text-white flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-[#E8D9B0] uppercase tracking-widest block font-bold">
                    Abono para Asegurar tu Espacio
                  </span>
                  <span className="text-2xl font-serif font-bold text-[#FAF7F0]">
                    RD${selectedService.deposit.toLocaleString()}
                  </span>
                  <p className="text-[10px] text-[#E8D9B0] mt-0.5">
                    Total: RD${selectedService.price.toLocaleString()} (restante se salda el día de tu cita)
                  </p>
                </div>
                <div className="p-2.5 bg-white/10 rounded-xl border border-[#C4A45B]">
                  <CreditCard className="w-5 h-5 text-[#C4A45B]" />
                </div>
              </div>

              {/* Bank Account Info with quick copy */}
              <div className="bg-white rounded-2xl border border-[#D4C4A3] p-3.5 space-y-2 text-xs">
                <div className="flex justify-between border-b border-[#F2ECE0] pb-1.5">
                  <span className="text-stone-500 font-medium">Banco:</span>
                  <span className="font-bold text-[#183728]">{bankInfo.bankName}</span>
                </div>
                <div className="flex justify-between border-b border-[#F2ECE0] pb-1.5">
                  <span className="text-stone-500 font-medium">Titular:</span>
                  <span className="font-bold text-[#183728]">{bankInfo.accountHolder}</span>
                </div>
                <div className="flex items-center justify-between bg-[#FAF7F0] p-2 rounded-xl border border-[#D4C4A3]">
                  <span className="text-stone-600 font-medium">Cuenta:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-[#183728]">{bankInfo.accountNumber}</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(bankInfo.accountNumber)}
                      className="p-1 hover:bg-[#E8D9B0] rounded text-[#183728] transition-colors"
                      title="Copiar"
                    >
                      {copiedAccount ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Direct WhatsApp Confirmation Button */}
              <div className="pt-1 space-y-2 text-center">
                <a
                  href={whatsappBookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-4 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Enviar Comprobante por WhatsApp</span>
                </a>
                <p className="text-[10px] text-stone-500">
                  Haz tu transferencia y envíale el recibo directo al WhatsApp de tu cosmiatra para confirmar al instante.
                </p>
              </div>

            </div>
          )}

        </div>

        {/* Modal Footer Controls */}
        <div className="px-5 py-3.5 bg-[#F2ECE0] border-t border-[#D4C4A3] flex items-center justify-between">
          {currentStep > 1 && currentStep < 3 ? (
            <button
              type="button"
              onClick={() => setCurrentStep(currentStep - 1)}
              className="px-4 py-2 rounded-xl border border-[#D4C4A3] bg-white text-stone-700 text-xs font-bold hover:bg-stone-50 flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Atrás</span>
            </button>
          ) : <div />}

          {currentStep === 1 && (
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="ml-auto px-6 py-2.5 rounded-xl bg-[#183728] hover:bg-[#0f241a] text-[#FAF7F0] border border-[#C4A45B] text-xs font-bold uppercase tracking-wider shadow-sm transition-all flex items-center gap-1.5"
            >
              <span>Continuar</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#C4A45B]" />
            </button>
          )}

          {currentStep === 2 && (
            <button
              type="button"
              disabled={!clientData.name.trim() || !clientData.phone.trim()}
              onClick={handleFinishBooking}
              className="px-6 py-2.5 rounded-xl bg-[#183728] hover:bg-[#0f241a] disabled:opacity-50 disabled:cursor-not-allowed text-[#FAF7F0] border border-[#C4A45B] text-xs font-bold uppercase tracking-wider shadow-sm transition-all flex items-center gap-1.5"
            >
              <span>Ver Datos de Abono</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#C4A45B]" />
            </button>
          )}

          {currentStep === 3 && (
            <button
              type="button"
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-[#183728] text-[#FAF7F0] text-xs font-bold uppercase tracking-wider"
            >
              Cerrar y Finalizar
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
