import React from 'react';
import { Calendar, MapPin } from 'lucide-react';
import { clinicInfo } from '../data/bankData';

export default function Navbar({ onOpenBooking }) {
  return (
    <header className="sticky top-0 z-40 bg-[#FAF7F0]/95 backdrop-blur-md border-b border-[#E2D8C3] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Logo Brand: High-Res Black Circular Badge + Clean Typography */}
          <a 
            href="#inicio"
            className="flex items-center space-x-3.5 group cursor-pointer text-left shrink-0"
          >
            {/* Logo in Pure Black Badge */}
            <div className="w-12 h-12 rounded-full overflow-hidden shadow-md group-hover:scale-105 transition-transform shrink-0 border border-[#C4A45B]">
              <img 
                src="/logo_ea_black.png" 
                alt="EDAM Sthetic Logo" 
                className="w-full h-full object-cover"
              />
            </div>

            {/* Typography Brand */}
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-serif tracking-[0.2em] text-[#183728] font-bold leading-none">
                  EDAM
                </span>
                <span className="text-xs font-serif tracking-[0.25em] text-[#9E7F36] uppercase font-bold">
                  Sthetic
                </span>
              </div>
              <span className="text-[9px] tracking-[0.25em] uppercase text-stone-600 font-semibold hidden md:block mt-0.5">
                Belleza • Confianza • Autenticidad
              </span>
            </div>
          </a>

          {/* Clean Navigation Links with ample spacing - Never wrapping */}
          <nav className="hidden xl:flex items-center gap-7 text-xs uppercase tracking-wider font-bold text-[#183728]/85">
            <a href="#inicio" className="hover:text-[#9E7F36] transition-colors whitespace-nowrap">Inicio</a>
            <a href="#sobre-mi" className="hover:text-[#9E7F36] transition-colors whitespace-nowrap">Sobre Mí</a>
            <a href="#servicios" className="hover:text-[#9E7F36] transition-colors whitespace-nowrap">Servicios</a>
            <a href="#cabina" className="hover:text-[#9E7F36] transition-colors whitespace-nowrap">Cabina</a>
            <a href="#recomendaciones" className="hover:text-[#9E7F36] transition-colors whitespace-nowrap">Recomendaciones</a>
            <a href="#ubicacion" className="hover:text-[#9E7F36] transition-colors whitespace-nowrap flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#C4A45B]" />
              <span>Ubicación</span>
            </a>
          </nav>

          {/* Medium screen navigation (1024px to 1279px) */}
          <nav className="hidden lg:flex xl:hidden items-center gap-3 text-[11px] uppercase tracking-wider font-bold text-[#183728]/85">
            <a href="#inicio" className="hover:text-[#9E7F36] transition-colors whitespace-nowrap">Inicio</a>
            <a href="#sobre-mi" className="hover:text-[#9E7F36] transition-colors whitespace-nowrap">Sobre Mí</a>
            <a href="#servicios" className="hover:text-[#9E7F36] transition-colors whitespace-nowrap">Servicios</a>
            <a href="#cabina" className="hover:text-[#9E7F36] transition-colors whitespace-nowrap">Cabina</a>
            <a href="#recomendaciones" className="hover:text-[#9E7F36] transition-colors whitespace-nowrap">Recomendaciones</a>
            <a href="#ubicacion" className="hover:text-[#9E7F36] transition-colors whitespace-nowrap flex items-center gap-1">
              <MapPin className="w-3 h-3 text-[#C4A45B]" />
              <span>Ubicación</span>
            </a>
          </nav>

          {/* Action Button: Never wrap, perfectly padded single-line pill */}
          <div className="flex items-center shrink-0">
            <button
              onClick={onOpenBooking}
              className="inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#183728] text-[#FAF7F0] border border-[#C4A45B] hover:bg-[#0f241a] shadow-md hover:shadow-lg transition-all whitespace-nowrap shrink-0"
            >
              <Calendar className="w-4 h-4 text-[#C4A45B]" />
              <span>Reservar Cita</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}
