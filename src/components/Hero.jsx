import React, { useState } from 'react';
import { Calendar, CheckCircle2, MapPin, Award } from 'lucide-react';
import { clinicInfo } from '../data/bankData';

export default function Hero({ onOpenBooking }) {
  const [heroView, setHeroView] = useState('paciente'); // 'paciente' | 'katherine'
  return (
    <section id="inicio" className="relative overflow-hidden bg-gradient-to-b from-[#F5EFEB] via-[#FAF7F0] to-[#FAF7F0] py-12 sm:py-16 border-b border-[#E2D8C3]">
      
      {/* Ambient background glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#C4A45B]/10 blur-3xl rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#183728]/10 blur-3xl rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Centered Brand Plaque on Dark Background */}
        <div className="text-center mb-10">
          <div className="inline-block">
            <div className="bg-[#0A0F0D] border-2 border-[#C4A45B] rounded-3xl p-5 sm:p-7 shadow-2xl max-w-lg mx-auto">
              <div className="flex flex-col items-center">
                {/* Monogram on Black */}
                <img
                  src="/logo_ea_black.png"
                  alt="EA Monograma"
                  className="w-20 h-20 sm:w-24 sm:h-24 object-contain mb-2 drop-shadow-md"
                />

                {/* EDAM STHETIC Typography */}
                <h2 className="text-3xl sm:text-4xl font-serif tracking-[0.25em] text-[#FAF7F0] font-bold leading-tight">
                  EDAM
                </h2>
                
                {/* STHETIC (No 'A') with gold accent line */}
                <div className="flex items-center gap-3 my-1">
                  <span className="w-8 sm:w-12 h-[1px] bg-[#C4A45B]"></span>
                  <span className="text-xs sm:text-sm font-serif tracking-[0.3em] uppercase text-[#C4A45B] font-bold">
                    Sthetic
                  </span>
                  <span className="w-8 sm:w-12 h-[1px] bg-[#C4A45B]"></span>
                </div>

                <p className="text-[9px] sm:text-[10px] tracking-[0.25em] uppercase text-[#FAF7F0]/70 font-semibold mt-1">
                  Belleza • Confianza • Autenticidad
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content & Photo Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Copy & Actions */}
          <div className="lg:col-span-7 text-left space-y-6">
            
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#183728]/10 border border-[#C4A45B]/60 text-[#183728] text-xs font-bold uppercase tracking-wider">
              <img src="/logo_ea_black.png" alt="" className="w-4 h-4 rounded-full inline-block" />
              <span>Cosmiatría & Cuidado Facial Personalizado</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-[#183728] leading-[1.1] font-bold">
              Salud, luminosidad y armonía <br />
              <span className="italic font-normal text-[#9E7F36]">para tu piel.</span>
            </h1>

            {/* Inclusive Welcome Text (For both women and men) */}
            <p className="text-base sm:text-lg text-stone-700 leading-relaxed max-w-xl font-light">
              <strong className="font-semibold text-[#183728]">Te damos la bienvenida a EDAM Sthetic.</strong>{' '}
              Un espacio profesional de salud y estética facial tanto para mujeres como para hombres. 
              Tratamientos avanzados, limpiezas profundas, aparatología y masajes dirigidos por tu cosmiatra{' '}
              <strong className="font-semibold text-[#183728]">Katherine Encarnación</strong> en Santo Domingo Este para cuidar y transformar tu piel.
            </p>

            {/* Special Promo Banner */}
            <div className="bg-[#183728] border-2 border-[#C4A45B] rounded-2xl p-4 text-[#FAF7F0] flex items-center justify-between shadow-md">
              <div className="pr-4">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#E8D9B0] block">
                  Promoción Especial
                </span>
                <p className="text-xs sm:text-sm font-medium mt-0.5">
                  Evaluación y Diagnóstico Facial por <strong className="text-[#C4A45B]">RD$500</strong>
                </p>
                <p className="text-[11px] text-[#E8D9B0]/90 italic mt-0.5">
                  Si realizas tu tratamiento el mismo día, los RD$500 se descuentan del valor de tu servicio.
                </p>
              </div>
              <button
                onClick={onOpenBooking}
                className="shrink-0 px-4 py-2 rounded-xl bg-[#C4A45B] hover:bg-[#b5954c] text-[#183728] font-bold text-xs uppercase tracking-wider transition-colors"
              >
                Agendar
              </button>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <button
                onClick={onOpenBooking}
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-[#183728] text-[#FAF7F0] border border-[#C4A45B] hover:bg-[#0f241a] transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 text-sm font-bold tracking-wide"
              >
                <Calendar className="w-4 h-4 text-[#C4A45B]" />
                <span>Reservar mi Cita</span>
              </button>

              <a
                href="#servicios"
                className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-white border border-[#D4C4A3] text-[#183728] hover:bg-[#F2ECE0] transition-all text-sm font-bold shadow-sm"
              >
                <span>Ver Menú de Servicios</span>
              </a>
            </div>

            {/* Value badges (Changed 'Seña por transferencia' to Dominican term 'Abono por transferencia') */}
            <div className="pt-6 border-t border-[#E2D8C3] grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-[#183728]">
              <div className="flex items-center gap-2 font-medium">
                <CheckCircle2 className="w-4 h-4 text-[#C4A45B] shrink-0" />
                <span>Ficha médica y diagnóstico</span>
              </div>
              <div className="flex items-center gap-2 font-medium">
                <CheckCircle2 className="w-4 h-4 text-[#C4A45B] shrink-0" />
                <span>Pago y abono por transferencia</span>
              </div>
              <div className="flex items-center gap-2 font-medium">
                <Award className="w-4 h-4 text-[#C4A45B] shrink-0" />
                <span>Santo Domingo Este</span>
              </div>
            </div>

          </div>

          {/* Right Column: Clean Photo Presentation with En Cabina / Katherine Switcher */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-sm sm:max-w-md">
              
              {/* Card Container with clean frame */}
              <div className="bg-white p-3.5 rounded-3xl shadow-xl border-2 border-[#D4C4A3]">
                
                {/* Switcher Buttons - Clean Luxury Segmented Control (No Emojis) */}
                <div className="flex items-center gap-1.5 p-1 bg-[#183728]/5 rounded-2xl border border-[#D4C4A3] mb-3">
                  <button
                    type="button"
                    onClick={() => setHeroView('paciente')}
                    className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                      heroView === 'paciente'
                        ? 'bg-[#183728] text-[#FAF7F0] shadow-sm'
                        : 'text-[#183728] hover:bg-stone-200/60'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${heroView === 'paciente' ? 'bg-[#C4A45B]' : 'bg-[#183728]/30'}`} />
                    <span className="uppercase tracking-wider text-[11px]">En Cabina</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setHeroView('katherine')}
                    className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                      heroView === 'katherine'
                        ? 'bg-[#183728] text-[#FAF7F0] shadow-sm'
                        : 'text-[#183728] hover:bg-stone-200/60'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${heroView === 'katherine' ? 'bg-[#C4A45B]' : 'bg-[#183728]/30'}`} />
                    <span className="uppercase tracking-wider text-[11px]">Tu Cosmiatra</span>
                  </button>
                </div>

                {/* Photo Display */}
                <div className="aspect-[4/5] rounded-2xl overflow-hidden relative bg-[#183728]/10 border border-[#D4C4A3]">
                  {heroView === 'paciente' ? (
                    <>
                      <img
                        src="/cabin/atendiendo_paciente.jpg"
                        alt="Atención de paciente en cabina EDAM Sthetic"
                        className="w-full h-full object-cover object-center animate-fadeIn"
                      />
                      <div className="absolute top-3 left-3 bg-[#0A0F0D]/90 backdrop-blur-md px-3 py-1 rounded-full border border-[#C4A45B] text-[10px] font-bold text-[#FAF7F0] uppercase tracking-wider flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C4A45B] animate-pulse"></span>
                        <span>Protocolo Real en Cabina</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <img
                        src="/foto_mami.jpeg"
                        alt="Katherine Encarnación - EDAM Sthetic"
                        className="w-full h-full object-cover object-top animate-fadeIn"
                      />
                      <div className="absolute top-3 left-3 bg-[#0A0F0D]/90 backdrop-blur-md px-3 py-1 rounded-full border border-[#C4A45B] text-[10px] font-bold text-[#FAF7F0] uppercase tracking-wider flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C4A45B]"></span>
                        <span>Especialista Certificada</span>
                      </div>
                    </>
                  )}
                </div>

                {/* Clean Info Caption below the photo */}
                <div className="pt-4 px-2 pb-1 text-left">
                  <div className="flex items-center justify-between">
                    <div>
                      {heroView === 'paciente' ? (
                        <>
                          <span className="text-[10px] uppercase tracking-[0.2em] text-[#9E7F36] font-bold block">
                            Cabina en Santo Domingo Este
                          </span>
                          <h3 className="text-xl font-serif font-bold text-[#183728]">
                            Atención Personalizada en Vivo
                          </h3>
                          <p className="text-xs text-stone-600 font-medium mt-1">
                            Fototerapia LED azul y tecnología hidrofacial
                          </p>
                        </>
                      ) : (
                        <>
                          <span className="text-[10px] uppercase tracking-[0.2em] text-[#9E7F36] font-bold block">
                            Tu Cosmiatra
                          </span>
                          <h3 className="text-xl font-serif font-bold text-[#183728]">
                            Katherine Encarnación
                          </h3>
                          <p className="text-xs text-stone-600 font-medium mt-1">
                            Graduada en las Fuerzas Armadas • UNPHU • INFOTEP
                          </p>
                        </>
                      )}
                    </div>
                    <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-[#C4A45B] bg-black">
                      <img src="/logo_ea_black.png" alt="EA" className="w-full h-full object-cover" />
                    </div>
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
