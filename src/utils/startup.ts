import { startupCheck as startupCheckDb } from "../../common/db/index.js";
const MUST_BE_SET_ENV = [
    "GOOGLE_CLIENT_ID",
    "GOOGLE_CLIENT_SECRET",
    "VITE_PUBLIC_APPLICATION_URL",
    "DATABASE_URL",
    "SESSION_SECRET"
];


export const startupCheck = async () => {
    try {
        for (const env of MUST_BE_SET_ENV) {
            if (!process.env[env]) {
                console.error(`${env} is not set`);
                process.exit(1);
            }
        }
        await startupCheckDb();
    } catch (error) {
        console.error('Startup check failed', error);
        process.exit(1);
    }

    console.log('Startup check passed');
}