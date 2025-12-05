import React from 'react'

export function Card({ children, className = '', gradient = false }) {
  const baseClass = "rounded-xl p-6 border border-slate-700 backdrop-blur-sm"
  const gradientClass = gradient ? "bg-gradient-to-br from-slate-800 to-slate-900" : "bg-slate-800 bg-opacity-50"
  
  return (
    <div className={`${baseClass} ${gradientClass} ${className} shadow-lg hover:shadow-xl transition-all duration-300`}>
      {children}
    </div>
  )
}

export function CardTitle({ children, icon: Icon, className = '' }) {
  return (
    <h2 className={`text-xl font-bold text-white mb-4 flex items-center gap-3 ${className}`}>
      {Icon && <Icon className="w-6 h-6 text-blue-400" />}
      {children}
    </h2>
  )
}

export function Badge({ children, variant = 'default', className = '' }) {
  const variants = {
    default: 'bg-slate-700 text-slate-200',
    success: 'bg-green-900 text-green-200',
    error: 'bg-red-900 text-red-200',
    warning: 'bg-yellow-900 text-yellow-200',
    info: 'bg-blue-900 text-blue-200',
    primary: 'bg-blue-600 text-blue-100',
  }
  
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${variants[variant]} ${className}`}>
      {children}
    </span>
  )
}

export function StatBox({ label, value, icon: Icon, color = 'blue' }) {
  const colors = {
    blue: 'from-blue-600 to-blue-700',
    green: 'from-green-600 to-green-700',
    purple: 'from-purple-600 to-purple-700',
    orange: 'from-orange-600 to-orange-700',
    red: 'from-red-600 to-red-700',
  }
  
  return (
    <div className={`bg-gradient-to-br ${colors[color]} rounded-lg p-4 shadow-lg`}>
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs text-gray-100 uppercase tracking-wide font-semibold">{label}</p>
        {Icon && <Icon className="w-5 h-5 text-white opacity-60" />}
      </div>
      <p className="text-3xl font-bold text-white">{value}</p>
    </div>
  )
}

export function TabButton({ active, children, onClick, icon: Icon }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 font-medium transition-all duration-200 border-b-2 flex items-center gap-2 ${
        active
          ? 'text-blue-400 border-blue-400'
          : 'text-slate-400 border-transparent hover:text-slate-300'
      }`}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {children}
    </button>
  )
}

export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center gap-2">
      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
    </div>
  )
}
