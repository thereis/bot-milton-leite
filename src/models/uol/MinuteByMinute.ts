export enum MatchStageEnum {
  FIRST_HALF = 1,
  SECOND_HALF = 2,
  INTERVAL = 5,
  ENDED = 10,
}

export interface MinuteByMinuteEvent {
  id: number;
  published: number;
  "match-stage": MatchStageEnum;
  type: number;
  subtype: number;
  minute: number;
  text: string;
}

export class MinuteByMinute {
  "match-stage": MatchStageEnum;

  goals!: {
    home: number;
    away: number;
  };

  timeline!: MinuteByMinuteEvent[];
}
