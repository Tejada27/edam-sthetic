import React, { useState } from 'react';
import { Sparkles, ShieldCheck, Heart, Award, Gift, Check, ArrowRight, Eye } from 'lucide-react';

export default function CabinTourSection({ onOpenBooking }) {
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const realCabinPhotos = [
    {
      id: 'atendiendo',
      image: '/cabin/atendiendo_paciente.jpg',
      title: 'Atención Personalizada en Vivo',
      category: 'Procedimiento Real',
      description: 'Sesión facial con máscara de fototerapia LED azul y tecnología hidrofacial en cabina.',
      highlight: 'Fototerapia LED + Hidrofacial'
    },
    {
      id: 'hombre',
      image: '/cabin/facial_hombre.jpg',
      title: 'Cuidado Facial para Todos',
      category: 'Damas y Caballeros',
      description: 'Higiene dérmica y exfoliación profunda adaptada al tipo de piel de cada paciente, tanto femenino como masculino.',
      highlight: 'Atención Inclusiva'
    },
    {
      id: 'productos',
      image: '/cabin/dermocosmetica_aparatologia.jpg',
      title: 'Dermocosmética y Aparatología',
      category: 'Cuidado Avanzado',
      description: 'Trabajamos con activos de élite: Skinceuticals, La Roche-Posay, Vichy, e instrumental de cavitación y radiofrecuencia.',
      highlight: 'Dermocosmética Certificada'
    },
    {
      id: 'panoramica',
      image: '/cabin/cabina_panoramica.jpg',
      title: 'Espacio Privado y Climatizado',
      category: 'Instalaciones',
      description: 'Camilla ergonómica acolchada, almohadilla cervical, iluminación indirecta cálida y ambiente sonoro relajante.',
      highlight: 'Máximo Confort e Higiene'
    },
    {
      id: 'espejo',
      image: '/cabin/espejo_led_firma.jpg',
      title: 'El Espejo Firma EDAM Sthetic',
      category: 'Espacio Icónico',
      description: 'Espejo orgánico retroiluminado con el monograma EA donde evaluamos juntos tu progreso dérmico tras cada protocolo.',
      highlight: 'Sello de Identidad'
    }
  ];

  return (
    <section id="cabina" className="py-20 bg-[#F5EFEB] border-b border-[#E2D8C3] relative overflow-hidden">
      
      {/* Background soft ambient accents */}
      <div className="absolute top-1/4 right-0 w-80 h-80 bg-[#C4A45B]/10 blur-3xl rounded-full pointer-events-none" />
      <div className="absolute bottom-10 left-0 w-96 h-96 bg-[#183728]/10 blur-3xl rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#183728]/10 border border-[#C4A45B]/60 text-[#183728] text-xs font-bold uppercase tracking-wider">
            <img src="/logo_ea_black.png" alt="" className="w-4 h-4 rounded-full inline-block" />
            <span>Nuestras Instalaciones Reales</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#183728] font-bold">
            Conoce Nuestra Cabina <br className="hidden sm:inline" />
            <span className="italic font-normal text-[#9E7F36]">de EDAM Sthetic</span>
          </h2>

          <p className="text-stone-700 text-sm sm:text-base leading-relaxed font-light">
            Creemos en la transparencia total. Te mostramos fotos reales de nuestra cabina en Santo Domingo Este, en el cuñao Plaza Nueva Jerusalén (Calle El Sol, esquina Tulipán, entrando por la Hípica), 
            diseñada bajo rigurosos estándares de higiene, privacidad y confort para que disfrutes de tu momento de cuidado.
          </p>
        </div>

        {/* Real Photo Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-16">
          {realCabinPhotos.map((photo, index) => (
            <div
              key={photo.id}
              onClick={() => setSelectedPhoto(photo)}
              className={`group bg-white rounded-3xl overflow-hidden border-2 border-[#D4C4A3] hover:border-[#C4A45B] shadow-md hover:shadow-xl transition-all duration-3xl cursor-pointer flex flex-col ${
                index === 0 ? 'md:col-span-2 lg:col-span-2' : ''
              }`}
            >
              {/* Photo Container */}
              <div className={`relative overflow-hidden bg-black ${index === 0 ? 'h-72 sm:h-96' : 'h-64 sm:h-72'}`}>
                <img
                  src={photo.image}
                  alt={photo.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Badge on photo */}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full bg-[#0A0F0D]/90 border border-[#C4A45B] text-[#FAF7F0] text-[10px] font-bold tracking-wider uppercase backdrop-blur-sm">
                    {photo.category}
                  </span>
                </div>

                {/* View zoom icon button */}
                <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 text-[#FAF7F0] border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Eye className="w-4 h-4 text-[#C4A45B]" />
                </div>

                {/* Bottom title overlay */}
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="text-[11px] text-[#C4A45B] font-bold uppercase tracking-widest block mb-1">
                    {photo.highlight}
                  </span>
                  <h3 className="text-lg sm:text-xl font-serif font-bold text-[#FAF7F0] leading-snug">
                    {photo.title}
                  </h3>
                </div>
              </div>

              {/* Caption Description */}
              <div className="p-5 flex-1 flex flex-col justify-between bg-white text-left">
                <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed">
                  {photo.description}
                </p>
                <div className="mt-4 pt-3 border-t border-[#E2D8C3] flex items-center justify-between text-xs text-[#183728] font-bold">
                  <span className="flex items-center gap-1.5 text-[#9E7F36]">
                    <ShieldCheck className="w-4 h-4" />
                    Bioseguridad Garantizada
                  </span>
                  <span className="text-[11px] text-stone-500 group-hover:text-[#183728] group-hover:translate-x-1 transition-all flex items-center gap-1">
                    Ampliar foto →
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Compact, Light Loyalty Banner without image (Minimal & Spacious) */}
        <div className="bg-white rounded-2xl border border-[#D4C4A3] p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-left shadow-sm">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-full bg-[#183728]/10 text-[#183728] flex items-center justify-center shrink-0 border border-[#C4A45B]/40">
              <Gift className="w-5 h-5 text-[#9E7F36]" />
            </div>
            <div>
              <p className="text-xs font-serif font-bold text-[#183728] uppercase tracking-wider flex items-center gap-2">
                <span>Tarjeta de Fidelidad: Cada Sesión Suma</span>
                <span className="text-[10px] font-sans font-bold px-2 py-0.5 rounded-full bg-[#183728]/10 text-[#183728]">
                  Gratis en tu 1ra cita
                </span>
              </p>
              <p className="text-xs text-stone-600 font-light mt-0.5">
                5ta sesión con <strong className="font-semibold text-[#183728]">50% de descuento</strong> • 10ma sesión <strong className="font-semibold text-[#183728]">¡Totalmente gratis!</strong>
              </p>
            </div>
          </div>
          <button
            onClick={onOpenBooking}
            className="shrink-0 px-5 py-2.5 rounded-xl bg-[#183728] hover:bg-[#0f241a] text-[#FAF7F0] text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
          >
            Reservar Cita
          </button>
        </div>

      </div>

      {/* Lightbox Modal for enlarged photo */}
      {selectedPhoto && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div 
            className="max-w-3xl w-full bg-[#0A0F0D] border-2 border-[#C4A45B] rounded-3xl overflow-hidden shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative max-h-[70vh] bg-black flex items-center justify-center">
              <img
                src={selectedPhoto.image}
                alt={selectedPhoto.title}
                className="max-h-[70vh] w-auto object-contain mx-auto"
              />
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/70 border border-[#C4A45B] text-white flex items-center justify-center hover:bg-black transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="p-6 text-left space-y-2 bg-[#0A0F0D] text-white">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#C4A45B]">
                  {selectedPhoto.category}
                </span>
                <span className="text-xs text-stone-400">EDAM Sthetic • Cabina Real</span>
              </div>
              <h3 className="text-xl font-serif font-bold text-[#FAF7F0]">{selectedPhoto.title}</h3>
              <p className="text-xs text-stone-300 font-light">{selectedPhoto.description}</p>
            </div>
          </div>
        </div>
      )}

    </section>
  );
}
