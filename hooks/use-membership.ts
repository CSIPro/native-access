import { z } from "zod";

import { NestRole } from "./use-roles";
import { NestRoom } from "./use-rooms";
import { useQuery } from "react-query";
import { firebaseAuth } from "@/lib/firebase-config";
import { BASE_API_URL, NestError } from "@/lib/utils";

export const Membership = z.object({
  id: z.string(),
  canAccess: z.boolean(),
  userId: z.string(),
  role: NestRole.partial(),
  room: NestRoom.partial(),
});

export type Membership = z.infer<typeof Membership>;

export const useMemberships = (userId: string) => {
  const authUser = firebaseAuth.currentUser;

  const membershipsQuery = useQuery({
    queryKey: ["memberships", userId],
    queryFn: async () => {
      if (!authUser || !userId) {
        throw new Error("No user found");
      }

      const res = await fetch(`${BASE_API_URL}/users/${userId}/memberships`, {
        headers: {
          Authorization: `Bearer ${await authUser?.getIdToken()}`,
        },
      });

      if (!res.ok) {
        const errorParse = NestError.safeParse(await res.json());

        if (errorParse.success) {
          throw new Error(errorParse.data.message);
        }

        throw new Error("An error occurred while fetching memberships");
      }

      const membershipsParse = Membership.array().safeParse(await res.json());

      if (!membershipsParse.success) {
        throw new Error("An error occurred while parsing memberships");
      }

      return membershipsParse.data;
    },
    refetchInterval: 20000,
  });

  return membershipsQuery;
};
