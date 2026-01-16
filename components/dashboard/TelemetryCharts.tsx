
import React, { useEffect, useRef } from 'react';
import Plotly from 'plotly.js-dist-min';
import { TelemetryPoint } from '../../types/index';

export const RealTimeChart: React.FC<{ data: TelemetryPoint[] }> = ({ data }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || data.length === 0) return;

    const traces: any[] = [
      {
        x: data.map(d => d.timestamp),
        y: data.map(d => d.temp_ext),
        name: 'Ext Temp',
        type: 'scatter',
        mode: 'lines',
        line: { color: '#f2495c', width: 1.5, shape: 'spline' },
        fill: 'tozeroy',
        fillcolor: 'rgba(242, 73, 92, 0.05)'
      },
      {
        x: data.map(d => d.timestamp),
        y: data.map(d => d.temp_int),
        name: 'Int Temp',
        type: 'scatter',
        mode: 'lines',
        line: { color: '#5794f2', width: 1.5 },
      }
    ];

    const layout = {
      paper_bgcolor: 'rgba(0,0,0,0)',
      plot_bgcolor: 'rgba(0,0,0,0)',
      margin: { t: 10, b: 30, l: 30, r: 10 },
      showlegend: true,
      legend: { font: { color: '#d8d9da', size: 9 }, orientation: 'h', x: 0, y: -0.2 },
      xaxis: { gridcolor: '#2c3235', tickfont: { color: '#7b8087', size: 9 }, zeroline: false },
      yaxis: { gridcolor: '#2c3235', tickfont: { color: '#7b8087', size: 9 }, zeroline: false },
    };

    Plotly.newPlot(containerRef.current, traces, layout, { responsive: true, displayModeBar: false });
  }, [data]);

  return <div ref={containerRef} className="w-full h-full" />;
};

export const PowerDistribution: React.FC<{ data: TelemetryPoint[] }> = ({ data }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || data.length === 0) return;

    const trace: any = {
      x: data.map(d => d.power_draw),
      type: 'histogram',
      marker: { color: '#73bf69', line: { color: '#181b1f', width: 1 } },
      opacity: 0.7,
    };

    const layout = {
      paper_bgcolor: 'rgba(0,0,0,0)',
      plot_bgcolor: 'rgba(0,0,0,0)',
      margin: { t: 10, b: 20, l: 20, r: 10 },
      xaxis: { gridcolor: '#2c3235', tickfont: { color: '#7b8087', size: 8 } },
      yaxis: { gridcolor: '#2c3235', tickfont: { color: '#7b8087', size: 8 } },
    };

    Plotly.newPlot(containerRef.current, [trace], layout, { responsive: true, displayModeBar: false });
  }, [data]);

  return <div ref={containerRef} className="w-full h-full" />;
};
