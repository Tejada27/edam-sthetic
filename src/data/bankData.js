export const clinicInfo = {
  name: 'EDAM Sthetic',
  tagline: 'Belleza • Confianza • Autenticidad',
  slogan: 'Tu piel en las mejores manos ♡',
  specialistName: 'Katherine Encarnación',
  specialistTitle: 'Cosmiatra Especialista',
  currency: 'RD$',
  address: 'Santo Domingo Este, en el cuñao Plaza Nueva Jerusalén. Calle El Sol, esquina Tulipán, entrando por la Hípica.',
  shortAddress: 'Santo Domingo Este, en el cuñao Plaza Nueva Jerusalén',
  googleMapsQuery: 'EDAM Sthetic Santo Domingo Este',
  googleMapsUrl: 'https://maps.google.com/?q=18.491793%2C-69.765053',
  phoneFormatted: '+1 (829) 271-6763',
  whatsappNumber: '18292716763',
  whatsappUrl: 'https://wa.me/message/CI524PS2CJXZB1',
  instagram: '@edamsthetic',
  instagramUrl: 'https://www.instagram.com/edamsthetic/'
};

export const bankInfo = {
  bankName: 'Banco Popular Dominicano / Banreservas',
  accountType: 'Cuenta de Ahorros',
  accountNumber: '7920148592',
  accountHolder: 'Katherine Encarnación',
  docId: 'Cédula de Identidad',
  currency: 'RD$',
  depositPolicy: 'Para asegurar tu espacio en cabina se solicita un abono de RD$500 a RD$1,000 según el tratamiento. El monto restante se completa el día de tu cita.',
  whatsappNumber: '18292716763',
  whatsappUrl: 'https://wa.me/message/CI524PS2CJXZB1'
};

export const initialAppointments = [
  {
    id: 'CITA-101',
    clientName: 'Yomaira Castillo',
    clientPhone: '+1 809 342 9981',
    clientEmail: 'yomaira.castillo@gmail.com',
    serviceId: 'limpieza-facial-profunda',
    serviceName: 'Limpieza Facial Profunda',
    date: '2026-10-14',
    time: '10:00 AM',
    price: 2000,
    deposit: 500,
    status: 'confirmada',
    paymentReceipt: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=400&q=80',
    notes: 'Cliente puntual. Piel mixta, extraer comedones con cuidado en aletas nasales.',
    createdAt: '2026-10-12T14:30:00Z',
    fichaTecnica: {
      skinType: 'Mixta con tendencia a brillos en zona T',
      allergies: 'Ninguna conocida',
      isPregnant: 'No',
      isLactating: 'No',
      usesRetinol: 'Suspendió hace 5 días según indicación',
      hasMedicalConditions: 'Ninguna',
      consentAccepted: true,
      signatureDate: '2026-10-12'
    }
  },
  {
    id: 'CITA-102',
    clientName: 'Ana Patricia Santana',
    clientPhone: '+1 829 782 1102',
    clientEmail: 'anapatricia@hotmail.com',
    serviceId: 'evaluacion-diagnostico',
    serviceName: 'Evaluación y Diagnóstico Estético Facial',
    date: '2026-10-14',
    time: '03:30 PM',
    price: 500,
    deposit: 500,
    status: 'pendiente_verificacion',
    paymentReceipt: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=400&q=80',
    notes: 'Primera visita. Desea armar un plan para manchas post-acné. Recordar que los RD$500 se le descuentan si realiza tratamiento el mismo día.',
    createdAt: '2026-10-12T18:15:00Z',
    fichaTecnica: {
      skinType: 'Sensible y con manchas residuales',
      allergies: 'Alérgica al marisco',
      isPregnant: 'No',
      isLactating: 'No',
      usesRetinol: 'No utiliza',
      hasMedicalConditions: 'Ninguna',
      consentAccepted: true,
      signatureDate: '2026-10-12'
    }
  },
  {
    id: 'CITA-103',
    clientName: 'Carlos Manuel Méndez',
    clientPhone: '+1 849 512 8840',
    clientEmail: 'carlos.m@gmail.com',
    serviceId: 'limpieza-facial-profunda',
    serviceName: 'Limpieza Facial Profunda',
    date: '2026-10-15',
    time: '11:30 AM',
    price: 2000,
    deposit: 500,
    status: 'confirmada',
    paymentReceipt: null,
    notes: 'Cliente masculino. Poros dilatados en mejillas y puntos negros en nariz.',
    createdAt: '2026-10-11T11:00:00Z',
    fichaTecnica: {
      skinType: 'Grasa / Gruesa',
      allergies: 'Ninguna',
      isPregnant: 'No',
      isLactating: 'No',
      usesRetinol: 'No',
      hasMedicalConditions: 'Ninguna',
      consentAccepted: true,
      signatureDate: '2026-10-11'
    }
  }
];
