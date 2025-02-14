import React, { useState, useEffect } from 'react';
import * as d3 from 'd3';
import ThreeDBarChart from './ThreeDBarChart';

interface LoadCsvDataProps {
  colX: string;
  colY: string;
  colZ: string;
}

interface DataPoint {
  state: string;
  specialty: string;
  value: number;
  value1: string[]; // Or any other type based on your actual data
  [key: string]: any; // Allow any other keys to accommodate all CSV columns
}


const LoadCsvData: React.FC<LoadCsvDataProps> = ({ colX, colY, colZ }) => {
  const [data, setData] = useState<DataPoint[]>([]);

  useEffect(() => {
    d3.csv('/10000_HCP_Ven_CLL.csv').then((rawData: any[]) => {
      const processedData = rawData.map(d => {
        // Keep all columns in the data point
        return {
          ...d,
          state: d[colX],
          specialty: d[colY],
          value: +d[colZ], // Ensure this is a number
          value1: [d[colZ]] // Wrap in an array for consistency
        };
      });

      // Debugging
      console.log('Processed Data:', processedData);

      setData(processedData);
    });
  }, [colX, colY, colZ]);

  return (
    <div>
      <center>
        <h1>3-D Bar Chart</h1>
      </center>
      {data.length > 0 ? <ThreeDBarChart data={data} colX={colX} colY={colY} colZ={colZ} /> : <p>Loading data...</p>}
    </div>
  );
};

export default LoadCsvData;
