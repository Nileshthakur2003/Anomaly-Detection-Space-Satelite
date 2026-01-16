
import { Satellite, TelemetryPoint } from '../types/index';

export const SATELLITES: Satellite[] = [
  { id: 'EOS-1', name: 'EOS-1 Alpha', type: 'Earth Observation', orbit: 'LEO', status: 'operational' },
  { id: 'COM-4', name: 'CommStar-4', type: 'Communications', orbit: 'GEO', status: 'degraded' },
  { id: 'NAV-9', name: 'NavCore-9', type: 'Navigation', orbit: 'MEO', status: 'operational' },
  { id: 'RS-X', name: 'Resue-X', type: 'Experimental', orbit: 'SSO', status: 'critical' },
];

export const generateMockTelemetry = (count: number = 30): TelemetryPoint[] => {
  const data: TelemetryPoint[] = [];
  const now = Date.now();
  
  for (let i = 0; i < count; i++) {
    const time = new Date(now - (count - i) * 10000).toLocaleTimeString();
    data.push({
      timestamp: time,
      temp_ext: -100 + Math.random() * 200,
      temp_int: 20 + Math.random() * 15,
      power_draw: 45 + Math.random() * 10,
      voltage_bus: 28 + (Math.random() - 0.5) * 0.1,
      attitude_error: Math.random() * 0.5,
      signal_strength: -85 + Math.random() * 10,
    });
  }
  return data;
};
