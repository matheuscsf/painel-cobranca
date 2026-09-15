import type { AgingBand } from "@/types/dashboard";

// Cores do selo de atraso por faixa de dias
export const AGING_STYLE: Record<AgingBand, string> = {
  "01-29": "bg-purple-100 text-purple-700",
  "30-60": "bg-purple-200 text-purple-800",
  "61-90": "bg-rose-100 text-rose-700",
  "91+":   "bg-rose-200 text-rose-800",
};
