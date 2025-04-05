import 'dotenv/config';
import { createRequestHandler } from "@remix-run/express";
import type { ViteDevServer } from 'vite';
import type { ServerBuild } from "@remix-run/node";
import compression from "compression";
import express from "express";
import morgan from "morgan";
import apiRouter from './src/api/index.js';
import { startupCheck } from "./src/utils/startup.js";

let viteDevServer: ViteDevServer | undefined;

const initViteServer = async (): Promise<ViteDevServer | undefined> => {
  if (process.env.NODE_ENV === "production") {
    return undefined;
  }
  const vite = await import("vite");
  return vite.createServer({
    server: { middlewareMode: true },
  });
};

const initServer = async () => {
  viteDevServer = await initViteServer();

  const app = express();

  // Basic middleware
  app.use(compression());
  app.disable("x-powered-by");
  app.use(morgan("tiny"));
  app.use(express.json());


  // Static assets
  app.use(express.static("build/client", { maxAge: "1h" }));
  if (viteDevServer) {
    app.use(viteDevServer.middlewares);
  } else {
    app.use(
      "/assets",
      express.static("build/client/assets", { immutable: true, maxAge: "1y" })
    );
  }

  await startupCheck();

  // API routes must come before any static or Remix middleware
  app.use('/api', (req, _, next) => {
    // Log API requests
    console.log(`API Request: ${req.method} ${req.url}`);
    next();
  }, apiRouter);



  // the build output will have three folders: client, node, and server, this file will be in the node folder
  // so we need to import the server build from the node folder in production
  const importPath = process.env.NODE_ENV === "production" ? "../server/index.js" : "./index.js";

  // Remix handler comes last
  const remixHandler = createRequestHandler({
    build: viteDevServer
      ? () => {
          if (!viteDevServer) throw new Error('Vite server not initialized');
          return viteDevServer.ssrLoadModule("virtual:remix/server-build") as Promise<ServerBuild>;
        }
      // after build, the server build is in ./index.js relative to server.js
      // eslint-disable-next-line import/no-unresolved
      : await import(importPath) as unknown as ServerBuild,
  });

  // All other routes go to Remix
  app.all("*", remixHandler);

  const port = Number(process.env.PORT) || 3000;
  app.listen(port, '0.0.0.0', () =>
    console.log(`Express server listening at http://0.0.0.0:${port}`)
  );
};

initServer().catch(console.error); 