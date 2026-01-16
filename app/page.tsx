
import React, { useState, useEffect } from 'react';
import { useKafka } from '../hooks/useKafka';
import { kafka } from '../lib/kafka';
import { Satellite, AnomalyReport, TelemetryPoint } from '../types/index';
import { generateMockTelemetry } from '../lib/constants';
import { analyzeTelemetryWithAI } from '../lib/gemini';
import Panel from '../components/ui/Panel';
import { RealTimeChart, PowerDistribution } from '../components/dashboard/TelemetryCharts';

interface PageProps {
  satellite: Satellite;
}

const DashboardPage: React.FC<PageProps> = ({ satellite }) => {
  const telemetry = useKafka(satellite.id, generateMockTelemetry(60));
  const [reports, setReports] = useState<AnomalyReport[]>([]);
  const [isBusy, setIsBusy] = useState(false);

  // Background producer (simulating external Kafka stream)
  useEffect(() => {
    const producer = setInterval(() => {
      const last = telemetry[telemetry.length - 1];
      const next: TelemetryPoint = {
        timestamp: new Date().toLocaleTimeString(),
        temp_ext: last.temp_ext + (Math.random() - 0.5) * 5,
        temp_int: last.temp_int + (Math.random() - 0.5) * 1,
        power_draw: Math.max(30, last.power_draw + (Math.random() - 0.5) * 4),
        voltage_bus: 28 + (Math.random() - 0.5) * 0.05,
        attitude_error: Math.max(0, last.attitude_error + (Math.random() - 0.5) * 0.05),
        signal_strength: Math.min(-60, last.signal_strength + (Math.random() - 0.5) * 3),
      };
      kafka.produce(satellite.id, next);
    }, 2000);
    return () => clearInterval(producer);
  }, [satellite.id, telemetry]);

  const handleAIQuery = async () => {
    setIsBusy(true);
    const report = await analyzeTelemetryWithAI(satellite.name, telemetry);
    if (report) setReports(prev => [report, ...prev]);
    setIsBusy(false);
  };

  const latest = telemetry[telemetry.length - 1];

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Page Header (Grafana Style) */}
      <header className="h-12 border-b border-[#2c3235] bg-[#181b1f] flex items-center px-4 justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-xs font-bold text-white uppercase tracking-wider">{satellite.name} / Telemetry Explorer</h1>
          <span className="text-[9px] font-mono text-cyan-500 bg-cyan-500/10 px-1.5 py-0.5 border border-cyan-500/20">EVENT_STREAMING</span>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={handleAIQuery}
            disabled={isBusy}
            className={`text-[10px] font-bold px-3 py-1.5 rounded-sm transition-all border ${
              isBusy ? 'bg-[#111217] text-[#4c5255] border-[#2c3235]' : 'bg-[#2c3235] text-[#d8d9da] border-[#4c5255] hover:bg-[#3c4245]'
            }`}
          >
            {isBusy ? 'AI PROCESSING OFFSET...' : 'AI DIAGNOSTIC SCAN'}
          </button>
          <div className="w-[1px] h-6 bg-[#2c3235] mx-1"></div>
          <span className="text-[10px] font-mono text-[#7b8087]">OFFSET: {telemetry.length}</span>
        </div>
      </header>

      {/* Main Grid */}
      <div className="flex-1 overflow-y-auto p-3 grid grid-cols-12 gap-3 auto-rows-[220px]">
        {/* Quick Stats */}
        <div className="col-span-12 grid grid-cols-4 gap-3 h-20">
            {[
                { label: 'BUS_VOLTAGE', val: latest.voltage_bus.toFixed(3) + ' V', status: 'ok' as const },
                { label: 'POWER_LOAD', val: latest.power_draw.toFixed(1) + ' W', status: 'ok' as const },
                { label: 'ATTITUDE_ERR', val: latest.attitude_error.toFixed(4) + '°', status: latest.attitude_error > 0.4 ? 'warn' : 'ok' as const },
                { label: 'RSSI', val: latest.signal_strength.toFixed(0) + ' DBM', status: 'ok' as const }
            ].map((stat, i) => (
                <Panel key={i} title={stat.label} status={stat.status}>
                    <div className="flex items-center justify-center h-full">
                        <span className="text-2xl font-mono font-bold text-white tracking-tighter">{stat.val}</span>
                    </div>
                </Panel>
            ))}
        </div>

        {/* Main Charts */}
        <div className="col-span-12 lg:col-span-8 row-span-2">
            <Panel title="Real-time Thermal Convergence (KAFKA-PARTITION-0)">
                <RealTimeChart data={telemetry} />
            </Panel>
        </div>

        <div className="col-span-12 lg:col-span-4 row-span-2">
            <Panel title="Power Stability Histogram">
                <PowerDistribution data={telemetry} />
            </Panel>
        </div>

        {/* Anomaly Log Table */}
        <div className="col-span-12 row-span-2">
            <Panel title="AI Anomaly Engine / Global Event Log">
                <div className="h-full overflow-y-auto bg-[#111217]">
                    <table className="w-full text-left text-[10px] border-collapse">
                        <thead className="sticky top-0 bg-[#0b0c0e] z-10 shadow-sm shadow-[#2c3235]">
                            <tr className="text-[#7b8087] border-b border-[#2c3235]">
                                <th className="p-2 font-bold uppercase tracking-widest">TIMESTAMP</th>
                                <th className="p-2 font-bold uppercase tracking-widest">SUBSYSTEM</th>
                                <th className="p-2 font-bold uppercase tracking-widest">SEVERITY</th>
                                <th className="p-2 font-bold uppercase tracking-widest">ANALYSIS</th>
                                <th className="p-2 font-bold uppercase tracking-widest">ACTION</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reports.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-12 text-center text-[#4c5255] italic font-mono uppercase tracking-[0.3em]">
                                        --- No Anomalies Detected in Stream ---
                                    </td>
                                </tr>
                            ) : (
                                reports.map(r => (
                                    <tr key={r.id} className="border-b border-[#2c3235] hover:bg-[#181b1f] transition-colors group">
                                        <td className="p-2 font-mono text-cyan-500">{r.timestamp}</td>
                                        <td className="p-2 font-bold text-[#d8d9da]">{r.subsystem}</td>
                                        <td className="p-2">
                                            <span className={`px-1.5 py-0.5 rounded-sm font-bold ${
                                                r.severity === 'Critical' ? 'bg-[#f2495c] text-white' : 
                                                r.severity === 'High' ? 'bg-[#ff9830] text-black' : 'bg-[#5794f2] text-white'
                                            }`}>
                                                {r.severity}
                                            </span>
                                        </td>
                                        <td className="p-2 text-[#7b8087] group-hover:text-[#d8d9da] transition-colors leading-tight max-w-lg">{r.aiAnalysis}</td>
                                        <td className="p-2">
                                            <button className="bg-transparent border border-cyan-500 text-cyan-500 text-[9px] px-2 py-0.5 font-bold uppercase rounded-sm hover:bg-cyan-500 hover:text-white transition-all">
                                                Patch
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Panel>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
