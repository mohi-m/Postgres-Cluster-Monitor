import React from 'react'
import { Server, Activity, AlertCircle, CheckCircle } from 'lucide-react'
import { Card, Badge } from './UI'

export default function StatusGrid({ nodes = [] }) {
  const getPrimaryLabel = (host) => {
    const ips = ['4.155.229.148', '20.3.208.164', '20.171.8.192']
    const labels = ['Primary (Write)', 'Secondary 1 (Read)', 'Secondary 2 (Read)']
    const idx = ips.indexOf(host)
    return idx >= 0 ? labels[idx] : 'Unknown'
  }

  const getNodeColor = (up, latency) => {
    if (!up) return 'from-red-900 to-red-800 border-red-600'
    if (latency < 20) return 'from-green-900 to-green-800 border-green-600'
    if (latency < 50) return 'from-yellow-900 to-yellow-800 border-yellow-600'
    return 'from-orange-900 to-orange-800 border-orange-600'
  }

  const getStatusVariant = (up, latency) => {
    if (!up) return 'error'
    if (latency < 20) return 'success'
    if (latency < 50) return 'warning'
    return 'info'
  }

  const getLatencyColor = (latency) => {
    if (latency < 20) return 'text-green-300'
    if (latency < 50) return 'text-yellow-300'
    return 'text-orange-300'
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {nodes.map(n => (
        <Card
          key={n.host}
          gradient
          className={`bg-gradient-to-br ${getNodeColor(n.up, n.latency_ms)} border-2 hover:scale-105 transform transition-transform duration-300`}
        >
          {/* Header with Icon and Badge */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-start gap-3 flex-1">
              <div className={`p-3 rounded-lg ${n.up ? 'bg-green-900 bg-opacity-50' : 'bg-red-900 bg-opacity-50'}`}>
                <Server className={`w-6 h-6 ${n.up ? 'text-green-300' : 'text-red-300'}`} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-white">{getPrimaryLabel(n.host)}</h3>
                <p className="text-xs text-slate-300 font-mono mt-1">{n.host}</p>
              </div>
            </div>
            <Badge variant={getStatusVariant(n.up, n.latency_ms)}>
              {n.up ? 'UP' : 'DOWN'}
            </Badge>
          </div>

          {/* Status Indicator */}
          <div className="mb-6 p-4 bg-black bg-opacity-30 rounded-lg border border-white border-opacity-10">
            <div className="flex items-center gap-3 mb-3">
              {n.up ? (
                <CheckCircle className="w-5 h-5 text-green-300 animate-pulse" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-300 animate-pulse" />
              )}
              <span className="text-sm font-medium">
                {n.up ? 'Responding normally' : 'Connection failed'}
              </span>
            </div>
          </div>

          {/* Latency Section */}
          <div className="mb-6">
            <p className="text-xs text-slate-300 uppercase tracking-widest font-semibold mb-3">Response Time</p>
            <div className="flex items-baseline gap-2">
              <p className={`text-4xl font-black ${getLatencyColor(n.latency_ms)}`}>
                {n.latency_ms !== null && n.latency_ms !== undefined ? n.latency_ms : '--'}
              </p>
              <span className="text-sm text-slate-400">ms</span>
            </div>
          </div>

          {/* Health Bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-slate-300 uppercase tracking-widest font-semibold">Connection Health</p>
              <span className="text-xs px-2 py-1 bg-black bg-opacity-30 rounded">
                {n.up ? '100%' : '0%'}
              </span>
            </div>
            <div className="bg-black bg-opacity-30 rounded-full h-3 overflow-hidden border border-white border-opacity-10">
              <div
                className={`h-full transition-all duration-500 ${
                  n.up
                    ? 'bg-gradient-to-r from-green-400 to-emerald-300'
                    : 'bg-gradient-to-r from-red-400 to-rose-300'
                }`}
                style={{ width: n.up ? '100%' : '0%' }}
              />
            </div>
          </div>

          {/* Status Indicator Dot */}
          <div className="flex items-center gap-2 pt-4 border-t border-white border-opacity-10">
            <div
              className={`w-3 h-3 rounded-full ${
                n.up ? 'bg-green-400 animate-pulse shadow-lg shadow-green-400' : 'bg-red-400 animate-pulse shadow-lg shadow-red-400'
              }`}
            />
            <span className="text-xs text-slate-400">
              {n.up ? 'Live monitoring active' : 'Offline - awaiting reconnection'}
            </span>
          </div>
        </Card>
      ))}
    </div>
  )
}
