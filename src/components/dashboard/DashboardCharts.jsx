import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts';
import Card from '../ui/Card';

const COLORS = {
  LOW: '#4ade80',     // Green
  MEDIUM: '#facc15',  // Yellow
  HIGH: '#f97316',    // Orange
  CRITICAL: '#ef4444' // Red
};

export const SeverityChart = ({ data }) => {
  const chartData = [
    { name: 'Low', value: data.LOW, color: COLORS.LOW },
    { name: 'Medium', value: data.MEDIUM, color: COLORS.MEDIUM },
    { name: 'High', value: data.HIGH, color: COLORS.HIGH },
    { name: 'Critical', value: data.CRITICAL, color: COLORS.CRITICAL }
  ].filter(item => item.value > 0);

  return (
    <Card title="Severity Overview" className="chart-card">
      <div style={{ width: '100%', height: 250 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={chartData}
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '4px' }}
              itemStyle={{ color: '#e2e8f0' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="chart-legend">
        {chartData.map((entry, index) => (
          <div key={index} className="legend-item">
            <span className="legend-color" style={{ backgroundColor: entry.color }}></span>
            <span className="legend-label">{entry.name}: {entry.value}</span>
          </div>
        ))}
      </div>
    </Card>
  );
};

export const EventTrendChart = ({ data }) => {
  const trendData = data || [];

  return (
    <Card title="Security Event Trend (24h)" className="chart-card">
      <div style={{ width: '100%', height: 250 }}>
        <ResponsiveContainer>
          <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorEvents" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
            <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} tickLine={false} />
            <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '4px' }}
              itemStyle={{ color: '#e2e8f0' }}
            />
            <Area type="monotone" dataKey="events" stroke="#3b82f6" fillOpacity={1} fill="url(#colorEvents)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
