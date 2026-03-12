import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Html } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';

// Optimized sphere component with smooth floating
function TechSphere({ position, size, name, logoUrl, index }) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  
  // Store random speeds per sphere for variety
  const floatOffset = useRef({
    speedX: 0.3 + Math.random() * 0.4,
    speedY: 0.2 + Math.random() * 0.5,
    speedZ: 0.25 + Math.random() * 0.35,
    offsetX: Math.random() * Math.PI * 2,
    offsetY: Math.random() * Math.PI * 2,
    offsetZ: Math.random() * Math.PI * 2
  });

  useFrame((state) => {
    if (!meshRef.current) return;

    const time = state.clock.elapsedTime;
    const amplitude = hovered ? 0.4 : 0.25;
    
    // Smooth sinusoidal floating motion
    meshRef.current.position.x = position[0] + Math.sin(time * floatOffset.current.speedX + floatOffset.current.offsetX) * amplitude;
    meshRef.current.position.y = position[1] + Math.sin(time * floatOffset.current.speedY + floatOffset.current.offsetY) * amplitude;
    meshRef.current.position.z = position[2] + Math.sin(time * floatOffset.current.speedZ + floatOffset.current.offsetZ) * amplitude;

    // Gentle rotation
    meshRef.current.rotation.x = Math.sin(time * 0.2) * 0.1;
    meshRef.current.rotation.y = Math.cos(time * 0.2) * 0.1;

    // Scale on hover
    const targetScale = hovered ? 1.15 : 1;
    meshRef.current.scale.x += (targetScale - meshRef.current.scale.x) * 0.1;
    meshRef.current.scale.y += (targetScale - meshRef.current.scale.y) * 0.1;
    meshRef.current.scale.z += (targetScale - meshRef.current.scale.z) * 0.1;
  });

  return (
    <Float
      speed={0.5}
      rotationIntensity={0.1}
      floatIntensity={0.3}
    >
      <mesh
        ref={meshRef}
        position={position}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
      >
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial
          color="#ffffff"
          roughness={0.1}
          metalness={0.05}
          emissive="#ffffff"
          emissiveIntensity={0.1}
        />
        
        <Html
          center
          distanceFactor={size * 1.2}
          transform
          sprite
          style={{
            pointerEvents: 'none',
          }}
        >
          <div 
            className="flex items-center justify-center" 
            style={{ 
              width: '180px', 
              height: '180px',
              transform: hovered ? 'scale(1.15)' : 'scale(1)',
              transition: 'transform 0.3s ease',
            }}
          >
            <img 
              src={logoUrl} 
              alt={name}
              style={{
                width: '160px',
                height: '160px',
                objectFit: 'contain',
                filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.6))',
              }}
            />
          </div>
        </Html>
      </mesh>
    </Float>
  );
}

// Optimized scene component
function Scene({ mousePosition }) {
  const groupRef = useRef();

  const techStack = [
    { 
      name: 'Python', 
      logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
      position: [-4, 1, 2], 
      size: 1.8,
    },
    { 
      name: 'JavaScript', 
      logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg',
      position: [3.5, 2, 0], 
      size: 1.5,
    },
    { 
      name: 'React', 
      logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
      position: [-1, -1.5, 3], 
      size: 1.6,
    },
    { 
      name: 'TypeScript', 
      logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg',
      position: [5, -1, -1], 
      size: 1.3,
    },
    { 
      name: 'Node.js', 
      logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',
      position: [-5.5, -2, 0], 
      size: 1.2,
    },
    { 
      name: 'C++', 
      logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg',
      position: [1, 0, -2], 
      size: 1.1,
    },
    { 
      name: 'Java', 
      logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg',
      position: [-2.5, 3, -1], 
      size: 1.25,
    },
    { 
      name: 'HTML', 
      logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg',
      position: [6.5, 1, 2], 
      size: 1.0,
    },
    { 
      name: 'CSS', 
      logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg',
      position: [-6, 0.5, -2], 
      size: 0.95,
    },
    { 
      name: 'Git', 
      logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg',
      position: [2, -2.5, 1], 
      size: 1.1,
    },
    { 
      name: 'C', 
      logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg',
      position: [-3, -0.5, -3], 
      size: 0.9,
    },
    { 
      name: 'SQL', 
      logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg',
      position: [4, 3, -2], 
      size: 0.85,
    },
  ];

  useFrame(() => {
    if (groupRef.current) {
      const targetRotX = mousePosition.y * 0.1;
      const targetRotY = mousePosition.x * 0.1;
      groupRef.current.rotation.x += (targetRotX - groupRef.current.rotation.x) * 0.05;
      groupRef.current.rotation.y += (targetRotY - groupRef.current.rotation.y) * 0.05;
    }
  });

  return (
    <>
      <ambientLight intensity={0.8} />
      <directionalLight position={[10, 10, 5]} intensity={1.5} />
      <directionalLight position={[-10, -10, -5]} intensity={0.5} />
      <pointLight position={[0, 0, 10]} intensity={1.0} />
      
      <group ref={groupRef}>
        {techStack.map((tech, index) => (
          <TechSphere
            key={tech.name}
            {...tech}
            index={index}
          />
        ))}
      </group>
    </>
  );
}

export default function TechStack() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const sectionRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (event) => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        setMousePosition({ x, y });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section
      ref={sectionRef}
      id="techstack"
      className="min-h-screen text-white py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-8 relative overflow-hidden bg-[#0d0d0d]"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-[#0d0d0d] via-[#1a1a2e] to-[#0d0d0d]"></div>
      <div className="max-w-7xl mx-auto relative z-10">
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light tracking-[0.2em] sm:tracking-[0.3em] mb-8 sm:mb-10 md:mb-12 text-center uppercase">
          MY TECH STACK
        </h2>

        <div className="w-full h-[400px] sm:h-[500px] md:h-[600px] lg:h-[700px] relative">
          <Canvas
            camera={{ position: [0, 0, window.innerWidth < 768 ? 22 : 18], fov: window.innerWidth < 768 ? 70 : 60}}
            gl={{ 
              antialias: true, 
              alpha: true,
              preserveDrawingBuffer: true,
            }}
          >
            <color attach="background" args={['#0d0d0d']} />
            <fog attach="fog" args={['#0d0d0d', 20, 40]} />
            
            <Scene mousePosition={mousePosition} />
            
            <EffectComposer multisampling={0}>
              <Bloom 
                intensity={0.3} 
                luminanceThreshold={0.4} 
                luminanceSmoothing={0.7}
                height={150}
              />
            </EffectComposer>
          </Canvas>
        </div>

        <p className="text-center text-gray-500 text-xs sm:text-sm mt-6 sm:mt-8 tracking-wider px-4">
          HOVER OVER SPHERES TO INTERACT
        </p>
      </div>
    </section>
  );
}
