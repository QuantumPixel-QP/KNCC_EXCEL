import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Box, Stars } from '@react-three/drei';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { BarChart, Activity, Cpu, ChevronDown, ArrowRight } from 'lucide-react';
import logo from '../assets/logo.png';
import './LandingPage.css';

const AnimatedScaffolding = () => {
  const groupRef = useRef();
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.15;
      groupRef.current.position.y = Math.sin(t * 0.5) * 0.3 - 1;
    }
  });

  return (
    <group ref={groupRef} position={[2, -1, -2]}>
      {/* Central Core block */}
      <Box args={[1.5, 4, 1.5]} position={[0, 2, 0]}>
        <meshStandardMaterial color="#1f2937" roughness={0.3} metalness={0.8} />
      </Box>
      
      {/* Outer Scaffolding */}
      {[
        [2, 2], [2, -2], [-2, 2], [-2, -2]
      ].map(([x, z], i) => (
        <group key={`scaffold-${i}`}>
          {/* Vertical Pillar */}
          <Box args={[0.2, 5.5, 0.2]} position={[x, 2.75, z]}>
            <meshStandardMaterial color="#4b5563" roughness={0.4} metalness={0.9} />
          </Box>
          {/* Horizontal Beams at Level 1 */}
          <Box args={[4.2, 0.2, 0.2]} position={[0, 1.5, z]}>
            <meshStandardMaterial color="#F59E0B" roughness={0.5} metalness={0.5} emissive="#b45309" emissiveIntensity={0.2} />
          </Box>
          <Box args={[0.2, 0.2, 4.2]} position={[x, 1.5, 0]}>
            <meshStandardMaterial color="#F59E0B" roughness={0.5} metalness={0.5} emissive="#b45309" emissiveIntensity={0.2} />
          </Box>
          {/* Horizontal Beams at Level 2 */}
          <Box args={[4.2, 0.2, 0.2]} position={[0, 3.5, z]}>
            <meshStandardMaterial color="#F59E0B" roughness={0.5} metalness={0.5} emissive="#b45309" emissiveIntensity={0.2} />
          </Box>
          <Box args={[0.2, 0.2, 4.2]} position={[x, 3.5, 0]}>
            <meshStandardMaterial color="#F59E0B" roughness={0.5} metalness={0.5} emissive="#b45309" emissiveIntensity={0.2} />
          </Box>
        </group>
      ))}
    </group>
  );
};

export default function LandingPage() {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <div className="landing-container">
      
      {/* 3D Background */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, opacity: 0.8 }}>
        <Canvas camera={{ position: [0, 0, 12], fov: 45 }}>
          <ambientLight intensity={0.3} />
          <directionalLight position={[10, 10, 10]} intensity={1.5} color="#ffffff" />
          <directionalLight position={[-10, -10, -10]} intensity={0.8} color="#F59E0B" />
          <spotLight position={[0, 10, 5]} angle={0.5} penumbra={1} intensity={2} color="#3B82F6" />
          <Stars radius={100} depth={50} count={3000} factor={3} saturation={0} fade speed={1} />
          <AnimatedScaffolding />
          <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} maxPolarAngle={Math.PI / 2 + 0.2} minPolarAngle={Math.PI / 2 - 0.2} />
        </Canvas>
      </div>

      <div className="blueprint-overlay"></div>

      {/* Main Content Area */}
      <div className="content-wrapper">
        
        {/* Navigation Bar */}
        <nav className="nav-bar">
          <motion.div 
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.8 }}
            className="nav-logo"
          >
            <img src={logo} alt="KNCC Logo" style={{ width: '36px', height: '36px', borderRadius: '6px', objectFit: 'contain' }} />
            <span className="nav-logo-text">KNCC EXCEL</span>
          </motion.div>
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            onClick={() => navigate('/login')}
            className="nav-signin-btn"
          >
            Sign In
          </motion.button>
        </nav>

        {/* Hero Section */}
        <div className="hero-section">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            style={{ textAlign: 'center', maxWidth: '900px' }}
          >
            <motion.div variants={itemVariants} className="hero-tag">
              <span className="hero-tag-dot"></span>
              A Quantum Pixel Product
            </motion.div>
            
            <motion.h1 variants={itemVariants} className="hero-title">
              Intelligent Construction <br/>
              <span className="hero-title-gradient">
                Automation
              </span>
            </motion.h1>
            
            <motion.p variants={itemVariants} className="hero-subtitle">
              Real-time analytics, automated reporting, and AI-driven insights for modern construction sites. Built to optimize efficiency and track resources seamlessly.
            </motion.p>

            <motion.div variants={itemVariants} className="btn-group">
              <button
                onClick={() => navigate('/login')}
                className="btn-primary"
              >
                Login to Dashboard <ArrowRight size={20} />
              </button>
              
              <button
                className="btn-secondary"
                onClick={() => navigate('/product')}
              >
                Explore Features
              </button>
            </motion.div>
          </motion.div>

          {/* Value Pillars / Cards */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="features-grid"
          >
            {[
              { icon: <BarChart size={28} color="#F59E0B" />, title: 'Automated Reporting', desc: 'Generate daily site reports and progress tracking automatically.' },
              { icon: <Activity size={28} color="#3B82F6" />, title: 'Real-time Analytics', desc: 'Live dashboards for material tracking and cost analysis.' },
              { icon: <Cpu size={28} color="#10B981" />, title: 'AI-Driven Insights', desc: 'Predictive scheduling and automated quality control.' }
            ].map((item, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon-wrapper">
                  {item.icon}
                </div>
                <h3 className="feature-title">{item.title}</h3>
                <p className="feature-desc">{item.desc}</p>
              </div>
            ))}
          </motion.div>
          
          {/* Scroll Indicator - Flowing in document */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="scroll-indicator"
          >
            <span className="scroll-text">Scroll</span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            >
              <ChevronDown size={20} />
            </motion.div>
          </motion.div>
        </div>

        {/* Footer Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="footer-link-wrapper"
          style={{ position: 'relative' }}
        >
          <a 
            href="http://quantumpixel.duckdns.org" 
            target="_blank" 
            rel="noopener noreferrer"
            className="footer-link"
          >
            quantumpixel.duckdns.org
          </a>
        </motion.div>
      </div>
    </div>
  );
}
