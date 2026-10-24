import { daysBetween, formatDate, todayISODate } from "@/lib/date";
import type { Loan } from "@/types/api";

export type LoanState = "repaid" | "overdue" | "due";

export function getLoanState(loan: Loan): LoanState {
  if (loan.repaid_at) return "repaid";
  if (loan.due_date && loan.due_date < todayISODate()) return "overdue";
  return "due";
}

export function getDueDescription(loan: Loan) {
  const state = getLoanState(loan);

  if (state === "repaid" && loan.repaid_at) return `Repaid on ${formatDate(loan.repaid_at)}`;
  if (!loan.due_date) return "No due date";

  const days = daysBetween(todayISODate(), loan.due_date);

  if (state === "overdue") return `Overdue by ${-days} ${-days === 1 ? "day" : "days"}`;
  if (days === 0) return "Due today";
  if (days === 1) return "Due tomorrow";
  return `Due ${formatDate(loan.due_date)}`;
}
