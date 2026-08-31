// Contrato de dados de cada sensor retornado pelo ESP
export interface SensorData {
  id: string;
  name: string;
  value: string | number;
  unit: string;
  status: 'online' | 'offline' | 'warning';
  lastUpdated: string;
}

// Contrato dos atuadores do robô (Motores, LEDs, Buzzer)
export interface ActuatorData {
  id: string;
  name: string;
  type: 'switch' | 'button';
  isOn: boolean;
}

// Status geral do robô
export interface RobotStatus {
  robotId: string;
  batteryLevel: number;
  isConnected: boolean;
}