import { singleton } from "tsyringe";
import { Telegraf } from "telegraf";

import UOLMatchesController from "../uol/matches/matches.controller";

@singleton()
export default class BotService {
  bot = new Telegraf(process.env.TELEGRAM_API_KEY!, { telegram: {} });

  constructor(private uolMatchesController: UOLMatchesController) {}

  registerCommands = async () => {
    this.bot.command("hoje", async (ctx) => {
      await ctx.replyWithChatAction("typing");

      ctx.reply(this.uolMatchesController.getTodayMatches(), {
        parse_mode: "HTML",
      });
    });

    this.bot.command("proximas_partidas", async (ctx) => {
      await ctx.replyWithChatAction("typing");

      ctx.reply(this.uolMatchesController.getUpcomingMatches(), {
        parse_mode: "HTML",
      });
    });

    // Under construction
    this.bot.command("narrar", async (ctx) => {
      await ctx.replyWithChatAction("typing");

      //   UOLBotService.watchMatch(113149, (message: string) => ctx.reply(message));
    });
  };
}
