import React, { useState, useEffect } from 'react';
import { getAuditLogs } from '../services/auditLogService';
import { Search, Clock, User } from 'lucide-react';
import Spinner from '../components/ui/Spinner';
import ErrorState from '../components/ui/ErrorState';
import EmptyState from '../components/ui/EmptyState';

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

  if (loading) return <Spinner message="Loading audit trail records..." />;
  if (error) return <ErrorState message={error} />;

  const filteredLogs = logs.filter(log => {
    const matchesSearch = (log.actorName || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (log.action || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (log.targetId || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAction = filterAction === 'ALL' || log.action === filterAction;
    return matchesSearch && matchesAction;
  });

  const actions = Array.from(new Set(logs.map(log => log.action).filter(Boolean)));

  return (
    <div className="page-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 className="page-title">Audit Logs</h1>
          <p className="page-subtitle">Immutable compliance audit trail, administrative operations, and security action logs</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--brand-color)' }}></span>
          <span>{filteredLogs.length} audit entries</span>
        </div>
      </div>

      <div className="card">
        {/* Table Toolbar */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            background: 'var(--bg-primary)', 
            padding: '8px 14px', 
            borderRadius: 'var(--radius-md)', 
            border: '1px solid var(--border-color)', 
            flex: 1,
            minWidth: '240px'
          }}>
            <Search size={16} className="text-muted" style={{ marginRight: '10px', flexShrink: 0 }} />
            <input 
              type="text"
              placeholder="Search by actor name, action, or target ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ 
                background: 'transparent', 
                border: 'none', 
                color: 'var(--text-primary)', 
                outline: 'none', 
                width: '100%',
                fontSize: '0.875rem'
              }}
            />
          </div>

          <select 
            value={filterAction} 
            onChange={(e) => setFilterAction(e.target.value)}
            className="form-control"
            style={{ width: '180px' }}
          >
            <option value="ALL">All Actions ({actions.length})</option>
            {actions.map(action => (
              <option key={action} value={action}>{action}</option>
            ))}
          </select>
        </div>

        {filteredLogs.length === 0 ? (
          <EmptyState 
            title="No audit logs found" 
            message="No activity records match the current filter or search criteria." 
          />
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Actor / Identity</th>
                  <th>Action</th>
                  <th>Target Entity</th>
                  <th>Result</th>
                  <th>Client IP</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map(log => (
                  <tr key={log.id} className="hover-row">
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                      <Clock size={12} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
                      {new Date(log.occurredAt).toLocaleString()}
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: 'var(--hover-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--brand-color)', flexShrink: 0 }}>
                          <User size={13} />
                        </div>
                        <div>
                          <strong style={{ fontSize: '0.85rem' }}>{log.actorName}</strong>
                          <div className="text-muted" style={{ fontSize: '0.725rem', fontFamily: 'var(--font-mono, monospace)' }}>
                            {log.actorId}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span style={{ 
                        fontFamily: 'var(--font-mono, monospace)', 
                        fontSize: '0.8rem', 
                        fontWeight: 600,
                        padding: '3px 8px',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: 'var(--bg-primary)',
                        border: '1px solid var(--border-color)',
                        color: 'var(--brand-color)'
                      }}>
                        {log.action}
                      </span>
                    </td>
                    <td>
                      <div>
                        <span style={{ fontSize: '0.825rem', fontWeight: 600 }}>{log.targetType}</span>
                        <div className="text-muted" style={{ fontSize: '0.725rem', fontFamily: 'var(--font-mono, monospace)' }}>
                          {log.targetId}
                        </div>
                      </div>
                    </td>
                    <td>
                      <span style={{ 
                        display: 'inline-flex',
                        alignItems: 'center',
                        padding: '2px 8px', 
                        borderRadius: 'var(--radius-full)', 
                        fontSize: '0.725rem', 
                        fontWeight: 700, 
                        background: log.result === 'SUCCESS' ? 'var(--status-success-bg)' : 'var(--status-critical-bg)', 
                        color: log.result === 'SUCCESS' ? 'var(--status-success)' : 'var(--status-critical)',
                        border: `1px solid ${log.result === 'SUCCESS' ? 'var(--status-success-border)' : 'var(--status-critical-border)'}`
                      }}>
                        {log.result}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono, monospace)' }}>
                      {log.ipAddress}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuditLogs;
