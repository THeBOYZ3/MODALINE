import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface BallpitProps {
  count?: number;
  gravity?: number;
  friction?: number;
  wallBounce?: number;
  followCursor?: boolean;
  colors?: string[];
  minSize?: number;
  maxSize?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const Ballpit: React.FC<BallpitProps> = ({
  count = 45,
  gravity = 0,
  friction = 0.985,
  wallBounce = 0.35,
  followCursor = true,
  colors = ['#0063ff', '#ffffff', '#000000'],
  minSize = 0.7,
  maxSize = 1.3,
  className = '',
  style = {},
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let animationFrameId: number;
    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 25;

    // Transparent renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0); // Completely transparent
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 2.0);
    dirLight1.position.set(10, 20, 15);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight2.position.set(-10, -10, -10);
    scene.add(dirLight2);

    // Calculate dynamic 3D screen bounds at camera.position.z = 25 with 45 deg FOV
    const vFOV = (camera.fov * Math.PI) / 180;
    let frustumHeight = 2 * Math.tan(vFOV / 2) * camera.position.z;
    let frustumWidth = frustumHeight * (width / height);

    let boundsY = frustumHeight / 2;
    let boundsX = frustumWidth / 2;
    const boundsZ = 6;

    // Create Balls
    const spheres: {
      mesh: THREE.Mesh;
      baseRadius: number;
      radius: number;
      pos: THREE.Vector3;
      vel: THREE.Vector3;
    }[] = [];

    const getScaleFactor = (w: number) => {
      if (w < 768) return 0.5; // Mobile: 50% of original
      if (w < 1024) return 0.7; // Tablet: 70% of original
      return 1.0; // Desktop: original size
    };

    const initialScale = getScaleFactor(width);
    const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
    const parsedColors = colors.map((c) => new THREE.Color(c));

    for (let i = 0; i < count; i++) {
      const baseRadius = minSize + Math.random() * (maxSize - minSize);
      const radius = baseRadius * initialScale;
      const color = parsedColors[i % parsedColors.length];

      const material = new THREE.MeshStandardMaterial({
        color,
        roughness: 0.25,
        metalness: 0.1,
      });

      const mesh = new THREE.Mesh(sphereGeometry, material);
      mesh.scale.setScalar(radius);

      // Distribute across full screen width and height
      const pos = new THREE.Vector3(
        (Math.random() - 0.5) * (boundsX * 1.8),
        (Math.random() - 0.5) * (boundsY * 1.8),
        (Math.random() - 0.5) * (boundsZ * 1.2)
      );

      // Slow, smooth initial drift velocity
      const vel = new THREE.Vector3(
        (Math.random() - 0.5) * 0.04,
        (Math.random() - 0.5) * 0.04,
        (Math.random() - 0.5) * 0.03
      );

      mesh.position.copy(pos);
      scene.add(mesh);

      spheres.push({ mesh, baseRadius, radius, pos, vel });
    }

    // Cursor tracking
    const mouse = new THREE.Vector2(-9999, -9999);
    const raycaster = new THREE.Raycaster();
    const mousePlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const mouseWorldPos = new THREE.Vector3();

    const handlePointerPos = (clientX: number, clientY: number) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      raycaster.ray.intersectPlane(mousePlane, mouseWorldPos);
    };

    const handleMouseMove = (e: MouseEvent) => {
      handlePointerPos(e.clientX, e.clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        handlePointerPos(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    if (followCursor) {
      window.addEventListener('mousemove', handleMouseMove, { passive: true });
      window.addEventListener('touchmove', handleTouchMove, { passive: true });
      window.addEventListener('touchstart', handleTouchMove, { passive: true });
    }

    // Resize listener
    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);

      frustumHeight = 2 * Math.tan(vFOV / 2) * camera.position.z;
      frustumWidth = frustumHeight * (width / height);
      boundsY = frustumHeight / 2;
      boundsX = frustumWidth / 2;

      const scale = getScaleFactor(width);
      for (let i = 0; i < spheres.length; i++) {
        const ball = spheres[i];
        ball.radius = ball.baseRadius * scale;
        ball.mesh.scale.setScalar(ball.radius);
      }
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Update positions & physics
      for (let i = 0; i < spheres.length; i++) {
        const ball = spheres[i];

        // Apply gravity
        ball.vel.y -= gravity * 0.002;

        // Apply friction for gentle slowing
        ball.vel.multiplyScalar(friction);

        // Smooth cursor push
        if (followCursor && mouse.x !== -9999) {
          const distToMouse = ball.pos.distanceTo(mouseWorldPos);
          if (distToMouse < 6) {
            const force = (6 - distToMouse) * 0.008;
            const dir = new THREE.Vector3().subVectors(ball.pos, mouseWorldPos).normalize();
            ball.vel.addScaledVector(dir, force);
          }
        }

        // Move ball
        ball.pos.add(ball.vel);

        // Screen edge wall collisions (smooth bounce)
        const maxX = boundsX - ball.radius;
        if (Math.abs(ball.pos.x) > maxX) {
          ball.pos.x = Math.sign(ball.pos.x) * maxX;
          ball.vel.x *= -wallBounce;
        }

        const maxY = boundsY - ball.radius;
        if (Math.abs(ball.pos.y) > maxY) {
          ball.pos.y = Math.sign(ball.pos.y) * maxY;
          ball.vel.y *= -wallBounce;
        }

        const maxZ = boundsZ - ball.radius;
        if (Math.abs(ball.pos.z) > maxZ) {
          ball.pos.z = Math.sign(ball.pos.z) * maxZ;
          ball.vel.z *= -wallBounce;
        }

        // Ball-to-ball soft elastic collision handling
        for (let j = i + 1; j < spheres.length; j++) {
          const other = spheres[j];
          const diff = new THREE.Vector3().subVectors(other.pos, ball.pos);
          const dist = diff.length();
          const minDist = ball.radius + other.radius;

          if (dist < minDist && dist > 0) {
            const normal = diff.normalize();
            const overlap = minDist - dist;

            // Softly separate spheres
            ball.pos.addScaledVector(normal, -overlap * 0.4);
            other.pos.addScaledVector(normal, overlap * 0.4);

            // Relative velocity
            const relVel = new THREE.Vector3().subVectors(other.vel, ball.vel);
            const sepVel = relVel.dot(normal);

            if (sepVel < 0) {
              const impulse = sepVel * 0.4; // Soft collision bounce
              ball.vel.addScaledVector(normal, impulse);
              other.vel.addScaledVector(normal, -impulse);
            }
          }
        }

        ball.mesh.position.copy(ball.pos);
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (followCursor) {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('touchmove', handleTouchMove);
        window.removeEventListener('touchstart', handleTouchMove);
      }
      window.removeEventListener('resize', handleResize);

      // Clean up Three scene
      spheres.forEach((s) => {
        s.mesh.geometry.dispose();
        if (Array.isArray(s.mesh.material)) {
          s.mesh.material.forEach((m) => m.dispose());
        } else {
          s.mesh.material.dispose();
        }
      });
      renderer.dispose();
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, [count, gravity, friction, wallBounce, followCursor, colors, minSize, maxSize]);

  return (
    <div
      ref={containerRef}
      className={`w-full h-full pointer-events-none ${className}`}
      style={{ background: 'transparent', ...style }}
    />
  );
};

export default Ballpit;
