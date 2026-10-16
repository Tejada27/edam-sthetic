import React from 'react';
import { MessageCircle, MapPin, Clock, Navigation, Lock } from 'lucide-react';
import { clinicInfo, bankInfo } from '../data/bankData';

function InstagramIcon({ className = "w-4 h-4" }) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

export default function Footer({ onOpenBooking, onOpenAdmin }) {
  return (
    <footer className="bg-[#0A0F0D] text-[#FAF7F0] pt-16 pb-12 border-t-2 border-[#C4A45B] text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/15">
          
          {/* Col 1: Brand & Logo */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3.5">
              <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border border-[#C4A45B] bg-black">
                <img src="/logo_ea_black.png" alt="EA" className="w-full h-full object-cover" />
              </div>
              <div>
                <span className="text-xl font-serif tracking-[0.2em] text-[#FAF7F0] font-bold block leading-none">
                  EDAM <span className="text-xs tracking-[0.25em] text-[#C4A45B] uppercase font-bold">Sthetic</span>
                </span>
                <span className="text-[9px] tracking-[0.2em] uppercase text-[#E8D9B0] font-medium">
                  Belleza • Confianza • Autenticidad
                </span>
              </div>
            </div>

            <p className="text-xs text-[#FAF7F0]/80 leading-relaxed font-light">
              Centro especializado en cosmiatría, salud dérmica y bienestar integral junto a tu cosmiatra Katherine Encarnación.
            </p>

            <div className="pt-1">
              <button
                onClick={onOpenBooking}
                className="px-5 py-2.5 rounded-xl bg-[#C4A45B] hover:bg-[#b5954c] text-[#183728] text-xs font-bold uppercase tracking-wider transition-colors shadow-md"
              >
                Agendar una Cita
              </button>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-[#C4A45B]">
              Secciones
            </h4>
            <ul className="space-y-2 text-xs text-[#FAF7F0]/80">
              <li><a href="#inicio" className="hover:text-[#C4A45B] transition-colors">Inicio</a></li>
              <li><a href="#sobre-mi" className="hover:text-[#C4A45B] transition-colors">Sobre Katherine Encarnación</a></li>
              <li><a href="#servicios" className="hover:text-[#C4A45B] transition-colors">Menú de Tratamientos</a></li>
              <li><a href="#recomendaciones" className="hover:text-[#C4A45B] transition-colors">Recomendaciones Previas</a></li>
              <li><a href="#ubicacion" className="hover:text-[#C4A45B] transition-colors">Ubicación & Google Maps</a></li>
            </ul>
          </div>

          {/* Col 3: Exact Location */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-[#C4A45B]">
              Ubicación Santo Domingo Este
            </h4>
            <div className="space-y-2 text-xs text-[#FAF7F0]/80">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#C4A45B] shrink-0 mt-0.5" />
                <span>
                  Santo Domingo Este, en el cuñao Plaza Nueva Jerusalén. Calle El Sol, esquina Tulipán, entrando por la Hípica.
                </span>
              </p>
              <p className="flex items-center gap-2 pt-1 text-[#E8D9B0]">
                <Navigation className="w-3.5 h-3.5 text-[#C4A45B] shrink-0" />
                <span>Google Maps: <strong>EDAM Sthetic</strong></span>
              </p>
              <p className="flex items-center gap-2 pt-1">
                <Clock className="w-3.5 h-3.5 text-[#C4A45B] shrink-0" />
                <span>Atención previa cita</span>
              </p>
            </div>
          </div>

          {/* Col 4: Contact & Social Media */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-[#C4A45B]">
              Contacto & Redes
            </h4>
            <div className="space-y-2.5 text-xs text-[#FAF7F0]/80">
              <p>Atención directa y consultas:</p>
              <div className="flex flex-col gap-2">
                <a
                  href={clinicInfo.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white/10 border border-[#C4A45B]/60 text-[#E8D9B0] hover:bg-white/20 transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-[#25D366]" />
                  <span>WhatsApp: {clinicInfo.phoneFormatted}</span>
                </a>
                <a
                  href={clinicInfo.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white/10 border border-[#C4A45B]/60 text-[#E8D9B0] hover:bg-white/20 transition-colors"
                >
                  <InstagramIcon className="w-4 h-4 text-[#E1306C]" />
                  <span>Instagram: {clinicInfo.instagram}</span>
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom credits with discrete admin lock button */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#FAF7F0]/60 gap-4">
          <p>© {new Date().getFullYear()} EDAM Sthetic • Katherine Encarnación. Todos los derechos reservados.</p>
          <div className="flex items-center gap-4 text-xs text-[#E8D9B0]/80">
            <span>Santo Domingo Este, República Dominicana</span>
            <button
              onClick={onOpenAdmin}
              title="Acceso de Gestión Cabina"
              className="opacity-25 hover:opacity-100 text-[#FAF7F0] hover:text-[#C4A45B] transition-opacity p-1 flex items-center gap-1 text-[11px]"
            >
              <Lock className="w-3 h-3 text-[#C4A45B]" />
              <span className="sr-only sm:not-sr-only">Gestión</span>
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
