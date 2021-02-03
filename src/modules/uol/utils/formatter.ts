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
  return `⚽ <b>${match.time1["nome-completo"]}</b> x <b>${match.time2["nome-completo"]}</b> às <b>${match.horario}</b> (Rodada: ${match.rodada})`;
};

export const formatMatchResult = (match: Match): string => {
  return `⚽ <b>${match.time1["nome-completo"]} ${match.placar1}</b> x <b>${match.placar2} ${match.time2["nome-completo"]}</b> (Rodada: ${match.rodada})`;
};

export const formatGroupedMatches = (title: string, content: string) => {
  const divider = `-`.repeat(title.length).split("").join(" ");
  let message = "";

  message += `${divider}\n`;
  message += `${title}\n`;
  message += `${divider}\n`;
  message += `${content}\n`;

  return message;
};

export const formatUpcomingMatch = (
  match: Match,
  shouldDisplayDate: boolean = false
): string => {
  const parsedDate = parse(match.data, constants.DATE_FORMAT, new Date());

  const matchDateAndDay = format(
    parsedDate,
    constants.OUTPUT_DATE_FORMAT_WITH_TIME,
    {
      locale: brazilianLocale,
    }
  );

  let message = "";

  message += `📣 Rodada: ${match.rodada}\n`;
  message += `⚽ ${match.time1["nome-completo"]} x ${match.time2["nome-completo"]}\n`;
  message += `📆 ${
    shouldDisplayDate
      ? `${matchDateAndDay} às ${match.horario}`
      : `Horário: <b>${match.horario}</b>`
  }\n`;
  message += `🏟️ Estádio: ${match.estadio} (${match.local})\n`;

  return message;
};

const getMatchStageMessage = (
  stage: MatchStageEnum,
  timeline: MinuteByMinuteEvent
) => {
  let message = "";

  switch (stage) {
    case MatchStageEnum.EARLY_GAME:
      message = "Pré jogo";
      break;

    case MatchStageEnum.FIRST_HALF:
    case MatchStageEnum.SECOND_HALF:
      message = timeline["first-card"]
        ? `Autoriza o árbitro!`
        : `${timeline.minute}' do ${timeline["match-stage"]}° tempo`;
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
  const team = event.team === "home" ? match.time1 : match.time2 ?? undefined;

  switch (event.subtype) {
    case MatchEventSubType.GOAL:
      message += `⚠️ GOOOOOOOL! do ${team["nome-completo"]}!\n`;
      event.text && (message += `📝 ${event.text}`);
      break;

    case MatchEventSubType.TEXT:
      message = `📝 ${event.text}`;
      break;

    case MatchEventSubType.YELLOW_CARD:
      message += `🟨 Cartão amarelo para o jogador do ${team["nome-completo"]}!\n`;
      message += `📝 ${event.text}`;
      break;

    case MatchEventSubType.RED_CARD:
      message += `🟥 Cartão vermelho para o jogador do ${team["nome-completo"]}!\n`;
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

export const formatUnexpectedEndedMatch = (match: Match) => {
  let message = "";

  message += `⚠️ Esta partida ainda não começou ou não está disponível!\n`;
  message += `📣 Rodada: ${match.rodada}\n`;
  message += `⚽ ${match.time1["nome-completo"]} x ${match.time2["nome-completo"]}`;

  return message;
};
