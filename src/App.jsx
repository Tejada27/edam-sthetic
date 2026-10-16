import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import AboutMe from './components/AboutMe';
import ServicesSection from './components/ServicesSection';
import CabinTourSection from './components/CabinTourSection';
import RecommendationsGuide from './components/RecommendationsGuide';
import LocationSection from './components/LocationSection';
import BookingModal from './components/BookingModal';
import AdminAgenda from './components/AdminAgenda';
import Footer from './components/Footer';
import { initialAppointments } from './data/bankData';

function App() {
  const [activeTab, setActiveTab] = useState('client'); // 'client' | 'admin'
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [preselectedService, setPreselectedService] = useState(null);

  // Load appointments from localStorage or fall back to initial data
  const [appointments, setAppointments] = useState(() => {
    const saved = localStorage.getItem('edam_appointments_rd');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error loading appointments from localStorage', e);
      }
    }
    return initialAppointments;
  });

  // Save appointments to localStorage when updated
  useEffect(() => {
    localStorage.setItem('edam_appointments_rd', JSON.stringify(appointments));
  }, [appointments]);

  const handleOpenBooking = (service = null) => {
    setPreselectedService(service);
    setIsBookingOpen(true);
  };

  const handleCloseBooking = () => {
    setIsBookingOpen(false);
    setPreselectedService(null);
  };

  const handleAppointmentCreated = (newAppointment) => {
    setAppointments(prev => [newAppointment, ...prev]);
  };

  const handleUpdateAppointment = (updatedAppointment) => {
    setAppointments(prev => 
      prev.map(item => item.id === updatedAppointment.id ? updatedAppointment : item)
    );
  };

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-[#FAF7F0] text-stone-900 font-sans flex flex-col selection:bg-[#E2D2A4] selection:text-[#183728]">
      
      {/* Top Navigation Bar with Isotipo EA */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenBooking={() => handleOpenBooking(null)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'client' ? (
          <>
            {/* 1. Hero Banner with Full Logo & Handwritten Slogan */}
            <Hero onOpenBooking={() => handleOpenBooking(null)} />

            {/* 2. Apartado Sobre Mí: Katherine Encarnación & Formación UNPHU / FF.AA. / INFOTEP */}
            <AboutMe onOpenBooking={() => handleOpenBooking(null)} />

            {/* 3. Catálogo de Tratamientos Oficial (Faciales & Masajes en RD$) */}
            <ServicesSection onSelectService={(service) => handleOpenBooking(service)} />

            {/* 4. Conoce Nuestra Cabina & Tarjeta de Fidelidad */}
            <CabinTourSection onOpenBooking={() => handleOpenBooking(null)} />

            {/* 5. Recomendaciones Antes de los Procesos */}
            <RecommendationsGuide />

            {/* 6. Ubicación en Santo Domingo Este & Google Maps */}
            <LocationSection onOpenBooking={() => handleOpenBooking(null)} />
          </>
        ) : (
          /* 6. Módulo Tipo Agenda de Citas + Fichas Técnicas para Katherine */
          <AdminAgenda
            appointments={appointments}
            onUpdateAppointment={handleUpdateAppointment}
            onNewAppointmentClick={() => handleOpenBooking(null)}
          />
        )}
      </main>

      {/* Footer */}
      <Footer onOpenBooking={() => handleOpenBooking(null)} />

      {/* Booking Wizard Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={handleCloseBooking}
        preselectedService={preselectedService}
        onAppointmentCreated={handleAppointmentCreated}
        existingAppointments={appointments}
      />

    </div>
  );
}

export default App;
