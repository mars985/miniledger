import { Router } from "express";
import { addLoanEntry, getLoanSummary, repayLoan } from "../controllers/loan.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  addLoanEntrySchema,
  repayLoanSchema,
} from "../validators/loan.validator.js";

const router = Router();

router.use(authenticate);

router.post("/addLoanEntry", validate(addLoanEntrySchema), addLoanEntry);
// TODO: add multer middleware for the optional receipt image
router.post("/repayLoan", validate(repayLoanSchema), repayLoan);
router.get("/summary", getLoanSummary);

export default router;
