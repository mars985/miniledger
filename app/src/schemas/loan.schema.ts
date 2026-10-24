import { z } from "zod";
import {
  MAX_FRIEND_NAME_LENGTH,
  MAX_LOAN_AMOUNT,
  MIN_FRIEND_NAME_LENGTH,
} from "@/constants/validation";
import { toISODate, todayISODate } from "@/lib/date";

export const addLoanSchema = z
  .object({
    friend_name: z
      .string()
      .trim()
      .min(MIN_FRIEND_NAME_LENGTH, "Enter your friend's name")
      .max(MAX_FRIEND_NAME_LENGTH, `Name can be at most ${MAX_FRIEND_NAME_LENGTH} characters`),
    amount: z
      .string()
      .trim()
      .regex(/^\d+$/, "Enter a whole number amount")
      .transform(Number)
      .pipe(
        z
          .number()
          .int()
          .positive("Amount must be more than 0")
          .max(MAX_LOAN_AMOUNT, "Amount is too large"),
      ),
    lent_on: z.date({ error: "Pick the date you lent the money" }),
    due_date: z.date({ error: "Pick a due date" }),
  })
  .superRefine((data, ctx) => {
    const lentOn = toISODate(data.lent_on);

    if (lentOn > todayISODate()) {
      ctx.addIssue({
        code: "custom",
        path: ["lent_on"],
        message: "Lent on can't be in the future",
      });
    }

    if (toISODate(data.due_date) < lentOn) {
      ctx.addIssue({
        code: "custom",
        path: ["due_date"],
        message: "Due date can't be before lent on",
      });
    }
  });

export type AddLoanFormInput = z.input<typeof addLoanSchema>;
