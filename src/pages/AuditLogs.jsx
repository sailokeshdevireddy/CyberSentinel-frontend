import React, { useState, useEffect } from 'react';
import { getAuditLogs } from '../services/auditLogService';
import Spinner from '../components/ui/Spinner';
import ErrorState from '../components/ui/ErrorState';

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAction, setFilterAction] = useState('ALL');

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        const res = await getAuditLogs();
        if (res.success) {
          setLogs(res.data);
        } else {
          setError('Failed to fetch audit logs');
        }
      } catch (err) {
        setError('Error loading audit logs');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  if (loading) return <Spinner />;
  if (error) return <ErrorState message={error} />;

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.actorName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          log.targetId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAction = filterAction === 'ALL' || log.action === filterAction;
    return matchesSearch && matchesAction;
  });

  const actions = Array.from(new Set(logs.map(log => log.action)));

  return (
    <div className="page-container" style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Audit Logs</h2>
          <p className="text-muted">Track organization activities</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
        <input 
          type="text"
          placeholder="Search actor, action, target..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: '8px 12px', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: '6px', flex: 1 }}
        />
        <select 
          value={filterAction} 
          onChange={(e) => setFilterAction(e.target.value)}
          style={{ padding: '8px 12px', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: '6px' }}
        >
          <option value="ALL">All Actions</option>
          {actions.map(action => (
            <option key={action} value={action}>{action}</option>
          ))}
        </select>
      </div>

      {filteredLogs.length === 0 ? (
        <div style={{ padding: '40px', textAlign: 'center', background: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
          No audit logs found matching your criteria.
        </div>
      ) : (
        <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '8px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', background: 'var(--bg-primary)' }}>
                <th style={{ padding: '12px 16px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Occurred At</th>
                <th style={{ padding: '12px 16px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Actor</th>
                <th style={{ padding: '12px 16px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Action</th>
                <th style={{ padding: '12px 16px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Target</th>
                <th style={{ padding: '12px 16px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Result</th>
                <th style={{ padding: '12px 16px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>IP Address</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map(log => (
                <tr key={log.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '12px 16px', fontSize: '0.9rem' }}>{new Date(log.occurredAt).toLocaleString()}</td>
                  <td style={{ padding: '12px 16px', fontSize: '0.9rem' }}>
                    <div>{log.actorName}</div>
                    <div className="text-muted" style={{ fontSize: '0.75rem' }}>{log.actorId}</div>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: '0.9rem' }}>{log.action}</td>
                  <td style={{ padding: '12px 16px', fontSize: '0.9rem' }}>
                    <div>{log.targetType}</div>
                    <div className="text-muted" style={{ fontSize: '0.75rem', fontFamily: 'monospace' }}>{log.targetId}</div>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: '0.9rem' }}>
                    <span style={{ padding: '2px 6px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold', background: log.result === 'SUCCESS' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: log.result === 'SUCCESS' ? 'var(--status-success)' : 'var(--status-critical)' }}>
                      {log.result}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>{log.ipAddress}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AuditLogs;
