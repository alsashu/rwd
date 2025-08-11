import { EventEmitter } from "@angular/core";
import { AppConfigConst } from "../app/app-config-const.service";
import { IServicesService } from "../services/iservices.service";

/**
 * The interface of the WebsocketService
 */
export interface IWebsocketService {
  isConnected: boolean;
  isAutoReconnectEnabled: boolean;
  eventEmitter: EventEmitter<any>;
  getIsOffLine(): boolean;
  open();
  resetConnection();
  reconnect(error: any);
  clearSocket();
  send(message: any);
}

/**
 * Web socket service
 */
export class WebsocketService implements IWebsocketService {
  public static localStorageKey = {
    websocketConnected: "alm-rvw-ws-connected",
  };
  private static websocketMessage = "websocket-message";

  private socket: any;
  private serverUrl: string;
  private offline: boolean;
  private autoReconnectIntervalInMs = 5000;
  private isConnectedMemo = localStorage.getItem(WebsocketService.localStorageKey.websocketConnected) || "true";
  public isAutoReconnectEnabled = true;

  public isConnected = false;
  public eventEmitter: EventEmitter<any> = new EventEmitter<any>();

  /**
   * Constructor
   * @param servicesService The services Service
   */
  constructor(private servicesService: IServicesService) {}

  /**
   * Service init
   */
  public initService() {
    this.open();
  }

  /**
   * Open the web socket
   */
  public open(): void {
    try {
      this.serverUrl = AppConfigConst.config.SERVER_URL.replace("http", "ws");
      this.offline = AppConfigConst.config.OFFLINE;
      console.log("Websocket open. Web socket serverUrl:", this.serverUrl);
      // const websocketUrl = this.serverUrl;
      const websocketUrl = this.offline ? "ws://offline" : this.serverUrl;
      const socket = new WebSocket(websocketUrl);
      this.socket = socket;

      socket.onopen = () => {
        this.send({ type: WebsocketService.websocketMessage, payload: "right-viewer client connected" });
        this.isConnected = true;
        if (this.isConnectedMemo === "false") {
          this.eventEmitter.emit({ status: "reconnected" });
        }
        this.isConnectedMemo = "true";
        localStorage.setItem(WebsocketService.localStorageKey.websocketConnected, this.isConnectedMemo);

        console.log("WebsocketService connected");
        this.eventEmitter.emit({ status: "connected" });
      };

      socket.onclose = (error: any) => {
        // console.log(`Socket closing. Was connected: ${this.isConnected}`);
        if (this.isConnected) {
          // We send notification only if we were connected
          this.isConnected = false;
          this.isConnectedMemo = "false";
          localStorage.setItem(WebsocketService.localStorageKey.websocketConnected, this.isConnectedMemo);
          this.eventEmitter.emit({ status: "disconnected" });
        }

        switch (error.code) {
          // Close normal
          case 1000:
            console.log("WebSocket: closed");
            break;
          // Abnormal closure
          default:
            this.reconnect(error);
            break;
        }
      };

      socket.onerror = (error: any) => {
        console.log("WebsocketService error: " + JSON.stringify(error, null, 2));
        switch (error.code) {
          case "ECONNREFUSED":
            this.reconnect(error);
            break;
          default:
            break;
        }
      };

      socket.onmessage = (message: any) => {
        try {
          console.log("WebsocketService onmessage", message);
          const data = JSON.parse(message.data);
          this.eventEmitter.emit(data);
        } catch (ex) {
          console.error("WebsocketService onmessage exception", ex);
        }
      };
    } catch (e) {
      console.error("Socket open error:", e);
    }
  }

  /**
   * Reset connection
   */
  public resetConnection() {
    this.isConnected = false;
    this.clearSocket();
    this.open();
  }

  /**
   * Automatic reconnection
   * @param error The error that generated the deconnection
   */
  public reconnect(error: any) {
    this.isConnected = false;
    this.clearSocket();

    if (this.isAutoReconnectEnabled) {
      console.log(`WebsocketService: retry in ${this.autoReconnectIntervalInMs} ms`, error);
      setTimeout(() => {
        console.log("WebSocketClient: reconnecting...");
        this.open();
      }, this.autoReconnectIntervalInMs);
    }
  }

  /**
   * Clear the web socket
   */
  public clearSocket() {
    if (this.socket) {
      this.socket.removeAllListeners();
    }
  }

  /**
   * Send a web socket message to server
   * @param message The message to be sent
   */
  public send(message: any): void {
    console.log("WebsocketService.send", message);
    if (this.socket) {
      this.socket.send(JSON.stringify(message));
    }
  }

  /**
   * Indiquates if offline or not
   * @returns Boolean
   */
  public getIsOffLine(): boolean {
    return this.offline;
  }
}
