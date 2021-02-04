import { groupBy } from "lodash";
import { delay, inject, singleton } from "tsyringe";

import * as constants from "../constants";

import BotService from "../../bot/bot.service";
import UOLMatchesService from "../matches/matches.service";
import UOLLiveMatchService from "./live.service";

type ChatTypes = "private" | "group" | "supergroup" | "channel";

interface ICreateMatchContainer {
  matchId: number;
  chatId: number;
  chatType: ChatTypes;
}
interface IMatchContainer {
  service: UOLLiveMatchService;
}

interface IConnectedToMatch {
  matchId: number;
  chatId: number;
  chatType: ChatTypes;
}

@singleton()
export default class UOLLiveMatchesController {
  private connectedToMatches: IConnectedToMatch[] = [];
  private matchesContainer: Map<number, IMatchContainer> = new Map();
  private listenersCountInterval!: NodeJS.Timeout;

  constructor(
    @inject(delay(() => BotService)) private botService: BotService,
    @inject(delay(() => UOLMatchesService))
    private uolMatchesService: UOLMatchesService
  ) {
    this.listenersCountInterval = setInterval(() => {
      this.listeners();
    }, constants.LISTENERS_INTERVAL);
  }

  listeners = () => {
    const connectedChats = this.connectedToMatches;

    if (!connectedChats.length) return;

    console.log(`There are ${connectedChats.length} active chats.`);

    const groupedChats = groupBy(this.connectedToMatches, "matchId");

    for (let [matchId, chats] of Object.entries(groupedChats)) {
      const groups = chats.reduce(
        (acc, chat) => ({
          ...acc,
          [chat.chatType]:
            acc && acc[chat.chatType] ? acc[chat.chatType] + 1 : 1,
        }),
        {} as { [key: string]: number }
      );

      console.log(`[${matchId}]: ${chats.length} active connections.`, groups);
    }
  };

  deleteMatchContainer = (matchId: number, chatId: number) => {
    this.matchesContainer.delete(matchId);

    this.connectedToMatches = this.connectedToMatches.filter(
      (connection) => connection.chatId !== chatId
    );
  };

  getMatchContainer = (id: number) => {
    const container = this.matchesContainer.has(id);

    if (!container) return false;

    return this.matchesContainer.get(id);
  };

  updateMatchContainer = (matchId: number, data: Partial<IMatchContainer>) => {
    const container = this.getMatchContainer(matchId);

    if (!container) return;

    this.matchesContainer.set(matchId, { ...container, ...data });
  };

  createMatchContainer = ({
    matchId,
    chatId,
    chatType,
  }: ICreateMatchContainer) => {
    const match = this.uolMatchesService.getById(matchId);

    if (!match) {
      throw new Error(`Could not find match ${matchId}`);
    }

    const service = new UOLLiveMatchService({
      matchId,
      match,
      chatId,
      onClose: () => this.deleteMatchContainer(matchId, chatId),
      telegram: this.botService.bot.telegram,
    });

    this.connectedToMatches.push({ matchId, chatId, chatType });

    return this.matchesContainer.set(matchId, {
      service,
    });
  };

  isAlreadyWatching = (chatId: number) =>
    this.connectedToMatches.find((connection) => connection.chatId === chatId);

  addChatIdToMatchContainer = (
    matchId: number,
    chatId: number,
    chatType: ChatTypes
  ) => {
    const container = this.getMatchContainer(matchId);

    if (!container) {
      return this.createMatchContainer({ matchId, chatId, chatType });
    }

    container.service.addChatId(chatId);

    this.connectedToMatches.push({ chatId, matchId, chatType });
  };

  removeChatIdFromContainer = (matchId: number, chatId: number) => {
    const container = this.getMatchContainer(matchId);

    if (container) {
      container.service.removeChatId(chatId);
    }

    this.connectedToMatches = this.connectedToMatches.filter(
      (connection) => connection.chatId != chatId
    );
  };
}
