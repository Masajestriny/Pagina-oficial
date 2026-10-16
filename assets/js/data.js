/**
 * TRINY MASAJES - FUENTE CENTRAL DE DATOS COMERCIALES
 * Servicios a S/ 100 (60 min), Productos reales, Promociones y Generador Centralizado de WhatsApp.
 */

export const BRAND_DATA = {
  name: "Triny Masajes",
  legalName: "Grupo Inversiones Baldeón Flores SAC",
  tagline: "Relájate desde la comodidad de tu Hogar",
  whatsapp: "+51 986 820 428",
  whatsappRaw: "51986100444",
  whatsappSecundario: "+51 994 138 981",
  email: "soporte@trinymasajes.com",
  currency: "PEN",
  currencySymbol: "S/",
  hours: "Lunes a Domingo de 08:00 a 20:00 (Previa reserva)",
  serviceAreas: [
    "Condominios de Playa del Sur (Playa Blanca, Playa Misterio km 117, Las Lagunas, Cocoa, Asia, Bujama)",
    "Lima Metropolitana (Miraflores, San Isidro, Surco, San Borja, La Molina y distritos afines)",
    "Sesiones concertadas en espacio terapéutico"
  ]
};

/**
 * CATÁLOGO COMPLETO DE SERVICIOS
 * Duración estándar: 60 minutos | Precio estándar: S/ 100
 */
