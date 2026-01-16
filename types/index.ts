
export interface TelemetryPoint {
  timestamp: string;
  temp_ext: number;
  temp_int: number;
  power_draw: number;
  voltage_bus: number;
  attitude_error: number;
  signal_strength: number;
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
