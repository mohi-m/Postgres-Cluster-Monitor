import React, { useState } from 'react'
import { Search, Database, Zap, TrendingUp } from 'lucide-react'
import { Card, CardTitle, StatBox, Badge } from './UI'

export default function QueryBuilder({ onQuery, loading, recordCount }) {
  const [limit, setLimit] = useState(500)

  const handleFetch = () => {
    const numLimit = Math.max(1, Math.min(10000, parseInt(limit) || 500))
    setLimit(numLimit)
    onQuery(numLimit)
  }

  const presets = [
    { label: 'Last 100', value: 100 },
    { label: 'Last 500', value: 500 },
    { label: 'Last 1,000', value: 1000 },
    { label: 'Last 5,000', value: 5000 },
    { label: 'Last 10,000', value: 10000 }
  ]

  return (
    <div className="space-y-6">
      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Query Builder Card */}
        <Card gradient className="flex flex-col justify-between">
          <div>
            <CardTitle icon={Search}>Query Builder</CardTitle>

            <div className="space-y-5">
              {/* Input Row */}
              <div>
                <label className="block text-sm font-semibold text-slate-200 mb-3">
                  📊 Number of Records
                </label>
                <div className="flex gap-3">
                  <input
                    type="number"
                    min="1"
                    max="10000"
                    value={limit}
                    onChange={(e) => setLimit(e.target.value)}
                    className="flex-1 px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="Enter number (1-10000)"
                  />
                  <button
                    onClick={handleFetch}
                    disabled={loading}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-600 disabled:to-gray-700 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-blue-glow"
                  >
                    <Zap className="w-4 h-4" />
                    {loading ? 'Fetching...' : 'Execute'}
                  </button>
                </div>
              </div>

              {/* Preset Buttons */}
              <div>
                <label className="block text-sm font-semibold text-slate-200 mb-3">
                  ⚡ Quick Presets
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {presets.map((preset) => (
                    <button
                      key={preset.value}
                      onClick={() => {
                        setLimit(preset.value)
                        onQuery(preset.value)
                      }}
                      disabled={loading}
                      className="px-3 py-2 bg-slate-700 hover:bg-slate-600 disabled:bg-gray-700 rounded-lg text-sm font-medium transition duration-200 border border-slate-600 hover:border-slate-500"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Stats Box */}
          <div className="mt-6 p-4 bg-black bg-opacity-30 rounded-lg border border-slate-600">
            <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold mb-2">Current Dataset</p>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-black text-green-400">{recordCount}</p>
              <p className="text-sm text-slate-400">records loaded</p>
            </div>
          </div>
        </Card>

        {/* SQL Info Card */}
        <Card gradient>
          <CardTitle icon={Database}>Query Details</CardTitle>

          <div className="space-y-4">
            <div>
              <p className="text-sm font-semibold text-slate-200 mb-2">📝 SQL Statement</p>
              <div className="bg-slate-950 p-4 rounded-lg border border-slate-700 font-mono text-xs text-slate-300 overflow-x-auto shadow-inner">
                <div className="whitespace-pre-wrap">
                  <span className="text-blue-300">SELECT</span> * 
                  <br/>
                  <span className="text-blue-300">FROM</span> public.data_bitcoin
                  <br/>
                  <span className="text-blue-300">ORDER BY</span> open_time <span className="text-yellow-300">DESC</span>
                  <br/>
                  <span className="text-blue-300">LIMIT</span> <span className="text-green-300">{limit || 'N'}</span>;
                </div>
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-200 mb-2">🔄 Data Flow Route</p>
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <Badge variant="primary">GET /data</Badge>
                <span className="text-slate-400">→</span>
                <Badge variant="warning">pgBouncer</Badge>
                <span className="text-slate-400">→</span>
                <Badge variant="success">Read Replica</Badge>
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-200 mb-2">✨ Features</p>
              <ul className="space-y-1 text-slate-300 text-xs">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                  Load balancing across replicas
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                  Connection pooling via pgBouncer
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                  Async query execution
                </li>
              </ul>
            </div>
          </div>
        </Card>
      </div>

      {/* Advanced Options */}
      <Card gradient>
        <CardTitle icon={TrendingUp}>Advanced Options</CardTitle>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-200 mb-3">
              📅 Time Range Filter
            </label>
            <div className="relative">
              <input
                type="text"
                disabled
                placeholder="Coming soon..."
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-400 cursor-not-allowed opacity-50"
              />
              <Badge variant="info" className="absolute right-2 top-1/2 -translate-y-1/2 text-xs">
                Soon
              </Badge>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-200 mb-3">
              💰 Price Range Filter
            </label>
            <div className="relative">
              <input
                type="text"
                disabled
                placeholder="Coming soon..."
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-400 cursor-not-allowed opacity-50"
              />
              <Badge variant="info" className="absolute right-2 top-1/2 -translate-y-1/2 text-xs">
                Soon
              </Badge>
            </div>
          </div>
        </div>

        <p className="text-xs text-slate-400 mt-4 flex items-center gap-2">
          <span className="text-blue-400">💡</span> Additional filters and export functionality coming soon
        </p>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatBox label="Total Records" value={recordCount.toLocaleString()} color="blue" icon={Database} />
        <StatBox label="Query Type" value="SELECT" color="green" />
        <StatBox label="Cache Size" value="Disabled" color="purple" />
        <StatBox label="Pool Mode" value="Transaction" color="orange" />
      </div>
    </div>
  )
}
