export interface MinuteByMinuteEvent {
  id: number;
  published: number;
  "match-stage": number;
  type: number;
  subtype: number;
  minute: number;
  text: string;
}

export class MinuteByMinute {
  "match-stage": number;

  goals!: {
    home: number;
    away: number;
  };

  timeline!: MinuteByMinuteEvent[];
}
