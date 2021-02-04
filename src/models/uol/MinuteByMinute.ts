export enum MatchStageEnum {
  FIRST_HALF = 1,
  SECOND_HALF = 2,
  INTERVAL = 5,
  ENDED = 8,
  EARLY_GAME = 9,
  AFTER_GAME = 10,
}

export enum MatchEventType {
  EVENT = 1,
  VIDEO = 3,
}

export enum MatchEventSubType {
  TEXT = 1,
  GOAL = 2,
  YELLOW_CARD = 4,
  RED_CARD = 5,
  SUBSTITUTION = 6,
  PENALTY = 7,
}

export interface MinuteByMinuteEvent {
  id: number;
  published: number;
  "match-stage": MatchStageEnum;
  type: MatchEventType;
  subtype: MatchEventSubType;
  minute: number;
  text?: string;
  team?: "home" | "away";
  "first-card"?: boolean;
  "extra-time"?: number;
  "player-id"?: number;
  "substitute-player-id"?: number;
}

export class MinuteByMinute {
  "match-stage": MatchStageEnum;

  goals!: {
    home: number;
    away: number;
  };

  timeline!: MinuteByMinuteEvent[];
}
