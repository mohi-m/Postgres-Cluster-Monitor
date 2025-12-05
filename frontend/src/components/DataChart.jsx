import React, { useMemo } from 'react'
import { ComposedChart, Bar, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export default function DataChart({ data = [] }) {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return []
    
    // Prepare data with formatting
    return data
      .slice()
      .reverse()
      .map((d, idx) => ({
        idx,
        time: d.open_time ? new Date(d.open_time).toLocaleTimeString() : `#${idx}`,
        open: parseFloat(d.open),
        high: parseFloat(d.high),
        low: parseFloat(d.low),
        close: parseFloat(d.close),
        volume: parseFloat(d.volume),
      }))
      .slice(0, 100) // Show last 100 for readability
  }, [data])

  const stats = useMemo(() => {
    if (chartData.length === 0) {
      return { min: 0, max: 0, avg: 0, range: 0 }
    }
    const closes = chartData.map(d => d.close)
    const min = Math.min(...closes)
    const max = Math.max(...closes)
    const avg = closes.reduce((a, b) => a + b, 0) / closes.length
    return { min: min.toFixed(2), max: max.toFixed(2), avg: avg.toFixed(2), range: (max - min).toFixed(2) }
  }, [chartData])

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length > 0) {
      const data = payload[0].payload
      return (
        <div className="bg-slate-800 border border-slate-600 rounded p-3 text-xs text-white shadow-lg">
          <p className="font-semibold mb-2">{data.time}</p>
          <p className="text-green-400">Open: ${data.open.toFixed(2)}</p>
          <p className="text-blue-400">High: ${data.high.toFixed(2)}</p>
          <p className="text-orange-400">Low: ${data.low.toFixed(2)}</p>
          <p className="text-purple-400">Close: ${data.close.toFixed(2)}</p>
          <p className="text-cyan-400 mt-2">Volume: {data.volume.toFixed(0)}</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Min Price', value: `$${stats.min}`, color: 'from-blue-600 to-blue-700' },
          { label: 'Max Price', value: `$${stats.max}`, color: 'from-green-600 to-green-700' },
          { label: 'Avg Price', value: `$${stats.avg}`, color: 'from-purple-600 to-purple-700' },
          { label: 'Range', value: `$${stats.range}`, color: 'from-orange-600 to-orange-700' }
        ].map((stat, idx) => (
          <div key={idx} className={`bg-gradient-to-br ${stat.color} rounded-lg p-4 shadow-lg flex flex-col justify-center items-start`}>
            <p className="text-xs text-gray-100 uppercase tracking-wide mb-2 font-semibold">{stat.label}</p>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Main Chart */}
      <div className="bg-slate-800 rounded-lg p-4">
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="volumeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.7} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="time" 
              tick={false}
              stroke="#64748b"
            />
            <YAxis 
              yAxisId="left" 
              stroke="#64748b"
              domain={['dataMin - 100', 'dataMax + 100']}
              label={{ value: 'Price (USD)', angle: -90, position: 'insideLeft' }}
            />
            <YAxis 
              yAxisId="right" 
              orientation="right" 
              stroke="#64748b"
              label={{ value: 'Volume', angle: 90, position: 'insideRight' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="line"
            />
            
            {/* Volume as background bars */}
            <Bar 
              yAxisId="right" 
              dataKey="volume" 
              fill="url(#volumeGradient)" 
              opacity={0.5}
              name="Volume"
            />
            
            {/* Price lines */}
            <Line 
              yAxisId="left" 
              type="monotone" 
              dataKey="open" 
              stroke="#10b981" 
              dot={false}
              strokeWidth={2}
              isAnimationActive={false}
              name="Open"
            />
            <Line 
              yAxisId="left" 
              type="monotone" 
              dataKey="close" 
              stroke="#f59e0b" 
              dot={false}
              strokeWidth={2}
              isAnimationActive={false}
              name="Close"
            />
            <Line 
              yAxisId="left" 
              type="monotone" 
              dataKey="high" 
              stroke="#8b5cf6" 
              strokeDasharray="5 5"
              dot={false}
              strokeWidth={1}
              isAnimationActive={false}
              name="High"
            />
            <Line 
              yAxisId="left" 
              type="monotone" 
              dataKey="low" 
              stroke="#ef4444" 
              strokeDasharray="5 5"
              dot={false}
              strokeWidth={1}
              isAnimationActive={false}
              name="Low"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Info Box */}
      <div className="bg-slate-700 rounded-lg p-4 text-sm text-slate-300">
        <p className="flex items-center gap-2">
          <span className="text-blue-400">●</span> Green = Open Price
        </p>
        <p className="flex items-center gap-2">
          <span className="text-yellow-400">●</span> Orange = Close Price
        </p>
        <p className="flex items-center gap-2">
          <span className="text-purple-400">●</span> Purple Dashed = High Price
        </p>
        <p className="flex items-center gap-2">
          <span className="text-red-400">●</span> Red Dashed = Low Price
        </p>
        <p className="flex items-center gap-2 mt-2">
          <span className="text-blue-400">█</span> Blue Bars = Trading Volume (right axis)
        </p>
      </div>
    </div>
  )
}
