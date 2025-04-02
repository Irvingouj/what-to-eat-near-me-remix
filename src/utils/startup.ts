import { startupCheck as startupCheckDb } from "../../common/db/index.js";
const MUST_BE_SET_ENV = [
    "GOOGLE_CLIENT_ID",
    "GOOGLE_CLIENT_SECRET",
    "VITE_PUBLIC_APPLICATION_URL",
    "DATABASE_URL",
    "SESSION_SECRET"
];


export const startupCheck = async () => {
    await startupCheckDb();
    MUST_BE_SET_ENV.forEach((env) => {
        if (!process.env[env]) {
            console.error(`${env} is not set`);
            process.exit(1);
        }
    });
}