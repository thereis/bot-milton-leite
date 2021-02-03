import axios from "axios";

import * as constants from "../constants";
import groupBy from "lodash/groupBy";

import { Match, MatchStatusEnum } from "../../../models/Match";
import { format, parse, isAfter } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";

import { singleton } from "tsyringe";
import { Dictionary } from "lodash";

@singleton()
export default class UOLMatchesService {
  private loaded: boolean = false;

  private matches: Match[] = [];
  private filteredMatches: Match[] = [];
  private groupedMatches: Dictionary<Match[]> = {};
  private today = format(new Date(), constants.DATE_FORMAT);

  private matchesUrl: string =
    "https://www.uol.com.br/esporte/service/?loadComponent=match-service&contentType=json";

  constructor() {}

  load = async (): Promise<Match[]> => {
    const request = await axios.get(this.matchesUrl);
    const response = request.data;

    this.matches = response.matches;
    this.filteredMatches = response.matches;
    this.loaded = true;

    return this.matches;
  };

  reload = async () => {
    return await this.load();
  };

  reset = () => {
    this.filteredMatches = this.matches;
    this.groupedMatches = {};

    return this;
  };

  formatDate = (date: string) => {
    const newDate = parse(
      date ?? this.today,
      constants.DATE_FORMAT,
      new Date()
    );

    return format(newDate, constants.OUTPUT_DATE_FORMAT_WITH_DAYWEEK, {
      locale: ptBR,
    });
  };

  getLoadedMatches() {
    return this.matches;
  }

  getMatches() {
    const matches = this.filteredMatches;

    this.filteredMatches = this.matches;
    this.groupedMatches = {};

    return matches;
  }

  filterByIdCompeticao = (id: string) => {
    this.filteredMatches = this.filteredMatches.filter(
      (match) => match["id-competicao"] === id
    );

    return this;
  };

  filterByStatus = (status: MatchStatusEnum = MatchStatusEnum.COMPLETED) => {
    this.filteredMatches = this.filteredMatches.filter(
      (match) => match.status === status
    );

    return this;
  };

  filterByCompeticao = (competicao: string) => {
    this.filteredMatches = this.filteredMatches.filter(
      (match) => match.competicao === competicao
    );

    return this;
  };

  filterByRodada = (rodada: number) => {
    this.filteredMatches = this.filteredMatches.filter(
      (match) => match.rodada === rodada
    );

    return this;
  };

  filterByTodayMatches = () => {
    const today = this.today;

    this.filteredMatches = this.filteredMatches.filter(
      (match) => match.data === today
    );

    return this;
  };

  filterByDate = (date?: string) => {
    const today = parse(date ?? this.today, constants.DATE_FORMAT, new Date());

    this.filteredMatches = this.filteredMatches.filter((match) => {
      const data = parse(match.data, constants.DATE_FORMAT, new Date());
      return isAfter(data, today);
    });

    return this;
  };

  filterByCoverage = () => {
    this.filteredMatches = this.filteredMatches.filter(
      (match) => match.coverage
    );

    return this;
  };

  sortByDate = () => {
    this.filteredMatches = this.filteredMatches.sort(
      (match, nextMatch) => +match.data - +nextMatch.data
    );

    return this;
  };

  getById = (id: number) => {
    return this.matches.find((match) => match.id === id);
  };

  groupByData = () => {
    this.groupedMatches = groupBy(this.filteredMatches, "data");

    return this;
  };

  getGroupedMatches = () => {
    const groupedMatches = this.groupedMatches;

    this.filteredMatches = this.matches;
    this.groupedMatches = {};

    return groupedMatches;
  };
}
