import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float, Html } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import gsap from 'gsap';

// Individual premium glass sphere component
function TechSphere({ position, size, name, logoUrl, color, index }) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  
  // Random velocity for free-floating movement
  const velocity = useRef({
    x: (Math.random() - 0.5) * 0.5,
    y: (Math.random() - 0.5) * 0.5,
    z: (Math.random() - 0.5) * 0.4,
  });

  useFrame((state) => {
    if (!meshRef.current) return;

    // Super free-floating movement with boost on hover
    const speedMultiplier = hovered ? 2.5 : 1;
    meshRef.current.position.x += velocity.current.x * 0.02 * speedMultiplier;
    meshRef.current.position.y += velocity.current.y * 0.02 * speedMultiplier;
    meshRef.current.position.z += velocity.current.z * 0.02 * speedMultiplier;

    // Boundary check and bounce for continuous movement
    const bounds = { x: 8, y: 4, z: 4 };
    if (Math.abs(meshRef.current.position.x) > bounds.x) {
      velocity.current.x *= -1;
    }
    if (Math.abs(meshRef.current.position.y) > bounds.y) {
      velocity.current.y *= -1;
    }
    if (Math.abs(meshRef.current.position.z) > bounds.z) {
      velocity.current.z *= -1;
    }

    // Faster rotation on hover
    const rotationSpeed = hovered ? 3 : 1;
    meshRef.current.rotation.x += 0.002 * rotationSpeed;
    meshRef.current.rotation.y += 0.003 * rotationSpeed;

    // Scale on hover with smooth transition
    const targetScale = hovered ? 1.3 : 1;
    meshRef.current.scale.lerp(
      new THREE.Vector3(targetScale, targetScale, targetScale),
      0.1
    );
  });

  return (
    <Float
      speed={1.5}
      rotationIntensity={0.3}
      floatIntensity={1.2}
      floatingRange={[-0.5, 0.5]}
    >
      <mesh
        ref={meshRef}
        position={position}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        castShadow
        receiveShadow
      >
        <sphereGeometry args={[size, 64, 64]} />
        <meshStandardMaterial
          color="#ffffff"
          roughness={0.3}
          metalness={0.2}
          envMapIntensity={2.0}
        />
        
        {/* Technology logo - much larger and visible on white sphere */}
        <Html
          center
          distanceFactor={size * 0.8}
          transform
          sprite
          style={{
            transition: 'all 0.3s ease',
            pointerEvents: 'none',
          }}
        >
          <div 
            className="flex items-center justify-center" 
            style={{ 
              width: '200px', 
              height: '200px',
              transform: hovered ? 'scale(1.2)' : 'scale(1)',
              transition: 'transform 0.3s ease',
            }}
          >
            <img 
              src={logoUrl} 
              alt={name}
              style={{
                width: '180px',
                height: '180px',
                objectFit: 'contain',
                filter: 'drop-shadow(0 6px 16px rgba(0,0,0,0.8))',
              }}
            />
          </div>
        </Html>
      </mesh>
    </Float>
  );
}

