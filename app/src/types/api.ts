export interface ApiResponse<T> {
  statusCode: number;
  data: T;
  message: string;
  success: boolean;
}

export interface User {
  id: number;
  name: string;
  phone: string;
}

export interface AuthSession {
  user: User;
  token: string;
}

export interface Loan {
  id: number;
  created_at: string;
  user_id: number;
  friend_name: string;
  amount: number;
  lent_on: string;
  due_date: string | null;
  repaid_at: string | null;
  receipt_url: string | null;
}

export interface NewLoan {
  friend_name: string;
  amount: number;
  lent_on: string;
  due_date: string;
}

export interface LoanSummary {
  total_lent: number;
  total_repaid: number;
  overdue_amount: number;
}

export type LoanStatus = "all" | "unpaid" | "repaid";
