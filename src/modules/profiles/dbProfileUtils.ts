import z from "zod";
import type { PocketBase } from "../auth/pocketbaseTypeHelpers";
import { extractMessageFromPbError } from "@/lib/pbUtils";

const collectionName = "profiles";
const profileSchema = z.object({
  collectionId: z.string(),
  collectionName: z.literal(collectionName),
  id: z.string(),
  profileName: z.string(),
  orgIds: z.array(z.string()),
  userId: z.string(),
  created: z.string(),
  updated: z.string(),
});

export type TProfile = z.infer<typeof profileSchema>;
type TProfileCreateSeed = Omit<
  TProfile,
  "collectionId" | "collectionName" | "id" | "created" | "updated"
>;

export const createProfile = async (p: { pb: PocketBase; data: TProfileCreateSeed }) => {
  try {
    const data = await p.pb.collection(collectionName).create(p.data);
    const messages = ["Successfully created profile"];

    return { success: true, messages, data } as const;
  } catch (error) {
    const messagesResp = extractMessageFromPbError({ error });
    const messages = ["Failed to create profile", ...(messagesResp ? messagesResp : [])];

    return { success: false, messages, error } as const;
  }
};

export const listProfiles = async (p: { pb: PocketBase }) => {
  try {
    const initData = await p.pb.collection(collectionName).getFullList();

    const data = initData
      .map((x) => profileSchema.safeParse(x))
      .filter((x) => x.success)
      .map((x) => x.data);
    return { success: true, data } as const;
  } catch (error) {
    return { success: false, error } as const;
  }
};

export const smartSubscribeToProfiles = async (p: {
  pb: PocketBase;
  onChange: (x: TProfile[]) => void;
}) => {
  const listUsersResp = await listProfiles(p);
  if (!listUsersResp.success) return listUsersResp;

  let allDocs = listUsersResp.data;
  p.onChange(allDocs);
  const unsub = p.pb.collection(collectionName).subscribe("*", (e) => {
    if (e.action === "create") {
      const parseResp = profileSchema.safeParse(e.record);
      if (parseResp.success) allDocs.push(parseResp.data);
    }
    if (e.action === "update") {
      const parseResp = profileSchema.safeParse(e.record);
      if (!parseResp.success) return;

      allDocs = allDocs.filter((x) => parseResp.data?.id !== x.id);
      allDocs.push(parseResp.data);
    }
    if (e.action === "delete") {
      const parseResp = profileSchema.safeParse(e.record);
      if (!parseResp.success) return;

      allDocs = allDocs.filter((x) => parseResp.data?.id !== x.id);
    }
    p.onChange(allDocs);
  });

  return { success: true, data: unsub } as const;
};
