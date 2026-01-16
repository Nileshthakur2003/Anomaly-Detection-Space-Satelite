
import React, { useState, useEffect, useRef } from 'react';
import Plotly from 'plotly.js-dist-min';
import { TelemetryPoint, Satellite, AnomalyReport } from '../types';
import { kafka } from '../services/kafka';
import { generateMockTelemetry } from '../constants';
import { analyzeTelemetryWithAI } from '../services/geminiService';
import GrafanaPanel from './GrafanaPanel';

interface DashboardProps {
  satellite: Satellite;
}

const Dashboard: React.FC<DashboardProps> = ({ satellite }) => {
  const [telemetryBuffer, setTelemetryBuffer] = useState<TelemetryPoint[]>(generateMockTelemetry(50));
  const [reports, setReports] = useState<AnomalyReport[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const chartRef = useRef<HTMLDivElement>(null);
  const heatRef = useRef<HTMLDivElement>(null);

  // Kafka Consumer
  useEffect(() => {
    const unsubscribe = kafka.subscribe(satellite.id, (msg) => {
      setTelemetryBuffer(prev => [...prev.slice(-99), msg]);
    });

    const producer = setInterval(() => {
      const last = telemetryBuffer[telemetryBuffer.length - 1] || generateMockTelemetry(1)[0];
      const next: TelemetryPoint = {
        timestamp: new Date().toLocaleTimeString(),
        temp_ext: last.temp_ext + (Math.random() - 0.5) * 4,
        temp_int: last.temp_int + (Math.random() - 0.5) * 1,
        power_draw: last.power_draw + (Math.random() - 0.5) * 2,
        voltage_bus: 28 + (Math.random() - 0.5) * 0.05,
        attitude_error: Math.max(0, last.attitude_error + (Math.random() - 0.5) * 0.02),
        signal_strength: -85 + (Math.random() - 0.5) * 2,
      };
      kafka.produce(satellite.id, next);
    }, 2000);

    return () => {
      unsubscribe();
      clearInterval(producer);
    };
  }, [satellite.id]);

  // Plotly Time Series
  useEffect(() => {
    if (!chartRef.current) return;

    const data: any[] = [
      {
        x: telemetryBuffer.map(t => t.timestamp),
        y: telemetryBuffer.map(t => t.temp_ext),
        name: 'Ext Temp',
        type: 'scatter',
        mode: 'lines',
        line: { color: '#f2495c', width: 2 },
        fill: 'tozeroy',
        fillcolor: 'rgba(242, 73, 92, 0.1)'
      },
      {
        x: telemetryBuffer.map(t => t.timestamp),
        y: telemetryBuffer.map(t => t.temp_int),
        name: 'Int Temp',
        type: 'scatter',
        mode: 'lines',
        line: { color: '#5794f2', width: 2 }
      }
    ];

    const layout = {
      paper_bgcolor: 'rgba(0,0,0,0)',
      plot_bgcolor: 'rgba(0,0,0,0)',
      margin: { t: 10, b: 30, l: 40, r: 10 },
      showlegend: true,
      legend: { font: { color: '#d8d9da', size: 10 }, orientation: 'h', y: -0.2 },
      xaxis: { gridcolor: '#2c3235', tickfont: { color: '#7b8087', size: 9 } },
      yaxis: { gridcolor: '#2c3235', tickfont: { color: '#7b8087', size: 9 } },
    };

    Plotly.newPlot(chartRef.current, data, layout, { responsive: true, displayModeBar: false });
  }, [telemetryBuffer]);

  // Plotly Subsystem Heatmap
  useEffect(() => {
    if (!heatRef.current) return;

    const subsystems = ['EPS', 'TCS', 'ADCS', 'COMMS', 'OBC'];
    const z = subsystems.map(() => telemetryBuffer.slice(-10).map(() => Math.random() * 100));

    const data: any[] = [{
      z: z,
      x: telemetryBuffer.slice(-10).map(t => t.timestamp),
      y: subsystems,
      type: 'heatmap',
      colorscale: [
        [0, '#1a1d21'],
        [0.5, '#5794f2'],
        [1, '#73bf69']
      ],
      showscale: false
    }];

    const layout = {
      paper_bgcolor: 'rgba(0,0,0,0)',
      plot_bgcolor: 'rgba(0,0,0,0)',
      margin: { t: 5, b: 20, l: 50, r: 5 },
      xaxis: { visible: false },
      yaxis: { tickfont: { color: '#d8d9da', size: 10 } }
    };

    Plotly.newPlot(heatRef.current, data, layout, { responsive: true, displayModeBar: false });
  }, [telemetryBuffer]);

  const runAIAnalysis = async () => {
    setIsAnalyzing(true);
    const report = await analyzeTelemetryWithAI(satellite.name, telemetryBuffer);
    if (report) setReports(prev => [report, ...prev]);
    setIsAnalyzing(false);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#0b0c0e] flex flex-col">
      {/* Grafana Top Bar */}
      <div className="h-12 border-b border-[#2c3235] bg-[#181b1f] flex items-center px-4 justify-between">
        <div className="flex items-center gap-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">{satellite.name} / Telemetry Analysis</h2>
            <span className="text-[10px] bg-emerald-500/10 text-emerald-500 px-2 py-0.5 border border-emerald-500/20 rounded">LIVE CONSUMING</span>
        </div>
        <div className="flex items-center gap-3">
             <button 
                onClick={runAIAnalysis}
                disabled={isAnalyzing}
                className="bg-[#2c3235] hover:bg-[#3c4245] text-[11px] font-bold px-4 py-1.5 rounded transition-all text-[#d8d9da] border border-[#4c5255] flex items-center gap-2"
             >
                {isAnalyzing ? "RUNNING QUERY..." : "RUN AI DIAGNOSTIC"}
             </button>
             <div className="h-6 w-[1px] bg-[#2c3235]"></div>
             <span className="text-[11px] font-mono text-cyan-500">KAFKA_OFFSET: {telemetryBuffer.length}</span>
        </div>
      </div>

      <div className="p-4 grid grid-cols-12 gap-4 auto-rows-[280px]">
        {/* Main Telemetry Panel */}
        <div className="col-span-12 lg:col-span-8">
            <GrafanaPanel title="Thermal & Power Bus (Kafka Stream)">
                <div ref={chartRef} className="w-full h-full"></div>
            </GrafanaPanel>
        </div>

        {/* Health Heatmap */}
        <div className="col-span-12 lg:col-span-4">
            <GrafanaPanel title="Subsystem Vector Health">
                <div ref={heatRef} className="w-full h-full"></div>
            </GrafanaPanel>
        </div>

        {/* Anomaly Feed (Industrial List) */}
        <div className="col-span-12 lg:col-span-12 row-span-2">
            <GrafanaPanel title="AI Anomaly Engine / Kafka Message Log">
                <div className="p-2 h-full overflow-y-auto">
                    {reports.length === 0 ? (
                        <div className="flex items-center justify-center h-full text-[#4c5255] text-xs uppercase font-bold tracking-[0.2em]">
                            Waiting for AI event trigger...
                        </div>
                    ) : (
                        <table className="w-full text-left text-[11px] border-collapse">
                            <thead>
                                <tr className="text-[#7b8087] border-b border-[#2c3235] bg-[#111217]">
                                    <th className="p-2 font-semibold">TIME</th>
                                    <th className="p-2 font-semibold">SUBSYSTEM</th>
                                    <th className="p-2 font-semibold">SEVERITY</th>
                                    <th className="p-2 font-semibold">AI DIAGNOSTIC</th>
                                    <th className="p-2 font-semibold">COMMAND</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reports.map(r => (
                                    <tr key={r.id} className="border-b border-[#2c3235] hover:bg-[#22252b] transition-colors">
                                        <td className="p-2 mono text-emerald-500">{r.timestamp}</td>
                                        <td className="p-2 font-bold text-white">{r.subsystem}</td>
                                        <td className="p-2">
                                            <span className={`px-2 py-0.5 rounded-sm font-bold ${
                                                r.severity === 'Critical' ? 'bg-[#f2495c] text-white' : 'bg-[#5794f2] text-white'
                                            }`}>
                                                {r.severity}
                                            </span>
                                        </td>
                                        <td className="p-2 text-[#d8d9da] max-w-md">{r.aiAnalysis}</td>
                                        <td className="p-2">
                                            <button className="text-[10px] bg-transparent border border-[#5794f2] text-[#5794f2] hover:bg-[#5794f2]/10 px-2 py-0.5 rounded uppercase font-bold">
                                                Execute Fix
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </GrafanaPanel>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