export const SERVICES_DATA = [
  {
    id: "masaje-relajante",
    title: "Masaje Relajante",
    category: "relajante",
    categoryLabel: "Relajación & Calma",
    duration: "60 minutos",
    durationMinutes: 60,
    price: 100,
    description: "Maniobras suaves y fluidas con aceites esenciales botánicos de lavanda para relajar el sistema nervioso, aliviar el cansancio y mejorar el descanso.",
    benefits: ["Calma mental profunda", "Alivio de fatiga corporal", "Mejora de la calidad del sueño"],
    image: "assets/img/flyer para carrousel.png"
  },
  {
    id: "masaje-descontracturante",
    title: "Masaje Descontracturante",
    category: "terapeutico",
    categoryLabel: "Terapia & Descontracturante",
    duration: "60 minutos",
    durationMinutes: 60,
    price: 100,
    description: "Presiones profundas y fricciones directas sobre contracturas musculares en espalda, hombros y cuello acumuladas por sobrecarga o estrés postural.",
    benefits: ["Desarticulación de contracturas", "Alivio de rigidez dorsal", "Recuperación de movilidad"],
    image: "assets/img/PLAYA MISTERIO.jpg"
  },
  {
    id: "maderoterapia-corporal",
    title: "Maderoterapia Corporal",
    category: "maderoterapia",
    categoryLabel: "Maderoterapia & Estética",
    duration: "60 minutos",
    durationMinutes: 60,
    price: 100,
    description: "Técnica holística y moldeadora con implementos anatómicos de madera noble para drenar adiposidad, reactivar la circulación y tonificar la figura.",
    benefits: ["Modelado de silueta", "Estimulación linfática", "Reafirmación de tejidos"],
    image: "assets/img/flyer para carrousel.png"
  },
  {
    id: "maderoterapia-facial",
    title: "Maderoterapia Facial",
    category: "maderoterapia",
    categoryLabel: "Maderoterapia & Estética",
    duration: "60 minutos",
    durationMinutes: 60,
    price: 100,
    description: "Masaje facial estimulante con mini-rodillos y copas de madera diseñadas para activar la síntesis de colágeno, definir el óvalo facial y desinflamar.",
    benefits: ["Efecto lifting natural", "Drenaje de bolsas y ojeras", "Luminosidad cutánea"],
    image: "assets/img/IMAGEN DE PLAYA PARA GALERIA 2.jpg"
  },
  {
    id: "masaje-shiatsu",
    title: "Masaje Shiatsu Tradicional",
    category: "terapeutico",
    categoryLabel: "Terapia Oriental",
    duration: "60 minutos",
    durationMinutes: 60,
    price: 100,
    description: "Disciplina terapéutica oriental basada en presiones continuas sobre canales energéticos y meridianos del cuerpo para equilibrar la vitalidad física y mental.",
    benefits: ["Alivio de cefaleas tensionales", "Restablecimiento energético", "Relajación musculoesquelética"],
    image: "assets/img/Estiramientos tren interior.jpg"
  },
  {
    id: "reflexologia-podal",
    title: "Reflexología Podal y Holística",
    category: "terapeutico",
    categoryLabel: "Terapia Especializada",
    duration: "60 minutos",
    durationMinutes: 60,
    price: 100,
    description: "Estimulación sistemática de puntos reflejos en pies y pantorrillas que inciden de forma distal en los órganos vitales, mejorando la circulación periférica.",
    benefits: ["Alivio de pesadez en piernas", "Efecto sedante natural", "Estimulación del sistema digestivo"],
    image: "assets/img/PLAYA BLANCA.jpg"
  },
  {
    id: "masaje-deportivo",
    title: "Masaje Deportivo",
    category: "terapeutico",
    categoryLabel: "Terapia & Deporte",
    duration: "60 minutos",
    durationMinutes: 60,
    price: 100,
    description: "Enfoque dinámico para preparar o descargar la musculatura de deportistas y personas activas, previniendo lesiones y acelerando la oxigenación de fibras.",
    benefits: ["Descarga de ácido láctico", "Elasticidad muscular", "Prevención de microrroturas"],
    image: "assets/img/Estiramientos tren interior.jpg"
  },
  {
    id: "masaje-reductor",
    title: "Masaje Reductor",
    category: "maderoterapia",
    categoryLabel: "Maderoterapia & Estética",
    duration: "60 minutos",
    durationMinutes: 60,
    price: 120,
    description: "Maniobras vigorosas y de amasamiento focalizado en abdomen, flancos y piernas para movilizar cúmulos grasos y facilitar su metabolización natural.",
    benefits: ["Reducción de medidas", "Activación del metabolismo local", "Piel más compacta"],
    image: "assets/img/IMAGEN DE PLAYA PARA GALERIA.jpg"
  },
  {
    id: "drenaje-linfatico",
    title: "Drenaje Linfático",
    category: "maderoterapia",
    categoryLabel: "Terapia & Drenaje",
    duration: "60 minutos",
    durationMinutes: 60,
    price: 100,
    description: "Técnica manual suave y rítmica que impulsa el flujo de la linfa, eliminando líquidos acumulados y desinflamando tejidos post-quirúrgicos o pre-playa.",
    benefits: ["Desinflamación evidente", "Alivio de retención de líquidos", "Fortalecimiento inmunológico"],
    image: "assets/img/PLAYA LAS LAGUNAS.jpg"
  },
  {
    id: "masaje-prenatal",
    title: "Masaje Prenatal",
    category: "relajante",
    categoryLabel: "Cuidado Gestacional",
    duration: "60 minutos",
    durationMinutes: 60,
    price: 100,
    description: "Masaje suave y adaptado con posturas laterales seguras para aliviar dolores lumbares, reducir la hinchazón en tobillos y aportar serenidad a la futura mamá.",
    benefits: ["Alivio de sobrecarga lumbar", "Disminución de edema gestacional", "Tranquilidad y confort materno"],
    image: "assets/img/PLAYA BLANCA.jpg"
  },
  {
    id: "masaje-terapeutico",
    title: "Masaje Terapéutico",
    category: "terapeutico",
    categoryLabel: "Terapia Clínica",
    duration: "60 minutos",
    durationMinutes: 60,
    price: 100,
    description: "Evaluación y tratamiento integral de dolores musculares crónicos, rigidez articular y secuelas de malas posturas ergonómicas laborales.",
    benefits: ["Disminución del dolor articular", "Reeducación postural", "Bienestar funcional"],
    image: "assets/img/PLAYA MISTERIO.jpg"
  },
  {
    id: "masaje-piedras-calientes",
    title: "Masaje con Piedras Calientes",
    category: "relajante",
    categoryLabel: "Termoterapia & Spa",
    duration: "60 minutos",
    durationMinutes: 60,
    price: 100,
    description: "Aplicación de piedras basálticas volcánicas calientes a lo largo de los chakras y columna vertebral, combinada con aceites para una sedación muscular total.",
    benefits: ["Vasodilatación reconfortante", "Alivio de tensiones profundas", "Paz mental inmediata"],
    image: "assets/img/IMAGEN DE PLAYA PARA GALERIA 3.jpg"
  },
  {
    id: "aromaterapia",
    title: "Aromaterapia",
    category: "relajante",
    categoryLabel: "Aromaterapia & Bienestar",
    duration: "60 minutos",
    durationMinutes: 60,
    price: 100,
    description: "Fusión sensorial de masaje corporal envolvente y difusión de aceites esenciales puros (bergamota, eucalipto, lavanda) que actúan en el sistema límbico.",
    benefits: ["Regulación del estrés emocional", "Apertura de vías respiratorias", "Equilibrio sensorial"],
    image: "assets/img/IMAGEN DE PLAYA PARA GALERIA 2.jpg"
  },
  {
    id: "masaje-anticelulitico",
    title: "Masaje Anticelulítico",
    category: "maderoterapia",
    categoryLabel: "Maderoterapia & Estética",
    duration: "60 minutos",
    durationMinutes: 60,
    price: 100,
    description: "Tratamiento intensivo con fricciones drenantes y copas suecas para desarticular los nódulos fibróticos causantes de la piel de naranja en muslos y glúteos.",
    benefits: ["Mejora de la textura cutánea", "Reabsorción de micronódulos", "Mayor firmeza dérmica"],
    image: "assets/img/flyer para carrousel.png"
  },
  {
    id: "masaje-modelador",
    title: "Masaje Modelador",
    category: "maderoterapia",
    categoryLabel: "Maderoterapia & Estética",
    duration: "60 minutos",
    durationMinutes: 60,
    price: 100,
    description: "Técnica manual y de maderoterapia combinada para esculpir cintura, levantar glúteos y definir curvas corporales con resultados apreciables desde la primera sesión.",
    benefits: ["Definición de contorno", "Estimulación dérmica profunda", "Drenaje de excedentes"],
    image: "assets/img/IMAGEN DE PLAYA PARA GALERIA.jpg"
  },
  {
    id: "masaje-facial",
    title: "Masaje Facial",
    category: "facial",
    categoryLabel: "Cuidado Facial",
    duration: "60 minutos",
    durationMinutes: 60,
    price: 100,
    description: "Suaves maniobras de digitopuntura y drenaje linfático sobre rostro, cuello y escote con sueros hidratantes botánicos para un cutis radiante y descansado.",
    benefits: ["Relajación de músculos de la expresión", "Tono cutáneo luminoso", "Atenuación de líneas de estrés"],
    image: "assets/img/IMAGEN DE PLAYA PARA GALERIA 2.jpg"
  },
  {
    id: "limpieza-facial",
    title: "Limpieza Facial",
    category: "facial",
    categoryLabel: "Cuidado Facial",
    duration: "60 minutos",
    durationMinutes: 60,
    price: 100,
    description: "Protocolo completo de higiene facial: desmaquillado botánico, exfoliación suave, desincrustación de impurezas, mascarilla calmante y masaje hidratante final.",
    benefits: ["Poros descongestionados", "Piel sedosa y oxigenada", "Prevención de imperfecciones"],
    image: "assets/img/IMAGEN DE PLAYA PARA GALERIA 4.jpg"
  },
  {
    id: "exfoliacion-corporal",
    title: "Exfoliación Corporal",
    category: "relajante",
    categoryLabel: "Exfoliación & Spa",
    duration: "60 minutos",
    durationMinutes: 60,
    price: 100,
    description: "Renovación celular integral mediante sales marinas y cáscaras botánicas nutritivas, dejando la epidermis sedosa y receptiva a los masajes posteriores.",
    benefits: ["Remoción de células muertas", "Tacto aterciopelado", "Homogeneización del bronceado"],
    image: "assets/img/IMAGEN DE PLAYA PARA GALERIA 3.jpg"
  },
  {
    id: "spa-para-parejas",
    title: "Spa para Parejas",
    category: "relajante",
    categoryLabel: "Experiencia Dúo",
    duration: "60 minutos",
    durationMinutes: 60,
    price: 100,
    description: "Sesión relajante simultánea o consecutiva para dos personas con ambientación con velas aromáticas, música zen y aceites botánicos en casa o playa.",
    benefits: ["Conexión y sosiego mutuo", "Desconexión de la rutina", "Atención coordinada personalizada"],
    image: "assets/img/flyer para carrousel.png"
  },
  {
    id: "masaje-antiestres",
    title: "Masaje Antiestrés",
    category: "relajante",
    categoryLabel: "Relajación & Calma",
    duration: "60 minutos",
    durationMinutes: 60,
    price: 100,
    description: "Terapia sedante enfocada en disipar la tensión mental y física mediante roces lentos sobre la espalda, nuca y cráneo con esencia de manzanilla silvestre.",
    benefits: ["Descenso de niveles de cortisol", "Calma del sistema cardiovascular", "Sensación de bienestar global"],
    image: "assets/img/PLAYA LAS LAGUNAS.jpg"
  },
  {
    id: "masaje-cervical",
    title: "Masaje Cervical",
    category: "terapeutico",
    categoryLabel: "Terapia Localizada",
    duration: "60 minutos",
    durationMinutes: 60,
    price: 100,
    description: "Tratamiento focalizado para liberar contracturas en trapecios, cuello y base occipital causadas por horas frente a pantallas o tensiones acumuladas.",
    benefits: ["Liberación del cuello rígido", "Alivio de mareos tensionales", "Sensación de ligereza cefálica"],
    image: "assets/img/Estiramientos tren interior.jpg"
  },
  {
    id: "masaje-lumbar",
    title: "Masaje Lumbar",
    category: "terapeutico",
    categoryLabel: "Terapia Localizada",
    duration: "60 minutos",
    durationMinutes: 60,
    price: 100,
    description: "Descompresión muscular en la zona baja de la espalda y glúteos para calmar el dolor por sedentarismo o posturas forzadas.",
    benefits: ["Alivio del lumbago común", "Flexibilidad de la cadera", "Disminución de la compresión vertebral"],
    image: "assets/img/PLAYA MISTERIO.jpg"
  },
  {
    id: "masaje-piernas-cansadas",
    title: "Masaje Piernas Cansadas",
    category: "terapeutico",
    categoryLabel: "Terapia Circulatoria",
    duration: "60 minutos",
    durationMinutes: 60,
    price: 100,
    description: "Masaje ascendente y refrescante con geles mentolados y bombeos venosos para deshinchar piernas, activar la circulación y brindar liviandad.",
    benefits: ["Activación del retorno venoso", "Reducción de pesadez y edemas", "Sensación de frescura duradera"],
    image: "assets/img/PLAYA BLANCA.jpg"
  }
];

