import { Team } from "./Team";

export enum MatchStatusEnum {
  COMPLETED = "3",
}

export enum MatchCoverageEnum {
  FINISHED = 2,
}

export class Match {
  "competicao": string;
  "id-competicao": string;
  "fase": string;
  "posicao": number;
  "rodada": number;
  "data": string;
  "horario": string;
  "time1": Team;
  "time2": Team;
  "placar1": number;
  "placar2": number;
  "penalti1": null;
  "penalti2": null;
  "desempate_time1": number;
  "desempate_time2": number;
  "estadio": string;
  "local": string;
  "url-prejogo": string;
  "url-posjogo": string;
  "url-video": string;
  "eliminou-jogo-volta": boolean;
  "classificou-gols-fora": boolean;
  "id": number;
  "datahora": number;
  status?: MatchStatusEnum;
  coverage?: MatchCoverageEnum;
}
