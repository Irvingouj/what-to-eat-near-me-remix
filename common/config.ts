import { z } from "zod";
import { appConfig } from "./db/schema.js";
import { db } from "./db/index.js";

const appConfigZod = z.object({
    rateLimit: z.array(z.object({
        path: z.string(),
        user: z.number(),
        ip: z.number(),
        window: z.number(),
    })),
    defaultRateLimit: z.object({
        user: z.number(),
        ip: z.number(),
        window: z.number(),
    }),
});

type AppConfig = z.infer<typeof appConfigZod>;

const defaultConfig = {
    rateLimit: [
        {
            path: '/nearby',
            user: 5,
            ip: 5,
            window: 60 * 60 * 1000,
        }
    ],
    defaultRateLimit: {
        user: 5,
        ip: 5,
        window: 60 * 60 * 1000,
    }
} as AppConfig;


let __config: AppConfig | undefined = undefined;

const initConfig = async () => {
    const insertDefaultConfig = async () => {
        await db.insert(appConfig).values({
            config: defaultConfig,
        });

        __config = defaultConfig;
    }

    const config = await db.query.appConfig.findFirst();
    //delete all old configs
    await db.delete(appConfig)

    if (!config) {
        return await insertDefaultConfig();
    }

    const parsedConfig = appConfigZod.safeParse(config?.config);
    if (!parsedConfig.success) {
        return await insertDefaultConfig();
    }

    __config = parsedConfig.data;
}

export const getConfig = async () => {
    if (!__config) {
        await initConfig();
    }
    return __config as AppConfig;
}