/**
 * CATÁLOGO COMPLETO DE PRODUCTOS DE BIENESTAR
 * Precios individuales conservados y categorías reales.
 */
export const PRODUCTS_DATA = [
  {
    id: "prod-aceite-lavanda",
    title: "Aceite Esencial de Lavanda",
    category: "aceites",
    categoryLabel: "Aceites",
    price: 45,
    description: "Extracto puro de lavanda sobre base de almendras dulces. Indispensable para masajes relajantes nocturnos y calmar tensiones.",
    image: "assets/img/flyer para carrousel.png",
    stock: 14
  },
  {
    id: "prod-aceite-almendras",
    title: "Aceite de Almendras Dulces",
    category: "aceites",
    categoryLabel: "Aceites",
    price: 35,
    description: "Aceite emoliente 100% natural prensado en frío, rico en vitamina E. Hidrata y nutre profundamente todo tipo de piel.",
    image: "assets/img/IMAGEN DE PLAYA PARA GALERIA 2.jpg",
    stock: 18
  },
  {
    id: "prod-aceite-argan",
    title: "Aceite de Argán Premium",
    category: "aceites",
    categoryLabel: "Aceites",
    price: 65,
    description: "El oro líquido de Marruecos. Regenera la barrera lipídica de la piel y aporta luminosidad extraordinaria en rostro y cuerpo.",
    image: "assets/img/IMAGEN DE PLAYA PARA GALERIA 3.jpg",
    stock: 10
  },
  {
    id: "prod-aceite-rosa-mosqueta",
    title: "Aceite de Rosa Mosqueta",
    category: "aceites",
    categoryLabel: "Aceites",
    price: 50,
    description: "Poderoso regenerador celular natural que atenúa estrías, cicatrices y líneas de expresión con ácidos grasos esenciales.",
    image: "assets/img/IMAGEN DE PLAYA PARA GALERIA.jpg",
    stock: 12
  },
  {
    id: "prod-crema-reductora",
    title: "Crema Reductora Corporal",
    category: "cremas",
    categoryLabel: "Cremas",
    price: 55,
    description: "Fórmula termogénica con centella asiática, cafeína y carnitina para potenciar los resultados de la maderoterapia en casa.",
    image: "assets/img/flyer para carrousel.png",
    stock: 15
  },
  {
    id: "prod-crema-hidratante",
    title: "Crema Hidratante Natural",
    category: "cremas",
    categoryLabel: "Cremas",
    price: 40,
    description: "Textura ligera con manteca de karité y aloe vera orgánico que restablece el manto hidrolipídico sin dejar sensación grasa.",
    image: "assets/img/PLAYA LAS LAGUNAS.jpg",
    stock: 20
  },
  {
    id: "prod-crema-anticelulitica",
    title: "Crema Anticelulítica",
    category: "cremas",
    categoryLabel: "Cremas",
    price: 60,
    description: "Tratamiento reafirmante y descongestionante para muslos y glúteos enriquecido con algas pardas y hiedra marina.",
    image: "assets/img/IMAGEN DE PLAYA PARA GALERIA 4.jpg",
    stock: 11
  },
  {
    id: "prod-sales-himalaya",
    title: "Sales de Baño Himalaya",
    category: "sales-exfoliantes",
    categoryLabel: "Sales y Exfoliantes",
    price: 30,
    description: "Cristales de sal rosa mineral pura con aceites de eucalipto para inmersión en tina o pediluvio desintoxicante.",
    image: "assets/img/PLAYA BLANCA.jpg",
    stock: 25
  },
  {
    id: "prod-exfoliante-cafe",
    title: "Exfoliante de Café y Coco",
    category: "sales-exfoliantes",
    categoryLabel: "Sales y Exfoliantes",
    price: 35,
    description: "Gránulos de café orgánico peruano con aceite virgen de coco que activan la microcirculación y suavizan la piel al instante.",
    image: "assets/img/IMAGEN DE PLAYA PARA GALERIA 2.jpg",
    stock: 16
  },
  {
    id: "prod-difusor-ultrasonico",
    title: "Difusor Ultrasónico",
    category: "aromaterapia",
    categoryLabel: "Aromaterapia",
    price: 89,
    description: "Nebulizador silencioso de aceites esenciales con luz cálida ambiental LED y apagado automático para un santuario de descanso.",
    image: "assets/img/IMAGEN DE PLAYA PARA GALERIA 3.jpg",
    stock: 9
  },
  {
    id: "prod-kit-aromaterapia",
    title: "Kit Aromaterapia Zen",
    category: "aromaterapia",
    categoryLabel: "Aromaterapia",
    price: 125,
    description: "Caja de madera con 3 aceites puros (lavanda, naranja dulce y eucalipto) más almohadilla aromática cervical de semillas.",
    image: "assets/img/flyer para carrousel.png",
    stock: 7
  },
  {
    id: "prod-velas-soya",
    title: "Velas de Soya Aromatizadas",
    category: "aromaterapia",
    categoryLabel: "Aromaterapia",
    price: 28,
    description: "Cera vegetal 100% de soya con pabilo de algodón y notas aromáticas de vainilla y cedro. Combustión limpia y prolongada.",
    image: "assets/img/IMAGEN DE PLAYA PARA GALERIA.jpg",
    stock: 22
  }
];

