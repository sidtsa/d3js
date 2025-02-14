import React, { useState, useEffect, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as d3 from 'd3';
import { BufferGeometry, LineBasicMaterial, Float32BufferAttribute, Color, Vector3, Line, MeshStandardMaterial } from 'three';

// Define types for the data and props
interface DataPoint {
  x: string;
  y: string;
  z: string;
  value: number;
  [key: string]: any; // Add this line to store additional columns
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

interface ThreeDScatterPlotProps {
  cols: {
    X: string;
    Y: string;
    Z: string;
  };
  extraColumn: string; // Add this to receive the extra column
}

interface PlainScatterPlotProps {
  cols: {
    X: string;
    Y: string;
    Z: string;
  };
// Add this to receive the extra column
}

// Fetch and process data
const fetchData = async ( 
  maxCount: number,
  setMaxCount: React.Dispatch<React.SetStateAction<number>>,
  setData: React.Dispatch<React.SetStateAction<DataPoint[]>>,
  cols: ThreeDScatterPlotProps['cols'],
  extraColumn: string
) => {
  const data = await d3.csv('/10000_HCP_Ven_CLL.csv');

  // Get min and max for each axis
  const xValues = data.map(d => +d[cols.X]);
  const yValues = data.map(d => +d[cols.Y]);
  const zValues = data.map(d => +d[cols.Z]);

  const xMin = Math.min(...xValues);
  const xMax = Math.max(...xValues);
  const yMin = Math.min(...yValues);
  const yMax = Math.max(...yValues);
  const zMin = Math.min(...zValues);
  const zMax = Math.max(...zValues);

  // Create ranges
  const createRanges = (min: number, max: number) => {
    const rangeSize = (max - min) / 10;
    return Array.from({ length: 10 }, (_, i) => ({
      min: min + i * rangeSize,
      max: min + (i + 1) * rangeSize,
    }));
  };

  const xRanges = createRanges(xMin, xMax);
  const yRanges = createRanges(yMin, yMax);
  const zRanges = createRanges(zMin, zMax);

  // Filter data based on ranges
  const filteredData = data.filter((d: any) => { // Explicitly define type for d
    const xValue = +d[cols.X];
    const yValue = +d[cols.Y];
    const zValue = +d[cols.Z];

    return xRanges.some(range => xValue >= range.min && xValue < range.max) &&
           yRanges.some(range => yValue >= range.min && yValue < range.max) &&
           zRanges.some(range => zValue >= range.min && zValue < range.max);
  });

  const processedData: DataPoint[] = filteredData.map(d => ({
    x: d[cols.X],
    y: d[cols.Y],
    z: d[cols.Z],
    value: 1, // or any other logic to determine value
    extraValue: d[extraColumn] || 'Unknown',
  }));

  setData(processedData);
};




// Grid component
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

// Axis labels component
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
        xLabels.map((label, i) => (
          <Text key={i} position={[xScale(label) as number, -1, -1]} rotation={[0, 0, Math.PI / 3]} fontSize={0.3} color="black">
            {label}
          </Text>
        ))}
      {yLabels &&
        yLabels.map((label, i) => (
          <Text key={i} position={[-1, yScale(label) as number, -1]} fontSize={0.3} color="black" anchorX="right">
            {label}
          </Text>
        ))}
      {zLabels &&
        zLabels.map((label, i) => (
          <Text key={i} position={[-1, -1, zScale(label) as number]} fontSize={0.3} rotation={[Math.PI / 2, 0, 0]} color="black">
            {label}
          </Text>
        ))}
    </>
  );
};

// Color legend component
const ColorLegend: React.FC<{ colorMap: { [key: string]: string } }> = ({ colorMap }) => {
  return (
    <group position={[10, 2, 10]}>
      {/* <Text position={[0, 1, 0]} fontSize={0.5} color="black">
        Color Legend
      </Text> */}
      {Object.keys(colorMap).map((label, i) => (
        <group key={i} position={[0, -i * 0.5, 0]}>
          <mesh>
            <boxGeometry args={[0.5, 0.5, 0.5]} />
            <meshStandardMaterial color={colorMap[label]} />
          </mesh>
          <Text position={[2, 0, 0]} fontSize={0.3} color="black">
            {label}
          </Text>
        </group>
      ))}
    </group>
  );
};


