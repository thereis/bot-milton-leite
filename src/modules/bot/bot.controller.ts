import { autoInjectable } from "tsyringe";

import BotService from "./bot.service";

@autoInjectable()
export default class BotController {
  constructor(private botService: BotService) {
    process.once("SIGINT", () => this.botService.bot.stop("SIGINT"));
    process.once("SIGTERM", () => this.botService.bot.stop("SIGTERM"));
  }

  private loadCommands = async () => {
    return await this.botService.registerCommands();
  };

  private launch = async () => {
    this.botService.bot.launch();
  };

  load = async () => {
    console.log("Loading bot...");
    await this.loadCommands();
    await this.launch();
    console.log("Loaded!");
  };
}
