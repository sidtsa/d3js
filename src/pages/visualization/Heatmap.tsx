import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

// Function to calculate contrast color (white or black) based on background color brightness
function getContrastColor(hexColor: string): string {
  const color = hexColor.replace("#", "");
  const r = parseInt(color.substring(0, 2), 16);
  const g = parseInt(color.substring(2, 4), 16);
  const b = parseInt(color.substring(4, 6), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 125 ? "#000000" : "#FFFFFF";
}

// Function to handle missing values
const handleMissingValues = (data: number[][]): number[][] => {
  const fillValue = (arr: number[]) => {
    const mean = arr.reduce((acc, val) => acc + (isNaN(val) ? 0 : val), 0) / arr.length;
    return arr.map(val => isNaN(val) ? mean : val);
  };

  return data.map(row => fillValue(row));
};

// Function to calculate correlation matrix
const calculateCorrelationMatrix = (data: number[][]): number[][] => {
  const mean = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / arr.length;

  const stdDev = (arr: number[], mean: number) =>
    Math.sqrt(arr.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / arr.length);

  const covariance = (arr1: number[], arr2: number[], mean1: number, mean2: number) =>
    arr1.reduce((a, b, idx) => a + (b - mean1) * (arr2[idx] - mean2), 0) / arr1.length;

  const transpose = (matrix: number[][]) => matrix[0].map((_, i) => matrix.map(row => row[i]));

  const transposed = transpose(data);

  return transposed.map((col1, i) =>
    transposed.map((col2, j) => {
      const mean1 = mean(col1);
      const mean2 = mean(col2);
      return covariance(col1, col2, mean1, mean2) / (stdDev(col1, mean1) * stdDev(col2, mean2));
    })
  );
};

const Heatmap: React.FC = () => {
  const [correlationMatrix, setCorrelationMatrix] = useState<number[][]>([]);
  const [columnLabels, setColumnLabels] = useState<string[]>([]);
  const heatmapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/10000_HCP_Ven_CLL.csv');
        const csvText = await response.text();

        const parsedData = d3.csvParse(csvText);
        const columnLabels = Object.keys(parsedData[0]);

        // Parse data and handle missing values
        const csvData = parsedData.map(row =>
          Object.values(row).map(value => (isNaN(Number(value)) ? value : Number(value)))
        );

        const encodeCategoricalData = (data: any[][]) => {
          const encoder: { [key: string]: number } = {};
          let nextIndex = 0;

          data.forEach(row => {
            row.forEach((value, i) => {
              if (typeof value === 'string' && !(value in encoder)) {
                encoder[value] = nextIndex++;
              }
            });
          });

          return data.map(row =>
            row.map(value =>
              typeof value === 'string' ? encoder[value] : value
            )
          );
        };

        const removeConstantColumns = (data: number[][], labels: string[]) => {
          const nonConstantColumns = data[0].map((_, colIndex) => {
            const column = data.map(row => row[colIndex]);
            const uniqueValues = new Set(column);
            return uniqueValues.size > 1;
          });

          const filteredData = data.map(row => row.filter((_, colIndex) => nonConstantColumns[colIndex]));
          const filteredLabels = labels.filter((_, colIndex) => nonConstantColumns[colIndex]);

          return { filteredData, filteredLabels };
        };

        const encodedData = encodeCategoricalData(csvData);
        const cleanedData = handleMissingValues(encodedData);
        const { filteredData, filteredLabels } = removeConstantColumns(cleanedData, columnLabels);

        if (filteredData.length > 0 && filteredData[0].length > 0) {
          const matrix = calculateCorrelationMatrix(filteredData);
          setCorrelationMatrix(matrix);
          setColumnLabels(filteredLabels);
        } else {
          console.error('Data is empty or malformed after encoding.');
        }
      } catch (error) {
        console.error('Error loading or processing CSV file:', error);
      }
    };

    fetchData();
  }, []);

  const drawHeatmap = () => {
    if (!correlationMatrix.length || !columnLabels.length) return;

    const rows = correlationMatrix.length;
    const cols = correlationMatrix[0].length;

    const cellSize = 50;
    const margin = { top: 200, right: 50, bottom: 100, left: 250 };

    d3.select(heatmapRef.current).selectAll('*').remove();

    const svg = d3
      .select(heatmapRef.current)
      .append('svg')
      .attr('width', (cols * cellSize) + margin.left + margin.right)
      .attr('height', (rows * cellSize) + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const colorScale = d3.scaleSequential(d3.interpolateRdBu).domain([-1, 1]);

    svg
      .selectAll('rect')
      .data(correlationMatrix.flat())
      .enter()
      .append('rect')
      .attr('x', (_d: number, i: number) => (i % cols) * cellSize)
      .attr('y', (_d: number, i: number) => Math.floor(i / cols) * cellSize)
      .attr('width', cellSize)
      .attr('height', cellSize)
      .attr('fill', (d: number) => colorScale(d));

    svg
      .selectAll('.cellLabel')
      .data(correlationMatrix.flat())
      .enter()
      .append('text')
      .attr('x', (_d: number, i: number) => (i % cols) * cellSize + cellSize / 2)
      .attr('y', (_d: number, i: number) => Math.floor(i / cols) * cellSize + cellSize / 2)
      .attr('dy', '.35em')
      .attr('text-anchor', 'middle')
      .attr('fill', (d: number) => getContrastColor(d3.color(colorScale(d as number))?.formatHex() ?? '#000')) // Contrast color
      .text((d: number) => d.toFixed(2));

    svg
      .selectAll('.rowLabel')
      .data(columnLabels)
      .enter()
      .append('text')
      .attr('x', -margin.left / 2 + 100)
      .attr('y', (_d, i) => i * cellSize + cellSize / 2)
      .attr('dy', '.35em')
      .attr('text-anchor', 'end')
      .text(d => d);

    const verticalOffset = -120; // Adjust this value as needed

    svg
      .selectAll('.colLabel')
      .data(columnLabels)
      .enter()
      .append('text')
      .attr('x', (_d, i) => i * cellSize + cellSize / 2)
      .attr('y', (_d, i) => cellSize / 2 + verticalOffset) // Adjusted y position
      .attr('dy', '.35em')
      .attr('text-anchor', 'middle')
      .attr('transform', (_d, i) => `rotate(-90, ${i * cellSize + cellSize / 2}, ${cellSize / 2 + verticalOffset})`)
      .text(d => d);
  };

  useEffect(() => {
    drawHeatmap();
  }, [correlationMatrix, columnLabels]);

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h1>Correlation Heatmap</h1>
      <div
        style={{
          width: '100%',
          height: '100%',
          overflow: 'auto',
          border: '1px solid #ccc',
          margin: 'auto',
        }}
      >
        <div ref={heatmapRef}></div>
      </div>
    </div>
  );
};

export default Heatmap;
