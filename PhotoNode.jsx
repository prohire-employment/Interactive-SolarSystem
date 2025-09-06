/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { useLoader, useFrame } from "@react-three/fiber";
import { Billboard, Text, Ring } from "@react-three/drei";
import { TextureLoader, DoubleSide, AdditiveBlending } from "three";
import { useRef } from 'react';
import { setTargetBody } from "./actions";

// Scaling factors
const DISTANCE_SCALE = 70;
const RADIUS_SCALE = 1;
const TIME_SCALE = 0.05;

export default function CelestialBody({ body, highlight, dim }) {
  const { id, name, radius, distance, period, textureUrl, emissive, ring, rotationSpeed } = body;
  const texture = useLoader(TextureLoader, textureUrl);
  const ringTexture = ring ? useLoader(TextureLoader, ring.textureUrl) : null;
  
  const bodyRef = useRef();
  const orbitRef = useRef();

  useFrame(({ clock }) => {
    if (bodyRef.current) {
        // Orbital motion
        if (period > 0) {
            const angle = clock.getElapsedTime() * TIME_SCALE / period;
            const x = Math.cos(angle) * distance * DISTANCE_SCALE;
            const z = Math.sin(angle) * distance * DISTANCE_SCALE;
            bodyRef.current.position.set(x, 0, z);
        }
        // Axial rotation
        bodyRef.current.rotation.y += rotationSpeed * 0.001;
    }
    // Animate orbit opacity for a pulsing effect
    if (orbitRef.current) {
      orbitRef.current.material.opacity = 0.2 + Math.sin(clock.getElapsedTime() * 0.75) * 0.1;
    }
  });

  const scaledRadius = id === 'sun' ? radius / 15 : Math.log2(radius * 2 + 1) * RADIUS_SCALE;
  const materialColor = dim ? '#666666' : '#ffffff';
  const initialPosition = [distance * DISTANCE_SCALE, 0, 0];

  return (
    <group>
      <group
        ref={bodyRef}
        position={initialPosition}
        onClick={(e) => {
          e.stopPropagation();
          setTargetBody(id);
        }}
      >
        <mesh>
          <sphereGeometry args={[scaledRadius, 32, 32]} />
          {emissive ? (
            <meshBasicMaterial map={texture} color={emissive} />
          ) : (
            <meshStandardMaterial map={texture} color={materialColor} roughness={0.8} metalness={0.1} />
          )}
        </mesh>
        {emissive && (
             <mesh scale={[1.25, 1.25, 1.25]}>
                <sphereGeometry args={[scaledRadius, 32, 32]} />
                <meshBasicMaterial color={emissive} transparent opacity={0.35} blending={AdditiveBlending} />
            </mesh>
        )}
        {ring && ringTexture && (
          <mesh rotation-x={Math.PI / 2}>
            <ringGeometry args={[scaledRadius * ring.innerRadius, scaledRadius * ring.outerRadius, 64]} />
            <meshBasicMaterial map={ringTexture} side={DoubleSide} transparent opacity={0.8} />
          </mesh>
        )}
        <Billboard>
          <Text
            fontSize={scaledRadius > 10 ? 8 : 4}
            color="white"
            position={[0, scaledRadius + (scaledRadius > 10 ? 12 : 6), 0]}
            anchorX="center"
            anchorY="middle"
            fillOpacity={highlight ? 0.8 : 0}
          >
            {name}
          </Text>
        </Billboard>
      </group>

      {distance > 0 && !dim && (
         <Ring ref={orbitRef} args={[distance * DISTANCE_SCALE - 0.2, distance * DISTANCE_SCALE + 0.2, 128]} rotation-x={Math.PI / 2}>
            <meshBasicMaterial color="#ffffff" side={DoubleSide} transparent opacity={0.25} />
        </Ring>
      )}
    </group>
  );
}