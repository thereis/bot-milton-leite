import WebSocket from "ws";
import Telegram from "telegraf/typings/telegram";

import {
  formatEndedMatch,
  formatTimelineMessage,
  formatUnexpectedEndedMatch,
} from "../utils/formatter";

import { Match } from "../../../models/Match";
import { UOLWSMatchEvent } from "../../../models/uol/UOLWSMatchEvent";
import { WS_MAX_TIMEOUT } from "../constants";

interface IUOLLiveMatchService {
  matchId: number;
  match: Match;
  chatId: number;
  telegram: Telegram;
  onClose: () => void;
}

export default class UOLLiveMatchService {
  private matchId!: number;
  private match!: Match;
  private telegram!: Telegram;
  private connection!: WebSocket;
  private chatIds: number[] = [];
  private lastMessage: string = "";
  private lastEvent!: UOLWSMatchEvent;
  private onClose!: () => void;
  private pingTimeout?: NodeJS.Timeout;

  constructor({
    matchId,
    match,
    chatId,
    onClose,
    telegram,
  }: IUOLLiveMatchService) {
    this.matchId = matchId;
    this.match = match;
    this.telegram = telegram;
    this.onClose = onClose;

    console.log(`[${matchId}] Live match`);

    this.startup(matchId, chatId);
  }

  private connect = (id: number): Promise<WebSocket> =>
    new Promise((resolve, reject) => {
      console.log(`[${this.matchId}] Connecting to web socket...`);

      const socket = new WebSocket(
        `wss://rtw.uol.com/sub?id=placar-futebol-${id}`
      );

      socket.onopen = () => {
        console.log(`[${this.matchId}] Connected!`);

        this.connection = socket;

        resolve(socket);
      };

      socket.on("ping", this.heartbeat);

      socket.onclose = (error: WebSocket.CloseEvent) => {
        reject(this.shutdown(error));
      };
    });

  startup = async (matchId: number, chatId: number) => {
    if (this.connection && this.connection.OPEN) {
      return this.connection;
    }

    const connection = await this.connect(matchId);

    this.addChatId(chatId);

    connection.on("message", this.handleMessage);

    return connection;
  };

  private heartbeat = () => {
    this.pingTimeout && clearTimeout(this.pingTimeout);

    this.pingTimeout = setTimeout(() => {
      console.log(
        `[${this.matchId}] Terminating ${this.matchId} because of heartbeat.`
      );
      this.connection.terminate();
    }, WS_MAX_TIMEOUT);
  };

  shutdown = (error: WebSocket.CloseEvent) => {
    this.connection && this.connection.close();

    if (this.lastEvent) {
      this.notifyChatIds(
        formatEndedMatch(
          this.match,
          this.lastEvent.subchannels["minute-by-minute"]
        )
      );
    } else {
      this.notifyChatIds(formatUnexpectedEndedMatch(this.match));
    }

    console.log(
      `[${this.matchId}] Connection closed. Reason: ${error.code}-${error.reason}`
    );

    this.onClose && this.onClose();
  };

  isAlreadyWatching = (chatId: number) => this.chatIds.includes(chatId);
  removeChatId = (chatId: number) =>
    (this.chatIds = this.chatIds.filter((id) => chatId !== id));

  addChatId = (chatId: number) => {
    if (this.isAlreadyWatching(chatId)) return;

    this.chatIds.push(chatId);
    this.notifyChatId(chatId, this.lastMessage);

    console.log(`[${this.matchId}] ${chatId} has joined to the channel.`);

    return this.chatIds;
  };

  handleMessage = (rawData: any) => {
    const data = JSON.parse(rawData);

    if (data && data.invalidChannel) return this.connection.close();

    const event = new UOLWSMatchEvent({ ...data });
    const feed = event.subchannels?.["minute-by-minute"];

    if (feed && feed.timeline.length === 0) return;

    const message = formatTimelineMessage(this.match, feed);

    if (!message) return;

    this.lastMessage = message;
    this.lastEvent = event;

    this.notifyChatIds(message);
  };

  // TODO: Something is throwing an error because message is empty
  notifyChatIds = (message: string) => {
    for (let i = 0; i < this.chatIds.length; i++) {
      const chatId = this.chatIds[i];

      this.notifyChatId(chatId, message);
    }
  };

  notifyChatId = (chatId: number, message: string) => {
    this.telegram.sendMessage(chatId, message);
  };
}
