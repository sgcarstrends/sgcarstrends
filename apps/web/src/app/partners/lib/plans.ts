// Client-safe plan definitions (no server env vars)
export const PLANS = {
  starter: {
    name: "Starter",
    price: 29, // S$29
    description: "1 placement, 30 days",
  },
  growth: {
    name: "Growth",
    price: 79, // S$79
    description: "2 placements, 30 days",
  },
  premium: {
    name: "Premium",
    price: 149, // S$149
    description: "All placements, 30 days, priority support",
  },
} as const;

export type PlanKey = keyof typeof PLANS;
