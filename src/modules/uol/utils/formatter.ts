import { Match } from "../../../models/Match";
import { parse, format } from "date-fns";

import brazilianLocale from "date-fns/locale/pt-BR";

import * as constants from "../constants";
import {
  MatchEventSubType,
  MatchStageEnum,
  MinuteByMinute,
  MinuteByMinuteEvent,
} from "../../../models/uol/MinuteByMinute";

export const formatTodayMatch = (match: Match): string => {
  let message = `⚽ <b>${match.time1["nome-completo"]}</b> x <b>${match.time2["nome-completo"]}</b> às <b>${match.horario}</b> (Rodada: ${match.rodada})`;

  return message;
};

export const formatUpcomingMatch = (match: Match): string => {
  const parsedDate = parse(match.data, constants.DATE_FORMAT, new Date());
  let message = "";

  message += `------------------------------\n`;
  message += `📣 Rodada: ${match.rodada}\n`;
  message += `⚽ ${match.time1["nome-completo"]} x ${match.time2["nome-completo"]}\n`;
  message += `📆 ${format(parsedDate, constants.OUTPUT_DATE_FORMAT, {
    locale: brazilianLocale,
  })} às ${match.horario}\n`;
  message += `🏟️ Estádio: ${match.estadio} (${match.local})\n`;
  message += `------------------------------`;

  return message;
};

const getMatchStageMessage = (
  stage: MatchStageEnum,
  timeline: MinuteByMinuteEvent
) => {
  let message = "";

  switch (stage) {
    case MatchStageEnum.FIRST_HALF:
    case MatchStageEnum.SECOND_HALF:
      message = `${timeline.minute}' do ${timeline["match-stage"]}° tempo`;
      break;

    case MatchStageEnum.INTERVAL:
      message = "Intervalo";
      break;

    case MatchStageEnum.ENDED:
    case MatchStageEnum.AFTER_GAME:
      message = "Fim de jogo!";
      break;
  }

  return message;
};

const formatEventText = (match: Match, event: MinuteByMinuteEvent) => {
  let message = "";
  const team = event.team === "away" ? match.time1 : match.time2 ?? undefined;

  switch (event.subtype) {
    case MatchEventSubType.GOAL:
      message += `⚠️ GOOOOOOOL! do ${team["nome-completo"]}!`;
      message += `📝 ${event.text}`;
      break;

    case MatchEventSubType.TEXT:
      message = `📝 ${event.text}`;
      break;

    case MatchEventSubType.YELLOW_CARD:
      message += `🟨 Cartão amarelo para o jogador do ${team["nome-completo"]}!`;
      message += `📝 ${event.text}`;
      break;

    case MatchEventSubType.RED_CARD:
      message += `🟥 Cartão vermelho para o jogador do ${team["nome-completo"]}!`;
      message += `📝 ${event.text}`;
      break;

    case MatchEventSubType.SUBSTITUTION:
      message += `🔄 Substituição no ${team["nome-completo"]}.`;
  }

  return message;
};

export const formatTimelineMessage = (match: Match, feed: MinuteByMinute) => {
  if (!feed) return;

  const timeline = feed.timeline[0];

  let message = "";

  message += `⏰ ${getMatchStageMessage(timeline["match-stage"], timeline)}\n`;
  message += `⚽ ${match.time1["nome-completo"]} ${feed.goals.home} x ${feed.goals.away} ${match.time2["nome-completo"]}\n`;
  message += `${formatEventText(match, timeline)}`;

  return message;
};

export const formatEndedMatch = (match: Match, feed: MinuteByMinute) => {
  let message = "";

  message += `⚠️ Esta partida já acabou!\n`;
  message += `📣 Rodada: ${match.rodada}\n`;
  message += `⚽ ${match.time1["nome-completo"]} ${feed.goals.home} x ${feed.goals.away} ${match.time2["nome-completo"]}`;

  return message;
};
