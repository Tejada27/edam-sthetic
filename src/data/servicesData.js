export const servicesData = [
  {
    id: 'evaluacion-diagnostico',
    name: 'Evaluación y Diagnóstico Estético Facial',
    category: 'Diagnóstico',
    duration: '35 min',
    price: 500,
    deposit: 500,
    popular: true,
    promoTag: '¡Si te realizas tu tratamiento el mismo día, los RD$500 se descuentan de tu servicio!',
    shortDesc: 'Análisis minucioso del tipo y condición de tu piel, identificación de necesidades dérmicas y diseño de tu plan personalizado.',
    image: '/cabin/cabina_panoramica.jpg',
    includedItems: [
      'Análisis del tipo y condición de la piel.',
      'Identificación de necesidades principales.',
      'Revisión de sensibilidad y posibles contraindicaciones.',
      'Recomendación del tratamiento más adecuado.',
      'Orientación básica de cuidados en casa.'
    ],
    preRecommendations: [
      'Asistir con el rostro completamente limpio sin maquillaje.',
      'Llevar anotados o en fotos los productos cosméticos que usas a diario.',
      'Informar si estás usando medicamentos dermatológicos (retinol, isotretinoína, antibióticos).'
    ],
    postCare: [
      'Seguir la rutina domiciliaria prescrita por Katherine Encarnación.',
      'Uso diario y reaplicación de protector solar adecuado para tu tipo de piel.'
    ],
    contraindications: 'Ninguna para la evaluación. Se determinarán para los procedimientos posteriores.'
  },
  {
    id: 'limpieza-facial-profunda',
    name: 'Limpieza Facial Profunda',
    category: 'Faciales',
    duration: '75 min',
    price: 2000,
    deposit: 500,
    popular: true,
    shortDesc: 'Incluye extracción, aparatología y algunas tecnologías de hidrofacial, según las necesidades de tu piel.',
    image: '/cabin/atendiendo_paciente.jpg',
    includedItems: [
      'Higienización y preparación cutánea.',
      'Extracción minuciosa de comedones e impurezas.',
      'Aparatología especializada (alta frecuencia y tecnologías de hidrofacial).',
      'Mascarilla descongestiva e hidratación final.'
    ],
    preRecommendations: [
      'Suspender el uso de ácidos exfoliantes y retinol 4 días antes.',
      'Asistir sin maquillaje para optimizar el tiempo de cabina.',
      'Evitar exposición solar prolongada 48 horas previas.',
      'No depilar el rostro con cera en las 48 horas anteriores.'
    ],
    postCare: [
      'No aplicar maquillaje durante las primeras 24 horas.',
      'Reaplicar protector solar FPS 50 cada 3 horas.',
      'Evitar saunas, piscinas y sudoración intensa el mismo día.',
      'Mantener una hidratación constante con productos suaves.'
    ],
    contraindications: 'Acné inflamatorio agudo generalizado o heridas abiertas en la zona facial.'
  },
  {
    id: 'limpieza-facial-basica',
    name: 'Limpieza Facial',
    category: 'Faciales',
    duration: '60 min',
    price: 1500,
    deposit: 500,
    popular: false,
    shortDesc: 'Incluye limpieza y aparatología básica para oxigenar, purificar y devolverle luminosidad a tu rostro.',
    image: '/cabin/facial_hombre.jpg',
    includedItems: [
      'Doble limpieza dérmica.',
      'Exfoliación superficial suave.',
      'Aparatología básica oxigenante.',
      'Nutrición y sellado con crema hidratante y protector solar.'
    ],
    preRecommendations: [
      'Venir con rostro sin maquillaje.',
      'Evitar exfoliantes mecánicos el día previo.'
    ],
    postCare: [
      'Proteger la piel del sol directo.',
      'Hidratar adecuadamente durante el día.'
    ],
    contraindications: 'Dermatitis o eccema activo.'
  },
  {
    id: 'facial-efecto-lifting',
    name: 'Facial Efecto Lifting',
    category: 'Faciales',
    duration: '60 min',
    price: 1800,
    deposit: 500,
    popular: true,
    shortDesc: 'Ideal para dar un aspecto más firme, luminoso y revitalizado al rostro estimulando colágeno y tono dérmico.',
    image: '/cabin/fototerapia_led_roja.jpg',
    includedItems: [
      'Preparación y drenaje facial.',
      'Aparatología reafirmante y tensora.',
      'Velo de colágeno o activos tensores botánicos.',
      'Masaje moldeador miofascial.'
    ],
    preRecommendations: [
      'Beber suficiente agua antes de asistir.',
      'Venir con rostro limpio.',
      'Si tienes toxina botulínica o ácido hialurónico reciente, esperar al menos 15 días.'
    ],
    postCare: [
      'Disfrutar del efecto tensor inmediato.',
      'Uso de protector solar diario.',
      'Evitar calor excesivo las primeras 12 horas.'
    ],
    contraindications: 'Marcapasos o placas metálicas faciales si se utiliza radiofrecuencia.'
  },
  {
    id: 'peeling-quimico',
    name: 'Peeling Químico',
    category: 'Faciales',
    duration: '50 min',
    price: 1800,
    deposit: 500,
    popular: false,
    shortDesc: 'El tipo de peeling se selecciona según las necesidades y el estado de tu piel (manchas, textura, renovación celular).',
    image: '/cabin/mascarilla_hidroplastica.jpg',
    includedItems: [
      'Neutralización y desengrasado de la piel.',
      'Aplicación del ácido seleccionado según fototipo.',
      'Tiempo de exposición controlado.',
      'Neutralización, descongestión y sellado de barrera cutánea.'
    ],
    preRecommendations: [
      'Suspender retinol, tretinoína y exfoliantes 7 días antes.',
      'Cero bronceado o playa durante los 7 días previos.',
      'No depilarse el rostro los 4 días anteriores.'
    ],
    postCare: [
      'No arrancar las descamaciones de la piel.',
      'Uso estricto de protector solar FPS 50 cada 3 horas.',
      'Utilizar crema reparadora con ceramidas.',
      'No usar maquillaje por 48 horas.'
    ],
    contraindications: 'Embarazo, lactancia, alergia a la aspirina (ácido salicílico) o uso reciente de isotretinoína.'
  },
  {
    id: 'dermapen',
    name: 'Dermapen Revitalizante',
    category: 'Faciales',
    duration: '65 min',
    price: 2500,
    deposit: 800,
    popular: true,
    shortDesc: 'Microagujas estériles para revitalización, iluminación facial profunda y estimulación natural de colágeno.',
    image: '/cabin/dermapen_cabin.jpg',
    includedItems: [
      'Asepsia profunda y preparación dérmica.',
      'Cartucho de microagujas estéril desechable abierto frente al paciente.',
      'Infusión de coctel de vitaminas, péptidos y ácido hialurónico.',
      'Mascarilla calmante descongestiva.'
    ],
    preRecommendations: [
      'No tener brotes activos de acné infectado.',
      'Suspender ácidos y exfoliantes químicos 5 días antes.',
      'No tomar anticoagulantes ni aspirina 24h antes (previa consulta médica).'
    ],
    postCare: [
      'No lavar el rostro con agua corriente durante 8 horas (usar agua termal).',
      'Cero maquillaje durante 24 a 48 horas.',
      'Cambiar la funda de tu almohada esa noche.',
      'Protector solar no comedogénico obligatorio.'
    ],
    contraindications: 'Acné inflamatorio severo, herpes activo, queloides o tratamiento con Roaccutan.'
  },
  {
    id: 'hidralips',
    name: 'Hidralips',
    category: 'Faciales',
    duration: '45 min',
    price: 1500,
    deposit: 500,
    popular: false,
    shortDesc: 'Hidratación, volumen natural y suavidad para tus labios mediante exfoliación delicada y ácido hialurónico.',
    image: '/cabin/hidralips_cabin.jpg',
    includedItems: [
      'Exfoliación labial no invasiva.',
      'Micropunción superficial con ácido hialurónico no reticulado.',
      'Parche hidratante labial.',
      'Bálsamo regenerador con nutrientes.'
    ],
    preRecommendations: [
      'Asistir sin labial ni maquillaje.',
      'Asegurarse de no presentar herpes labial activo ni boqueras.'
    ],
    postCare: [
      'Aplicar bálsamo hidratante frecuentemente.',
      'No morderse los labios ni arrancarse pellejitos.',
      'Evitar comidas muy calientes o picantes las primeras 12 horas.'
    ],
    contraindications: 'Herpes labial activo o heridas abiertas en labios.'
  },
  {
    id: 'masaje-relajante-completo',
    name: 'Masaje Relajante de Cuerpo Completo',
    category: 'Masajes',
    duration: '60 min',
    price: 3000,
    deposit: 1000,
    popular: true,
    shortDesc: 'Libera tensiones y renueva tu energía con aromaterapia relajante y técnicas manuales descontracturantes.',
    image: '/cabin/masaje_relajante_cabin.jpg',
    includedItems: [
      'Aromaterapia inicial personalizada.',
      'Masaje de espalda, cuello, hombros, piernas y brazos.',
      'Aceites esenciales botánicos hidratantes.',
      'Música terapéutica y ambiente de desconexión total.'
    ],
    preRecommendations: [
      'Evitar comer pesado al menos 1 hora y media antes.',
      'Tomar un baño tibio antes de asistir.',
      'Informar sobre dolores agudos o zonas contracturadas.'
    ],
    postCare: [
      'Beber abundante agua durante el resto del día.',
      'Descansar y evitar entrenamientos de alto impacto tras la sesión.'
    ],
    contraindications: 'Fiebre, infecciones agudas o trombosis venosa.'
  },
  {
    id: 'masaje-reductor',
    name: 'Masaje Reductor (Por Zonas)',
    category: 'Masajes',
    duration: '45 min',
    price: 1500,
    deposit: 500,
    popular: false,
    shortDesc: 'Ayuda a tonificar, moldear y mejorar la circulación linfática en abdomen, piernas o brazos.',
    image: '/cabin/dermocosmetica_aparatologia.jpg',
    includedItems: [
      'Activación de ganglios linfáticos.',
      'Maniobras reductoras y moldeadoras vigorosas.',
      'Geles termoactivos o criogénicos.',
      'Drenaje de líquidos retenidos.'
    ],
    preRecommendations: [
      'No asistir en ayunas prolongadas ni recién comida.',
      'Venir con ropa cómoda.'
    ],
    postCare: [
      'Mantenerse bien hidratada para eliminar toxinas.',
      'Combinar con hábitos saludables y alimentación balanceada.'
    ],
    contraindications: 'Embarazo en zona abdominal, problemas renales o procesos inflamatorios agudos.'
  }
];

export const categories = ['Todos', 'Diagnóstico', 'Faciales', 'Masajes'];
