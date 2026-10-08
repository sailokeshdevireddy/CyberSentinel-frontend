import React, { useState, useEffect } from 'react';
import { getUser } from '../services/authService';
import { getDashboardData } from '../services/dashboardService';
import MetricCard from '../components/dashboard/MetricCard';
import { SeverityChart, EventTrendChart } from '../components/dashboard/DashboardCharts';
import { RecentEventsTable, RecentThreatsTable, RecentIncidentsTable } from '../components/dashboard/DashboardTables';
import ApplicationActivity from '../components/dashboard/ApplicationActivity';
import Spinner from '../components/ui/Spinner';
import ErrorState from '../components/ui/ErrorState';
import EmptyState from '../components/ui/EmptyState';
import { Shield, ShieldAlert, Target, Activity, AlertTriangle, BarChart2 } from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = getUser();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const dashboardData = await getDashboardData();
        // Unwrap backend envelope
        if (dashboardData.success) {
          setData(dashboardData.data);
          setError(null);
        } else {
          setError("Failed to load dashboard data. Please try again later.");
        }
      } catch (err) {
        setError("Failed to load dashboard data. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  if (loading) return <div className="dashboard-loading"><Spinner size="large" /></div>;
  if (error) return <div className="dashboard-error"><ErrorState message={error} onRetry={() => window.location.reload()} /></div>;
  if (!data) return <div className="dashboard-empty"><EmptyState title="No Data" message="No dashboard data available for your organization." /></div>;

  const { metrics, severityBreakdown, recentEvents, recentThreats, recentIncidents, applicationActivity } = data;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Overview</h1>
        <p className="dashboard-subtitle">Organization Security Posture</p>
      </div>

      <div className="metrics-grid">
        <MetricCard title="Total Applications" value={metrics.totalApplications} icon={Activity} />
        <MetricCard title="Events Today" value={metrics.eventsToday} icon={Shield} />
        <MetricCard title="Open Threats" value={metrics.openThreats} icon={Target} />
        <MetricCard title="Open Incidents" value={metrics.openIncidents} icon={AlertTriangle} />
        <MetricCard title="Critical Incidents" value={metrics.criticalIncidents} icon={ShieldAlert} critical={metrics.criticalIncidents > 0} />
        <MetricCard title="Average Risk Score" value={metrics.averageRiskScore !== null ? metrics.averageRiskScore : 'N/A'} icon={BarChart2} />
      </div>

      <div className="charts-grid">
        <SeverityChart data={severityBreakdown} />
        <EventTrendChart data={data.eventTrend} />
      </div>

      <div className="activity-grid">
        <div className="activity-main">
          <RecentIncidentsTable incidents={recentIncidents} />
          <RecentThreatsTable threats={recentThreats} />
          <RecentEventsTable events={recentEvents} />
        </div>
        <div className="activity-sidebar">
          <ApplicationActivity applications={applicationActivity} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
