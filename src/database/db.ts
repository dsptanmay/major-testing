import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema";
import postgres from "postgres";

export const client = postgres(process.env.DATABASE_URL, { prepare: false });
export const db = drizzle({ client, schema });
