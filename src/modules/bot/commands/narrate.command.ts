import { Context, Markup } from "telegraf";
import { autoInjectable, delay, inject, singleton } from "tsyringe";
import { LEAGUES } from "../../uol/constants";

import chunk from "lodash/chunk";

import UOLMatchesService from "../../uol/matches/matches.service";
import UOLLiveMatchesController from "../../uol/live/live.controller";
import { CallbackQuery, Message } from "telegraf/typings/telegram-types";

@autoInjectable()
export default class BotNarrateCommand {
  constructor(
    @inject(delay(() => UOLLiveMatchesController))
    private uolLiveMatchesController: UOLLiveMatchesController,
    private uolMatchesService: UOLMatchesService
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

  kicked = (ctx: Context & { message: Message.LeftChatMemberMessage }) => {
    if (ctx.message.left_chat_member.id !== ctx.botInfo.id) return;

    const chatId = ctx.chat?.id!;

    const currentMatch = this.uolLiveMatchesController.isAlreadyWatching(
      chatId
    );

    if (!currentMatch) return;

    this.uolLiveMatchesController.removeChatIdFromContainer(
      currentMatch.match.id,
      currentMatch.chatId
    );
  };

  stop = async (ctx: Context) => {
    const chatId = ctx.chat?.id!;

    const currentMatch = this.uolLiveMatchesController.isAlreadyWatching(
      chatId
    );

    if (!currentMatch) {
      return ctx.reply(
        "Atualmente você não está acompanhando a nenhuma partida. Digite /narrar para acompanhar uma partida ao vivo."
      );
    }

    this.uolLiveMatchesController.removeChatIdFromContainer(
      currentMatch.match.id,
      currentMatch.chatId
    );

    await ctx.reply("Você parou de acompanhar uma partida.");
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
    const { id: matchId } = JSON.parse(data);
    const { id: chatId, type } = ctx.chat!;
    const messageId = ctx.callbackQuery?.message?.message_id!;

    const isAlreadyWatching = this.uolLiveMatchesController.isAlreadyWatching(
      chatId
    );

    if (isAlreadyWatching) {
      await ctx.reply(
        "Essa conversa já está acompanhando a uma partida. Vamos te colocar pra acompanhar a nova partida escolhida ;)"
      );

      this.uolLiveMatchesController.removeChatIdFromContainer(matchId, chatId);
    }

    await ctx.telegram.answerCbQuery(
      ctx.callbackQuery?.id!,
      "Preparando conteúdo..."
    );

    await ctx.deleteMessage(messageId);

    this.uolLiveMatchesController.addChatIdToMatchContainer(
      matchId,
      chatId,
      type
    );
  };
}
