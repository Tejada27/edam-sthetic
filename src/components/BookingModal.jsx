import React, { useState, useEffect } from 'react';
import { servicesData } from '../data/servicesData';
import { bankInfo, clinicInfo } from '../data/bankData';
import { 
  X, Check, Calendar as CalendarIcon, Clock, 
  CreditCard, Copy, CheckCircle2, MessageCircle, FileText, ArrowRight, ArrowLeft 
} from 'lucide-react';

export default function BookingModal({ isOpen, onClose, preselectedService, onAppointmentCreated, existingAppointments }) {
  // Lock background scroll when open
  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Simple, lightweight 3-step wizard:
  // Step 1: Tratamiento, Fecha y Hora
  // Step 2: Datos de Contacto y Ficha Breve
  // Step 3: Confirmación y Abono por Transferencia / WhatsApp
  const [currentStep, setCurrentStep] = useState(() => preselectedService ? 2 : 1);
  const [selectedService, setSelectedService] = useState(() => preselectedService || servicesData[0]);

  // Official schedule from Katherine Encarnación
  // Martes: 10:00 AM y 3:00 PM
  // Jueves: 10:00 AM, 3:00 PM y 6:00 PM
  // Viernes: 3:00 PM y 6:00 PM (Faciales; masajes no disponibles los viernes)
  // Sábado: 6:00 PM (Solo tarde, no mañana)
  // Domingo: 10:00 AM y 3:00 PM
  const scheduleByDay = {
    0: ['10:00 AM', '03:00 PM'],             // Domingo
    2: ['10:00 AM', '03:00 PM'],             // Martes
    4: ['10:00 AM', '03:00 PM', '06:00 PM'], // Jueves
    5: ['03:00 PM', '06:00 PM'],             // Viernes
    6: ['06:00 PM']                          // Sábado
  };

  const isMassage = selectedService?.category === 'Masajes';

  // Generate available working dates matching Katherine's schedule
  const availableDates = [];
  const today = new Date();
  for (let i = 1; availableDates.length < 8 && i <= 28; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const dayOfWeek = d.getDay();
    if (scheduleByDay[dayOfWeek]) {
      // Masajes no disponibles los viernes
      if (isMassage && dayOfWeek === 5) {
        continue;
      }
      availableDates.push({
        iso: d.toISOString().split('T')[0],
        dayName: d.toLocaleDateString('es-ES', { weekday: 'short' }),
        dayNumber: d.getDate(),
        month: d.toLocaleDateString('es-ES', { month: 'short' }),
        dayOfWeek
      });
    }
  }

  const [selectedDate, setSelectedDate] = useState(() => availableDates[0]?.iso || '');

  // Calculate slots dynamically for the selected date
  const selectedDayOfWeek = selectedDate ? new Date(selectedDate + 'T12:00:00').getDay() : null;
  const rawSlots = selectedDayOfWeek !== null && scheduleByDay[selectedDayOfWeek] ? scheduleByDay[selectedDayOfWeek] : ['10:00 AM', '03:00 PM'];
  const timeSlots = isMassage && selectedDayOfWeek === 5 ? [] : rawSlots;

  const [selectedTime, setSelectedTime] = useState(() => timeSlots[0] || '10:00 AM');

  // Keep selectedTime synchronized if selectedDate or service changes
  useEffect(() => {
    if (timeSlots.length > 0 && !timeSlots.includes(selectedTime)) {
      setSelectedTime(timeSlots[0]);
    }
  }, [selectedDate, selectedService]);

  // Essential client data
  const [clientData, setClientData] = useState({
    name: '',
    phone: '',
    notesOrAllergies: ''
  });

  const [copiedAccount, setCopiedAccount] = useState(false);
  const [confirmedAppointment, setConfirmedAppointment] = useState(null);

  if (!isOpen) return null;

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

  const isFreeDeposit = (selectedService?.deposit || 0) === 0;

  // Pre-formatted WhatsApp message for instant 1-click booking confirmation
  const whatsappBookingUrl = `https://wa.me/${bankInfo.whatsappNumber}?text=${encodeURIComponent(
    `¡Hola Katherine! Quiero confirmar mi cita en EDAM Sthetic:\n\n` +
    `• Tratamiento: ${selectedService.name}\n` +
    `• Fecha: ${selectedDate}\n` +
    `• Hora: ${selectedTime}\n` +
    `• Paciente: ${clientData.name || 'Cliente'}\n` +
    `• Teléfono: ${clientData.phone || ''}\n` +
    (clientData.notesOrAllergies ? `• Nota médica/alergias: ${clientData.notesOrAllergies}\n` : '') +
    (isFreeDeposit 
      ? `• Pago: RD$${selectedService.price.toLocaleString()} (a pagar directo en cabina el día de mi cita).\n\n¡Por favor confírmame mi turno!`
      : `• Abono a transferir: RD$${selectedService.deposit.toLocaleString()} (restante en cabina).\n\nAdjunto mi comprobante de transferencia al Banco Popular para apartar mi turno.`)
  )}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 text-left">
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
                {currentStep === 3 && (isFreeDeposit ? '3. Confirmación de Cita' : '3. Confirmar Abono de Reserva')}
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
                        <p className={`text-[10px] font-semibold ${svc.deposit > 0 ? 'text-[#9E7F36]' : 'text-emerald-700'}`}>
                          {svc.deposit > 0 ? `Abono: RD$${svc.deposit.toLocaleString()}` : 'Sin abono previo'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Official Hours Summary */}
              <div className="p-3 rounded-2xl bg-[#183728]/5 border border-[#183728]/15 text-xs text-[#183728] space-y-1">
                <p className="font-bold uppercase tracking-wider text-[#9E7F36] text-[10px]">
                  Horarios Oficiales en Cabina:
                </p>
                <div className="text-stone-700 grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-0.5 text-[11px]">
                  <p>• <strong>Martes:</strong> 10:00 AM y 3:00 PM</p>
                  <p>• <strong>Jueves:</strong> 10:00 AM, 3:00 PM y 6:00 PM</p>
                  <p>• <strong>Viernes:</strong> 3:00 PM y 6:00 PM</p>
                  <p>• <strong>Sábado:</strong> 6:00 PM</p>
                  <p>• <strong>Domingo:</strong> 10:00 AM y 3:00 PM</p>
                </div>
                {isMassage && (
                  <p className="text-[10px] text-[#9E7F36] font-semibold pt-1 border-t border-[#183728]/10">
                    💆 Masajes disponibles todos los días menos viernes y sábados en la mañana.
                  </p>
                )}
              </div>

              {/* Date Selection */}
              <div>
                <label className="block text-xs font-bold text-[#183728] uppercase tracking-wider mb-1.5">
                  Elige un Día Disponible
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                  {availableDates.slice(0, 6).map((d) => (
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
                      <span className="block text-sm font-bold font-serif my-0.5">{d.dayNumber}</span>
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
                {timeSlots.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {timeSlots.map((slot) => {
                      const booked = isSlotBooked(selectedDate, slot);
                      return (
                        <button
                          key={slot}
                          type="button"
                          disabled={booked}
                          onClick={() => setSelectedTime(slot)}
                          className={`py-2.5 px-2 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
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
                ) : (
                  <p className="text-xs text-stone-500 italic p-3 bg-stone-100 rounded-xl">
                    No hay turnos disponibles para esta fecha.
                  </p>
                )}
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
                  <p className={`text-[10px] font-semibold ${selectedService.deposit > 0 ? 'text-[#9E7F36]' : 'text-emerald-700'}`}>
                    {selectedService.deposit > 0 ? `Abono: RD$${selectedService.deposit.toLocaleString()}` : 'Sin abono previo'}
                  </p>
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
              
              {!isFreeDeposit ? (
                <>
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
                      Haz tu transferencia al Banco Popular y envíale el recibo a Katherine para asegurar tu turno.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  {/* Evaluation No Deposit Card */}
                  <div className="bg-[#183728] p-4 rounded-2xl border-2 border-[#C4A45B] text-white flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-[#E8D9B0] uppercase tracking-widest block font-bold">
                        Cita Agendada sin Abono Previo
                      </span>
                      <span className="text-xl font-serif font-bold text-[#FAF7F0]">
                        Pago Directo en Cabina
                      </span>
                      <p className="text-[10px] text-[#E8D9B0] mt-0.5">
                        Valor del diagnóstico: RD${selectedService.price.toLocaleString()} (lo pagas al llegar)
                      </p>
                    </div>
                    <div className="p-2.5 bg-white/10 rounded-xl border border-[#C4A45B]">
                      <CheckCircle2 className="w-5 h-5 text-[#C4A45B]" />
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl border border-[#D4C4A3] p-4 space-y-2 text-xs text-stone-700">
                    <p className="font-bold text-[#183728] flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>¡Tu espacio en cabina ha sido reservado!</span>
                    </p>
                    <p className="text-[11px] text-stone-600 leading-relaxed">
                      Para la Evaluación y Diagnóstico no se requiere transferir abono previo. Podrás saldar los RD$500 en efectivo o transferencia el día de tu cita.
                    </p>
                    <p className="text-[10px] text-amber-800 bg-amber-50 p-2 rounded-lg border border-amber-200">
                      Recuerda: si decides realizarte tu tratamiento ese mismo día, los RD$500 se te descuentan del servicio.
                    </p>
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
                      <span>Confirmar Cita por WhatsApp</span>
                    </a>
                    <p className="text-[10px] text-stone-500">
                      Envía los datos a Katherine por WhatsApp para que quede agendado en su calendario.
                    </p>
                  </div>
                </>
              )}

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
              <span>{isFreeDeposit ? 'Confirmar Cita' : 'Ver Datos de Abono'}</span>
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
