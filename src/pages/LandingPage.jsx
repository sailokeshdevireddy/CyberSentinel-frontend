import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Activity, Target, ShieldAlert, ArrowRight } from 'lucide-react';
import { checkAuth } from '../services/authService';
import './LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (checkAuth()) {
      navigate('/dashboard');
    }
  }, [navigate]);

  return (
    <div className="landing-page">
      <div className="landing-bg-decor"></div>

      <header className="landing-header">
        <div className="logo">
          <div className="logo-icon-box">
            <Shield size={22} />
          </div>
          <h1>CyberSentinel</h1>
        </div>
        <div className="header-actions">
          <Link to="/login" className="btn btn-secondary">Sign In</Link>
          <Link to="/register" className="btn btn-primary">Get Started</Link>
        </div>
      </header>

      <main className="landing-main">
        <section className="hero">
          <div className="hero-pill">
            <Shield size={13} /> Multi-Tenant Security Operations Platform
          </div>
          <h2 className="hero-title">
            Enterprise Security Event Monitoring & Incident Management
          </h2>
          <p className="hero-description">
            CyberSentinel continuously ingests real-time security events from distributed applications, calculates explainable risk scores via rule-based telemetry, correlates events into actionable threats, and orchestrates incident investigations.
          </p>
          <div className="cta-group">
            <Link to="/register" className="btn btn-primary btn-large">
              Get Started <ArrowRight size={16} style={{ marginLeft: '6px' }} />
            </Link>
            <Link to="/login" className="btn btn-secondary btn-large">
              Sign In to Workspace
            </Link>
          </div>
        </section>

        {/* Stats Ribbon */}
        <section className="stats-ribbon">
          <div className="stat-item">
            <div className="stat-val">100%</div>
            <div className="stat-lbl">Multi-Tenant Enclave Isolation</div>
          </div>
          <div className="stat-item">
            <div className="stat-val">&lt; 10ms</div>
            <div className="stat-lbl">Telemetry Evaluation Latency</div>
          </div>
          <div className="stat-item">
            <div className="stat-val">Rule-Based</div>
            <div className="stat-lbl">Explainable Risk Scoring</div>
          </div>
          <div className="stat-item">
            <div className="stat-val">Real-Time</div>
            <div className="stat-lbl">Correlated Threat Detection</div>
          </div>
        </section>

        <section className="capabilities">
          <div className="capability-card">
            <div className="cap-icon-box">
              <Activity size={22} />
            </div>
            <h3>Security Event Ingestion</h3>
            <p>High-throughput ingestion pipeline monitoring authentication, authorization, and network telemetries across distributed workloads.</p>
          </div>

          <div className="capability-card">
            <div className="cap-icon-box">
              <Target size={22} />
            </div>
            <h3>Explainable Risk Analysis</h3>
            <p>Every risk score is computed with transparent, auditable factors giving security analysts immediate insight into why an anomaly occurred.</p>
          </div>

          <div className="capability-card">
            <div className="cap-icon-box">
              <ShieldAlert size={22} />
            </div>
            <h3>Correlated Threat Detection</h3>
            <p>Automatically group multi-stage events and suspicious patterns into unified threat vectors before breaches can spread.</p>
          </div>

          <div className="capability-card">
            <div className="cap-icon-box">
              <Shield size={22} />
            </div>
            <h3>Incident Investigation Studio</h3>
            <p>Conduct forensic investigations with full event timelines, responder assignments, case notes, and audited resolution playbooks.</p>
          </div>
        </section>

        <section className="workflow">
          <h3>Architectural Incident Lifecycle</h3>
          <div className="workflow-steps">
            <div className="step">Protected Applications</div>
            <div className="step-arrow">→</div>
            <div className="step">Security Events</div>
            <div className="step-arrow">→</div>
            <div className="step">Risk Evaluation</div>
            <div className="step-arrow">→</div>
            <div className="step">Threat Correlation</div>
            <div className="step-arrow">→</div>
            <div className="step">Incident Escalation</div>
            <div className="step-arrow">→</div>
            <div className="step">Forensic Resolution</div>
          </div>
        </section>
      </main>

      <footer className="landing-footer">
        <p>&copy; {new Date().getFullYear()} CyberSentinel Security Platform. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
