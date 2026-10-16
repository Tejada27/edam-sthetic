import React, { useState } from 'react';
import { servicesData, categories } from '../data/servicesData';
import { ShieldAlert, Check, Info, Calendar } from 'lucide-react';

export default function ServicesSection({ onSelectService }) {
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [modalService, setModalService] = useState(null);

  const filteredServices = selectedCategory === 'Todos'
    ? servicesData
    : servicesData.filter(s => s.category === selectedCategory);

  return (
    <section id="servicios" className="py-20 bg-[#FAF7F0] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#183728]/10 border border-[#C4A45B]/60 text-[#183728] text-xs font-bold uppercase tracking-wider mb-2">
            <img src="/logo_ea_black.png" alt="" className="w-4 h-4 rounded-full inline-block" />
            <span>Carta Oficial de Procedimientos</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-serif text-[#183728] font-bold">
            Menú de Tratamientos
          </h2>
          <p className="font-['Great_Vibes'] text-3xl text-[#9E7F36] mt-1">
            Faciales & Masajes Terapéuticos
          </p>

          <p className="text-stone-600 text-xs sm:text-sm mt-2 font-light">
            Procedimientos especializados con aparatología de última generación. Consulta las recomendaciones de preparación antes de agendar tu cita.
          </p>

          {/* Category Filter Pills (Flyer button removed as requested) */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2 rounded-full text-xs font-bold tracking-wide transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#183728] text-[#FAF7F0] border border-[#C4A45B] shadow-sm'
                    : 'bg-white text-[#183728] border border-[#D4C4A3] hover:bg-[#F2ECE0]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

        </div>

        {/* Highlight Card: Evaluación y Diagnóstico */}
        <div className="mb-12 bg-gradient-to-r from-[#183728] via-[#244737] to-[#183728] rounded-3xl p-6 sm:p-8 text-[#FAF7F0] border-2 border-[#C4A45B] shadow-xl text-left flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C4A45B]/20 text-[#E8D9B0] text-[11px] font-bold uppercase tracking-widest border border-[#C4A45B]/40">
              Primer Paso Esencial
            </div>
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#FAF7F0]">
              Evaluación y Diagnóstico Estético Facial — <span className="text-[#C4A45B]">RD$500</span>
            </h3>
            <p className="text-xs sm:text-sm text-[#E8D9B0] leading-relaxed">
              Incluye análisis del tipo y condición de tu piel, identificación de necesidades, revisión de contraindicaciones y orientación de tu rutina en casa.
            </p>
            <p className="text-xs font-medium text-amber-200 bg-black/30 p-2.5 rounded-xl border border-amber-300/40">
              <strong>Importante:</strong> Si realizas tu tratamiento el mismo día, los <strong>RD$500 se descuentan</strong> del valor del servicio.
            </p>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row md:flex-col gap-2.5">
            <button
              onClick={() => onSelectService(servicesData.find(s => s.id === 'evaluacion-diagnostico'))}
              className="px-6 py-3.5 rounded-xl bg-[#C4A45B] hover:bg-[#b5954c] text-[#183728] font-bold text-xs uppercase tracking-wider shadow-md transition-all text-center"
            >
              Agendar Diagnóstico
            </button>
            <button
              onClick={() => setModalService(servicesData.find(s => s.id === 'evaluacion-diagnostico'))}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-[#FAF7F0] text-xs font-medium border border-white/20 text-center"
            >
              Ver qué incluye
            </button>
          </div>
        </div>

        {/* Services Grid (Without time estimates, clean and elegant) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="group bg-white rounded-3xl border border-[#D4C4A3] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              {/* Card Image */}
              <div className="relative aspect-[16/10] overflow-hidden bg-stone-200">
                <img
                  src={service.image}
                  alt={service.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#183728]/70 via-transparent to-transparent" />
                
                {/* Category Badge */}
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className="px-3 py-1 rounded-full bg-[#FAF7F0] text-[10px] font-bold text-[#183728] tracking-widest uppercase border border-[#C4A45B]">
                    {service.category}
                  </span>
                  {service.popular && (
                    <span className="px-3 py-1 rounded-full bg-[#183728] text-[#C4A45B] text-[10px] font-bold tracking-wider border border-[#C4A45B]">
                      Destacado
                    </span>
                  )}
                </div>

                {/* Price Pill Styled directly from the Flyer */}
                <div className="absolute bottom-3 right-3 bg-[#183728] border-2 border-[#C4A45B] px-4 py-1.5 rounded-full shadow-lg">
                  <span className="font-serif font-bold text-base text-[#FAF7F0] tracking-wide">
                    RD${service.price.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between text-left space-y-4">
                <div>
                  <h3 className="text-xl font-serif font-bold text-[#183728] leading-snug group-hover:text-[#9E7F36] transition-colors">
                    {service.name}
                  </h3>
                  <p className="text-xs text-stone-600 font-light mt-2 leading-relaxed">
                    {service.shortDesc}
                  </p>
                </div>

                {/* Pre-recommendation reminder */}
                <div className="bg-[#FAF7F0] border border-[#D4C4A3] p-3 rounded-2xl flex items-start gap-2.5 text-xs text-stone-800">
                  <ShieldAlert className="w-4 h-4 text-[#9E7F36] shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-bold text-[10px] text-[#183728] uppercase tracking-wider">
                      Preparación previa
                    </p>
                    <p className="text-[11px] text-stone-600 font-light mt-0.5">
                      {service.preRecommendations[0]}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-2 flex items-center gap-2">
                  <button
                    onClick={() => setModalService(service)}
                    className="flex-1 py-2.5 px-3 rounded-xl border border-[#D4C4A3] bg-white text-[#183728] text-xs font-bold hover:bg-[#F2ECE0] transition-colors flex items-center justify-center gap-1.5"
                    title="Ver recomendaciones antes y después del proceso"
                  >
                    <Info className="w-3.5 h-3.5 text-[#9E7F36]" />
                    <span>Ver Cuidados</span>
                  </button>

                  <button
                    onClick={() => onSelectService(service)}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-[#183728] hover:bg-[#0f241a] text-[#FAF7F0] border border-[#C4A45B] text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5"
                  >
                    <Calendar className="w-3.5 h-3.5 text-[#C4A45B]" />
                    <span>Reservar Cita</span>
                  </button>
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>

      {/* MODAL: Recomendaciones antes y después del proceso (Sin tiempo estimado) */}
      {modalService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#FAF7F0] rounded-3xl max-w-xl w-full p-6 sm:p-8 overflow-y-auto max-h-[90vh] shadow-2xl border-2 border-[#C4A45B] text-left relative">
            
            <button
              onClick={() => setModalService(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white border border-[#D4C4A3] text-stone-600 hover:bg-stone-100 flex items-center justify-center text-sm font-bold transition-colors"
            >
              ✕
            </button>

            <div className="pr-8">
              <span className="text-[11px] uppercase tracking-widest text-[#9E7F36] font-bold">
                EDAM Sthetic • Protocolo & Cuidados
              </span>
              <h3 className="text-2xl font-serif font-bold text-[#183728] mt-1">
                {modalService.name}
              </h3>
              <p className="text-xs text-stone-600 mt-1">
                Precio: <strong>RD${modalService.price.toLocaleString()}</strong> • Abono para reservar: <strong>RD${modalService.deposit.toLocaleString()}</strong>
              </p>
            </div>

            {/* Content: Pre-recommendations */}
            <div className="mt-6 space-y-5">
              
              <div className="bg-white border border-[#D4C4A3] p-4 rounded-2xl shadow-sm">
                <h4 className="text-xs font-bold text-[#183728] uppercase tracking-wider flex items-center gap-2 mb-3">
                  <ShieldAlert className="w-4 h-4 text-[#C4A45B]" />
                  Recomendaciones ANTES de tu cita
                </h4>
                <ul className="space-y-2 text-xs text-stone-700">
                  {modalService.preRecommendations.map((rec, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C4A45B] mt-1.5 shrink-0" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* What is included */}
              {modalService.includedItems && (
                <div className="bg-white border border-[#D4C4A3] p-4 rounded-2xl shadow-sm">
                  <h4 className="text-xs font-bold text-[#183728] uppercase tracking-wider flex items-center gap-2 mb-3">
                    <Check className="w-4 h-4 text-emerald-600" />
                    ¿Qué incluye tu sesión?
                  </h4>
                  <ul className="space-y-1.5 text-xs text-stone-700">
                    {modalService.includedItems.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-emerald-700 font-bold">✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Post Care */}
              <div className="bg-[#183728]/10 border border-[#183728]/30 p-4 rounded-2xl">
                <h4 className="text-xs font-bold text-[#183728] uppercase tracking-wider flex items-center gap-2 mb-2">
                  <Check className="w-4 h-4 text-[#183728]" />
                  Cuidados posteriores indicados por tu cosmiatra
                </h4>
                <ul className="space-y-1.5 text-xs text-stone-700">
                  {modalService.postCare.map((care, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#183728] mt-1.5 shrink-0" />
                      <span>{care}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

            {/* Footer */}
            <div className="mt-8 pt-4 border-t border-[#D4C4A3] flex items-center justify-end gap-3">
              <button
                onClick={() => setModalService(null)}
                className="px-4 py-2.5 rounded-xl border border-[#D4C4A3] text-stone-600 text-xs font-medium hover:bg-stone-50"
              >
                Cerrar
              </button>
              <button
                onClick={() => {
                  const s = modalService;
                  setModalService(null);
                  onSelectService(s);
                }}
                className="px-6 py-2.5 rounded-xl bg-[#183728] text-[#FAF7F0] border border-[#C4A45B] hover:bg-[#0f241a] text-xs font-bold uppercase tracking-wider shadow-md flex items-center gap-1.5"
              >
                <Calendar className="w-3.5 h-3.5 text-[#C4A45B]" />
                <span>Reservar este tratamiento</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </section>
  );
}
