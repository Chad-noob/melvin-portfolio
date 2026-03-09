import { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import { Text, MeshTransmissionMaterial, Float, Html } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';

// Create golf ball dimple texture with normal map
function createGolfBallTextures() {
  const size = 1024;
  
  // Color/albedo map
  const colorCanvas = document.createElement('canvas');
  colorCanvas.width = size;
  colorCanvas.height = size;
  const colorCtx = colorCanvas.getContext('2d');
  
  // Bright white background
  colorCtx.fillStyle = '#ffffff';
  colorCtx.fillRect(0, 0, size, size);
  
  // Normal map for 3D depth
  const normalCanvas = document.createElement('canvas');
  normalCanvas.width = size;
  normalCanvas.height = size;
  const normalCtx = normalCanvas.getContext('2d');
  
  // Neutral normal (pointing straight out)
  normalCtx.fillStyle = 'rgb(128, 128, 255)';
  normalCtx.fillRect(0, 0, size, size);
  
  // Create prominent dimple pattern
  const dimpleRadius = 16;
  const spacing = 35;
  
  for (let y = 0; y < size; y += spacing) {
    for (let x = 0; x < size; x += spacing) {
      // Offset every other row for hexagonal pattern
      const offsetX = (y / spacing) % 2 === 0 ? 0 : spacing / 2;
      const posX = x + offsetX;
      
      if (posX < size) {
        // Draw dimple shadow on color map
        const colorGradient = colorCtx.createRadialGradient(
          posX, y, 0,
          posX, y, dimpleRadius
        );
        colorGradient.addColorStop(0, 'rgba(0, 0, 0, 0.25)');
        colorGradient.addColorStop(0.5, 'rgba(0, 0, 0, 0.15)');
        colorGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        colorCtx.fillStyle = colorGradient;
        colorCtx.beginPath();
        colorCtx.arc(posX, y, dimpleRadius, 0, Math.PI * 2);
        colorCtx.fill();
        
        // Draw normal map for depth
        const normalGradient = normalCtx.createRadialGradient(
          posX, y, 0,
          posX, y, dimpleRadius
        );
        normalGradient.addColorStop(0, 'rgb(128, 128, 180)'); // Indent
        normalGradient.addColorStop(0.7, 'rgb(128, 128, 220)');
        normalGradient.addColorStop(1, 'rgb(128, 128, 255)'); // Normal
        
        normalCtx.fillStyle = normalGradient;
        normalCtx.beginPath();
        normalCtx.arc(posX, y, dimpleRadius, 0, Math.PI * 2);
        normalCtx.fill();
      }
    }
  }
  
  const colorTexture = new THREE.CanvasTexture(colorCanvas);
  const normalTexture = new THREE.CanvasTexture(normalCanvas);
  
  return { colorTexture, normalTexture };
}

// Individual sphere component
function TechSphere({ position, size, name, icon, logoUrl, index }) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);

  // Create golf ball textures once
  const textures = useMemo(() => {
    const { colorTexture, normalTexture } = createGolfBallTextures();
    colorTexture.wrapS = THREE.RepeatWrapping;
    colorTexture.wrapT = THREE.RepeatWrapping;
    colorTexture.repeat.set(3, 3);
    
    normalTexture.wrapS = THREE.RepeatWrapping;
    normalTexture.wrapT = THREE.RepeatWrapping;
    normalTexture.repeat.set(3, 3);
    
    return { colorTexture, normalTexture };
  }, []);

  // Random velocity for floating
  const velocity = useRef({
    x: (Math.random() - 0.5) * 0.3,
    y: (Math.random() - 0.5) * 0.3,
    z: (Math.random() - 0.5) * 0.2,
  });

  useFrame((state) => {
    if (!meshRef.current) return;

    // Floating animation
    meshRef.current.position.x += velocity.current.x * 0.016;
    meshRef.current.position.y += velocity.current.y * 0.016;
    meshRef.current.position.z += velocity.current.z * 0.016;

    // Boundary check and bounce
    const bounds = { x: 8, y: 5, z: 4 };
    if (Math.abs(meshRef.current.position.x) > bounds.x) {
      velocity.current.x *= -1;
    }
    if (Math.abs(meshRef.current.position.y) > bounds.y) {
      velocity.current.y *= -1;
    }
    if (Math.abs(meshRef.current.position.z) > bounds.z) {
      velocity.current.z *= -1;
    }

    // Gentle rotation
    meshRef.current.rotation.x += 0.002;
    meshRef.current.rotation.y += 0.003;

    // Scale on hover
    const targetScale = hovered ? 1.3 : 1;
    meshRef.current.scale.lerp(
      new THREE.Vector3(targetScale, targetScale, targetScale),
      0.1
    );
  });

  return (
    <Float
      speed={2}
      rotationIntensity={0.5}
      floatIntensity={0.5}
    >
      <mesh
        ref={meshRef}
        position={position}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
      >
        <sphereGeometry args={[size, 128, 128]} />
        <meshStandardMaterial
          map={textures.colorTexture}
          normalMap={textures.normalTexture}
          normalScale={[0.5, 0.5]}
          color="#ffffff"
          roughness={0.7}
          metalness={0.0}
          envMapIntensity={1.2}
        />
        
        {/* Technology logo as HTML element */}
        <Html
          center
          distanceFactor={size * 2}
          transform
          occlude
          style={{
            transition: 'all 0.3s',
            pointerEvents: 'none',
          }}
        >
          <div className="flex items-center justify-center" style={{ width: '100px', height: '100px' }}>
            <img 
              src={logoUrl} 
              alt={name}
              style={{
                width: '80px',
                height: '80px',
                objectFit: 'contain',
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
              }}
            />
          </div>
        </Html>
      </mesh>
    </Float>
  );
}

