import { sleep } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "react-query";

const PAST_EVENTS = [
  {
    id: "58dc2520-a190-4433-af8e-9f1c7157df44",
    title: "CSI PRO KICK-OFF",
    date: new Date(2024, 2, 11, 11),
    location: "Auditorio Gustavo Figueroa",
    description:
      "Líderes de CSI PRO presentan el laboratorio y el tipo de trabajo que se realiza en él para la comunidad del Departamento de Ingeniería Industrial.",
    type: "conference",
    presenters: ["Karla Arleth Lerma Molina", "Saúl Ramos Laborín"],
    attendees: [
      "217200160",
      "217200161",
      "217200162",
      "217200163",
      "217200164",
      "217200165",
    ],
  },
  {
    id: "b007324e-3373-4a4a-a2c7-311deacc9e20",
    title: "REMAH",
    date: new Date(2024, 2, 12, 11),
    location: "Auditorio Gustavo Figueroa",
    description:
      "Miembros de CSI PRO presentan REMAH: Red de Monitoreo Ambiental de Hermosillo, un proyecto para el monitoreo de la calidad del aire en nuestra ciudad.",
    type: "conference",
    presenters: ["Karolina Badilla Ramírez", "Luis Ernesto Hernández López"],
    attendees: [
      "217200160",
      "217200161",
      "217200162",
      "217200163",
      "217200164",
      "217200165",
    ],
  },
  {
    id: "9aa69e0a-40dc-4296-bf72-efb990f11f73",
    title: "Espacio y sostenibilidad",
    date: new Date(2024, 2, 11, 13),
    location: "Auditorio Gustavo Figueroa",
    description:
      "Ing. Juan Badouin presenta el trabajo del coloquio internacional Espacio y sostenibilidad organizado en conjunto con NASA.",
    type: "conference",
    presenters: ["Ing. Juan Badouin"],
    attendees: [
      "217200160",
      "217200161",
      "217200162",
      "217200163",
      "217200164",
      "217200165",
    ],
  },
  {
    id: "3747bcc0-ab02-4652-9dcf-d2c55f98f4d3",
    title: "Construyendo una Pokédex: de HTML a JS Vainilla a React",
    date: new Date(2024, 2, 13, 17),
    location: "Auditorio Gustavo Figueroa",
    description:
      "Ing. Abraham Hurtado presenta el proceso de construcción de una Pokédex desde cero en una conferencia con enfoque práctico.",
    type: "conference",
    presenters: ["Ing. Abraham Hurtado"],
    attendees: [
      "217200160",
      "217200161",
      "217200162",
      "217200163",
      "217200164",
      "217200165",
    ],
  },
  {
    id: "455da06b-6576-4fe9-98d0-66cd4a8f4838",
    title: "CSI PRO BrainTive",
    date: new Date(2024, 2, 14, 13),
    location: "Auditorio Gustavo Figueroa",
    description:
      "Miembros de CSI PRO de cuarto semestre presentan BrainTive, un proyecto que busca generar llaves digitales por medio de neurociencia.",
    type: "conference",
    presenters: [
      "Gael Borchardt Castellanos",
      "Jorge Duarte Ruiz",
      "Daniel Estrada Neri",
      "Kevin Haro Martínez",
    ],
    attendees: [
      "217200160",
      "217200161",
      "217200162",
      "217200163",
      "217200164",
      "217200165",
    ],
  },
];

const ACTIVE_EVENTS = [
  {
    id: "35f9e340-f1eb-43fc-9662-c5015ece5fda",
    title: "Introducción a React Native",
    date: new Date(2024, 4, 6, 13),
    location: "Auditorio Gustavo Figueroa",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec purus nec nunc tincidunt tincidunt. Nullam nec purus nec nunc tincidunt tincidunt.",
    type: "workshop",
    presenters: ["Ing. John Doe"],
    attendees: [],
  },
  {
    id: "e6227a3f-6e0b-486f-b9d6-b5c53990cf43",
    title: "Introducción a Next.js",
    date: new Date(2024, 4, 7, 13),
    location: "Auditorio Gustavo Figueroa",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec purus nec nunc tincidunt tincidunt. Nullam nec purus nec nunc tincidunt tincidunt.",
    type: "workshop",
    presenters: ["Ing. John Doe"],
    attendees: [],
  },
];

export const useEvents = () => {
  const { status, data, error, refetch } = useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      await sleep(1500);

      return ACTIVE_EVENTS.sort((a, b) => a.date.getTime() - b.date.getTime());
    },
  });

  return {
    status,
    data,
    error,
    refetch,
  };
};

export const usePastEvents = () => {
  const { status, data, error, refetch } = useQuery({
    queryKey: ["past-events"],
    queryFn: async () => {
      await sleep(1500);

      return PAST_EVENTS.sort((a, b) => b.date.getTime() - a.date.getTime());
    },
  });

  return {
    status,
    data,
    error,
    refetch,
  };
};

export const useEvent = (eventId: string) => {
  const queryClient = useQueryClient();

  const { status, data, error, refetch } = useQuery({
    queryKey: ["event", eventId],
    queryFn: async () => {
      await sleep(1500);

      return [...PAST_EVENTS, ...ACTIVE_EVENTS].find(
        (event) => event.id === eventId
      );
    },
  });

  const mutation = useMutation(async (unisonId: string) => {
    await sleep(1500);

    const event = [...PAST_EVENTS, ...ACTIVE_EVENTS].find(
      (event) => event.id === eventId
    );

    if (!event) {
      throw new Error("Event not found");
    }

    event.attendees.push(unisonId);
    queryClient.invalidateQueries(["events"]);
    queryClient.invalidateQueries(["event", eventId]);
  });

  return {
    status,
    data,
    error,
    refetch,
    mutation,
  };
};
