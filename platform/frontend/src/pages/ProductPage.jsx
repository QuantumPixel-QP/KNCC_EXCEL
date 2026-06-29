import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, BarChart, Activity, Cpu } from 'lucide-react';
import logo from '../assets/logo.png';
import './ProductPage.css';

export default function ProductPage() {
  const navigate = useNavigate();

  const fadeIn = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  return (
    <div className="product-container">
      <div className="product-blueprint-overlay"></div>
      
      <div className="product-content">
        <div className="nav-logo" onClick={() => navigate('/')}>
          <img src={logo} alt="KNCC Logo" style={{ width: '36px', height: '36px', borderRadius: '6px', objectFit: 'contain' }} />
          <span className="nav-logo-text">KNCC EXCEL</span>
        </div>

        <motion.div 
          className="product-header"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
        >
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1rem',
            background: 'rgba(245, 158, 11, 0.1)',
            border: '1px solid rgba(245, 158, 11, 0.2)',
            borderRadius: '4px',
            color: '#F59E0B',
            fontSize: '0.85rem',
            fontWeight: 600,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            marginBottom: '2rem'
          }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#F59E0B', boxShadow: '0 0 10px #F59E0B' }}></span>
            A Quantum Pixel Product
          </div>
          <h1 className="product-title">Built for the Modern <br/> Construction Site</h1>
          <p className="product-subtitle">
            KNCC EXCEL delivers a comprehensive suite of tools designed specifically for construction management. 
            From automated daily reports to real-time material tracking, our platform bridges the gap between the field and the office.
          </p>
        </motion.div>

        {/* Feature 1 */}
        <motion.div 
          className="feature-section"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
        >
          <div className="feature-text">
            <div style={{ display: 'inline-block', padding: '1rem', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '8px', marginBottom: '1rem' }}>
              <BarChart size={32} color="#F59E0B" />
            </div>
            <h2>Automated Reporting</h2>
            <p>
              Eliminate hours of manual data entry. KNCC EXCEL automatically compiles daily site logs, worker hours, and equipment utilization into polished, stakeholder-ready reports.
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: '#a1a1aa' }}>
              <li style={{ marginBottom: '0.5rem' }}>✓ One-click daily log generation</li>
              <li style={{ marginBottom: '0.5rem' }}>✓ Auto-sync with field mobile apps</li>
              <li>✓ Instant PDF exports for stakeholders</li>
            </ul>
          </div>
          <div className="feature-visual">
            <div style={{ width: '100%', height: '250px', background: 'rgba(0,0,0,0.5)', borderRadius: '8px', display: 'flex', flexDirection: 'column', padding: '1.5rem', gap: '1rem' }}>
              <div style={{ width: '40%', height: '20px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px' }}></div>
              <div style={{ width: '100%', height: '80px', background: 'rgba(245,158,11,0.2)', borderRadius: '4px', border: '1px solid rgba(245,158,11,0.3)' }}></div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1, height: '60px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}></div>
                <div style={{ flex: 1, height: '60px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}></div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Feature 2 */}
        <motion.div 
          className="feature-section reverse"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
        >
          <div className="feature-text">
            <div style={{ display: 'inline-block', padding: '1rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '8px', marginBottom: '1rem' }}>
              <Activity size={32} color="#3B82F6" />
            </div>
            <h2>Real-time Analytics</h2>
            <p>
              Track your materials, deliveries, and costs live. Our live dashboards give project managers total visibility into exactly what is happening on site at any given moment.
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: '#a1a1aa' }}>
              <li style={{ marginBottom: '0.5rem' }}>✓ Live delivery tracking & receiving</li>
              <li style={{ marginBottom: '0.5rem' }}>✓ Budget vs Actual cost reconciliation</li>
              <li>✓ Inventory depletion monitoring</li>
            </ul>
          </div>
          <div className="feature-visual">
            <div style={{ width: '100%', height: '250px', background: 'rgba(0,0,0,0.5)', borderRadius: '8px', display: 'flex', alignItems: 'flex-end', padding: '1.5rem', gap: '1rem' }}>
              <div style={{ flex: 1, height: '40%', background: '#3B82F6', borderRadius: '4px 4px 0 0', opacity: 0.6 }}></div>
              <div style={{ flex: 1, height: '70%', background: '#3B82F6', borderRadius: '4px 4px 0 0', opacity: 0.8 }}></div>
              <div style={{ flex: 1, height: '50%', background: '#3B82F6', borderRadius: '4px 4px 0 0', opacity: 0.7 }}></div>
              <div style={{ flex: 1, height: '90%', background: '#F59E0B', borderRadius: '4px 4px 0 0' }}></div>
              <div style={{ flex: 1, height: '60%', background: '#3B82F6', borderRadius: '4px 4px 0 0', opacity: 0.9 }}></div>
            </div>
          </div>
        </motion.div>

        {/* Feature 3 */}
        <motion.div 
          className="feature-section"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
        >
          <div className="feature-text">
            <div style={{ display: 'inline-block', padding: '1rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px', marginBottom: '1rem' }}>
              <Cpu size={32} color="#10B981" />
            </div>
            <h2>AI-Driven Insights</h2>
            <p>
              Predict delays before they happen. By analyzing weather patterns, delivery schedules, and historical data, our AI proactively alerts you to potential bottlenecks.
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: '#a1a1aa' }}>
              <li style={{ marginBottom: '0.5rem' }}>✓ Predictive schedule adjustments</li>
              <li style={{ marginBottom: '0.5rem' }}>✓ Automated risk identification</li>
              <li>✓ Smart vendor performance scoring</li>
            </ul>
          </div>
          <div className="feature-visual">
            <div style={{ width: '100%', height: '250px', background: 'rgba(0,0,0,0.5)', borderRadius: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '1.5rem', position: 'relative' }}>
              <div style={{ width: '100px', height: '100px', border: '2px solid rgba(16, 185, 129, 0.3)', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div style={{ width: '60px', height: '60px', border: '2px solid rgba(16, 185, 129, 0.6)', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <div style={{ width: '20px', height: '20px', background: '#10B981', borderRadius: '50%', boxShadow: '0 0 20px #10B981' }}></div>
                </div>
              </div>
              <div style={{ position: 'absolute', top: '20%', left: '20%', width: '40px', height: '20px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px' }}></div>
              <div style={{ position: 'absolute', bottom: '30%', right: '20%', width: '60px', height: '10px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px' }}></div>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div 
          className="cta-section"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
        >
          <h2 style={{ fontFamily: 'Outfit', fontSize: '2.5rem', marginBottom: '1.5rem' }}>Ready to Digitize Your Job Site?</h2>
          <button className="cta-button" onClick={() => navigate('/login')}>
            Get Started Now <ArrowRight size={20} />
          </button>
        </motion.div>
      </div>
    </div>
  );
}
