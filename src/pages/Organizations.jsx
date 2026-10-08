import React, { useState, useEffect } from 'react';
import { getOrganizationById } from '../services/organizationService';
import { getUser } from '../services/authService';
import { Building } from 'lucide-react';
import Spinner from '../components/ui/Spinner';
import ErrorState from '../components/ui/ErrorState';

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

  if (loading) return <Spinner />;
  if (error) return <ErrorState message={error} />;
  
  if (!organization) {
    return (
      <div className="page-container">
        <h2>Organization</h2>
        <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>
          No organization information available.
        </div>
      </div>
    );
  }

  return (
    <div className="page-container" style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Organization Details</h2>
        <p className="text-muted">Manage your organization context</p>
      </div>

      <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '12px', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Building size={32} color="var(--brand-color)" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.25rem', margin: 0 }}>{organization.name}</h3>
            <div style={{ display: 'inline-block', marginTop: '8px', padding: '4px 8px', background: organization.status === 'ACTIVE' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: organization.status === 'ACTIVE' ? 'var(--status-success)' : 'var(--status-critical)', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold' }}>
              {organization.status}
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <div>
            <div className="text-muted" style={{ fontSize: '0.85rem', marginBottom: '4px' }}>Organization ID</div>
            <div style={{ fontFamily: 'monospace', background: 'var(--bg-primary)', padding: '8px', borderRadius: '4px', border: '1px solid var(--border-color)' }}>{organization.id}</div>
          </div>
          <div>
            <div className="text-muted" style={{ fontSize: '0.85rem', marginBottom: '4px' }}>Slug</div>
            <div>{organization.slug}</div>
          </div>
          <div>
            <div className="text-muted" style={{ fontSize: '0.85rem', marginBottom: '4px' }}>Created At</div>
            <div>{new Date(organization.createdAt).toLocaleString()}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Organizations;
