export const services = [
  {
    id: "corte",
    name: "Corte masculino",
    description: "Um corte que valoriza sua identidade.",
    price: 45,
    duration: 40,
  },
  {
    id: "barba",
    name: "Barba",
    description: "Precisão, cuidado e acabamento.",
    price: 30,
    duration: 25,
  },
  {
    id: "combo",
    name: "Corte + barba",
    description: "A experiência completa de cuidado.",
    price: 65,
    duration: 60,
  },
];

export const professionals = [
  {
    id: "leonardo",
    name: "Leonardo",
    specialty: "Cortes clássicos e modernos",
    initials: "LE",
    image: "/images/leonardo.webp",
  },
  {
    id: "rafael",
    name: "Rafael",
    specialty: "Degradês e acabamentos",
    initials: "RA",
    image: "/images/rafael.webp",
  },
  {
    id: "matheus",
    name: "Matheus",
    specialty: "Barba e estilo masculino",
    initials: "MA",
    image: "/images/matheus.webp",
  },
];

// Número fictício vazio: o formulário copia a solicitação para demonstrar o fluxo.
// Para integrar um número real, use o formato internacional, com DDI e DDD.
export const whatsappNumber = "";

export const business = {
  name: "FORMA.",
  city: "Jundiaí — SP",
  address: "",
  // Horários em minutos após 00:00, usados apenas para sugerir pedidos de horário.
  // 0 = domingo, 1 = segunda-feira, ..., 6 = sábado.
  bookingSchedule: {
    0: null,
    1: { open: 540, close: 1140 },
    2: { open: 540, close: 1140 },
    3: { open: 540, close: 1140 },
    4: { open: 540, close: 1140 },
    5: { open: 540, close: 1140 },
    6: { open: 540, close: 1020 },
  },
  openingHours: [
    { days: "Segunda a sexta", hours: "09h às 19h" },
    { days: "Sábado", hours: "09h às 17h" },
    { days: "Domingo", hours: "Fechado" },
  ],
};
