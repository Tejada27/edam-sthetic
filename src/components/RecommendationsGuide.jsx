import React from 'react';
import { ShieldCheck, AlertTriangle, Sun, Droplets, Ban, CheckCircle2 } from 'lucide-react';

export default function RecommendationsGuide() {
  const generalGuidelines = [
    {
      icon: Ban,
      title: 'Suspender Ácidos y Retinol',
      desc: 'Evita aplicar retinol, tretinoína, ácido glicólico o salicílico de 3 a 5 días antes de tu sesión facial en cabina.',
      color: 'text-[#183728] bg-[#183728]/10 border border-[#C4A45B]/40'
    },
    {
      icon: Sun,
      title: 'Cero Exposición Solar Directa',
      desc: 'No te expongas al sol directo, playas o piscinas durante las 48 horas previas al procedimiento.',
      color: 'text-[#9E7F36] bg-[#C4A45B]/15 border border-[#C4A45B]/40'
    },
    {
      icon: CheckCircle2,
      title: 'Asistir con Rostro Limpio',
      desc: 'Te recomendamos acudir sin maquillaje ni cremas pesadas para evaluar el estado real de tus poros y aprovechar al máximo tu tiempo de atención.',
      color: 'text-[#183728] bg-[#183728]/10 border border-[#C4A45B]/40'
    },
    {
      icon: Droplets,
      title: 'Hidratación Previa',
      desc: 'Beber abundante agua en las 24 horas previas facilita las extracciones y mejora la oxigenación de tu piel.',
      color: 'text-[#9E7F36] bg-[#C4A45B]/15 border border-[#C4A45B]/40'
    }
  ];

  return (
    <section id="recomendaciones" className="py-20 bg-[#F5EFEB] border-b border-[#E2D8C3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#183728]/10 border border-[#C4A45B]/60 text-[#183728] text-xs font-bold uppercase tracking-wider mb-2">
            <img src="/logo_ea_black.png" alt="" className="w-4 h-4 rounded-full inline-block" />
            <span>Protocolo de Bioseguridad y Cuidado Cutáneo</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif text-[#183728] font-bold">
            Recomendaciones Antes de los Procesos
          </h2>
          <p className="font-['Great_Vibes'] text-3xl text-[#9E7F36] mt-1">
            Tu piel en las mejores manos
          </p>
          <p className="text-stone-600 text-xs sm:text-sm mt-2 font-light leading-relaxed">
            Para garantizar que tu experiencia en EDAM Sthetic sea segura y obtengas resultados luminosos y duraderos, 
            sigue estas indicaciones previas a tu cita:
          </p>
        </div>

        {/* 4 Guidelines Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {generalGuidelines.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white p-6 rounded-3xl border border-[#D4C4A3] shadow-sm hover:border-[#C4A45B] transition-all text-left flex flex-col justify-between"
              >
                <div>
                  <div className={`w-12 h-12 rounded-2xl ${item.color} flex items-center justify-center mb-4`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-serif font-bold text-[#183728]">
                    {item.title}
                  </h3>
                  <p className="text-xs text-stone-600 font-light mt-2 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#F2ECE0] flex items-center gap-1.5 text-[11px] font-semibold text-[#183728]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#C4A45B]" />
                  <span>Pauta de Cuidado Clínico</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Medical disclaimer alert - Adjusted to "tu cosmiatra" tone */}
        <div className="mt-12 bg-[#183728] text-[#FAF7F0] border-2 border-[#C4A45B] rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-5 text-left shadow-lg">
          <div className="p-3 bg-[#C4A45B]/20 rounded-2xl text-[#C4A45B] shrink-0 border border-[#C4A45B]/30">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h4 className="text-base font-serif font-bold text-[#E8D9B0]">
              ¿Tienes condiciones de salud, tomas medicamentos o estás en embarazo?
            </h4>
            <p className="text-xs text-[#FAF7F0]/90 font-light mt-1 leading-relaxed">
              Durante tu reserva completarás la <strong>Ficha Técnica confidencial</strong> para que como tu cosmiatra pueda verificar posibles contraindicaciones (ej. alergia a la aspirina para ácido salicílico, placas metálicas o uso de retinoides) y diseñar el protocolo más seguro para tu bienestar.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
