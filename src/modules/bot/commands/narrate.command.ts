import { Context, Markup } from "telegraf";
import { autoInjectable, delay, inject, singleton } from "tsyringe";
import { LEAGUES } from "../../uol/constants";

import chunk from "lodash/chunk";

import UOLMatchesService from "../../uol/matches/matches.service";
import BotService from "../bot.service";
import { CallbackQuery } from "telegraf/typings/telegram-types";
import UOLLiveMatchService from "../../uol/live/live.service";
import UOLMatchesController from "../../uol/matches/matches.controller";

@autoInjectable()
export default class BotNarrateCommand {
  constructor(
    @inject(delay(() => BotService)) private botService: BotService,
    private uolMatchesService: UOLMatchesService,
    private uolMatchesController: UOLMatchesController
  ) {}

  options = () => {
    return this.uolMatchesService
      .filterByIdCompeticao(LEAGUES.BRASILEIRAO)
      .filterByTodayMatches()
      .getMatches()
      .map(({ id, time1, time2 }) =>
        Markup.button.callback(
          `${time1["nome-completo"]} x ${time2["nome-completo"]}`,
          JSON.stringify({ action: "watch", id })
        )
      );
  };

  execute = async (ctx: Context) => {
    await ctx.replyWithChatAction("typing");

    await ctx.reply(
      "Qual partida você gostaria de acompanhar?",
      Markup.inlineKeyboard(chunk(this.options(), 1))
    );

    try {
      await ctx.deleteMessage();
    } catch (e) {}
  };

  watch = async (ctx: Context) => {
    const { data } = ctx.callbackQuery as CallbackQuery.DataCallbackQuery;
    const { id } = JSON.parse(data);

    ctx.telegram.answerCbQuery(
      ctx.callbackQuery?.id!,
      "Preparando conteúdo..."
    );

    ctx.deleteMessage(ctx.callbackQuery?.message?.message_id!);

    await this.uolMatchesController.watchMatch(+id, (message: string) =>
      ctx.reply(message)
    );
  };
}
