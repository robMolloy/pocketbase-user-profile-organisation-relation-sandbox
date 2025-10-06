import z from "zod";
import type { PocketBase } from "../auth/pocketbaseTypeHelpers";
import { extractMessageFromPbError } from "@/lib/pbUtils";

const collectionName = "organisations";
const organisationSchema = z.object({
  collectionId: z.string(),
  collectionName: z.literal(collectionName),
  id: z.string(),
  orgName: z.string(),
  userIds: z.array(z.string()),
  created: z.string(),
  updated: z.string(),
});

export type TOrganisation = z.infer<typeof organisationSchema>;
type TOrganisationCreateSeed = Pick<TOrganisation, "orgName" | "userIds">;

export const createOrganisation = async (p: { pb: PocketBase; data: TOrganisationCreateSeed }) => {
  try {
    const data = await p.pb.collection(collectionName).create(p.data);
    const messages = ["Successfully created organisation"];

    return { success: true, messages, data } as const;
  } catch (error) {
    const messagesResp = extractMessageFromPbError({ error });
    const messages = ["Failed to create organisation", ...(messagesResp ? messagesResp : [])];

    return { success: false, messages, error } as const;
  }
};

export const listOrganisations = async (p: { pb: PocketBase }) => {
  try {
    const initData = await p.pb.collection(collectionName).getFullList();

    const data = initData
      .map((x) => organisationSchema.safeParse(x))
      .filter((x) => x.success)
      .map((x) => x.data);
    return { success: true, data } as const;
  } catch (error) {
    return { success: false, error } as const;
  }
};

export const smartSubscribeToOrganisations = async (p: {
  pb: PocketBase;
  onChange: (x: TOrganisation[]) => void;
}) => {
  const listUsersResp = await listOrganisations(p);
  if (!listUsersResp.success) return listUsersResp;

  let allDocs = listUsersResp.data;
  p.onChange(allDocs);
  const unsub = p.pb.collection(collectionName).subscribe("*", (e) => {
    if (e.action === "create") {
      const parseResp = organisationSchema.safeParse(e.record);
      if (parseResp.success) allDocs.push(parseResp.data);
    }
    if (e.action === "update") {
      const parseResp = organisationSchema.safeParse(e.record);
      if (!parseResp.success) return;

      allDocs = allDocs.filter((x) => parseResp.data?.id !== x.id);
      allDocs.push(parseResp.data);
    }
    if (e.action === "delete") {
      const parseResp = organisationSchema.safeParse(e.record);
      if (!parseResp.success) return;

      allDocs = allDocs.filter((x) => parseResp.data?.id !== x.id);
    }
    p.onChange(allDocs);
  });

  return { success: true, data: unsub } as const;
};