export const PROMOTIONS_DATA = [
  {
    id: "promo-duo-relax",
    title: "Paquete Dúo Relax a Domicilio",
    badge: "Más Solicitado",
    sessions: "2 sesiones consecutivas o compartidas",
    priceRegular: 200,
    pricePromo: 180,
    savings: 20,
    description: "Dos masajes relajantes de 60 minutos con aceites esenciales, aromaterapia botánica y traslado con camilla clínica a tu residencia o casa de playa.",
    includes: [
      "2 Masajes Relajantes completos (60 min c/u)",
      "Camilla ergonómica y sábanas descartables",
      "Aceites botánicos de primera calidad",
      "Aromaterapia personalizada"
    ]
  },
  {
    id: "promo-pack-maderoterapia",
    title: "Plan Integral Maderoterapia (5 Sesiones)",
    badge: "Resultados Progresivos",
    sessions: "5 sesiones de 60 min c/u",
    priceRegular: 500,
    pricePromo: 450,
    savings: 50,
    description: "Programa secuencial para estimular drenaje linfático, moldear contorno corporal y reafirmar la piel en la comodidad de tu residencia.",
    includes: [
      "Evaluación corporal inicial",
      "5 sesiones completas de 60 minutos",
      "Combinación de copas suecas, rodillos y tabla moldeadora",
      "Seguimiento personalizado de avance"
    ]
  },
  {
    id: "promo-circuito-playa",
    title: "Circuito Bienestar Total Playa",
    badge: "Exclusivo Casas & Condominios",
    sessions: "Experiencia 110 minutos continuos",
    priceRegular: 200,
    pricePromo: 180,
    savings: 20,
    description: "La experiencia completa de spa frente al mar: exfoliación corporal revitalizante, masaje descontracturante profundo y reflexología podal.",
    includes: [
      "Exfoliación corporal con sales marinas (30 min)",
      "Masaje Descontracturante profundo (50 min)",
      "Reflexología podal calmante (30 min)",
      "Infusión herbal de cortesía"
    ]
  }
];

