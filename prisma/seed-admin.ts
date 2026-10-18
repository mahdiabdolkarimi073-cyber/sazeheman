import { PrismaClient } from "@prisma/client";
import { configDotenv } from "dotenv";

configDotenv({ quiet: true });

const prisma = new PrismaClient();

/**
 * Admin bootstrap / promotion script.
 *
 * Promotes an EXISTING user to admin role — never creates a new account,
 * never uses default credentials, and never touches arbitrary users.
 *
 * Usage:
 *   ADMIN_PHONE=09123456789 npm run prisma:seed-admin
 *
 * The user identified by ADMIN_PHONE must already exist in the database.
 * If the account does not exist, the script reports the error and exits
 * without making any changes.
 *
 * If the user already has the admin role, the script confirms and exits.
 */
async function main() {
  const rawPhone = process.env.ADMIN_PHONE?.trim();

  if (!rawPhone) {
    console.error("\n[ADMIN SEED] ERROR: ADMIN_PHONE environment variable is required.");
    console.error("[ADMIN SEED] Usage: ADMIN_PHONE=09123456789 npm run prisma:seed-admin\n");
    process.exit(1);
  }

  // Normalize: trim + collapse internal spaces (matches createOrUpdateUser's .trim()).
  const phone = String(rawPhone).trim().replace(/\s+/g, "");

  // Validate Iranian mobile format: 09XXXXXXXXX or +989XXXXXXXXX
  const valid = /^(09|\+989)\d{9}$/.test(phone);
  if (!valid) {
    console.error(`\n[ADMIN SEED] ERROR: Invalid phone format "${phone}".`);
    console.error("[ADMIN SEED] Expected format: 09123456789 or +989123456789\n");
    process.exit(1);
  }

  const user = await prisma.user.findUnique({
    where: { phone },
    select: { id: true, phone: true, role: true, status: true, nickname: true, first_name: true },
  });

  if (!user) {
    console.error(`\n[ADMIN SEED] ERROR: No user found with phone "${phone}".`);
    console.error("[ADMIN SEED] The user must register first through the normal signup flow.");
    console.error("[ADMIN SEED] After registration, re-run this script to promote the account.\n");
    process.exit(1);
  }

  if (user.role === "admin") {
    console.log(`\n[ADMIN SEED] User "${phone}" is already an admin. No changes needed.`);
    console.log(`[ADMIN SEED] User ID: ${user.id}`);
    console.log(`[ADMIN SEED] Status: ${user.status}\n`);
    return;
  }

  const updated = await prisma.user.update({
    where: { id: user.id },
    data: { role: "admin" },
    select: { id: true, phone: true, role: true, status: true },
  });

  console.log(`\n[ADMIN SEED] Successfully promoted user to admin.`);
  console.log(`[ADMIN SEED] Phone: ${updated.phone}`);
  console.log(`[ADMIN SEED] User ID: ${updated.id}`);
  console.log(`[ADMIN SEED] Role: ${updated.role}`);
  console.log(`[ADMIN SEED] Status: ${updated.status}\n`);
}

main()
  .catch((e) => {
    console.error("[ADMIN SEED] Unexpected error:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
