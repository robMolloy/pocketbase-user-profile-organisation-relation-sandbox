import { TextInput } from "@/components/custom/CustomInputs";
import { Button } from "@/components/ui/button";
import type { PocketBase } from "@/modules/auth/pocketbaseTypeHelpers";
import { useState } from "react";
import { createOrganisation } from "./dbOrganisationUtils";
import {
  FormFeedbackMessages,
  useFormFeedbackMessages,
} from "../auth/formTemplates/FormFeedbackMessages";
import { useUsersStore } from "../auth/users/usersStore";

export const CreateOrgForm = (p: { pb: PocketBase }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [orgName, setOrgName] = useState("");
  const [userId, setUserId] = useState("");

  const formFeedback = useFormFeedbackMessages();

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

          const resp = await createOrganisation({ pb: p.pb, data: { orgName, userIds: [userId] } });
          const feedbackFn = resp.success ? formFeedback.showSuccess : formFeedback.showError;
          feedbackFn(resp.messages);

          setIsLoading(false);
        }}
      >
        <div>
          <label htmlFor="org-name">Org Name</label>
          <TextInput
            id="org-name"
            type="text"
            placeholder="Enter your org name"
            value={orgName}
            onInput={setOrgName}
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
