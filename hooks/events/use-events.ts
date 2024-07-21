import Constants from "expo-constants";
import { NestError, sleep } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { z } from "zod";
import { NestRoom } from "../use-rooms";
import { NestUser } from "../use-user-data";
import { firebaseAuth } from "@/lib/firebase-config";

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

export const EventAttendee = z.object({
  id: z.string().uuid(),
  eventId: z.string().uuid(),
  userId: z.string().uuid().optional().nullable(),
  unisonId: z.string().max(9).nullable(),
  enrolled: z.string().datetime({ offset: true }).nullable(),
  verified: z.string().datetime({ offset: true }).nullable(),
  createdAt: z.string().datetime({ offset: true }),
  updatedAt: z.string().datetime({ offset: true }),
  user: NestUser.partial().nullable().optional(),
});

export type EventAttendee = z.infer<typeof EventAttendee>;

export const EventTypes = z.enum(
  [
    "conference",
    "workshop",
    "hackathon",
    "seminar",
    "webinar",
    "csipro_talks",
    "csipro_workshop",
    "csipro_insights",
  ],
  { required_error: "El tipo de evento es obligatorio" }
);

export type EventTypes = z.infer<typeof EventTypes>;

export const eventTypesLabels: Record<keyof typeof EventTypes.enum, string> = {
  conference: "Conferencia",
  workshop: "Taller",
  hackathon: "Hackatón",
  seminar: "Seminario",
  webinar: "Webinario",
  csipro_talks: "CSI PRO Talks",
  csipro_workshop: "CSI PRO Workshop",
  csipro_insights: "CSI PRO Insights",
};

export const Event = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string().nullable().optional(),
  eventStart: z.string().datetime({ offset: true }),
  eventEnd: z.string().datetime({ offset: true }),
  eventType: EventTypes,
  eventSchedule: z.object({}).nullable(),
  participants: z.array(z.string()).nullable(),
  spots: z.number(),
  createdAt: z.string().datetime({ offset: true }),
  updatedAt: z.string().datetime({ offset: true }),
  room: NestRoom.partial(),
  owner: NestUser.partial(),
});

export type Event = z.infer<typeof Event>;

interface UseEventsProps {
  past?: boolean;
  limit?: number;
}

export const useEvents = ({
  past = false,
  limit = 20,
}: UseEventsProps = {}) => {
  const apiUrl = Constants.expoConfig.extra?.authApiUrl;
  const authUser = firebaseAuth.currentUser;

  const { status, data, error, refetch } = useQuery({
    queryKey: ["events", { past, limit }],
    queryFn: async () => {
      const authToken = await authUser?.getIdToken();

      const res = await fetch(
        `${apiUrl}/events?past=${past ? "true" : "false"}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (!res.ok) {
        const error = NestError.safeParse(await res.json());

        if (error.success) {
          throw new Error(error.data.message);
        }

        throw new Error("Couldn't fetch events");
      }

      const eventsParse = Event.array().safeParse(await res.json());

      if (!eventsParse.success) {
        console.log(eventsParse.error);

        throw new Error("Couldn't parse events");
      }

      return eventsParse.data;
    },
    refetchInterval: 30000,
    retryDelay: 10000,
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
  const apiUrl = Constants.expoConfig.extra?.authApiUrl;
  const authUser = firebaseAuth.currentUser;
  const queryClient = useQueryClient();

  const { status, data, error, refetch } = useQuery({
    queryKey: ["event", eventId],
    queryFn: async () => {
      const authToken = await authUser?.getIdToken();

      const eventRes = await fetch(`${apiUrl}/events/${eventId}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      const attendeesRes = await fetch(
        `${apiUrl}/events/${eventId}/attendees`,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );

      if (!eventRes.ok) {
        const error = NestError.safeParse(await eventRes.json());

        if (error.success) {
          throw new Error(error.data.message);
        }

        throw new Error("Couldn't fetch event");
      }

      if (!attendeesRes.ok) {
        const error = NestError.safeParse(await attendeesRes.json());

        if (error.success) {
          throw new Error(error.data.message);
        }

        throw new Error("Couldn't fetch attendees");
      }

      const eventData = await eventRes.json();
      const attendeesData = await attendeesRes.json();

      const eventParse = Event.safeParse(eventData);
      const attendeesParse = EventAttendee.array().safeParse(attendeesData);

      if (!eventParse.success) {
        console.log(eventParse.error);

        throw new Error("Couldn't parse event");
      }

      if (!attendeesParse.success) {
        console.log(attendeesParse.error);

        throw new Error("Couldn't parse attendees");
      }

      return { event: eventParse.data, attendees: attendeesParse.data };
    },
  });

  const addAttendee = useMutation(async (unisonId: string) => {
    const authToken = await authUser?.getIdToken();

    const res = await fetch(`${apiUrl}/events/${eventId}/add-attendee`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({ unisonId }),
    });

    if (!res.ok) {
      const error = NestError.safeParse(await res.json());

      if (error.success) {
        console.log(error.data.message);

        throw new Error(error.data.message);
      }

      throw new Error("Couldn't add attendee");
    }

    queryClient.invalidateQueries(["events"]);
    queryClient.invalidateQueries(["event", eventId]);
  });

  return {
    status,
    data,
    error,
    refetch,
    addAttendee,
  };
};

export const EventForm = z.object({
  name: z
    .string({ required_error: "El nombre del evento es obligatorio" })
    .max(200, {
      message: "El nombre del evento no puede exceder 200 caracteres",
    })
    .min(1, {
      message: "El nombre del evento no puede estar vacío",
    }),
  description: z.string().nullable().optional(),
  eventStart: z.date(),
  eventEnd: z.date(),
  eventType: EventTypes,
  roomId: z
    .string({
      required_error: "El lugar del evento es obligatorio",
    })
    .uuid(),
  spots: z
    .number({ required_error: "La disponibilidad es obligatoria" })
    .min(1, { message: "La disponibilidad debe ser mayor a 0" }),
  participants: z.array(
    z.object({
      name: z.string().max(75, {
        message:
          "El nombre de los participantes no debe exceder de 75 caracteres",
      }),
    })
  ),
});

export type EventForm = z.infer<typeof EventForm>;

export const useSubmitEvent = () => {
  const apiUrl = Constants.expoConfig.extra?.authApiUrl;
  const queryClient = useQueryClient();
  const authUser = firebaseAuth.currentUser;

  const mutation = useMutation(async (data: Event) => {
    const authToken = await authUser?.getIdToken();

    if (!authToken) {
      throw new Error("Ocurrió un error de autenticación");
    }

    const res = await fetch(`${apiUrl}/events`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const error = NestError.safeParse(await res.json());

      if (error.success) {
        throw new Error(error.data.message);
      }

      throw new Error("No fue posible crear el evento");
    }

    queryClient.invalidateQueries(["events"]);
  });

  return mutation;
};
