import { create } from "zustand";

type Plan = "online" | "offline";

interface PlanState {
	plan: Plan;
	setPlan: (plan: Plan) => void;
}

const store = create<PlanState>();
const usePlanStore = store((set) => ({
	plan: "online",
	setPlan: (plan) => set({ plan }),
}));

export default usePlanStore;