// Scene component
function Scene({ mousePosition }) {
  const groupRef = useRef();

  const techStack = [
    { 
      name: 'C', 
      icon: 'C', 
      logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg',
      position: [-6, 2, -2], 
      size: 1.2 
    },
    { 
      name: 'C++', 
      icon: 'C++', 
      logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg',
      position: [6, -1, 1], 
      size: 0.9 
    },
    { 
      name: 'Python', 
      icon: 'PY', 
      logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
      position: [-4, -2, 2], 
      size: 1.4 
    },
    { 
      name: 'JavaScript', 
      icon: 'JS', 
      logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg',
      position: [2, 3, -1], 
      size: 1.1 
    },
    { 
      name: 'React', 
      icon: 'RC', 
      logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
      position: [-2, 0, 3], 
      size: 1.0 
    },
    { 
      name: 'Node.js', 
      icon: 'ND', 
      logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',
      position: [5, 2, -2], 
      size: 0.85 
    },
    { 
      name: 'Java', 
      icon: 'JV', 
      logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg',
      position: [0, -3, 0], 
      size: 1.15 
    },
    { 
      name: 'TypeScript', 
      icon: 'TS', 
      logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg',
      position: [-7, -1, 1], 
      size: 0.9 
    },
    { 
      name: 'HTML', 
      icon: 'HT', 
      logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg',
      position: [3, -2, 2], 
      size: 1.0 
    },
    { 
      name: 'CSS', 
      icon: 'CS', 
      logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg',
      position: [-3, 3, -1], 
      size: 0.95 
    },
    { 
      name: 'Git', 
      icon: 'GT', 
      logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg',
      position: [7, 0, 2], 
      size: 1.05 
    },
    { 
      name: 'SQL', 
      icon: 'SQL', 
      logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg',
      position: [0, 1, -3], 
      size: 0.8 
    },
  ];

  // Mouse parallax effect
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        mousePosition.y * 0.1,
        0.05
      );
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        mousePosition.x * 0.1,
        0.05
      );
    }
  });

  return (
    <group ref={groupRef}>
      <ambientLight intensity={2.0} />
      <directionalLight position={[5, 5, 5]} intensity={2.5} castShadow />
      <directionalLight position={[-5, -5, 5]} intensity={1.5} />
      <pointLight position={[10, 10, 10]} intensity={2.0} />
      <pointLight position={[-10, -10, -10]} intensity={1.5} color="#ffffff" />
      <pointLight position={[0, 0, 10]} intensity={1.8} color="#ffffff" />
      <spotLight position={[0, 15, 0]} angle={0.5} penumbra={1} intensity={1.5} />
      <spotLight position={[0, -15, 0]} angle={0.5} penumbra={1} intensity={1.2} />
      
      {techStack.map((tech, index) => (
        <TechSphere
          key={tech.name}
          {...tech}
          index={index}
        />
      ))}
    </group>
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
      className="min-h-screen bg-black text-white py-20 px-8 relative overflow-hidden"
    >
      {/* Gradient background effects */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <h2 className="text-5xl md:text-6xl font-light tracking-[0.3em] mb-12 text-center uppercase">
          MY TECH STACK
        </h2>

        {/* Three.js Canvas */}
        <div className="w-full h-[700px]">
          <Canvas
            camera={{ position: [0, 0, 15], fov: 75 }}
            gl={{ 
              antialias: true, 
              alpha: true,
              toneMapping: THREE.ACESFilmicToneMapping,
              toneMappingExposure: 2.2,
            }}
          >
            <color attach="background" args={['#000000']} />
            <Scene mousePosition={mousePosition} />
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