// Data table component
const DataTable: React.FC<{ selectedData: DataPoint[] }> = ({ selectedData }) => {
  if (selectedData.length === 0) return null;
  console.log(selectedData)
  const columns = Object.keys(selectedData[0]);

  return (
    <table style={tableStyles}>
      <thead>
        <tr>
          {columns.map(col => (
            <th key={col} style={thTdStyles}>{col}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {selectedData.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {columns.map(col => (
              <td key={col} style={thTdStyles}>{row[col]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const tableStyles: React.CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
  marginTop: '20px',
  marginBottom: '20px',
  tableLayout: 'fixed',
};

const thTdStyles: React.CSSProperties = {
  border: '1px solid black',
  padding: '5px',
  textAlign: 'center',
  wordWrap: 'break-word',
};

// Main scatter plot component
const ThreeDScatterPlot: React.FC<ThreeDScatterPlotProps> = ({ cols, extraColumn }) => {
  const [data, setData] = useState<DataPoint[]>([]);
  const [maxCount, setMaxCount] = useState(0);
  const [selectedPoint, setSelectedPoint] = useState<DataPoint | null>(null);
  const [selectedData, setSelectedData] = useState<DataPoint[]>([]);

  useEffect(() => {
    fetchData(maxCount, setMaxCount, setData, cols, extraColumn);
  }, [cols.X, cols.Y, cols.Z, extraColumn]);

  // Scales for X, Y, Z axes
  const xScale = useMemo(() => (data.length > 0 ? d3.scaleBand().domain(data.map(d => d.x)).range([0, 10]) : null), [data]);
  const yScale = useMemo(() => (data.length > 0 ? d3.scaleBand().domain(data.map(d => d.y)).range([0, 10]) : null), [data]);
  const zScale = useMemo(() => (data.length > 0 ? d3.scaleBand().domain(data.map(d => d.z)).range([0, 10]) : null), [data]);

  const colorMap: { [key: string]: string } = {
    High: 'pink',   // Orange (secondary color)
    Medium: 'yellow', // Green (secondary color)
    Low: 'black',    // Purple (secondary color)
    Unknown: '#BDBDBD' // Gray (neutral color)
  };
  
  

  const getColorForExtraColumn = (extraValue: string): string => {
    return colorMap[extraValue] || 'gray';
  };

  useEffect(() => {
    if (selectedPoint) {
      const filteredData = data.filter(
        d =>
          d.x === selectedPoint.x &&
          d.y === selectedPoint.y &&
          d.z === selectedPoint.z
      );
      setSelectedData(filteredData);
    }
  }, [selectedPoint, data]);

  if (!xScale || !yScale || !zScale) return null;

  return (
    <div style={{ height: 600 }}>
      <center>
        <h1>3-D Color Scatter Chart</h1>
      </center>
      <Canvas camera={{ position: [0, 0, 20], up: [0, 0, 1] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[20, 20, 20]} />
        <OrbitControls />
        <ColorLegend colorMap={colorMap} />
        <Grid />
        <AxisLabels xLabels={xScale.domain()} yLabels={yScale.domain()} zLabels={zScale.domain()} xScale={xScale} yScale={yScale} zScale={zScale} cols={cols} />

        {data.map((d, i) => (
          <React.Fragment key={i}>
            <mesh
              position={[xScale(d.x) as number, yScale(d.y) as number, zScale(d.z) as number]}
              onClick={() => {
                setSelectedPoint(d);
              }}
            >
              <sphereGeometry args={[0.15, 32, 32]} />
              <meshStandardMaterial color={getColorForExtraColumn(d.extraValue)} />
            </mesh>
          </React.Fragment>
        ))}
       
      </Canvas>

      {/* Add the ColorLegend component */}
     

      {selectedPoint && <DataTable selectedData={selectedData} />}
    </div>
  );
};

// Fetch and process data for PlainThreeDScatterPlot
const fetchDataForPlain = async (
  maxCount: number,
  setMaxCount: React.Dispatch<React.SetStateAction<number>>,
  setData: React.Dispatch<React.SetStateAction<DataPoint[]>>,
  cols: PlainScatterPlotProps['cols']
) => {
  const data = await d3.csv('/10000_HCP_Ven_CLL.csv');
  // ... (logic for fetching and processing data without extraColumn)
};

// Plain scatter plot component
const PlainThreeDScatterPlot: React.FC<PlainScatterPlotProps> = ({ cols }) => {
  const [data, setData] = useState<DataPoint[]>([]);
  const [maxCount, setMaxCount] = useState(0);
  const [selectedPoint, setSelectedPoint] = useState<DataPoint | null>(null);
  const [selectedData, setSelectedData] = useState<DataPoint[]>([]);

  useEffect(() => {
    fetchDataForPlain(maxCount, setMaxCount, setData, cols);
  }, [cols.X, cols.Y, cols.Z]);

  const xScale = useMemo(() => (data.length > 0 ? d3.scaleBand().domain(data.map(d => d.x)).range([0, 10]) : null), [data]);
  const yScale = useMemo(() => (data.length > 0 ? d3.scaleBand().domain(data.map(d => d.y)).range([0, 10]) : null), [data]);
  const zScale = useMemo(() => (data.length > 0 ? d3.scaleBand().domain(data.map(d => d.z)).range([0, 10]) : null), [data]);

  useEffect(() => {
    if (selectedPoint) {
      const filteredData = data.filter(
        d =>
          d.x === selectedPoint.x &&
          d.y === selectedPoint.y &&
          d.z === selectedPoint.z
      );
      setSelectedData(filteredData);
    }
  }, [selectedPoint, data]);

  if (!xScale || !yScale || !zScale) return null;

  return (
    <div style={{ height: 600 }}>
      <center>
        <h1>Plain Scatter Chart</h1>
      </center>
      <Canvas camera={{ position: [0, 0, 20], up: [0, 0, 1] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[20, 20, 20]} />
        <OrbitControls />

        <Grid />
        <AxisLabels xLabels={xScale.domain()} yLabels={yScale.domain()} zLabels={zScale.domain()} xScale={xScale} yScale={yScale} zScale={zScale} cols={cols} />

        {data.map((d, i) => (
          <React.Fragment key={i}>
            <mesh
              position={[xScale(d.x) as number, yScale(d.y) as number, zScale(d.z) as number]}
              onClick={() => setSelectedPoint(d)}
            >
              <sphereGeometry args={[0.15, 32, 32]} />
              <meshStandardMaterial color="red" />
            </mesh>
            <primitive
              object={
                new Line(
                  new BufferGeometry().setFromPoints([
                    new Vector3(xScale(d.x) as number, yScale(d.y) as number, 0),
                    new Vector3(xScale(d.x) as number, yScale(d.y) as number, zScale(d.z) as number)
                  ]),
                  new LineBasicMaterial({ color: 'lightgray' })
                )
              }
            />
          </React.Fragment>
        ))}
      </Canvas>
      {selectedPoint && <DataTable selectedData={selectedData} />}
    </div>
  );
};

export { ThreeDScatterPlot, PlainThreeDScatterPlot };
