/**
 * Page-specific context explanations for international visitors
 */
export const PAGE_CONTEXTS = {
  coe: {
    title: "What is COE?",
    content: `The **Certificate of Entitlement (COE)** is a permit required to register a vehicle in Singapore. COEs are obtained through a quota-based bidding system where the government controls supply to manage road congestion.

Each COE is valid for **10 years**, after which you must either renew at the Prevailing Quota Premium (PQP) or deregister the vehicle.`,
  },
  pqp: {
    title: "What is PQP?",
    content: `The **Prevailing Quota Premium (PQP)** is the 3-month moving average of COE prices. Vehicle owners can renew their COE at the PQP rate for either 5 or 10 years, without participating in the bidding process.

This provides a predictable renewal cost based on recent market rates.`,
  },
  cars: {
    title: "What is this data?",
    content: `This shows **new vehicle registrations** in Singapore, broken down by fuel type (Petrol, Electric, Hybrid, Diesel) and vehicle type (Hatchback, Sedan, SUV, etc.).

Data is sourced monthly from the **Land Transport Authority (LTA)**.`,
  },
  deregistrations: {
    title: "What is deregistration?",
    content: `When a vehicle's COE expires or an owner chooses to scrap or export their car, it must be **deregistered**. This data tracks vehicles leaving Singapore's roads.

It provides insights into fleet turnover and the impact of the 10-year COE lifecycle.`,
  },
  parf: {
    title: "What is PARF?",
    content: `The **Preferential Additional Registration Fee (PARF)** rebate is given when you deregister a vehicle before its COE expires. The rebate is a percentage of the Additional Registration Fee (ARF) paid, decreasing as the vehicle ages.

**Budget 2026 Changes (effective Feb 2026):** Rebate percentages cut by 45 percentage points across all brackets, and the cap halved from $60,000 to $30,000.`,
  },
} as const;
