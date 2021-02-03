import { singleton } from "tsyringe";

import { LEAGUES, MATCH_UPDATER_TIMEOUT } from "../constants";

import {
  formatGroupedMatches,
  formatMatchResult,
  formatTodayMatch,
  formatUpcomingMatch,
} from "../utils/formatter";

import UOLMatchesService from "./matches.service";
import { MatchStatusEnum } from "../../../models/Match";

@singleton()
export default class UOLMatchesController {
  private reloadInterval?: NodeJS.Timeout;

  constructor(private uolService: UOLMatchesService) {
    this.matchUpdater();
  }

  matchUpdater = () => {
    if (!this.reloadInterval) {
      this.reloadInterval = setInterval(
        async () => await this.reload(),
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

    const results = matches.map((match) => formatTodayMatch(match));

    return `<b>As partidas de hoje no Brasileirão:</b>\n\n${results.join(
      "\n"
    )}`;
  };

  getMatchResults = () => {
    const matches = this.uolService
      .filterByIdCompeticao(LEAGUES.BRASILEIRAO)
      .filterByStatus(MatchStatusEnum.COMPLETED)
      .getMatches();

    const results = matches.map((match) => formatMatchResult(match));

    return `<b>Resultados das partidas do Brasileirão:</b>\n\n${results.join(
      "\n"
    )}`;
  };

  getUpcomingMatches = () => {
    let upcomingMatches = "";

    const groupedMatches = this.uolService
      .filterByIdCompeticao(LEAGUES.BRASILEIRAO)
      .filterByDate()
      .sortByDate()
      .groupByData()
      .getGroupedMatches();

    for (const [date, matches] of Object.entries(groupedMatches)) {
      const upcomingMatchesText = matches
        .map((match) => formatUpcomingMatch(match))
        .join("\n");

      upcomingMatches += formatGroupedMatches(
        `Partidas no dia <b>${this.uolService.formatDate(date)}</b>`,
        upcomingMatchesText
      );
    }

    return upcomingMatches;
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
