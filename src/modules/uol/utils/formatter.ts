import { Match } from "../../../models/Match";
import { parse, format } from "date-fns";

import brazilianLocale from "date-fns/locale/pt-BR";

import * as constants from "../constants";

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
