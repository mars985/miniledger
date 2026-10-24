import type { Request, RequestHandler } from "express";
import * as loanService from "../services/loan.service.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import type {
  AddLoanEntryInput,
  ListLoansInput,
  RepayLoanInput,
} from "../validators/loan.validator.js";

function requireUserId(req: Request) {
  if (!req.user) throw new ApiError(401, "Unauthorized");
  return req.user.id;
}

export const addLoanEntry: RequestHandler = async (req, res) => {
  const userId = requireUserId(req);

  const loan = await loanService.addLoanEntry(userId, req.body as AddLoanEntryInput);

  res.status(201).json(new ApiResponse(201, loan, "Loan added"));
};

export const listLoans: RequestHandler = async (req, res) => {
  const userId = requireUserId(req);
  const { status } = req.query as unknown as ListLoansInput;

  const loans = await loanService.listLoans(userId, status);

  res.status(200).json(new ApiResponse(200, loans, "Loans"));
};

export const repayLoan: RequestHandler = async (req, res) => {
  const userId = requireUserId(req);
  const { id } = req.body as RepayLoanInput;

  const loan = await loanService.repayLoan(userId, id);

  res.status(200).json(new ApiResponse(200, loan, "Loan marked as repaid"));
};

export const getLoanSummary: RequestHandler = async (req, res) => {
  const userId = requireUserId(req);

  const summary = await loanService.getLoanSummary(userId);

  res.status(200).json(new ApiResponse(200, summary, "Loan summary"));
};
