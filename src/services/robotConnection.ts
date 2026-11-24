import * as signalR from '@microsoft/signalr';
import { API_BASE_URL } from '../config/environment';

let controllerHub: signalR.HubConnection | null = null;
let robotHub: signalR.HubConnection | null = null;
let configuredAccessToken: string | null = null;
let currentControl = { x: 0, y: 0 };

export const setRobotAccessToken = (token: string | null) => {
  configuredAccessToken = token;
};

const publishControl = async (x: number, y: number): Promise<void> => {
  if (!controllerHub || controllerHub.state !== signalR.HubConnectionState.Connected) {
    return;
  }

  try {
    await controllerHub.invoke('SendControlInput', x, y);
  } catch (error) {
    console.error('[Ventol] Falha ao enviar comando ao Adan-Stella:', error);
  }
};

/**
 * Inicializa a assinatura de telemetria no backend.
 * RobotController conecta o cliente MQTT de telemetria ao receber este STOP.
 * O envio dos comandos contínuos continua sendo feito pelo ControllerHub.
 */
const initializeTelemetry = async (accessToken: string): Promise<void> => {
  try {
    const response = await fetch(API_BASE_URL + '/api/robot/command', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + accessToken,
      },
      body: JSON.stringify({ x: 0, y: 0 }),
    });

    if (!response.ok) {
      const details = await response.text().catch(() => '');
      console.warn(
        '[Ventol] Não foi possível inicializar a telemetria. HTTP ' +
          response.status + (details ? ': ' + details : '')
      );
    }
  } catch (error) {
    console.warn('[Ventol] Falha ao inicializar a telemetria:', error);
  }
};

export const initConnections = (
  onRobotData: (data: string) => void,
  onConnectionStatus: (connected: boolean) => void
): (() => void) => {
  const accessToken = configuredAccessToken;

  if (!accessToken) {
    onConnectionStatus(false);
    console.error('[Ventol] Não há sessão autenticada do Adan-Stella.');
    return () => undefined;
  }

  let disposed = false;
  let retryTimer: ReturnType<typeof setTimeout> | null = null;
  let heartbeatTimer: ReturnType<typeof setInterval> | null = null;

  const localControllerHub = new signalR.HubConnectionBuilder()
    .withUrl(API_BASE_URL + '/controllerHub', {
      accessTokenFactory: () => accessToken,
    })
    .withAutomaticReconnect()
    .build();

  const localRobotHub = new signalR.HubConnectionBuilder()
    .withUrl(API_BASE_URL + '/robotHub', {
      accessTokenFactory: () => accessToken,
    })
    .withAutomaticReconnect()
    .build();

  controllerHub = localControllerHub;
  robotHub = localRobotHub;

  localRobotHub.on('ReceiveRobotData', onRobotData);

  const updateStatus = () => {
    const connected =
      localControllerHub.state === signalR.HubConnectionState.Connected &&
      localRobotHub.state === signalR.HubConnectionState.Connected;

    onConnectionStatus(connected);

    if (!connected) {
      currentControl = { x: 0, y: 0 };
    }
  };

  const activateTelemetryIfConnected = () => {
    if (
      localControllerHub.state === signalR.HubConnectionState.Connected &&
      localRobotHub.state === signalR.HubConnectionState.Connected
    ) {
      void initializeTelemetry(accessToken);
    }
  };

  const scheduleRetry = () => {
    if (disposed || retryTimer !== null) return;

    retryTimer = setTimeout(() => {
      retryTimer = null;
      void startConnections();
    }, 5000);
  };

  const onReconnecting = () => {
    updateStatus();
  };

  const onReconnected = () => {
    updateStatus();
    activateTelemetryIfConnected();
  };

  localControllerHub.onreconnecting(onReconnecting);
  localRobotHub.onreconnecting(onReconnecting);
  localControllerHub.onreconnected(onReconnected);
  localRobotHub.onreconnected(onReconnected);

  localControllerHub.onclose(() => {
    updateStatus();
    scheduleRetry();
  });

  localRobotHub.onclose(() => {
    updateStatus();
    scheduleRetry();
  });

  const startConnections = async (): Promise<void> => {
    if (disposed) return;

    try {
      if (localControllerHub.state === signalR.HubConnectionState.Disconnected) {
        await localControllerHub.start();
      }

      if (localRobotHub.state === signalR.HubConnectionState.Disconnected) {
        await localRobotHub.start();
      }

      updateStatus();
      activateTelemetryIfConnected();
    } catch (error) {
      console.error('[Ventol] Erro ao conectar aos hubs SignalR:', error);
      updateStatus();
      scheduleRetry();
    }
  };

  heartbeatTimer = setInterval(() => {
    if (currentControl.x !== 0 || currentControl.y !== 0) {
      void publishControl(currentControl.x, currentControl.y);
    }
  }, 350);

  void startConnections();

  return () => {
    disposed = true;
    currentControl = { x: 0, y: 0 };

    if (retryTimer !== null) clearTimeout(retryTimer);
    if (heartbeatTimer !== null) clearInterval(heartbeatTimer);

    if (localControllerHub.state === signalR.HubConnectionState.Connected) {
      void localControllerHub.invoke('SendControlInput', 0, 0).catch(() => undefined);
    }

    void localControllerHub.stop();
    void localRobotHub.stop();

    if (controllerHub === localControllerHub) controllerHub = null;
    if (robotHub === localRobotHub) robotHub = null;

    onConnectionStatus(false);
  };
};

export const sendControl = async (x: number, y: number): Promise<void> => {
  // Never queue movement while offline; reconnecting must not restart an old command.
  if (!controllerHub || controllerHub.state !== signalR.HubConnectionState.Connected) {
    currentControl = { x: 0, y: 0 };
    return;
  }

  currentControl = { x, y };
  await publishControl(x, y);
};
