import { H1 } from "@/components/custom/H1";
import { MainLayout } from "@/components/templates/LayoutTemplate";
import { pb } from "@/config/pocketbaseConfig";
import { CreateOrgForm } from "@/modules/organisations/CreateOrgForm";
import { useOrganisationsStore } from "@/modules/organisations/useOrganisationsStore";
import { LoggedInUserOnlyRoute } from "@/modules/routeProtector/LoggedInUserOnlyRoute";
import { LogScreen } from "@/screens/LogScreen";

export default function Page() {
  useOrganisationsStore;
  return (
    <LoggedInUserOnlyRoute>
      <MainLayout>
        <div className="flex flex-col gap-4">
          <H1>Create org form</H1>
          <CreateOrgForm pb={pb} />

          <H1>Create profile form</H1>
          <CreateOrgForm pb={pb} />
        </div>

        <LogScreen />
      </MainLayout>
    </LoggedInUserOnlyRoute>
  );
}
