"use client";

import { Button } from "@heroui/button";
import { Input, Textarea } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import {
  createCampaign,
  type CampaignActionState,
} from "@web/app/partners/actions/campaigns";
import { authClient } from "@web/app/partners/lib/auth-client";
import { PLANS } from "@web/app/partners/lib/plans";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";

const placementTypes = [
  { value: "floating-banner", label: "Floating Banner", description: "Bottom of all pages" },
  { value: "pinned-card", label: "Pinned Card", description: "Sidebar on data pages" },
  { value: "in-feed", label: "In-Feed Card", description: "Home page bento grid" },
];

const plans = Object.entries(PLANS).map(([value, plan]) => ({
  value,
  label: plan.name,
  price: `S$${plan.price}/month`,
}));

const initialState: CampaignActionState = {};

export function CampaignForm() {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(createCampaign, initialState);

  useEffect(() => {
    if (state.success && state.campaignId && state.plan) {
      toast.success("Redirecting to payment...");
      authClient.subscription.upgrade({
        plan: state.plan,
        successUrl: `/partners/campaigns/${state.campaignId}`,
        cancelUrl: "/partners/campaigns/create",
        metadata: {
          campaignId: state.campaignId,
        },
      });
    }
  }, [state.success, state.campaignId, state.plan]);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {state.errors?._form && (
        <div className="rounded-lg bg-danger-50 p-3 text-danger-700 text-sm">
          {state.errors._form[0]}
        </div>
      )}

      <Input
        name="name"
        label="Campaign Name"
        placeholder="Summer Sale Campaign"
        isRequired
        isInvalid={!!state.errors?.name}
        errorMessage={state.errors?.name?.[0]}
      />

      <Select
        name="placementType"
        label="Placement Type"
        placeholder="Select placement"
        isRequired
        isInvalid={!!state.errors?.placementType}
        errorMessage={state.errors?.placementType?.[0]}
      >
        {placementTypes.map((type) => (
          <SelectItem key={type.value} textValue={type.label}>
            <div className="flex flex-col">
              <span>{type.label}</span>
              <span className="text-default-400 text-xs">{type.description}</span>
            </div>
          </SelectItem>
        ))}
      </Select>

      <Input
        name="destinationUrl"
        label="Destination URL"
        placeholder="https://yoursite.com/landing"
        type="url"
        isRequired
        isInvalid={!!state.errors?.destinationUrl}
        errorMessage={state.errors?.destinationUrl?.[0]}
      />

      <Textarea
        name="altText"
        label="Alt Text"
        placeholder="Describe your ad for accessibility"
        isInvalid={!!state.errors?.altText}
        errorMessage={state.errors?.altText?.[0]}
      />

      <Select
        name="plan"
        label="Plan"
        placeholder="Select a plan"
        isRequired
        isInvalid={!!state.errors?.plan}
        errorMessage={state.errors?.plan?.[0]}
      >
        {plans.map((plan) => (
          <SelectItem key={plan.value} textValue={plan.label}>
            <div className="flex items-center justify-between">
              <span>{plan.label}</span>
              <span className="text-default-400 text-sm">{plan.price}</span>
            </div>
          </SelectItem>
        ))}
      </Select>

      <div className="grid grid-cols-2 gap-4">
        <Input
          name="startDate"
          label="Start Date"
          type="date"
          isRequired
          isInvalid={!!state.errors?.startDate}
          errorMessage={state.errors?.startDate?.[0]}
        />
        <Input
          name="endDate"
          label="End Date"
          type="date"
          isRequired
          isInvalid={!!state.errors?.endDate}
          errorMessage={state.errors?.endDate?.[0]}
        />
      </div>

      {/* TODO: Add image upload component */}
      <Input
        name="imageUrl"
        label="Creative Image URL"
        placeholder="https://example.com/image.jpg"
        description="Image upload coming soon. For now, provide a direct URL."
        isRequired
        isInvalid={!!state.errors?.imageUrl}
        errorMessage={state.errors?.imageUrl?.[0]}
      />

      <div className="flex justify-end gap-3 pt-4">
        <Button
          type="button"
          variant="light"
          onPress={() => router.back()}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          color="primary"
          isLoading={pending}
        >
          {pending ? "Creating..." : "Create Campaign"}
        </Button>
      </div>
    </form>
  );
}
