import { LineUp } from "./LineUp";
import { MinuteByMinute } from "./MinuteByMinute";
import { WSMatch } from "./WSMatch";

export class UOLWSMatchEvent {
  subchannels!: {
    match: WSMatch;
    lineup: LineUp;
    "minute-by-minute": MinuteByMinute;
  };
  "channelName": string;
  "lastModified": number;
  "prevModified": number;

  constructor(params: Partial<UOLWSMatchEvent>) {
    Object.assign(this, params);
  }
}
