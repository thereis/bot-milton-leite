import { MatchCoverageEnum, MatchStatusEnum } from "../Match";
import { MatchStageEnum } from "./MinuteByMinute";

export interface IWSPlacarTeam {
  id: number;
  "short-name": string;
  name: string;
  slug: string;
  image: string;
  color1: string;
  color2: string;
  goals: number;
}

export class WSPlacar {
  id!: number;
  coverage!: MatchCoverageEnum;
  status!: MatchStatusEnum;
  "match-stage"!: MatchStageEnum;
  date!: number;
  stadium!: string;
  local!: string;
  championship!: {
    id: number;
    name: string;
    slug: string;
    season: number;
    stage: {
      id: number;
      name: string;
      slug: string;
      classification: number;
    };
    group: {
      id: number;
      name: string;
      slug: string;
    };
  };
  teams!: {
    home: IWSPlacarTeam;
    away: IWSPlacarTeam;
  };
  url!: string;
}
