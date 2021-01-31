import { singleton } from "tsyringe";

import { LEAGUES, MATCH_UPDATER_TIMEOUT } from "../constants";
import { formatTodayMatch, formatUpcomingMatch } from "../utils/formatter";

import UOLMatchesService from "./matches.service";
import UOLLiveMatchController from "../live/live.service";

@singleton()
export default class UOLMatchesController {
  private reloadInterval?: NodeJS.Timeout;

  constructor(
    private uolService: UOLMatchesService,
    private uolLiveMatch: UOLLiveMatchController
  ) {
    this.matchUpdater();
  }

  matchUpdater = () => {
    if (!this.reloadInterval) {
      this.reloadInterval = setInterval(
        () => this.reload(),
        MATCH_UPDATER_TIMEOUT
      );
    }
  };

  getTodayMatches = () => {
    const matches = this.uolService
      .filterByIdCompeticao(LEAGUES.BRASILEIRAO)
      .filterByTodayMatches()
      .getMatches();

    if (matches.length === 0) {
      return "Nenhuma partida do brasileirão acontecendo hoje!";
    }

    const partidas = matches.map((match) => formatTodayMatch(match));

    return `<b>As partidas de hoje no Brasileirão:</b>\n\n${partidas.join(
      "\n"
    )}`;
  };

  getUpcomingMatches = () => {
    const matches = this.uolService
      .filterByIdCompeticao(LEAGUES.BRASILEIRAO)
      .filterByDate()
      .sortByDate()
      .getMatches()
      .map((match) => formatUpcomingMatch(match))
      .join("\n");

    return `<b>Próximas partidas do Brasileirão Série A:\n${matches}</b>`;
  };

  // Under construction
  watchMatch = async (id: number, sendReply: any) => {
    const connnection = await this.uolLiveMatch.startup(id);

    connnection.on("message", (data) => {
      const message = this.uolLiveMatch.formatData(data);

      if (message) {
        sendReply(message);
      }
    });
  };

  load = async () => {
    console.log("Loading matches...");

    await this.uolService.load();

    console.log("Loaded!");
  };

  reload = async () => {
    console.log("Reloading matches...");

    await this.uolService.reload();

    console.log("Reloaded!");
  };
}
