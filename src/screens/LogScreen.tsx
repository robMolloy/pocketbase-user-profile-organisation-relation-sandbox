import { useCurrentUserStore } from "@/modules/auth/authDataStore";
import { useOrganisationsStore } from "@/modules/organisations/useOrganisationsStore";

export const LogScreen = () => {
  const currentUserStore = useCurrentUserStore();
  const organisationsStore = useOrganisationsStore();

  return (
    <pre>
      {JSON.stringify(
        {
          currentUserStore,
          organisationsStore,
        },
        undefined,
        2,
      )}
    </pre>
  );
};