export const GALLERY_DATA = [
  {
    src: "assets/img/PLAYA BLANCA.jpg",
    alt: "Terapeutas profesionales de Triny Masajes con uniforme clínico en condominio de Playa Blanca",
    caption: "Servicio profesional en condominios residenciales de Playa Blanca."
  },
  {
    src: "assets/img/PLAYA MISTERIO.jpg",
    alt: "Terapeuta de Triny Masajes llegando con camilla ergonómica a Playa Misterio km 117",
    caption: "Atención a domicilio con equipo profesional completo en Playa Misterio km. 117."
  },
  {
    src: "assets/img/PLAYA LAS LAGUNAS.jpg",
    alt: "Terapeuta acreditada en acceso a condominio exclusivo Playa Las Lagunas",
    caption: "Puntualidad y pulcritud terapéutica en Playa Las Lagunas."
  },
  {
    src: "assets/img/IMAGEN DE PLAYA PARA GALERIA.jpg",
    alt: "Vista panorámica de bahía de descanso atendida por Triny Masajes",
    caption: "Entornos de sosiego y descanso marino donde llevamos nuestras terapias."
  },
  {
    src: "assets/img/IMAGEN DE PLAYA PARA GALERIA 2.jpg",
    alt: "Piscina y área de descanso en casa de playa",
    caption: "Tratamientos relajantes al borde de la alberca o en terraza privada."
  },
  {
    src: "assets/img/IMAGEN DE PLAYA PARA GALERIA 3.jpg",
    alt: "Puesta de sol en bahía de descanso marina",
    caption: "El atardecer perfecto complementado con un masaje descontracturante."
  },
  {
    src: "assets/img/IMAGEN  DE PLAYA PARA GALERIA 4.jpg",
    alt: "Acceso seguro a condominio residencial Cocoa",
    caption: "Cobertura autorizada en condominios cerrados y club houses del Sur."
  },
  {
    src: "assets/img/flyer para carrousel.png",
    alt: "Camilla de masajes con toallas limpias y aceites para sesión relajante",
    caption: "Higiene rigurosa: sábanas descartables y desinfección grado clínico."
  }
];

