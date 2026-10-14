import React, { useState, useEffect } from 'react';
import { getOrganizationById } from '../services/organizationService';
import { getUser } from '../services/authService';
import { Building, Shield, Clock, Hash, Tag } from 'lucide-react';
import Spinner from '../components/ui/Spinner';
import ErrorState from '../components/ui/ErrorState';
import StatusBadge from '../components/ui/StatusBadge';

const Organizations = () => {
  const [organization, setOrganization] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const user = getUser();

  useEffect(() => {
    const fetchOrg = async () => {
      try {
        setLoading(true);
        if (user && user.organizationId) {
          const res = await getOrganizationById(user.organizationId);
          if (res.success) {
            setOrganization(res.data);
          }
        } else {
          setError('No organization context found for user.');
        }
      } catch (err) {
        setError('Failed to load organization data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrg();
  }, [user]);

  if (loading) return <Spinner message="Loading organization context..." />;
  if (error) return <ErrorState message={error} />;
  
  if (!organization) {
    return (
      <div className="page-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div className="page-header">
          <h1 className="page-title">Organization Context</h1>
          <p className="page-subtitle">Tenant workspace isolation and governance boundary</p>
        </div>
        <div className="card" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
          No organization information available for your account.
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1000px' }}>
      <div className="page-header">
        <h1 className="page-title">Organization Context</h1>
        <p className="page-subtitle">Multi-tenant boundary, security compliance profile, and workspace identifier</p>
      </div>

      <div className="card" style={{ padding: '28px' }}>
        {/* Header Block */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '20px', 
          marginBottom: '28px',
          paddingBottom: '24px',
          borderBottom: '1px solid var(--border-color)',
          flexWrap: 'wrap'
        }}>
          <div style={{ 
            width: '64px', 
            height: '64px', 
            borderRadius: 'var(--radius-lg)', 
            background: 'var(--brand-subtle)', 
            border: '1px solid var(--brand-glow)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            color: 'var(--brand-color)',
            boxShadow: 'var(--shadow-glow)'
          }}>
            <Building size={32} />
          </div>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                {organization.name}
              </h2>
              <StatusBadge status={organization.status} />
            </div>
            <p className="text-muted" style={{ margin: '4px 0 0', fontSize: '0.85rem' }}>
              Isolated security tenant workspace with dedicated audit logging & telemetry boundaries
            </p>
          </div>
        </div>

        {/* Tenant Attributes Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
          <div style={{ 
            background: 'var(--bg-primary)', 
            padding: '16px', 
            borderRadius: 'var(--radius-md)', 
            border: '1px solid var(--border-color)' 
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '6px' }}>
              <Hash size={14} style={{ color: 'var(--brand-color)' }} /> Organization ID
            </div>
            <div style={{ 
              fontFamily: 'var(--font-mono, monospace)', 
              fontSize: '0.85rem', 
              color: 'var(--text-primary)', 
              background: 'var(--bg-secondary)', 
              padding: '6px 10px', 
              borderRadius: 'var(--radius-sm)',
              wordBreak: 'break-all'
            }}>
              {organization.id}
            </div>
          </div>

          <div style={{ 
            background: 'var(--bg-primary)', 
            padding: '16px', 
            borderRadius: 'var(--radius-md)', 
            border: '1px solid var(--border-color)' 
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '6px' }}>
              <Tag size={14} style={{ color: 'var(--brand-color)' }} /> Tenant Slug
            </div>
            <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              {organization.slug}
            </div>
          </div>

          <div style={{ 
            background: 'var(--bg-primary)', 
            padding: '16px', 
            borderRadius: 'var(--radius-md)', 
            border: '1px solid var(--border-color)' 
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '6px' }}>
              <Clock size={14} style={{ color: 'var(--brand-color)' }} /> Provisioning Date
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              {new Date(organization.createdAt).toLocaleString()}
            </div>
          </div>
        </div>

        {/* Security Compliance Overview */}
        <div style={{ 
          marginTop: '24px', 
          padding: '16px 20px', 
          background: 'var(--brand-subtle)', 
          border: '1px solid var(--brand-glow)', 
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <Shield size={20} style={{ color: 'var(--brand-color)', flexShrink: 0 }} />
          <div style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
            <strong style={{ color: 'var(--text-primary)' }}>Tenant Enclave Isolation: </strong>
            All security events, detected threats, incidents, and audit logs are cryptographically scoped strictly to this organization ID. Cross-tenant leakage is prevented at the database and API boundary.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Organizations;
