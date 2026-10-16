import React from 'react';
import { MapPin, Navigation, ExternalLink, Clock, MessageCircle } from 'lucide-react';
import { clinicInfo } from '../data/bankData';

export default function LocationSection({ onOpenBooking }) {
  return (
    <section id="ubicacion" className="py-20 bg-[#FAF7F0] border-b border-[#E2D8C3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="bg-white rounded-3xl border-2 border-[#D4C4A3] p-8 sm:p-12 shadow-md">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Info Column */}
            <div className="lg:col-span-7 text-left space-y-6">
              
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#183728]/10 border border-[#C4A45B]/60 text-[#183728] text-xs font-bold uppercase tracking-wider">
                <MapPin className="w-3.5 h-3.5 text-[#9E7F36]" />
                <span>Nuestra Ubicación en Santo Domingo Este</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-serif text-[#183728] font-bold">
                Visítanos en EDAM Sthetic
              </h2>

              <p className="text-stone-600 text-sm leading-relaxed">
                Estamos ubicados en un entorno privado y tranquilo para brindarte la mayor comodidad y desconexión en cada sesión.
              </p>

              {/* Exact Address Cards */}
              <div className="space-y-3 pt-1">
                
                <div className="p-4 rounded-2xl bg-[#FAF7F0] border border-[#D4C4A3] flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#183728] text-[#C4A45B] flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-serif font-bold text-[#183728]">
                      Santo Domingo Este, en el cuñao Plaza Nueva Jerusalén
                    </h4>
                    <p className="text-xs text-stone-600 mt-0.5 leading-relaxed">
                      Calle El Sol, esquina Tulipán, entrando por la Hípica.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#183728]/5 border border-[#183728]/20 flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#C4A45B] text-[#183728] flex items-center justify-center shrink-0 mt-0.5">
                    <Navigation className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-serif font-bold text-[#183728]">
                      Encuéntranos en Google Maps
                    </h4>
                    <p className="text-xs text-stone-600 mt-0.5">
                      Solo escribe <strong>"EDAM Sthetic"</strong> en el buscador de Google Maps y te aparecerá la ruta directa.
                    </p>
                  </div>
                </div>

              </div>

              {/* Links */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href={clinicInfo.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#183728] text-[#FAF7F0] border border-[#C4A45B] text-xs font-bold uppercase tracking-wider hover:bg-[#0f241a] transition-all shadow-sm"
                >
                  <Navigation className="w-4 h-4 text-[#C4A45B]" />
                  <span>Abrir en Google Maps</span>
                </a>

                <button
                  onClick={onOpenBooking}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white border border-[#D4C4A3] text-[#183728] hover:bg-[#F2ECE0] text-xs font-bold uppercase tracking-wider transition-all"
                >
                  <span>Reservar Cita Ahora</span>
                </button>
              </div>

            </div>

            {/* Visual Box / Badge on pure black luxury background */}
            <div className="lg:col-span-5">
              <div className="bg-[#0A0F0D] text-[#FAF7F0] p-8 rounded-3xl border-2 border-[#C4A45B] shadow-2xl text-center space-y-4">
                <div className="w-16 h-16 rounded-full overflow-hidden mx-auto border border-[#C4A45B]">
                  <img src="/logo_ea_black.png" alt="EA" className="w-full h-full object-cover" />
                </div>
                
                <div>
                  <h3 className="text-2xl font-serif font-bold text-[#FAF7F0] tracking-widest">
                    EDAM <span className="text-[#C4A45B] text-lg font-normal">Sthetic</span>
                  </h3>
                  <p className="font-['Great_Vibes'] text-2xl text-[#E8D9B0] mt-1">"Tu piel en las mejores manos ♡"</p>
                </div>

                <div className="pt-2 border-t border-white/20 text-xs text-[#FAF7F0]/90 space-y-2 text-left">
                  <div className="flex items-center justify-between">
                    <span>Atención:</span>
                    <strong className="text-[#C4A45B]">Previa Cita (Mar, Jue, Vie, Sáb, Dom)</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Tu Cosmiatra:</span>
                    <strong>Katherine Encarnación</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>WhatsApp:</span>
                    <a href={clinicInfo.whatsappUrl} target="_blank" rel="noopener noreferrer" className="text-[#C4A45B] hover:underline">
                      {clinicInfo.phoneFormatted}
                    </a>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Instagram:</span>
                    <a href={clinicInfo.instagramUrl} target="_blank" rel="noopener noreferrer" className="text-[#C4A45B] hover:underline">
                      {clinicInfo.instagram}
                    </a>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Zona:</span>
                    <span>Santo Domingo Este</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
