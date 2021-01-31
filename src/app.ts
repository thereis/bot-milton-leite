import "reflect-metadata";
import { container, injectable } from "tsyringe";

/**
 * Controllers
 */
import BotController from "./modules/bot/bot.controller";
import UOLMatchesController from "./modules/uol/matches/matches.controller";

@injectable()
class App {
  constructor(
    private uolMatchesController: UOLMatchesController,
    private botController: BotController
  ) {
    this.start();
  }

  loadControllers = async () => {
    await this.uolMatchesController.load();
    await this.botController.load();
  };

  start = async () => {
    await this.loadControllers();

    console.log("Milton Leite is ready!");
  };
}

container.resolve(App);
