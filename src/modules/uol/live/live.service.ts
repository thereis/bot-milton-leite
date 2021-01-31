import { autoInjectable } from "tsyringe";

import WebSocket from "ws";

@autoInjectable()
export default class UOLLiveMatchController {
  private connection!: WebSocket;

  connect = (id: number) =>
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

    console.log("Connecting to web socket...");
    await this.connect(id);
    console.log("Connected!");

    return this.connection;
  };

  formatData = (data: any) => {
    const parsedData = JSON.parse(data);
    console.log("data: ", data);

    const minuteByMinute = parsedData?.["subchannels"]?.["minute-by-minute"];

    if (!minuteByMinute) return;

    return minuteByMinute["timeline"]?.[0].text;
  };
}
