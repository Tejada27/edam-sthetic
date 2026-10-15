import React from 'react';
import { Award, GraduationCap } from 'lucide-react';
import { clinicInfo } from '../data/bankData';

export default function AboutMe({ onOpenBooking }) {
  const academicCredentials = [
    {
      institution: 'Escuela Vocacional de las Fuerzas Armadas y de la Policía Nacional',
      logo: '/logos/digev.png',
      logoAlt: 'DIGEV / FF.AA. y P.N.',
      title: 'Graduada en Cosmiatría',
      description: 'Especialista graduada en diagnóstico dérmico, higiene facial profunda, química cosmética y tratamientos faciales avanzados.',
      badge: 'Graduada'
    },
    {
      institution: 'Universidad Nacional Pedro Henríquez Ureña (UNPHU)',
      logo: '/logos/unphu.png',
      logoAlt: 'UNPHU',
      title: 'Estudiante de Cosmetología',
      description: 'Formación universitaria continua en fundamentos científicos, dermatocosmética y bioseguridad cutánea.',
      badge: 'En curso'
    },
    {
      institution: 'INFOTEP',
      logo: '/logos/infotep.png',
      logoAlt: 'INFOTEP',
      title: 'Formación Técnica en Procesos Faciales',
      description: 'Capacitación técnica especializada en protocolos clínicos, aparatología moderna y técnicas manuales faciales.',
      badge: 'En curso'
    }
  ];

  return (
    <section id="sobre-mi" className="py-20 bg-[#F5EFEB] border-b border-[#E2D8C3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Photo & Clean Badge Column */}
          <div className="lg:col-span-5 text-center lg:text-left">
            <div className="relative inline-block mx-auto max-w-sm">
              
              <div className="w-72 sm:w-80 h-96 sm:h-[450px] rounded-3xl overflow-hidden shadow-2xl border-4 border-[#183728] relative mx-auto bg-[#183728]/10">
                <img
                  src="/foto_mami.jpeg"
                  alt="Katherine Encarnación - Tu Cosmiatra en EDAM Sthetic"
                  className="w-full h-full object-cover object-top"
                />
              </div>

              {/* Clean Black Badge */}
              <div className="mt-4 bg-[#0A0F0D] text-[#FAF7F0] p-4 rounded-2xl shadow-xl border-2 border-[#C4A45B] flex items-center gap-3.5 text-left">
                <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border border-[#C4A45B] bg-black">
                  <img src="/logo_ea_black.png" alt="EA" className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="text-xs font-serif font-bold text-[#C4A45B] leading-none uppercase tracking-wider">
                    Katherine Encarnación
                  </p>
                  <p className="text-[10px] text-[#FAF7F0]/80 mt-1">
                    Tu Cosmiatra • EDAM Sthetic
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* Bio & Professional Formation */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            {/* Tag with mini logo */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#183728]/10 border border-[#C4A45B]/60 text-[#183728] text-xs font-bold uppercase tracking-wider">
              <img src="/logo_ea_black.png" alt="" className="w-4 h-4 rounded-full inline-block" />
              <span>Conoce a tu Cosmiatra</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-serif text-[#183728] font-bold">
              Katherine Encarnación
            </h2>
            <p className="font-['Great_Vibes'] text-3xl text-[#9E7F36] -mt-3">
              Pasión por la salud, autenticidad y belleza de tu piel
            </p>

            {/* First-person warm & professional tone */}
            <div className="space-y-3 text-stone-700 font-light text-sm sm:text-base leading-relaxed">
              <p>
                Te doy una cálida bienvenida a <strong className="font-semibold text-[#183728]">EDAM Sthetic</strong>. Mi compromiso como tu cosmiatra es brindarte un espacio de confianza, higiene y profesionalismo clínico donde cada paciente recibe una atención dedicada y adaptada a la salud de su piel.
              </p>
              <p>
                No creo en fórmulas genéricas: cada piel tiene su propio ritmo y necesidades. Por eso, antes de iniciar cualquier tratamiento evaluamos juntos una <strong className="font-medium text-[#183728]">ficha técnica completa</strong> para que pueda seleccionar los principios activos y la aparatología más segura y efectiva para ti.
              </p>
            </div>

            {/* Academic Credentials Box with Official Institutional Logos */}
            <div className="pt-2">
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#183728] mb-3 flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-[#C4A45B]" />
                Formación Profesional y Avales Académicos
              </h3>

              <div className="space-y-3">
                {academicCredentials.map((cred, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-white border border-[#D4C4A3] shadow-sm hover:border-[#C4A45B] transition-all flex items-center justify-between gap-4"
                  >
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#183728]">{cred.title}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#183728]/10 text-[#183728]">
                          {cred.badge}
                        </span>
                      </div>
                      <p className="text-xs font-medium text-[#9E7F36]">{cred.institution}</p>
                      <p className="text-[11px] text-stone-600 font-light leading-relaxed">{cred.description}</p>
                    </div>

                    {/* Official Institution Logo */}
                    <div className="w-14 h-14 rounded-2xl bg-[#FAF7F0] p-1.5 border border-[#D4C4A3] flex items-center justify-center shrink-0 shadow-inner">
                      <img
                        src={cred.logo}
                        alt={cred.logoAlt}
                        className="max-h-full max-w-full object-contain"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
