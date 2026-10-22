import { and, eq, isNull, sql } from "drizzle-orm";
import { db } from "../db/index.js";
import { loansTable } from "../db/schema/index.js";
import { ApiError } from "../utils/ApiError.js";
import type { AddLoanEntryInput } from "../validators/loan.validator.js";

export type Loan = typeof loansTable.$inferSelect;

export async function addLoanEntry(userId: number, input: AddLoanEntryInput): Promise<Loan> {
  const { friend_name, amount, due_date, lent_on } = input;

  const [loan] = await db
    .insert(loansTable)
    .values({
      user_id: userId,
      friend_name,
      amount,
      due_date,
      ...(lent_on ? { lent_on } : {}),
    })
    .returning();

  if (!loan) throw new ApiError(500, "Failed to create loan");
  return loan;
}

export async function repayLoan(userId: number, loanId: number): Promise<Loan> {
  // TODO: upload the receipt image to Cloudinary and save its URL in receipt_url
  const [loan] = await db
    .update(loansTable)
    .set({ repaid_at: sql`now()` })
    .where(
      and(
        eq(loansTable.id, loanId),
        eq(loansTable.user_id, userId),
        isNull(loansTable.repaid_at),
      ),
    )
    .returning();

  if (loan) return loan;

  const [existing] = await db
    .select({ id: loansTable.id })
    .from(loansTable)
    .where(and(eq(loansTable.id, loanId), eq(loansTable.user_id, userId)));

  if (!existing) throw new ApiError(404, "Loan not found");
  throw new ApiError(409, "Loan is already repaid");
}
