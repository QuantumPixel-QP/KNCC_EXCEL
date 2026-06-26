import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Box, Cylinder, Grid, Text } from '@react-three/drei';

const BuildingElement = ({ position, args, color }) => {
  const meshRef = useRef();
  
  return (
    <Box args={args} position={position} ref={meshRef}>
      <meshStandardMaterial color={color} metalness={0.5} roughness={0.2} />
    </Box>
  );
};

const BimViewer = () => {
  return (
    <div style={{ width: '100%', height: '100%', minHeight: '400px', background: '#09090b', borderRadius: '12px', overflow: 'hidden', position: 'relative' }}>
      <div style={{ position: 'absolute', top: 10, left: 10, zIndex: 10, color: 'var(--accent-cyan)', fontFamily: 'Outfit', fontWeight: 600, fontSize: '14px', background: 'rgba(0,0,0,0.5)', padding: '4px 8px', borderRadius: '4px' }}>
        Sandbox BIM Viewer (Alpha)
      </div>
      <Canvas camera={{ position: [15, 10, 15], fov: 50 }}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 20, 10]} intensity={1.2} castShadow />
        <directionalLight position={[-10, -10, -10]} intensity={0.5} color="#8B5CF6" />
        
        {/* Core Foundation */}
        <BuildingElement position={[0, -0.5, 0]} args={[10, 1, 10]} color="#18181b" />
        
        {/* Structural Columns */}
        <BuildingElement position={[-4, 2, -4]} args={[0.5, 4, 0.5]} color="#3B82F6" />
        <BuildingElement position={[4, 2, -4]} args={[0.5, 4, 0.5]} color="#3B82F6" />
        <BuildingElement position={[-4, 2, 4]} args={[0.5, 4, 0.5]} color="#3B82F6" />
        <BuildingElement position={[4, 2, 4]} args={[0.5, 4, 0.5]} color="#3B82F6" />
        
        {/* Top Slab */}
        <BuildingElement position={[0, 4.25, 0]} args={[10, 0.5, 10]} color="#27272a" />
        
        {/* Secondary Columns */}
        <BuildingElement position={[-4, 6.5, -4]} args={[0.4, 4, 0.4]} color="#06b6d4" />
        <BuildingElement position={[4, 6.5, -4]} args={[0.4, 4, 0.4]} color="#06b6d4" />
        
        {/* Grid Floor */}
        <Grid position={[0, -1, 0]} args={[20, 20]} cellSize={1} cellThickness={1} cellColor="#3B82F6" sectionSize={5} sectionThickness={2} sectionColor="#8B5CF6" fadeDistance={30} />
        
        <OrbitControls makeDefault autoRotate autoRotateSpeed={0.5} maxPolarAngle={Math.PI / 2} />
      </Canvas>
    </div>
  );
};

export default BimViewer;
