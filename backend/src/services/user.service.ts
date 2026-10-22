import { randomInt } from "node:crypto";
import { and, eq, gt } from "drizzle-orm";
import { db } from "../db/index.js";
import { otpsTable, usersTable } from "../db/schema/index.js";
import { OTP_EXPIRY_MS, OTP_LENGTH } from "../constants/user.constants.js";
import { ApiError } from "../utils/ApiError.js";
import { signToken } from "../utils/jwt.js";

export type User = typeof usersTable.$inferSelect;

type Executor = Pick<typeof db, "delete">;

export async function findUserById(id: number): Promise<User | null> {
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, id));
  return user ?? null;
}

export async function findUserByPhone(phone: string): Promise<User | null> {
  const [user] = await db.select().from(usersTable).where(eq(usersTable.phone, phone));
  return user ?? null;
}

export const generateOTP = function () {
  return randomInt(0, 10 ** OTP_LENGTH).toString().padStart(OTP_LENGTH, "0");
};

export async function sendOtp(phone: string) {
  const code = generateOTP();
  const expires_at = new Date(Date.now() + OTP_EXPIRY_MS);

  await db
    .insert(otpsTable)
    .values({ phone, code, expires_at })
    .onConflictDoUpdate({ target: otpsTable.phone, set: { code, expires_at } });

  console.log(`[OTP] ${phone}: ${code}`);
}

async function consumeOtp(executor: Executor, phone: string, code: string) {
  const deleted = await executor
    .delete(otpsTable)
    .where(
      and(
        eq(otpsTable.phone, phone),
        eq(otpsTable.code, code),
        gt(otpsTable.expires_at, new Date()),
      ),
    )
    .returning({ phone: otpsTable.phone });

  if (deleted.length === 0) throw new ApiError(400, "Invalid or expired OTP");
}

function isUniqueViolation(err: unknown) {
  const code = (err as { code?: string; cause?: { code?: string } })?.cause?.code
    ?? (err as { code?: string })?.code;
  return code === "23505";
}

export async function register(phone: string, name: string, otp: string) {
  if (await findUserByPhone(phone)) {
    throw new ApiError(409, "Phone is already registered");
  }

  let user: User;
  try {
    user = await db.transaction(async (tx) => {
      await consumeOtp(tx, phone, otp);
      const [created] = await tx.insert(usersTable).values({ phone, name }).returning();
      if (!created) throw new ApiError(500, "Failed to create user");
      return created;
    });
  } catch (err) {
    if (isUniqueViolation(err)) throw new ApiError(409, "Phone is already registered");
    throw err;
  }

  return { user, token: signToken({ id: user.id }) };
}

export async function login(phone: string, otp: string) {
  const user = await findUserByPhone(phone);
  if (!user) throw new ApiError(404, "No account found for this phone");

  await consumeOtp(db, phone, otp);

  return { user, token: signToken({ id: user.id }) };
}
