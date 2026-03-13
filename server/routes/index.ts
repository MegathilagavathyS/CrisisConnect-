import { type Express } from "express";
import chatRouter from "./chat";

export async function registerRoutes(app: Express) {
  app.use("/api", chatRouter);
  return app.listen(0);
}