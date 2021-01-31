import "reflect-metadata";
import { container, injectable } from "tsyringe";

/**
 * Controllers
 */
import BotController from "./modules/bot/bot.controller";
import UOLMatchesController from "./modules/uol/matches/matches.controller";
import HealthCheckController from "./modules/health-check/health-check.controller";

@injectable()
class App {
  constructor(
    private uolMatchesController: UOLMatchesController,
    private botController: BotController,
    private healthCheckController: HealthCheckController
  ) {
    this.start();
  }

  loadControllers = async () => {
    await this.uolMatchesController.load();
    await this.botController.load();
    await this.healthCheckController.load();
  };

  start = async () => {
    await this.loadControllers();

    console.log("Milton Leite is ready!");
  };
}

container.resolve(App);