export const FAQ_DATA = [
  {
    id: "faq-multiples",
    question: "¿Puedo reservar varios masajes o sesiones para distintas personas en una sola solicitud?",
    answer: "¡Sí, totalmente! Nuestro nuevo sistema permite seleccionar uno o múltiples tipos de masajes y definir la cantidad de sesiones para cada uno (por ejemplo: 1 Masaje Relajante y 2 Masajes Descontracturantes). Puedes solicitar que se atiendan de forma consecutiva o coordinar la visita de más de una terapeuta si las agendas lo permiten."
  },
  {
    id: "faq-domicilio",
    question: "¿Cómo funciona el servicio de masajes a domicilio o en casa de playa?",
    answer: "Nuestras terapeutas acuden directamente a tu hogar, departamento o casa de playa con todo el equipamiento necesario: camilla ergonómica plegable, sábanas y protectores descartables, toallas esterilizadas, aceites esenciales botánicos y música relajante. Solo necesitas disponer de un espacio ventilado de aproximadamente 2 x 2 metros."
  },
  {
    id: "faq-zonas",
    question: "¿Qué zonas de Lima y playas cubren con sus traslados?",
    answer: "Atendemos permanentemente en Lima Metropolitana (Miraflores, San Isidro, Surco, San Borja, La Molina, Barranco, entre otros) y de forma destacada en los condominios del Sur chico y balnearios de Asia, Playa Blanca, Playa Misterio (km 117), Las Lagunas, Cocoa, Bujama, San Antonio y adyacentes. Consulta con anticipación para coordinar el ingreso al condominio."
  },
  {
    id: "faq-productos",
    question: "¿Puedo pedir productos de la tienda junto con mi reserva de masajes?",
    answer: "Por supuesto. El carrito de compras permite agregar tanto masajes como productos de autocuidado (aceites, cremas, exfoliantes). La terapeuta te los llevará directamente el día de tu cita sin costo adicional de envío."
  },
  {
    id: "faq-pagos",
    question: "¿Cuáles son los medios de pago aceptados?",
    answer: "Aceptamos transferencias bancarias directas (BCP, BBVA, Interbank), pagos mediante Yape y Plin, así como efectivo al concluir el servicio. Para reservas corporativas o paquetes de sesiones emitimos comprobante de pago electrónico a nombre de Grupo Inversiones Baldeón Flores SAC."
  },
  {
    id: "faq-protocolo",
    question: "¿Qué medidas de bioseguridad e higiene implementan?",
    answer: "Cada terapeuta cuenta con uniforme clínico de protección, realiza higiene de manos con alcohol antes y después de cada tratamiento, y utiliza campos descartables individuales para la camilla que se desechan inmediatamente al término de la sesión."
  }
];

