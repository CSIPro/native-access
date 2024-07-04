import { useQuery } from "react-query";
import { z } from "zod";

import { useRoomContext } from "@/context/room-context";
import { NestError } from "@/lib/utils";

export const RoomStats = z.object({
  successful: z.number(),
  failed: z.number(),
  unknown: z.number(),
  wireless: z.number(),
  total: z.number(),
});

export type RoomStats = z.infer<typeof RoomStats>;

export const useRoomStats = () => {
  const { selectedRoom } = useRoomContext();

  const statsQuery = useQuery({
    queryKey: ["room-stats", selectedRoom],
    queryFn: async () => {
      const fromDate = new Date(new Date().setHours(0, 0, 0, 0));

      const res = await fetch(
        `http://148.225.50.130:3000/rooms/${selectedRoom}/stats?from=${fromDate}`
      );

      if (!res.ok) {
        const errorParse = NestError.safeParse(await res.json());

        if (errorParse.success) {
          throw new Error(errorParse.data.message);
        }

        throw new Error("An error occurred while fetching room stats");
      }

      const statsParse = RoomStats.safeParse(await res.json());

      if (!statsParse.success) {
        throw new Error("An error occurred while parsing room stats");
      }

      return statsParse.data;
    },
    refetchInterval: 10000,
  });

  return statsQuery;
};
