import React from 'react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid 
} from 'recharts';
import Card from '../ui/Card';

// Fallback hex codes for SVG fill support across older rendering contexts
const HEX_FALLBACKS = {
  LOW: '#3b82f6',
  MEDIUM: '#eab308',
  HIGH: '#f97316',
  CRITICAL: '#ef4444'
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        backgroundColor: 'var(--bg-secondary)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-md)',
        padding: '8px 12px',
        boxShadow: 'var(--shadow-md)',
        fontSize: '0.8rem',
        color: 'var(--text-primary)'
      }}>
        {label && <div style={{ color: 'var(--text-muted)', marginBottom: '4px', fontSize: '0.75rem' }}>{label}</div>}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ 
            width: '8px', 
            height: '8px', 
            borderRadius: '50%', 
            backgroundColor: payload[0].color || 'var(--brand-color)' 
          }} />
          <span style={{ fontWeight: 600 }}>{payload[0].name || 'Events'}: {payload[0].value}</span>
        </div>
      </div>
    );
  }
  return null;
};

export const SeverityChart = ({ data = {} }) => {
  const chartData = [
    { name: 'Low', key: 'LOW', value: data.LOW || 0, color: HEX_FALLBACKS.LOW },
    { name: 'Medium', key: 'MEDIUM', value: data.MEDIUM || 0, color: HEX_FALLBACKS.MEDIUM },
    { name: 'High', key: 'HIGH', value: data.HIGH || 0, color: HEX_FALLBACKS.HIGH },
    { name: 'Critical', key: 'CRITICAL', value: data.CRITICAL || 0, color: HEX_FALLBACKS.CRITICAL }
  ].filter(item => item.value > 0);

  const totalEvents = (data.LOW || 0) + (data.MEDIUM || 0) + (data.HIGH || 0) + (data.CRITICAL || 0);

  return (
    <Card 
      title="Severity Breakdown" 
      subtitle="Threats and events by risk tier"
      className="chart-card"
    >
      <div style={{ width: '100%', height: 260, position: 'relative' }}>
        {chartData.length === 0 ? (
          <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            No severity data available
          </div>
        ) : (
          <>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  innerRadius={65}
                  outerRadius={88}
                  paddingAngle={4}
                  dataKey="value"
                  animationDuration={800}
                >
                  {chartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.color} 
                      stroke="var(--bg-secondary)" 
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Center Summary Counter */}
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
              pointerEvents: 'none'
            }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.1 }}>
                {totalEvents}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Total
              </div>
            </div>
          </>
        )}
      </div>

      <div className="chart-legend">
        {chartData.map((entry, index) => (
          <div key={index} className="legend-item">
            <span className="legend-color" style={{ backgroundColor: entry.color }}></span>
            <span className="legend-label">{entry.name}: <strong>{entry.value}</strong></span>
          </div>
        ))}
      </div>
    </Card>
  );
};

export const EventTrendChart = ({ data }) => {
  const trendData = data || [];

  return (
    <Card 
      title="Security Event Trend" 
      subtitle="Ingestion volume across the last 24 hours"
      className="chart-card"
    >
      <div style={{ width: '100%', height: 260 }}>
        {trendData.length === 0 ? (
          <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            No trend telemetry available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData} margin={{ top: 15, right: 15, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorEvents" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--brand-color, #3b82f6)" stopOpacity={0.35}/>
                  <stop offset="95%" stopColor="var(--brand-color, #3b82f6)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} opacity={0.6} />
              <XAxis 
                dataKey="time" 
                stroke="var(--text-muted)" 
                fontSize={11} 
                tickLine={false}
                axisLine={{ stroke: 'var(--border-color)' }}
              />
              <YAxis 
                stroke="var(--text-muted)" 
                fontSize={11} 
                tickLine={false} 
                axisLine={false} 
                allowDecimals={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="events" 
                stroke="var(--brand-color, #3b82f6)" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorEvents)" 
                animationDuration={800}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
};
