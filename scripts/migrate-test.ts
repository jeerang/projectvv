import { execSync } from "child_process";

const testDbUrl = "postgresql://app:app@localhost:5433/app_test";

console.log("Applying Prisma migrations to test database on port 5433...");
execSync("npx prisma migrate deploy", {
  stdio: "inherit",
  env: {
    ...process.env,
    DATABASE_URL: testDbUrl,
    DIRECT_URL: testDbUrl,
  },
});
