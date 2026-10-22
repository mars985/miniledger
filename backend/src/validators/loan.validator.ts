import { z } from "zod";
import {
  MAX_FRIEND_NAME_LENGTH,
  MAX_LOAN_AMOUNT,
  MIN_FRIEND_NAME_LENGTH,
} from "../constants/loan.constants.js";

const today = () => new Date().toLocaleDateString("en-CA");

export const addLoanEntrySchema = z
  .object({
    friend_name: z.string().trim().min(MIN_FRIEND_NAME_LENGTH).max(MAX_FRIEND_NAME_LENGTH),
    amount: z.coerce.number().int().positive().max(MAX_LOAN_AMOUNT),
    due_date: z.iso.date(),
    lent_on: z.iso.date().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.lent_on && data.lent_on > today()) {
      ctx.addIssue({
        code: "custom",
        path: ["lent_on"],
        message: "lent_on can't be in the future",
      });
    }

    if (data.due_date < (data.lent_on ?? today())) {
      ctx.addIssue({
        code: "custom",
        path: ["due_date"],
        message: "due_date can't be before lent_on",
      });
    }
  });

export const repayLoanSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export type AddLoanEntryInput = z.infer<typeof addLoanEntrySchema>;
export type RepayLoanInput = z.infer<typeof repayLoanSchema>;
