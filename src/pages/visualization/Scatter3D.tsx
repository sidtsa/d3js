import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import { scaleLinear } from 'd3-scale';
import { BufferGeometry, LineBasicMaterial, Line, Float32BufferAttribute } from 'three';
import './ThreeDScatterPlot.css'; // Import your CSS file

interface DataPoint {
  x: number;
  y: number;
  z: number;
}

const data: DataPoint[] = [
  { x: 1, y: 2, z: 3 },
  { x: 2, y: 3, z: 4 },
  { x: 3, y: 4, z: 5 },
  // Add more data points as needed
];

const Grid: React.FC = () => {
  const gridSize = 10;
  const divisions = 10;
  const gridLines: number[][] = [];

  for (let i = 0; i <= divisions; i++) {
    const offset = (i / divisions) * gridSize;
    gridLines.push([offset, 0, 0, offset, gridSize, 0]); // Lines parallel to Y axis
    gridLines.push([0, offset, 0, gridSize, offset, 0]); // Lines parallel to X axis
    gridLines.push([0, 0, offset, gridSize, 0, offset]); // Lines parallel to Z axis
  }

  return (
    <>
      {gridLines.map((line, i) => {
        const points = new Float32BufferAttribute(line, 3);
        const geometry = new BufferGeometry();
        geometry.setAttribute('position', points);

        return (
          <line key={i}>
            <primitive object={geometry} />
            <lineBasicMaterial color="lightgray" />
          </line>
        );
      })}
    </>
  );
};

const AxisLabels: React.FC = () => {
  return (
    <>
      <Text position={[5, -1, 0]} fontSize={0.3} color="black">
        X
      </Text>
      <Text position={[-1, 5, 0]} fontSize={0.3} color="black">
        Y
      </Text>
      <Text position={[-1, 0, 5]} rotation={[Math.PI / 2, 0, 0]} fontSize={0.3} color="black">
        Z
      </Text>
    </>
  );
};

interface DataLinesProps {
  data: DataPoint[];
  xScale: (value: number) => number;
  yScale: (value: number) => number;
  zScale: (value: number) => number;
}

const DataLines: React.FC<DataLinesProps> = ({ data, xScale, yScale, zScale }) => {
  return (
    <>
      {data.map((d, i) => {
        const x = xScale(d.x);
        const y = yScale(d.y);
        const z = zScale(d.z);

        // Create lines connecting data points to axes
        const lines = [
          [x, y, 0, x, y, z], // Z-axis line
          [x, 0, z, x, y, z], // Y-axis line
          [0, y, z, x, y, z], // X-axis line
        ];

        return lines.map((line, index) => {
          const points = new Float32BufferAttribute(line, 3);
          const geometry = new BufferGeometry();
          geometry.setAttribute('position', points);

          return (
            <line key={`${i}-${index}`}>
              <primitive object={geometry} />
              <lineBasicMaterial color="lightgray" />
            </line>
          );
        });
      })}
    </>
  );
};

const ThreeDScatterPlot: React.FC = () => {
  const xScale = scaleLinear().domain([0, 10]).range([0, 10]);
  const yScale = scaleLinear().domain([0, 10]).range([0, 10]);
  const zScale = scaleLinear().domain([0, 10]).range([0, 10]);

  return (
    <div className="canvas-container">
      <Canvas camera={{ position: [15, 15, 15], up: [0, 0, 1] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[20, 20, 20]} />
        <OrbitControls />

        <Grid />
        <AxisLabels />
        <DataLines data={data} xScale={xScale} yScale={yScale} zScale={zScale} />

        {data.map((d, i) => (
          <mesh key={i} position={[xScale(d.x), yScale(d.y), zScale(d.z)]}>
            <sphereGeometry args={[0.1, 32, 32]} />
            <meshStandardMaterial color={'steelblue'} />
          </mesh>
        ))}
      </Canvas>
    </div>
  );
};

export default ThreeDScatterPlot;
