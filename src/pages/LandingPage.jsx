import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Activity, Target, ShieldAlert } from 'lucide-react';
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
      <header className="landing-header">
        <div className="logo">
          <Shield size={32} className="logo-icon" />
          <h1>CyberSentinel</h1>
        </div>
        <div className="header-actions">
          <Link to="/login" className="btn btn-secondary">Sign In</Link>
          <Link to="/register" className="btn btn-primary">Get Started</Link>
        </div>
      </header>

      <main className="landing-main">
        <section className="hero">
          <h2 className="hero-title">Multi-Tenant Security Event Monitoring & Incident Management</h2>
          <p className="hero-description">
            CyberSentinel receives security events from registered applications, evaluates risk using rule-based factors, groups related events into threats, and supports incident investigation and resolution.
          </p>
          <div className="cta-group">
            <Link to="/register" className="btn btn-primary btn-large">Get Started</Link>
            <Link to="/login" className="btn btn-secondary btn-large">Sign In</Link>
          </div>
        </section>

        <section className="capabilities">
          <div className="capability-card">
            <Activity className="cap-icon" />
            <h3>Security Event Monitoring</h3>
            <p>Monitor security events across multiple applications in real-time.</p>
          </div>
          <div className="capability-card">
            <Target className="cap-icon" />
            <h3>Risk Analysis</h3>
            <p>Evaluate risk scores based on clear, explainable rule-based factors.</p>
          </div>
          <div className="capability-card">
            <ShieldAlert className="cap-icon" />
            <h3>Threat Detection</h3>
            <p>Group related security events automatically into actionable threats.</p>
          </div>
          <div className="capability-card">
            <Shield className="cap-icon" />
            <h3>Incident Management</h3>
            <p>Investigate and resolve security incidents with comprehensive timelines.</p>
          </div>
        </section>

        <section className="workflow">
          <h3>How it Works</h3>
          <div className="workflow-steps">
            <div className="step">Applications</div>
            <div className="step-arrow">→</div>
            <div className="step">Security Events</div>
            <div className="step-arrow">→</div>
            <div className="step">Risk Evaluation</div>
            <div className="step-arrow">→</div>
            <div className="step">Threats</div>
            <div className="step-arrow">→</div>
            <div className="step">Incidents</div>
            <div className="step-arrow">→</div>
            <div className="step">Investigation & Resolution</div>
          </div>
        </section>
      </main>

      <footer className="landing-footer">
        <p>&copy; {new Date().getFullYear()} CyberSentinel. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