export const WHEEL_PRIZES = [
  { id: "dto-10-relax", label: "10% dto. Sesión", description: "10% de descuento en tu próxima sesión de masaje individual.", probability: 0.30, color: "#F7F8FA", textColor: "#172B4D" },
  { id: "dto-15-madera", label: "15% Maderoterapia", description: "15% de descuento en sesión de Maderoterapia Corporal.", probability: 0.20, color: "#C6A56B", textColor: "#FFFFFF" },
  { id: "aceite-cortesia", label: "Aceite Relax", description: "Muestra de cortesía de aceite botánico relajante (15ml).", probability: 0.15, color: "#244A73", textColor: "#FFFFFF" },
  { id: "dto-20-pack", label: "20% Pack Dúo", description: "20% de descuento sobre el Paquete Dúo Relax para dos personas.", probability: 0.15, color: "#172B4D", textColor: "#FFFFFF" },
  { id: "reflex-extra", label: "+15m Reflexología", description: "15 minutos extra de reflexología podal en tu próxima reserva.", probability: 0.10, color: "#D46722", textColor: "#FFFFFF" },
  { id: "intenta-manana", label: "Sigue jugando", description: "¡Gracias por participar! Vuelve mañana para un nuevo intento de la suerte.", probability: 0.10, color: "#667085", textColor: "#FFFFFF" }
];

/**
 * FUNCIÓN CENTRALIZADA PARA COMUNICACIÓN POR WHATSAPP
 * Genera mensajes estructurados A, B o C y abre WhatsApp de manera segura.
 */
