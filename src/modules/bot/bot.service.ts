import { singleton } from "tsyringe";
import { Markup, session, Telegraf } from "telegraf";

import UOLMatchesController from "../uol/matches/matches.controller";
import BotNarrateCommand from "./commands/narrate.command";

@singleton()
export default class BotService {
  bot = new Telegraf(process.env.TELEGRAM_API_KEY!);

  constructor(
    private uolMatchesController: UOLMatchesController,
    private botNarrateCommand: BotNarrateCommand
  ) {}

  registerMiddleWares = async () => {
    this.bot.use(session());
  };

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

    this.bot.command("narrar", this.botNarrateCommand.execute);
    this.bot.command("parar", this.botNarrateCommand.stop);
    this.bot.action(/watch/g, this.botNarrateCommand.watch);
  };
}
