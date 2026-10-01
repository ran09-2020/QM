import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  CartesianGrid 
} from 'recharts';
import { Loader2, Globe, Users, Eye, Clock } from 'lucide-react';
import './AdminStats.css'; // Import standard CSS file

const AdminStats = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('real'); // 'real' or 'admin'
  const [chartType, setChartType] = useState('pages'); // 'pages', 'days', 'months'
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const isAuth = localStorage.getItem('stats_admin_auth') === 'true';
    if (isAuth) {
      setIsAuthenticated(true);
      fetchData();
    } else {
      setLoading(false);
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'admin123') {
      localStorage.setItem('stats_admin_auth', 'true');
      setIsAuthenticated(true);
      setLoading(true);
      fetchData();
    } else {
      alert('סיסמה שגויה');
    }
  };

  const fetchData = async () => {
    setIsRefreshing(true);
    try {
      const { data: views, error } = await supabase
        .from('page_views')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      setData(views || []);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="admin-login-wrapper">
        <form onSubmit={handleLogin} className="admin-login-box">
          <h2 className="admin-login-title">כניסת מנהל למערכת סטטיסטיקות</h2>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="סיסמה"
            className="admin-login-input"
          />
          <button type="submit" className="admin-login-btn">
            כניסה
          </button>
        </form>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="admin-login-wrapper">
        <Loader2 className="animate-spin" size={48} color="#3b82f6" />
      </div>
    );
  }

  const filteredData = data.filter(row => {
    const isAdminRow = row.path.startsWith('[מנהל]');
    return viewMode === 'real' ? !isAdminRow : isAdminRow;
  });

  const totalViews = filteredData.length;
  const uniqueVisitors = new Set(filteredData.map(d => d.visitor_id)).size;
  const today = new Date().toISOString().split('T')[0];
  const viewsToday = filteredData.filter(d => d.created_at.startsWith(today)).length;

  const getChartData = () => {
    const map = {};
    if (chartType === 'pages') {
      filteredData.forEach(d => {
        const p = d.path.replace('[מנהל] ', '');
        map[p] = (map[p] || 0) + 1;
      });
      return Object.entries(map).map(([name, count]) => ({ name, count })).sort((a,b)=>b.count-a.count).slice(0, 10);
    } 
    if (chartType === 'days') {
      filteredData.forEach(d => {
        const date = d.created_at.split('T')[0];
        const formatted = date.split('-').reverse().join('.');
        map[formatted] = (map[formatted] || 0) + 1;
      });
      return Object.entries(map).map(([name, count]) => ({ name, count })).reverse();
    }
    if (chartType === 'months') {
      filteredData.forEach(d => {
        const month = d.created_at.substring(0, 7);
        map[month] = (map[month] || 0) + 1;
      });
      return Object.entries(map).map(([name, count]) => ({ name, count })).reverse();
    }
    return [];
  };
  
  const chartData = getChartData();

  const getBrowserIcon = (ua) => {
    if (!ua) return '🌐';
    if (ua.includes('Chrome')) return 'Chrome 🟠'; 
    if (ua.includes('Safari') && !ua.includes('Chrome')) return 'Safari 🔵'; 
    if (ua.includes('Firefox')) return 'Firefox 🦊';
    if (ua.includes('Edge')) return 'Edge 🌊';
    return '📱';
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="admin-tooltip">
          <p className="admin-tooltip-label">{label}</p>
          <p className="admin-tooltip-value">{payload[0].value} צפיות</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="admin-stats-wrapper">
      <div className="admin-stats-container">
        
        {/* Header Section */}
        <div className="admin-header">
          <button 
            onClick={fetchData}
            disabled={isRefreshing}
            className="admin-refresh-btn"
          >
            {isRefreshing ? <Loader2 size={18} className="animate-spin" /> : null}
            רענן נתונים
          </button>

          <div className="admin-header-right">
            <div className="admin-toggle">
              <button 
                onClick={() => setViewMode('real')}
                className={viewMode === 'real' ? 'active' : ''}
              >
                גולשים אמיתיים
              </button>
              <button 
                onClick={() => setViewMode('admin')}
                className={viewMode === 'admin' ? 'active' : ''}
              >
                בדיקות מנהל
              </button>
            </div>
            <h1 className="admin-title">
              לוח בקרה - אנליטיקס <Globe color="#3b82f6" size={32} />
            </h1>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="admin-kpi-grid">
          <div className="admin-card admin-kpi-content">
            <div className="admin-kpi-text">
              <p className="admin-kpi-label">סה"כ צפיות (1000 אחרונות)</p>
              <p className="admin-kpi-value">{totalViews}</p>
            </div>
            <div className="admin-kpi-icon">
              <Eye size={28} color="#3b82f6" />
            </div>
          </div>
          <div className="admin-card admin-kpi-content">
            <div className="admin-kpi-text">
              <p className="admin-kpi-label">מבקרים ייחודיים (Unique)</p>
              <p className="admin-kpi-value">{uniqueVisitors}</p>
            </div>
            <div className="admin-kpi-icon">
              <Users size={28} color="#a855f7" />
            </div>
          </div>
          <div className="admin-card admin-kpi-content">
            <div className="admin-kpi-text">
              <p className="admin-kpi-label">צפיות היום</p>
              <p className="admin-kpi-value">{viewsToday}</p>
            </div>
            <div className="admin-kpi-icon">
              <Clock size={28} color="#22c55e" />
            </div>
          </div>
        </div>

        {/* Chart Section */}
        <div className="admin-card admin-chart-section">
          <div className="admin-chart-header">
            <div className="admin-chart-tabs">
              {[
                { id: 'pages', label: 'דפים' },
                { id: 'days', label: 'ימים' },
                { id: 'months', label: 'חודשים' }
              ].map(type => (
                <button 
                  key={type.id}
                  onClick={() => setChartType(type.id)}
                  className={chartType === type.id ? 'active' : ''}
                >
                  {type.label}
                </button>
              ))}
            </div>
            <h2 className="admin-chart-title">פילוח צפיות</h2>
          </div>
          <div className="admin-chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2a2e39" />
                <XAxis 
                  dataKey="name" 
                  tick={{fill: '#8b949e', fontSize: 12}} 
                  axisLine={{stroke: '#2a2e39'}}
                  tickLine={false}
                  dy={10}
                />
                <YAxis 
                  tick={{fill: '#8b949e', fontSize: 12}} 
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} cursor={{fill: '#2a2e39', opacity: 0.4}} />
                <Bar 
                  dataKey="count" 
                  fill="#3b82f6" 
                  radius={[4, 4, 0, 0]} 
                  maxBarSize={80}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Table Section */}
        <div className="admin-card admin-table-wrapper" style={{padding: 0}}>
          <div className="admin-table-header">
            <h2 className="admin-table-title">צפיות אחרונות (פירוט דחוס)</h2>
          </div>
          <div className="admin-table-scroll">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>זמן</th>
                  <th>עמוד</th>
                  <th>גולש</th>
                  <th>אזור</th>
                  <th>דפדפן</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.slice(0, 100).map((row) => {
                  const date = new Date(row.created_at);
                  const timeString = date.toLocaleTimeString('he-IL', { hour: '2-digit', minute:'2-digit' });
                  const dateString = date.toLocaleDateString('he-IL');
                  
                  return (
                    <tr key={row.id}>
                      <td>
                        <div className="admin-time">{timeString}</div>
                        <div className="admin-date">{dateString}</div>
                      </td>
                      <td className="admin-path" dir="ltr">
                        {row.path}
                      </td>
                      <td className="admin-visitor">
                        {row.visitor_id.substring(0, 6)}
                      </td>
                      <td>
                        <div className="admin-region">
                          {row.region !== 'Unknown' ? `${row.region}, ${row.country}` : row.country}
                        </div>
                      </td>
                      <td className="admin-browser">
                        {getBrowserIcon(row.user_agent)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default AdminStats;