// Scene component with premium lighting and composition
function Scene({ mousePosition }) {
  const groupRef = useRef();

  // Premium asymmetrical composition with overlapping spheres
  const techStack = [
    { 
      name: 'Python', 
      logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
      position: [-4, 1, 2], 
      size: 1.8,
      color: '#ffffff'
    },
    { 
      name: 'JavaScript', 
      logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg',
      position: [3.5, 2, 0], 
      size: 1.5,
      color: '#fffffa'
    },
    { 
      name: 'React', 
      logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
      position: [-1, -1.5, 3], 
      size: 1.6,
      color: '#ffffff'
    },
    { 
      name: 'TypeScript', 
      logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg',
      position: [5, -1, -1], 
      size: 1.3,
      color: '#fafafa'
    },
    { 
      name: 'Node.js', 
      logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',
      position: [-5.5, -2, 0], 
      size: 1.2,
      color: '#ffffff'
    },
    { 
      name: 'C++', 
      logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg',
      position: [1, 0, -2], 
      size: 1.1,
      color: '#f5f5f5'
    },
    { 
      name: 'Java', 
      logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg',
      position: [-2.5, 3, -1], 
      size: 1.25,
      color: '#ffffff'
    },
    { 
      name: 'HTML', 
      logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg',
      position: [6.5, 1, 2], 
      size: 1.0,
      color: '#fafafa'
    },
    { 
      name: 'CSS', 
      logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg',
      position: [-6, 0.5, -2], 
      size: 0.95,
      color: '#ffffff'
    },
    { 
      name: 'Git', 
      logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg',
      position: [2, -2.5, 1], 
      size: 1.1,
      color: '#f8f8f8'
    },
    { 
      name: 'C', 
      logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg',
      position: [-3, -0.5, -3], 
      size: 0.9,
      color: '#ffffff'
    },
    { 
      name: 'SQL', 
      logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg',
      position: [4, 3, -2], 
      size: 0.85,
      color: '#fafafa'
    },
  ];

  // Smooth mouse parallax effect
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        mousePosition.y * 0.15,
        0.03
      );
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        mousePosition.x * 0.15,
        0.03
      );
    }
  });

  return (
    <>
      {/* Bright lighting for white golf balls */}
      <ambientLight intensity={1.2} />
      <directionalLight position={[10, 10, 5]} intensity={2.0} color="#ffffff" castShadow />
      <directionalLight position={[-10, -10, -5]} intensity={1.0} color="#ffffff" />
      <pointLight position={[0, 5, 5]} intensity={2.5} color="#ffffff" />
      <pointLight position={[-5, -5, 0]} intensity={1.5} color="#ffffff" />
      <spotLight position={[10, 15, 10]} angle={0.3} penumbra={1} intensity={2.0} color="#ffffff" />
      
      {/* Environment for realistic reflections */}
      <Environment preset="city" />
      
      {/* Sphere group with mouse parallax */}
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
  const vantaRef = useRef(null);

  // Initialize Vanta clouds effect
  useEffect(() => {
    let vantaEffect = null;
    
    const loadVanta = async () => {
      if (!vantaRef.current && sectionRef.current) {
        try {
          const CLOUDS = (await import('vanta/dist/vanta.clouds.min')).default;
          vantaEffect = CLOUDS({
            el: sectionRef.current,
            THREE: THREE,
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.00,
            minWidth: 200.00,
            skyColor: 0x0f0f1e,
            cloudColor: 0x3a3a5c,
            cloudShadowColor: 0x1a1a2e,
            sunColor: 0xff9e64,
            sunGlareColor: 0xffc777,
            sunlightColor: 0xffb454,
            speed: 1.2
          });
          vantaRef.current = vantaEffect;
        } catch (error) {
          console.error('Vanta loading error:', error);
        }
      }
    };

    loadVanta();

    return () => {
      if (vantaRef.current) {
        vantaRef.current.destroy();
        vantaRef.current = null;
      }
    };
  }, []);

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
      className="min-h-screen text-white py-20 px-8 relative overflow-hidden"
      style={{ position: 'relative', isolation: 'isolate' }}
    >
      <div className="max-w-7xl mx-auto relative z-10">
        <h2 className="text-5xl md:text-6xl font-light tracking-[0.3em] mb-12 text-center uppercase">
          MY TECH STACK
        </h2>

        {/* Three.js Canvas with premium settings */}
        <div className="w-full h-[700px] relative z-20">
          <Canvas
            camera={{ position: [0, 0, 18], fov: 60 }}
            gl={{ 
              antialias: true, 
              alpha: true,
              toneMapping: THREE.ACESFilmicToneMapping,
              toneMappingExposure: 1.8,
            }}
            shadows
            style={{ background: 'transparent' }}
          >
            <fog attach="fog" args={['#000000', 15, 35]} />
            
            <Scene mousePosition={mousePosition} />
            
            {/* Post-processing effects for premium look */}
            <EffectComposer>
              <Bloom 
                intensity={0.5} 
                luminanceThreshold={0.2} 
                luminanceSmoothing={0.9}
                height={300}
                opacity={0.8}
              />
            </EffectComposer>
          </Canvas>
        </div>

        {/* Instructions */}
        <p className="text-center text-gray-500 text-sm mt-8 tracking-wider">
          HOVER OVER SPHERES TO INTERACT • MOVE YOUR MOUSE FOR PARALLAX
        </p>
      </div>
    </section>
  );
}
