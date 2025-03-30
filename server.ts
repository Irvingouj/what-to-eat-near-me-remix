import { createRequestHandler } from "@remix-run/express";
import type { ViteDevServer } from 'vite';
import type { ServerBuild } from "@remix-run/node";
import compression from "compression";
import express from "express";
import morgan from "morgan";
import apiRouter from './src/api';
import { startupCheck } from "./src/utils/startup";
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
  app.use('/api', (req, res, next) => {
    // Log API requests
    console.log(`API Request: ${req.method} ${req.url}`);
    next();
  }, apiRouter);

  // Remix handler comes last
  const remixHandler = createRequestHandler({
    build: viteDevServer
      ? () => {
          if (!viteDevServer) throw new Error('Vite server not initialized');
          return viteDevServer.ssrLoadModule("virtual:remix/server-build") as Promise<ServerBuild>;
        }
      : await import("./build/server/index.js") as unknown as ServerBuild,
  });

  // All other routes go to Remix
  app.all("*", remixHandler);

  const port = process.env.PORT || 3000;
  app.listen(port, () =>
    console.log(`Express server listening at http://localhost:${port}`)
  );
};

initServer().catch(console.error); 