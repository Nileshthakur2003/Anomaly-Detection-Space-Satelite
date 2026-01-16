
export interface TelemetryPoint {
  timestamp: string;
  temp_ext: number; // Celsius
  temp_int: number; // Celsius
  power_draw: number; // Watts
  voltage_bus: number; // Volts
  attitude_error: number; // Degrees
  signal_strength: number; // dBm
}

export interface Satellite {
  id: string;
  name: string;
  type: string;
  orbit: string;
  status: 'operational' | 'degraded' | 'critical' | 'maintenance';
}

export interface AnomalyReport {
  id: string;
  timestamp: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  subsystem: string;
  description: string;
  aiAnalysis: string;
  suggestedAction: string;
}

export enum Subsystem {
  EPS = 'Electrical Power System',
  TCS = 'Thermal Control System',
  ADCS = 'Attitude Determination and Control',
  COMMS = 'Communication System',
  OBC = 'On-Board Computer'
}
