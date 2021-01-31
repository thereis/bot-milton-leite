import { singleton } from "tsyringe";

import express from "express";

@singleton()
export default class HealthCheckController {
  private app = express();

  private routes = () => {
    this.app.get("/", ({ res }) => res?.send("Alive!"));
  };

  load = async () => {
    console.log("Loading health check...");
    this.routes();

    this.app.listen(8080);
    console.log("Loaded!");
  };
}
