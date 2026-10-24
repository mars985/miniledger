import { api } from "@/lib/api";
import type { ApiResponse, Loan, LoanStatus, LoanSummary, NewLoan } from "@/types/api";

export async function getLoans(status: LoanStatus, signal?: AbortSignal) {
  const { data } = await api.get<ApiResponse<Loan[]>>("/loans", { params: { status }, signal });
  return data.data;
}

export async function getLoanSummary(signal?: AbortSignal) {
  const { data } = await api.get<ApiResponse<LoanSummary>>("/loans/summary", { signal });
  return data.data;
}

export async function addLoan(loan: NewLoan) {
  const { data } = await api.post<ApiResponse<Loan>>("/loans/addLoanEntry", loan);
  return data.data;
}

export async function repayLoan(id: number) {
  const { data } = await api.post<ApiResponse<Loan>>("/loans/repayLoan", { id });
  return data.data;
}
