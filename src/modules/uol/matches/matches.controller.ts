import { autoInjectable } from "tsyringe";

import { LEAGUES } from "../constants";
import { formatUpcomingMatch } from "../utils/formatter";

import UOLMatchesService from "./matches.service";
import UOLLiveMatchController from "../live/live.service";

@autoInjectable()
export default class UOLMatchesController {
  constructor(
    private uolService: UOLMatchesService,
    private uolLiveMatch: UOLLiveMatchController
  ) {}

  getTodayMatches = () => {
    const matches = this.uolService
      .filterByIdCompeticao(LEAGUES.BRASILEIRAO)
      .filterByTodayMatches()
      .getMatches();

    if (matches.length === 0) {
      return "Nenhuma partida do brasileirão acontecendo hoje!";
    }

    const partidas = matches.map(
      (match) =>
        `${match.time1["nome-completo"]} x ${match.time2["nome-completo"]}`
    );

    return partidas.join("\n");
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
}