export function sendToWhatsApp({ type, data }) {
  const number = BRAND_DATA.whatsappRaw;
  let text = "";

  if (type === "booking") {
    // Formato A: Mensaje de reserva múltiple
    const customer = data.customer || {};
    const services = data.services || [];
    const totalDurationMin = services.reduce((acc, s) => acc + (s.durationMinutes || 60) * s.quantity, 0);
    const hours = Math.floor(totalDurationMin / 60);
    const mins = totalDurationMin % 60;
    const durationStr = `${hours}h${mins > 0 ? ` ${mins}m` : ""} (${totalDurationMin} min totales)`;

    const servicesList = services.map((s) => `• ${s.title} × ${s.quantity} — ${BRAND_DATA.currencySymbol} ${s.price * s.quantity}`).join("\n");

    text = `Hola, Triny Masajes. Deseo solicitar una reserva.

DATOS DEL CLIENTE
Nombre: ${customer.name || "No especificado"}
WhatsApp: ${customer.phone || "No especificado"}
${customer.locationType ? `Ubicación: ${customer.locationType} - ${customer.address || ""}` : ""}

SERVICIOS SOLICITADOS
${servicesList || "Ninguno seleccionado"}

DURACIÓN TOTAL ESTIMADA: ${durationStr}

FECHA SOLICITADA: ${data.date || "Por coordinar"}
HORARIO PREFERIDO: ${data.timeSlot || "Por coordinar"}

TOTAL ESTIMADO: ${BRAND_DATA.currencySymbol} ${data.totalPrice || 0}

${data.notes ? `OBSERVACIONES: ${data.notes}\n` : ""}Por favor, confirmen la disponibilidad y los detalles de mi reserva.

Gracias.`;

  } else if (type === "order") {
    // Formato B: Mensaje de pedido de productos
    const customer = data.customer || {};
    const products = data.products || [];
    const productsList = products.map((p) => `• ${p.title} × ${p.quantity} — ${BRAND_DATA.currencySymbol} ${p.price * p.quantity}`).join("\n");

    text = `Hola, Triny Masajes. Deseo realizar un pedido.

DATOS DEL CLIENTE
Nombre: ${customer.name || "No especificado"}
WhatsApp: ${customer.phone || "No especificado"}

PRODUCTOS
${productsList || "Ninguno seleccionado"}

TOTAL DEL PEDIDO: ${BRAND_DATA.currencySymbol} ${data.totalPrice || 0}

MÉTODO DE ENTREGA: ${data.deliveryMethod || "Entrega a domicilio / En cita de masaje"}
${data.address ? `DIRECCIÓN: ${data.address}\n` : ""}${data.notes ? `OBSERVACIONES: ${data.notes}\n` : ""}Por favor, confirmen la disponibilidad, el método de entrega y el pago.

Gracias.`;

  } else if (type === "cart-unified") {
    // Pedido combinado desde carrito (Masajes + Productos)
    const customer = data.customer || {};
    const services = data.services || [];
    const products = data.products || [];

    let sections = [];
    if (services.length > 0) {
      const sList = services.map((s) => `• ${s.title} × ${s.quantity} — ${BRAND_DATA.currencySymbol} ${s.price * s.quantity}`).join("\n");
      sections.push(`MASAJES & TERAPIAS:\n${sList}`);
    }
    if (products.length > 0) {
      const pList = products.map((p) => `• ${p.title} × ${p.quantity} — ${BRAND_DATA.currencySymbol} ${p.price * p.quantity}`).join("\n");
      sections.push(`PRODUCTOS DE BIENESTAR:\n${pList}`);
    }

    text = `Hola, Triny Masajes. Deseo realizar una solicitud desde el carrito.

DATOS DEL CLIENTE
Nombre: ${customer.name || "Por indicar"}
WhatsApp: ${customer.phone || "Por indicar"}
${customer.address ? `Dirección / Condominio: ${customer.address}\n` : ""}
${sections.join("\n\n")}

TOTAL GENERAL: ${BRAND_DATA.currencySymbol} ${data.totalPrice || 0}

${data.notes ? `OBSERVACIONES: ${data.notes}\n` : ""}Por favor, confirmen disponibilidad y forma de pago.

Gracias.`;

  } else if (type === "inquiry") {
    // Formato C: Mensaje de atención al cliente
    text = `Hola, Triny Masajes. Deseo realizar una consulta.

Nombre: ${data.name || "No indicado"}
WhatsApp: ${data.phone || "No indicado"}
Motivo de la consulta: ${data.subject || "Consulta general"}
${data.relatedItem ? `Servicio o producto relacionado: ${data.relatedItem}\n` : ""}Mensaje: ${data.message || ""}

Agradezco su atención.`;
  }

  // Codificación segura y apertura de WhatsApp
  const encodedUrl = `https://wa.me/${number}?text=${encodeURIComponent(text.trim())}`;
  const win = window.open(encodedUrl, "_blank", "noopener,noreferrer");
  if (!win) {
    window.location.href = encodedUrl;
  }
  return encodedUrl;
}
