/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import {Canvas, useLoader, useThree} from '@react-three/fiber'
import {TrackballControls} from '@react-three/drei'
import {useRef, useEffect, Suspense} from 'react'
import {animate} from 'motion'
import { Vector3, TextureLoader, BackSide } from 'three'
import useStore from './store'
import CelestialBody from './PhotoNode'
import {setTargetBody} from './actions'

function StarryBackground() {
    const texture = useLoader(TextureLoader, 'https://i.imgur.com/3Z3O2Q8.jpeg');
    return (
      <mesh>
        <sphereGeometry args={[5000, 64, 64]} />
        <meshBasicMaterial map={texture} side={BackSide} />
      </mesh>
    );
}

function SceneContent() {
  const celestialBodies = useStore.use.celestialBodies()
  const targetBodyId = useStore.use.targetBody()
  const resetCam = useStore.use.resetCam()
  const {camera} = useThree()
  const controlsRef = useRef()
  const groupRef = useRef()
  
  useEffect(() => {
    const targetBody = celestialBodies?.find(b => b.id === targetBodyId);
    
    if (controlsRef.current && (targetBody || resetCam)) {
        const duration = 1.2;
        const ease = "easeInOut";
        const currentTarget = controlsRef.current.target.clone();
        
        let targetCamPos, targetControlsTarget;

        if (resetCam) {
            targetCamPos = new Vector3(0, 200, 500);
            targetControlsTarget = new Vector3(0, 0, 0);
            useStore.setState({ resetCam: false });
        } else if (targetBody) {
            const bodyObj = groupRef.current.getObjectByProperty('type', 'Group')?.children.find(child => child.userData.id === targetBodyId);

            // Since bodies are moving, we set the target to the sun (0,0,0) and adjust camera
            // for a good viewing distance of the selected planet's orbit.
            const distance = (targetBody.distance || 20) * 70;
            targetCamPos = new Vector3(0, distance / 4, distance * 1.2);
            targetControlsTarget = new Vector3(0, 0, 0);
        }

        if (targetCamPos && targetControlsTarget) {
            animate(camera.position.x, targetCamPos.x, { duration, ease, onUpdate: latest => camera.position.x = latest });
            animate(camera.position.y, targetCamPos.y, { duration, ease, onUpdate: latest => camera.position.y = latest });
            animate(camera.position.z, targetCamPos.z, { duration, ease, onUpdate: latest => camera.position.z = latest });

            animate(currentTarget.x, targetControlsTarget.x, { duration, ease, onUpdate: latest => { if (controlsRef.current) controlsRef.current.target.x = latest }});
            animate(currentTarget.y, targetControlsTarget.y, { duration, ease, onUpdate: latest => { if (controlsRef.current) controlsRef.current.target.y = latest }});
            animate(currentTarget.z, targetControlsTarget.z, { duration, ease, onUpdate: latest => { if (controlsRef.current) controlsRef.current.target.z = latest }});
        }
    }
  }, [targetBodyId, resetCam, celestialBodies, camera]);


  return (
    <>
      <StarryBackground />
      <ambientLight intensity={0.05} />
      <pointLight position={[0, 0, 0]} intensity={3.0} distance={3000} color="#FFDDBB" />
      <TrackballControls
        ref={controlsRef}
        minDistance={10}
        maxDistance={2000}
        noPan
      />
      <group ref={groupRef}>
        {celestialBodies?.map(body => {
          const isHighlighted = targetBodyId === body.id
          const dim = !!targetBodyId && !isHighlighted
          return (
            <CelestialBody
              key={body.id}
              body={body}
              highlight={isHighlighted}
              dim={dim}
            />
          )
        })}
      </group>
    </>
  )
}

export default function PhotoViz() {
  return (
    <Canvas
      camera={{position: [0, 200, 500], near: 0.1, far: 10000}}
      onPointerMissed={() => setTargetBody(null)}
    >
      <Suspense fallback={null}>
        <SceneContent />
      </Suspense>
    </Canvas>
  )
}