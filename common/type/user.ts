import { users } from "common/db/schema";


export type User = typeof users.$inferSelect;