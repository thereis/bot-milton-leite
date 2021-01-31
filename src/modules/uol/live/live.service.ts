import { autoInjectable } from "tsyringe";

import WebSocket from "ws";
import { UOLWSMatchEvent } from "../../../models/uol/UOLWSMatchEvent";
import { formatTimelineMessage } from "../utils/formatter";

@autoInjectable()
export default class UOLLiveMatchService {
  private connection!: WebSocket;

  private connect = (id: number) =>
    new Promise((resolve, reject) => {
      const socket = new WebSocket(
        `wss://rtw.uol.com/sub?id=placar-futebol-${id}`
      );

      socket.onopen = () => {
        this.connection = socket;

        resolve(socket);
      };

      socket.onclose = () => reject();
    });

  startup = async (id: number) => {
    if (this.connection && this.connection.OPEN) {
      return this.connection;
    }

    console.log(`[${id}] Connecting to web socket...`);
    await this.connect(id);
    console.log(`[${id}] Connected!`);

    return this.connection;
  };

  formatData = (data: any) => {
    const parsedData = JSON.parse(data);

    const event = new UOLWSMatchEvent({ ...parsedData });
    const feed = event.subchannels["minute-by-minute"];

    if (feed && feed.timeline.length === 0) return;

    return formatTimelineMessage(feed);
  };
}
