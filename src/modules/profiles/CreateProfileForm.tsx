import { TextInput } from "@/components/custom/CustomInputs";
import { Button } from "@/components/ui/button";
import type { PocketBase } from "@/modules/auth/pocketbaseTypeHelpers";
import { useState } from "react";
import {
  FormFeedbackMessages,
  useFormFeedbackMessages,
} from "../auth/formTemplates/FormFeedbackMessages";
import { createProfile } from "./dbProfileUtils";
import { useOrganisationsStore } from "../organisations/useOrganisationsStore";
import { useUsersStore } from "../auth/users/usersStore";

export const CreateProfileForm = (p: { pb: PocketBase }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [profileName, setProfileName] = useState("");
  const [orgId, setOrgId] = useState("");
  const [userId, setUserId] = useState("");

  const formFeedback = useFormFeedbackMessages();
  const organisationsStore = useOrganisationsStore();
  const usersStore = useUsersStore();

  return (
    <div className="flex flex-col gap-4">
      {formFeedback.messages && formFeedback.status && (
        <FormFeedbackMessages messages={formFeedback.messages} status={formFeedback.status} />
      )}
      <form
        className="flex flex-col gap-4"
        onSubmit={async (e) => {
          e.preventDefault();
          if (isLoading) return;
          setIsLoading(true);

          const resp = await createProfile({
            pb: p.pb,
            data: {
              profileName,
              orgIds: [orgId],
              userId,
            },
          });
          const feedbackFn = resp.success ? formFeedback.showSuccess : formFeedback.showError;
          feedbackFn(resp.messages);

          setIsLoading(false);
        }}
      >
        <div>
          <label htmlFor="profile-name">Profile Name</label>
          <TextInput
            id="profile-name"
            type="text"
            placeholder="Enter your org name"
            value={profileName}
            onInput={setProfileName}
          />
        </div>
        <div>
          <label htmlFor="Org-id">Org ID</label>
          <TextInput
            id="Org-id"
            type="text"
            placeholder="Enter your Org ID"
            value={orgId}
            onInput={setOrgId}
          />
        </div>
        <div>
          <label htmlFor="user-id">User ID</label>
          <TextInput
            id="user-id"
            type="text"
            placeholder="Enter your user ID"
            value={userId}
            onInput={setUserId}
          />
        </div>
        <div className="flex justify-end gap-4">
          <Button type="submit">Submit</Button>
        </div>
      </form>
      <div>
        Organisations
        <div className="flex flex-wrap gap-4">
          {organisationsStore.data.map((org) => (
            <Button key={org.id} onClick={() => setOrgId(org.id)}>
              {org.orgName}
            </Button>
          ))}
        </div>
        <br />
        Users
        <div className="flex flex-wrap gap-4">
          {usersStore.data.map((user) => (
            <Button key={user.id} onClick={() => setUserId(user.id)}>
              {user.name}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};
