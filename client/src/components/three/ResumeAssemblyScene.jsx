import React, { useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { RoundedBox, Text } from '@react-three/drei';
import { animate } from 'framer-motion';

const Panel = ({ text, delay, targetPosition, targetRotation, startPosition, startRotation, color }) => {
  const groupRef = useRef();

  useEffect(() => {
    const controls = animate(0, 1, {
      duration: 1.2,
      delay: delay,
      ease: "circOut",
      onUpdate: (v) => {
        if (groupRef.current) {
          // Lerp position
          groupRef.current.position.x = startPosition[0] + (targetPosition[0] - startPosition[0]) * v;
          groupRef.current.position.y = startPosition[1] + (targetPosition[1] - startPosition[1]) * v;
          groupRef.current.position.z = startPosition[2] + (targetPosition[2] - startPosition[2]) * v;
          
          // Lerp rotation
          groupRef.current.rotation.x = startRotation[0] + (targetRotation[0] - startRotation[0]) * v;
          groupRef.current.rotation.y = startRotation[1] + (targetRotation[1] - startRotation[1]) * v;
          groupRef.current.rotation.z = startRotation[2] + (targetRotation[2] - startRotation[2]) * v;
        }
      }
    });

    return () => controls.stop();
  }, [delay, targetPosition, targetRotation, startPosition, startRotation]);

  return (
    <group ref={groupRef} position={startPosition} rotation={startRotation}>
      <RoundedBox args={[4.2, 1.4, 0.05]} radius={0.05} smoothness={4}>
        <meshStandardMaterial color={color} />
      </RoundedBox>
      <Text
        position={[0, 0, 0.03]}
        fontSize={0.4}
        color="#10131C" // ink color
        font="https://fonts.gstatic.com/s/ibmplexmono/v19/-F63fjptAgt5VM-kVkqdyU8n1i8q131nj-o.woff"
        anchorX="center"
        anchorY="middle"
      >
        {text}
      </Text>
    </group>
  );
};

export default function ResumeAssemblyScene() {
  const panels = [
    { text: "Header", targetPos: [0, 2.25, 0.0], startPos: [-4, 4, -2], startRot: [0.5, 0.3, 0.2] },
    { text: "Experience", targetPos: [0, 0.75, 0.1], startPos: [4, 3, -1], startRot: [-0.4, 0.5, -0.2] },
    { text: "Education", targetPos: [0, -0.75, 0.2], startPos: [-3, -2, -3], startRot: [0.2, -0.6, 0.4] },
    { text: "Skills", targetPos: [0, -2.25, 0.3], startPos: [3, -4, -2], startRot: [-0.6, -0.2, -0.5] }
  ];

  return (
    <Canvas camera={{ position: [0, 0, 8], fov: 45 }} gl={{ alpha: true }}>
      <ambientLight intensity={0.8} />
      <directionalLight position={[10, 10, 10]} intensity={1.5} />
      {panels.map((p, i) => (
        <Panel 
          key={p.text} 
          text={p.text}
          delay={i * 0.3}
          startPosition={p.startPos}
          startRotation={p.startRot}
          targetPosition={p.targetPos}
          targetRotation={[0, 0, 0]}
          color="#F6F1E4" // parchment color
        />
      ))}
    </Canvas>
  );
}
