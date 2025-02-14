import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';

// Define the types for the data
interface DataPoint {
  x: number;
  z: number;
  value: number;
  color: string;
}

interface ColumnChart3DProps {
  data: DataPoint[];
}

const ColumnChart3D: React.FC<ColumnChart3DProps> = ({ data }) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.x += 0.01;
      groupRef.current.rotation.y += 0.01;
    }
  });

  return (
    <group ref={groupRef}>
      {data.map((d, i) => (
        <mesh key={i} position={[d.x, d.value / 2, d.z]}>
          <boxGeometry args={[1, d.value, 1]} />
          <meshStandardMaterial color={d.color} />
        </mesh>
      ))}
    </group>
  );
};

const D3ChartColumn: React.FC = () => {
  const [data, setData] = useState<DataPoint[]>([]);

  useEffect(() => {
    d3.csv('/Segmentation-Dummy.csv').then((data2: any[]) => {
      // Transform the data to fit the DataPoint interface
      const processedData: DataPoint[] = data2.slice(0, 1000).map(d => ({
        x: +d.x, // Ensure numerical conversion
        z: +d.z, // Ensure numerical conversion
        value: +d.value, // Ensure numerical conversion
        color: d.color || '#ffffff' // Default color if not present
      }));

      console.log(processedData);
      setData(processedData);
    });
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas>
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <ColumnChart3D data={data} />
      </Canvas>
    </div>
  );
};

export default D3ChartColumn;
