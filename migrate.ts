import { migrate } from "drizzle-orm/postgres-js/migrator";
import { connection, db } from "./src/lib/db/db";

(async () => {
  await migrate(db, { migrationsFolder: "./drizzle" });
  await connection.end();
})();
