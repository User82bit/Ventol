import * as signalR from "@microsoft/signalr";
import { API_BASE_URL } from "../config/environment";

let controllerHub: signalR.HubConnection;
let robotHub: signalR.HubConnection;

export const initConnections = (
  onRobotData: (data: string) => void,
  onConnectionStatus: (connected: boolean) => void
) => {
  controllerHub = new signalR.HubConnectionBuilder()
    .withUrl(`${API_BASE_URL}/controllerHub`)
    .withAutomaticReconnect()
    .build();

  robotHub = new signalR.HubConnectionBuilder()
    .withUrl(`${API_BASE_URL}/robotHub`)
    .withAutomaticReconnect()
    .build();

  robotHub.on("ReceiveRobotData", onRobotData);

  const startConnections = async () => {
    try {
      await controllerHub.start();
      await robotHub.start();
      onConnectionStatus(true);
    } catch (err) {
      console.error("SignalR Connection Error: ", err);
      onConnectionStatus(false);
      setTimeout(startConnections, 5000);
    }
  };

  startConnections();
};

export const sendControl = async (x: number, y: number) => {
  if (controllerHub.state === signalR.HubConnectionState.Connected) {
    await controllerHub.invoke("SendControlInput", x, y);
  }
};
