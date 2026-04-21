"use client";

import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import type { SelectAdvertiser } from "@sgcarstrends/database";
import {
  updateProfile,
  type ProfileActionState,
} from "@web/app/partners/actions/settings";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";

interface AccountSettingsFormProps {
  advertiser: SelectAdvertiser | undefined;
  userEmail: string;
}

const initialState: ProfileActionState = {};

export function AccountSettingsForm({
  advertiser,
  userEmail,
}: AccountSettingsFormProps) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(updateProfile, initialState);

  useEffect(() => {
    if (state.success) {
      toast.success(advertiser ? "Profile updated" : "Profile created");
      router.refresh();
    }
  }, [state.success, advertiser, router]);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {state.errors?._form && (
        <div className="rounded-lg bg-danger-50 p-3 text-danger-700 text-sm">
          {state.errors._form[0]}
        </div>
      )}

      <Input
        name="companyName"
        label="Company Name"
        placeholder="Your Company Ltd"
        defaultValue={advertiser?.companyName}
        isRequired
        isInvalid={!!state.errors?.companyName}
        errorMessage={state.errors?.companyName?.[0]}
      />

      <Input
        name="contactName"
        label="Contact Name"
        placeholder="John Smith"
        defaultValue={advertiser?.contactName}
        isRequired
        isInvalid={!!state.errors?.contactName}
        errorMessage={state.errors?.contactName?.[0]}
      />

      <Input
        name="contactEmail"
        label="Contact Email"
        type="email"
        placeholder="john@company.com"
        defaultValue={advertiser?.contactEmail || userEmail}
        isRequired
        isInvalid={!!state.errors?.contactEmail}
        errorMessage={state.errors?.contactEmail?.[0]}
      />

      <Input
        name="website"
        label="Website"
        type="url"
        placeholder="https://yourcompany.com"
        defaultValue={advertiser?.website || ""}
        isInvalid={!!state.errors?.website}
        errorMessage={state.errors?.website?.[0]}
      />

      <div className="flex justify-end pt-4">
        <Button type="submit" color="primary" isLoading={pending}>
          {pending ? "Saving..." : advertiser ? "Update Profile" : "Create Profile"}
        </Button>
      </div>
    </form>
  );
}
