import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial, Stars, Float } from '@react-three/drei';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Code, Gamepad2, GraduationCap, ChevronDown, ArrowRight } from 'lucide-react';

const AnimatedShapes = () => {
  return (
    <>
      <Float speed={1.5} rotationIntensity={2} floatIntensity={3}>
        <Sphere args={[1, 64, 64]} scale={1.5} position={[-2, 1, -2]}>
          <MeshDistortMaterial
            color="#8B5CF6"
            attach="material"
            distort={0.5}
            speed={2}
            roughness={0.2}
            metalness={0.8}
            emissive="#4c1d95"
            emissiveIntensity={0.2}
          />
        </Sphere>
      </Float>

      <Float speed={2} rotationIntensity={1.5} floatIntensity={2}>
        <Sphere args={[1, 64, 64]} scale={1} position={[3, -1, -3]}>
          <MeshDistortMaterial
            color="#3B82F6"
            attach="material"
            distort={0.4}
            speed={1.5}
            roughness={0.1}
            metalness={0.9}
            emissive="#1e3a8a"
            emissiveIntensity={0.2}
          />
        </Sphere>
      </Float>

      <Float speed={1} rotationIntensity={1} floatIntensity={1.5}>
        <Sphere args={[1, 64, 64]} scale={0.7} position={[1, 2.5, -4]}>
          <MeshDistortMaterial
            color="#06b6d4"
            attach="material"
            distort={0.3}
            speed={1}
            roughness={0.3}
            metalness={0.7}
            emissive="#164e63"
            emissiveIntensity={0.2}
          />
        </Sphere>
      </Float>
    </>
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
    <div style={{ position: 'relative', width: '100vw', minHeight: '100vh', backgroundColor: '#09090b', overflowX: 'hidden' }}>
      
      {/* 3D Background */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, opacity: 0.8 }}>
        <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
          <ambientLight intensity={0.2} />
          <directionalLight position={[10, 10, 10]} intensity={1.5} color="#ffffff" />
          <directionalLight position={[-10, -10, -10]} intensity={0.5} color="#8B5CF6" />
          <spotLight position={[0, 5, 5]} angle={0.3} penumbra={1} intensity={2} color="#3B82F6" />
          <Stars radius={100} depth={50} count={3000} factor={3} saturation={0} fade speed={1} />
          <AnimatedShapes />
          <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.3} maxPolarAngle={Math.PI / 2 + 0.1} minPolarAngle={Math.PI / 2 - 0.1} />
        </Canvas>
      </div>

      {/* Main Content Area */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column'
      }}>
        
        {/* Navigation Bar */}
        <nav style={{ padding: '2rem 4rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <motion.div 
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.8 }}
            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}
          >
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, #8B5CF6, #3B82F6)' }} />
            <span style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: '1.25rem', letterSpacing: '0.05em' }}>QUANTUM</span>
          </motion.div>
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            onClick={() => navigate('/login')}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              color: '#fff',
              padding: '0.5rem 1.5rem',
              borderRadius: '20px',
              fontFamily: 'Inter',
              fontWeight: 500,
              fontSize: '0.9rem',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            }}
          >
            Sign In
          </motion.button>
        </nav>

        {/* Hero Section */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '0 2rem',
          marginTop: '-4rem'
        }}>
          
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            style={{ textAlign: 'center', maxWidth: '900px' }}
          >
            <motion.div variants={itemVariants} style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 1rem',
              background: 'rgba(139, 92, 246, 0.1)',
              border: '1px solid rgba(139, 92, 246, 0.2)',
              borderRadius: '20px',
              color: '#A78BFA',
              fontSize: '0.85rem',
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              marginBottom: '2rem'
            }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#A78BFA', boxShadow: '0 0 10px #A78BFA' }}></span>
              The Next Generation Ecosystem
            </motion.div>
            
            <motion.h1 variants={itemVariants} style={{
              fontFamily: 'Outfit',
              fontSize: 'clamp(3rem, 6vw, 5.5rem)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
              margin: '0 0 1.5rem 0',
              color: '#fff'
            }}>
              Where Creativity Meets <br/>
              <span style={{
                background: 'linear-gradient(135deg, #A78BFA 0%, #3B82F6 50%, #06b6d4 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                Engineering Excellence
              </span>
            </motion.h1>
            
            <motion.p variants={itemVariants} style={{
              fontFamily: 'Inter',
              fontSize: '1.25rem',
              color: '#a1a1aa',
              maxWidth: '650px',
              margin: '0 auto 3rem auto',
              lineHeight: 1.6
            }}>
              A unified platform redefining boundaries across Education, Gaming, and Software Innovation. Built for visionaries, by visionaries.
            </motion.p>

            <motion.div variants={itemVariants} style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={() => navigate('/login')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '1rem 2.5rem',
                  fontSize: '1.125rem',
                  fontWeight: 600,
                  color: '#fff',
                  background: 'linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%)',
                  border: 'none',
                  borderRadius: '30px',
                  cursor: 'pointer',
                  boxShadow: '0 10px 30px rgba(139, 92, 246, 0.3)',
                  transition: 'all 0.3s ease',
                  fontFamily: 'Outfit'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 15px 35px rgba(139, 92, 246, 0.5)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(139, 92, 246, 0.3)';
                }}
              >
                Enter Platform <ArrowRight size={20} />
              </button>
              
              <button
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '1rem 2.5rem',
                  fontSize: '1.125rem',
                  fontWeight: 600,
                  color: '#fff',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '30px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  fontFamily: 'Outfit'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                }}
              >
                Learn More
              </button>
            </motion.div>
          </motion.div>

          {/* Value Pillars / Cards */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.5rem',
              width: '100%',
              maxWidth: '1200px',
              marginTop: '5rem',
              padding: '0 2rem'
            }}
          >
            {[
              { icon: <GraduationCap size={28} color="#A78BFA" />, title: 'Education', desc: 'Next-gen learning ecosystems.' },
              { icon: <Gamepad2 size={28} color="#3B82F6" />, title: 'Gaming', desc: 'Immersive interactive experiences.' },
              { icon: <Code size={28} color="#06b6d4" />, title: 'Software', desc: 'Enterprise-grade innovation.' }
            ].map((item, index) => (
              <div key={index} style={{
                background: 'rgba(24, 24, 27, 0.5)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                borderRadius: '24px',
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                transition: 'all 0.3s ease',
                cursor: 'default'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.3)';
                e.currentTarget.style.background = 'rgba(24, 24, 27, 0.7)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.05)';
                e.currentTarget.style.background = 'rgba(24, 24, 27, 0.5)';
              }}
              >
                <div style={{ 
                  background: 'rgba(255, 255, 255, 0.05)', 
                  padding: '1rem', 
                  borderRadius: '16px',
                  marginBottom: '1.5rem'
                }}>
                  {item.icon}
                </div>
                <h3 style={{ fontFamily: 'Outfit', fontSize: '1.5rem', fontWeight: 600, color: '#fff', margin: '0 0 0.5rem 0' }}>{item.title}</h3>
                <p style={{ fontFamily: 'Inter', color: '#a1a1aa', margin: 0, lineHeight: 1.5 }}>{item.desc}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          style={{
            position: 'absolute',
            bottom: '2rem',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            color: '#71717a',
            gap: '0.5rem'
          }}
        >
          <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          >
            <ChevronDown size={20} />
          </motion.div>
        </motion.div>

        {/* Footer Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
          style={{
            position: 'absolute',
            bottom: '2rem',
            right: '4rem',
            pointerEvents: 'auto'
          }}
        >
          <a 
            href="http://quantumpixel.duckdns.org" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{
              color: '#71717a',
              textDecoration: 'none',
              fontSize: '0.875rem',
              fontFamily: 'Inter',
              transition: 'color 0.2s ease'
            }}
            onMouseOver={(e) => e.target.style.color = '#fff'}
            onMouseOut={(e) => e.target.style.color = '#71717a'}
          >
            quantumpixel.duckdns.org
          </a>
        </motion.div>
      </div>
    </div>
  );
}
