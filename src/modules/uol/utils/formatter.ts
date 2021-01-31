import { Match } from "../../../models/Match";
import { parse, format } from "date-fns";

import brazilianLocale from "date-fns/locale/pt-BR";

import * as constants from "../constants";
import { MinuteByMinute } from "../../../models/uol/MinuteByMinute";

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

export const formatTimelineMessage = (feed: MinuteByMinute) => {
  const timeline = feed.timeline[0];

  let message = "";

  message += `⏰ ${timeline.minute}' do ${timeline["match-stage"]} tempo\n`;
  message += `⚽ ${feed.goals.home} x ${feed.goals.away}\n`;
  message += `📝 ${timeline.text}`;

  return message;
};
