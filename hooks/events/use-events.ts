import { sleep } from "@/lib/utils";
import { useQuery } from "react-query";

const PAST_EVENTS = [
  {
    id: "1",
    title: "CSI PRO KICK-OFF",
    date: new Date(2024, 2, 11, 11),
    location: "Auditorio Gustavo Figueroa",
    description:
      "Líderes de CSI PRO presentan el laboratorio y el tipo de trabajo que se realiza en él para la comunidad del Departamento de Ingeniería Industrial.",
    type: "conference",
    presenters: ["Karla Arleth Lerma Molina", "Saúl Alberto Ramos Laborín"],
  },
  {
    id: "2",
    title: "REMAH",
    date: new Date(2024, 2, 12, 11),
    location: "Auditorio Gustavo Figueroa",
    description:
      "Miembros de CSI PRO presentan REMAH: Red de Monitoreo Ambiental de Hermosillo, un proyecto para el monitoreo de la calidad del aire en nuestra ciudad.",
    type: "conference",
    presenters: [
      "Karolina Abigaíl Badilla Ramírez",
      "Luis Ernesto Hernández López",
    ],
  },
  {
    id: "5",
    title: "CSI PRO BrainTive",
    date: new Date(2024, 2, 14, 13),
    location: "Auditorio Gustavo Figueroa",
    description:
      "Miembros de CSI PRO de cuarto semestre presentan BrainTive, un proyecto que busca generar llaves digitales por medio de neurociencia.",
    type: "conference",
    presenters: [
      "Gael Humberto Borchardt Castellanos",
      "Jorge Luis Duarte Ruiz",
      "Daniel Iván Estrada Neri",
      "Kevin Xandé Haro Martínez",
    ],
  },
];

const ACTIVE_EVENTS = [
  {
    id: "3",
    title: "Espacio y sostenibilidad",
    date: new Date(2024, 4, 6, 13),
    location: "Auditorio Gustavo Figueroa",
    description:
      "Ing. Juan Badouin presenta el trabajo del coloquio internacional Espacio y sostenibilidad organizado en conjunto con NASA.",
    type: "conference",
    presenters: ["Ing. Juan Badouin"],
  },
  {
    id: "4",
    title: "Construyendo una Pokédex: de HTML a JS Vainilla a React.",
    date: new Date(2024, 4, 6, 17),
    location: "Auditorio Gustavo Figueroa",
    description:
      "Ing. Abraham Hurtado presenta el proceso de construcción de una Pokédex desde cero en una conferencia con enfoque práctico.",
    type: "conference",
    presenters: ["Ing. Abraham Hurtado"],
  },
];

export const useEvents = () => {
  const { status, data, error } = useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      await sleep(1500);

      return PAST_EVENTS;
    },
  });

  return {
    status,
    data,
    error,
  };
};

export const usePastEvents = () => {
  const { status, data, error } = useQuery({
    queryKey: ["past-events"],
    queryFn: async () => {
      await sleep(1500);

      return PAST_EVENTS;
    },
  });

  return {
    status,
    data,
    error,
  };
};
