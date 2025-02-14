import React, { useMemo, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as d3 from 'd3';
import { BufferGeometry, LineBasicMaterial, Vector3 } from 'three';
import './ThreeDBarChart.css'; // Import the CSS file for positioning the popup

interface DataPoint {
  state: string;
  specialty: string;
  value: number;
  value1: string[]; // Array of strings to store multiple values
  [key: string]: any; // Allow additional properties from the CSV data
}

interface DataPointWithIndex extends DataPoint {
  index: number;
  originalData: DataPoint[]; // Add originalData to store all rows related to the bar
}

interface ThreeDBarChartProps {
  data: DataPoint[];
  colX: string;
  colY: string;
  colZ: string;
}

const ThreeDBarChart: React.FC<ThreeDBarChartProps> = ({ data, colX, colY, colZ}) => {
  const [hoveredBar, setHoveredBar] = useState<DataPointWithIndex | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);

  // Compute bar data with Z-axis values based on count of unique values in value1
  const barData = useMemo(() => {
    const groupedData = d3.rollup(
      data,
      (v) => v, // Store the full array of rows
      (d) => d.state,
      (d) => d.specialty
    );

    const flattenedData: DataPointWithIndex[] = [];
    for (const [state, specialties] of groupedData) {
      for (const [specialty, rows] of specialties) {
        const value1 = rows.map((d) => d.value1).flat(); // Flatten array of arrays
        flattenedData.push({
          state,
          specialty,
          value: 0, // Placeholder, not used
          value1,
          index: 0,
          originalData: rows as DataPoint[] // Store all rows related to this bar
        });
      }
    }
    return flattenedData;
  }, [data]);

  const sortedStates = Array.from(d3.rollup(data, (v) => d3.sum(v, (d) => d.value), (d) => d.state))
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map((d) => d[0]);

  const topStateData = barData.filter((d) => sortedStates.includes(d.state));

  const topSpecialtiesAndValues: Record<string, { specialties: string[], values: string[] }> = {};
  sortedStates.forEach((state) => {
    const stateData = topStateData.filter((d) => d.state === state);
    const specialties = Array.from(d3.rollup(stateData, (v) => d3.sum(v, (d) => d.value), (d) => d.specialty))
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map((d) => d[0]);
    const values = Array.from(d3.rollup(stateData, (v) => d3.sum(v, (d) => d.value), (d) => d.specialty))
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map((d) => d[1]); // Use d[1] to get the values directly
    topSpecialtiesAndValues[state] = { specialties, values: values.map(String) }; // Convert values to strings
  });

  const flattenedSpecialtyData: DataPointWithIndex[] = [];
  Object.entries(topSpecialtiesAndValues).forEach(([state, { specialties }]) => {
    specialties.forEach((specialty, index) => {
      const filteredData = data.filter(d => d.state === state && d.specialty === specialty);
      const value1 = filteredData.map(d => d.value1).flat(); // Flatten array of arrays
      const uniqueValueCount = new Set(value1).size; // Count unique values
      flattenedSpecialtyData.push({
        state,
        specialty,
        value: 0,
        value1,
        index,
        originalData: filteredData // Store the original data rows associated with this bar
      });
    });
  });

  const xScale = d3.scaleBand().domain(sortedStates).range([0, sortedStates.length * 2]);
  const yScale = d3.scaleBand().domain(flattenedSpecialtyData.map((d) => d.specialty)).range([0, flattenedSpecialtyData.length * 0.5]);
  const zScale = d3.scaleLinear().domain([0, d3.max(flattenedSpecialtyData, (d) => new Set(d.value1).size) || 0]).range([0, 10]);

  const baseColors = d3.schemeCategory10;
  const lightColors = baseColors.map((color) => d3.interpolateRgb(color, '#ffffff')(0.6));
  const colorScale = d3.scaleOrdinal(lightColors);
  colorScale.domain(flattenedSpecialtyData.map(d => `${d.state}-${d.specialty}`));

  const Axis: React.FC = () => {
    const createLine = (start: [number, number, number], end: [number, number, number]) => {
      const points = [new Vector3(...start), new Vector3(...end)];
      const geometry = new BufferGeometry().setFromPoints(points);
      const material = new LineBasicMaterial({ color: 'black' });
      return (
        <line>
          <primitive object={geometry} />
          <primitive object={material} />
        </line>
      );
    };

    return (
      <>
        {createLine([0, 0, 0], [sortedStates.length * 2, 0, 0])} {/* X axis */}
        {createLine([0, 0, 0], [0, flattenedSpecialtyData.length * 0.5, 0])} {/* Y axis */}
        {createLine([0, 0, 0], [0, 0, 10])} {/* Z axis */}
      </>
    );
  };

  const AxisLabels: React.FC = () => {
    const yAxisLength = flattenedSpecialtyData.length * 0.5;
    const zAxisMaxValue = d3.max(flattenedSpecialtyData, (d) => new Set(d.value1).size) || 0;
    const zAxisTicks = d3.scaleLinear().domain([0, zAxisMaxValue]).ticks(5);
    const displayedSpecialties = new Set<string>(); // To track displayed specialties

    const labelSpacing = yAxisLength / Math.max(flattenedSpecialtyData.length, 5);

    return (
      <>
        <Text position={[sortedStates.length, -4.5, 0]} fontSize={0.5} color="black">
          {colX}
        </Text>
        <Text
          position={[-4.5, yAxisLength / 2, 0]}
          fontSize={0.5}
          color="black"
          rotation={[0, 0, Math.PI / 2]}
          anchorX="center"
          anchorY="middle"
        >
          {colY}
        </Text>
        <Text position={[-2, -1.5, 5]} rotation={[Math.PI / 2, 0, Math.PI / 2]} fontSize={0.5} color="black">
          {colZ}
        </Text>
        {sortedStates.map((state, i) => (
          <Text key={i} position={[xScale(state) || 0 + 0.5, -1.5, 0]} fontSize={0.3} color="black" rotation={[0, 0, Math.PI / 3]} anchorX="right" anchorY="middle">
            {state === '' ? 'N/A' : state}
          </Text>
        ))}
        {flattenedSpecialtyData.map((d, i) => {
          const positionY = yScale(d.specialty) || 0 + (d.index * labelSpacing);
          if (displayedSpecialties.has(d.specialty)) {
            return null; // Skip if already displayed
          }
          displayedSpecialties.add(d.specialty);
          return (
            <Text
              key={i}
              position={[-1, positionY || 0, 0]}
              fontSize={0.3}
              color="black"
              anchorX="right"
              anchorY="middle"
            >
              {d.specialty === '' ? 'N/A' : d.specialty}
            </Text>
          );
        })}
       {zAxisTicks.map((tick, i) => (
          <Text key={i} position={[-1, -1, zScale(tick) || 0]} fontSize={0.3} rotation={[Math.PI / 2, 0, 0]} color="black">
            {tick}
          </Text>
        ))}
      </>
    );
  };

  

  const Bars: React.FC = () => {
    const handleBarClick = (barData: DataPointWithIndex) => {
      setHoveredBar(barData);
      setIsPopupOpen(true);  // Open the popup
    };
    return (
      <>
       {flattenedSpecialtyData.map((d, i) => {
  const x = xScale(d.state) || 0;
  const y = yScale(d.specialty) || 0 + (d.index * yScale.bandwidth() / 3.5);
  const z = 0;
  const height = zScale(new Set(d.value1).size); // Use the unique count as height
  const color = colorScale(`${d.state}-${d.specialty}`);
  
  return (
    <mesh
      key={i}
      position={[xScale(d.state) || 0 + 0.5, yScale(d.specialty) || 0 + (d.index * 0.5) || 0 + 0.5, zScale(new Set(d.value1).size) / 2]}
      onClick={() => handleBarClick(d)}  // Pass the full data to hoveredBar on click
      // onPointerOut={() => setHoveredBar(null)}
    >
      <boxGeometry args={[1, 1, zScale(new Set(d.value1).size)]} /> {/* Dimensions of the box */}
      <meshStandardMaterial color={color} />
      <Text
        position={[0, 0, height / 2 + 0.5]} // Adjust text position to be above the bar
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {new Set(d.value1).size}
      </Text>
    </mesh>
  );
})}

      </>
    );
  };

  
  const Popup: React.FC = () => {
    if (!isPopupOpen || !hoveredBar) return null;
    // if (!hoveredBar) return null;
  
    const { originalData } = hoveredBar;
  
    // Define columns to exclude
    const columnsToExclude = ['state', 'specialty', 'value', 'value1'];
  
    // Filter out the columns to exclude
    const filteredKeys = Object.keys(originalData[0]).filter(
      (key) => !columnsToExclude.includes(key)
    );

    return (
      <div className="popup">
        <div className="popup-content">
          <table>
            <thead>
              <tr>
                {filteredKeys.map((key) => (
                  <th key={key}>{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {originalData.map((row, index) => (
                <tr key={index}>
                  {filteredKeys.map((key) => (
                    <td key={key}>{row[key]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };
  

  return (
<div className="chart-container" style={{ position: 'relative', height: 600 }}>
  <div className="canvas-container" style={{ width: '100%', height: '100%' }}>
    <Canvas camera={{ position: [0, 0, 20], up: [0, 0, 1] }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <OrbitControls />
      <Axis />
      <Bars />
      <AxisLabels />
    </Canvas>
    {/* {selectedPoint && <DataTable selectedData={selectedData} />} */}
  </div>
  <div className="popup-container">
    <Popup />
  </div>
</div>


  );
};

export default ThreeDBarChart;
