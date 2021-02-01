import { delay, inject, singleton } from "tsyringe";

import BotService from "../../bot/bot.service";
import UOLMatchesService from "../matches/matches.service";
import UOLLiveMatchService from "./live.service";

interface ICreateMatchContainer {
  matchId: number;
  chatId: number;
}

interface IMatchContainer {
  service: UOLLiveMatchService;
}

interface IConnectedToMatch {
  matchId: number;
  chatId: number;
}

@singleton()
export default class UOLLiveMatchesController {
  private connectedToMatches: IConnectedToMatch[] = [];
  private matchesContainer: Map<number, IMatchContainer> = new Map();

  constructor(
    @inject(delay(() => BotService)) private botService: BotService,
    @inject(delay(() => UOLMatchesService))
    private uolMatchesService: UOLMatchesService
  ) {}

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

  createMatchContainer = ({ matchId, chatId }: ICreateMatchContainer) => {
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

    this.connectedToMatches.push({ matchId, chatId });

    return this.matchesContainer.set(matchId, {
      service,
    });
  };

  isAlreadyWatching = (chatId: number) =>
    this.connectedToMatches.find((connection) => connection.chatId === chatId);

  addChatIdToMatchContainer = (matchId: number, chatId: number) => {
    const container = this.getMatchContainer(matchId);

    if (!container) {
      return this.createMatchContainer({ matchId, chatId });
    }

    container.service.addChatId(chatId);

    this.connectedToMatches.push({ chatId, matchId });
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
