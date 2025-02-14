// PlainThreeDScatterPlot.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as d3 from 'd3';
import { BufferGeometry, LineBasicMaterial, Float32BufferAttribute, MeshStandardMaterial } from 'three';

interface DataPoint {
  x: string;
  y: string;
  z: string;
  value: number;
  [key: string]: any;
}

interface AxisLabelsProps {
  cols: {
    X: string;
    Y: string;
    Z: string;
  };
  xLabels: string[];
  yLabels: string[];
  zLabels: string[];
  xScale: d3.ScaleBand<string>;
  yScale: d3.ScaleBand<string>;
  zScale: d3.ScaleBand<string>;
}

interface PlainScatterPlotProps {
  cols: {
    X: string;
    Y: string;
    Z: string;
  };
}

const fetchDataForPlain = async (
  setData: React.Dispatch<React.SetStateAction<DataPoint[]>>,
  cols: PlainScatterPlotProps['cols']
) => {
  const data = await d3.csv('/10000_HCP_Ven_CLL.csv');
  const processedData: DataPoint[] = data.map(d => ({
    x: d[cols.X],
    y: d[cols.Y],
    z: d[cols.Z],
    value: 1,
  }));

  setData(processedData);
};

const Grid: React.FC = () => {
  const gridSize = 10;
  const divisions = 10;
  const gridLines: number[][] = [];

  for (let i = 0; i <= divisions; i++) {
    const offset = (i / divisions) * gridSize;
    gridLines.push([offset, 0, 0, offset, gridSize, 0]); 
    gridLines.push([0, offset, 0, gridSize, offset, 0]); 
    gridLines.push([0, 0, offset, gridSize, 0, offset]); 
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

const AxisLabels: React.FC<AxisLabelsProps> = ({ xLabels, yLabels, zLabels, xScale, yScale, zScale, cols }) => {
  return (
    <>
      <Text position={[3.5, -3, -1]} fontSize={0.5} anchorX="center" anchorY="middle" color="black">
        {cols.X}
      </Text>
      <Text
        position={[-3.5, 3.0, -1]}
        fontSize={0.5}
        color="black"
        rotation={[0, 0, Math.PI / 2]}
        anchorX="center"
        anchorY="middle"
      >
        {cols.Y}
      </Text>
      <Text position={[-3, -1.5, 5]} rotation={[Math.PI / 2, 0, Math.PI / 2]} fontSize={0.5} color="black">
        {cols.Z}
      </Text>

      {xLabels &&
        xLabels.map((range, i) => (
          <Text key={i} position={[xScale(range.label) as number, -1, -1]} rotation={[0, 0, Math.PI / 3]} fontSize={0.3} color="black">
            {range.label}
          </Text>
        ))}

      {yLabels &&
        yLabels.map((range, i) => (
          <Text key={i} position={[-1, yScale(range.label) as number, -1]} fontSize={0.3} color="black" anchorX="right">
            {range.label}
          </Text>
        ))}

      {zLabels &&
        zLabels.map((range, i) => (
          <Text key={i} position={[-1, -1, zScale(range.label) as number]} fontSize={0.3} rotation={[Math.PI / 2, 0, 0]} color="black">
            {range.label}
          </Text>
        ))}
    </>
  );
};

const PlainThreeDScatterPlot: React.FC<PlainScatterPlotProps> = ({ cols }) => {
  const [data, setData] = useState<DataPoint[]>([]);

  useEffect(() => {
    fetchDataForPlain(setData, cols);
  }, [cols]);

  return (
    <div style={{ height: 600 }}>
      <center>
        <h1>3-D Scatter Chart</h1>
      </center>
      <Canvas camera={{ position: [0, 0, 20], up: [0, 0, 1] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[20, 20, 20]} />
        <OrbitControls />
        <Grid />
        <AxisLabels 
          xLabels={[]} 
          yLabels={[]} 
          zLabels={[]} 
          xScale={d3.scaleBand().range([0, 10])} 
          yScale={d3.scaleBand().range([0, 10])} 
          zScale={d3.scaleBand().range([0, 10])} 
          cols={cols} 
        />
        {data.map((d, i) => (
          <mesh position={[5, 0, 5]} key={i}>
            <sphereGeometry args={[0.15, 32, 32]} />
            <meshStandardMaterial color="#00bcd4" />
          </mesh>
        ))}
      </Canvas>
    </div>
  );
};

export { PlainThreeDScatterPlot };
