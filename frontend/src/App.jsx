import React, { useEffect, useState } from 'react';
import { BarChart3, TrendingUp, Search, Zap, RefreshCw, Clock } from 'lucide-react';
import StatusGrid from './components/StatusGrid';
import DataChart from './components/DataChart';
import QueryBuilder from './components/QueryBuilder';
import { Card, CardTitle, TabButton } from './components/UI';

export default function App() {
  const [health, setHealth] = useState([]);
  const [data, setData] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const fetchHealth = async () => {
    try {
      const res = await fetch('/health');
      const result = await res.json();
      setHealth(result);
    } catch (e) {
      console.error('Health check failed:', e);
    }
  };

  const fetchData = async (limit = 500) => {
    setLoading(true);
    try {
      const res = await fetch(`/data?limit=${limit}`);
      const result = await res.json();
      setData(result.data || []);
      setLastUpdate(new Date());
    } catch (e) {
      console.error('Data fetch failed:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
    fetchData(500);

    const healthInterval = setInterval(fetchHealth, 10000);

    return () => clearInterval(healthInterval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Animated background gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-900 via-transparent to-purple-900 opacity-10 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <header className="mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
            <div className="p-3 bg-blue-600 rounded-lg w-fit">
              <BarChart3 className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Postgres Cluster Monitor
            </h1>
          </div>
          <p className="text-gray-400 text-base sm:text-lg mb-4">
            Real-time monitoring and stress testing for your Azure Postgres infrastructure
          </p>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-green-400" />
              <span>Updated: {lastUpdate.toLocaleTimeString()}</span>
            </div>
            <div className="hidden sm:block w-1 h-1 bg-gray-600 rounded-full" />
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span>Live monitoring</span>
            </div>
          </div>
        </header>

        {/* Tab Navigation */}
        <nav className="border-b border-gray-700 mb-8 pb-4 flex gap-2 flex-wrap">
          <TabButton
            active={activeTab === 'dashboard'}
            onClick={() => setActiveTab('dashboard')}
            icon={BarChart3}
          >
            Cluster Health
          </TabButton>
          <TabButton
            active={activeTab === 'chart'}
            onClick={() => setActiveTab('chart')}
            icon={TrendingUp}
          >
            Data Visualization
          </TabButton>
          <TabButton
            active={activeTab === 'query'}
            onClick={() => setActiveTab('query')}
            icon={Search}
          >
            Query Builder
          </TabButton>
          <TabButton
            active={activeTab === 'stress'}
            onClick={() => setActiveTab('stress')}
            icon={Zap}
          >
            Stress Test
          </TabButton>
        </nav>

        {/* Content Sections */}
        <main className="space-y-8">
          {activeTab === 'dashboard' && (
            <section className="space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold mb-1">Cluster Health Overview</h2>
                  <p className="text-gray-400">Monitor the status of your primary and replica nodes</p>
                </div>
                <button
                  onClick={fetchHealth}
                  className="p-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-all duration-200 shadow-lg hover:shadow-blue-glow"
                >
                  <RefreshCw className="w-5 h-5" />
                </button>
              </div>
              <StatusGrid nodes={health} />
            </section>
          )}

          {activeTab === 'chart' && (
            <section className="space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold mb-1">Data Visualization</h2>
                  <p className="text-gray-400">Historical data with volume analysis</p>
                </div>
                <button
                  onClick={() => fetchData(500)}
                  disabled={loading}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 shadow-lg"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                  {loading ? 'Loading...' : 'Refresh'}
                </button>
              </div>
              <Card gradient className="p-0 overflow-hidden">
                <div className="p-6 pb-0">
                  <p className="text-sm text-gray-400 mb-4 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-blue-400" />
                    Displaying {data.length} records
                  </p>
                </div>
                <DataChart data={data} />
              </Card>
            </section>
          )}

          {activeTab === 'query' && (
            <section className="animate-fadeIn">
              <QueryBuilder onQuery={fetchData} loading={loading} recordCount={data.length} />
            </section>
          )}

          {activeTab === 'stress' && (
            <section className="space-y-6 animate-fadeIn">
              <div>
                <h2 className="text-3xl font-bold mb-1 flex items-center gap-3">
                  <Zap className="w-8 h-8 text-yellow-400" />
                  Locust Load Testing
                </h2>
                <p className="text-gray-400 mt-2">
                  Run concurrent user simulations and monitor cluster performance degradation in real-time
                </p>
              </div>
              <Card className="p-0 overflow-hidden border-0 shadow-2xl">
                <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-6 py-4 border-b border-gray-700">
                  <p className="text-sm text-gray-400 flex items-center gap-2">
                    <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
                    Live Locust Web UI - Monitor tests while watching the Cluster Health tab
                  </p>
                </div>
                <iframe
                  title="locust-ui"
                  src="http://localhost:8089"
                  className="w-full"
                  style={{ height: '800px', border: 'none', background: '#0f172a' }}
                />
              </Card>
            </section>
          )}
        </main>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-gray-700 text-center text-gray-500 text-sm">
          <p>Postgres Cluster Monitor v0.1.0 • Built with React + Tailwind + Recharts</p>
        </footer>
      </div>
    </div>
  );
}
