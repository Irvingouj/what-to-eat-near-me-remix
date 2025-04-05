import { z } from "zod";
import { appConfig } from "./db/schema.js";
import { db } from "./db/index.js";

const appConfigZod = z.object({
    rateLimit: z.object({
        user: z.number(),
        ip: z.number(),
        window: z.number(),
    }),
});

type AppConfig = z.infer<typeof appConfigZod>;

const defaultConfig = {
    rateLimit: {
        user: 5,
        ip: 5,
        window: 60 * 60 * 1000,
    }
} as AppConfig;


let __config: AppConfig | undefined = undefined;

const initConfig = async () => {
    const config = await db.query.appConfig.findFirst();
    if (!config) {
        await db.insert(appConfig).values({
            config: defaultConfig,
        });

        __config = defaultConfig;
    }else {
        const parsedConfig = appConfigZod.parse(config.config);
        __config = parsedConfig;
    }
}

export const getConfig = () => {
    if (!__config) {
        initConfig();
    }
    return __config as AppConfig;
}