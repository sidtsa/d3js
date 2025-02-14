// import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
// import * as d3 from 'd3';
// import './App.css';
// import LoadCsvData from './LoadCsvData';
// import ThreeDScatterPlot from './ThreeDcolorScatter';
// import { PlainThreeDScatterPlot } from './ThreeDcolorScatter';

// // Define the types for the data
// interface DataPoint {
//   x: number;
//   z: number;
//   value: number;
//   color: string;
// }

// // Define types for the state
// interface DataColumn {
//   [key: string]: string;
// }

// // Define types for the LandingPage props
// interface LandingPageProps {
//   columns: string[];
//   onSubmit: (chartType: string, selectedColumns: string[], colX: string, colY: string, colZ: string) => void;
// }

// // Define the LandingPage component
// const LandingPage: React.FC<LandingPageProps> = ({ columns, onSubmit }) => {
//   const [chartType, setChartType] = useState<string>('');
//   const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
//   const [colX, setColX] = useState<string>('');
//   const [colY, setColY] = useState<string>('');
//   const [colZ, setColZ] = useState<string>('');

//   const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
//     event.preventDefault();
//     onSubmit(chartType, selectedColumns, colX, colY, colZ);
//   };

//   return (
//     <div className="landing-page">
//       <h1>Visualization</h1>
//       <form onSubmit={handleSubmit} className="form">
//         <label className="form-label">
//           Select Chart Type:
//           <select
//             className="form-select"
//             value={chartType}
//             onChange={(e: ChangeEvent<HTMLSelectElement>) => setChartType(e.target.value)}
//           >
//             <option value="">Select...</option>
//             <option value="scatter-color">Colored Scatter Graph</option>
//             <option value="scatter">Scatter Graph</option>
//             <option value="column3d">3D Column Chart</option>
//           </select>
//         </label>
//         <br />

//         {(chartType === 'scatter-color' || chartType === 'scatter' || chartType === 'column3d') && (
//           <>
//             <label className="form-label">
//               Select X Axis Column:
//               <select
//                 className="form-select"
//                 value={colX}
//                 onChange={(e: ChangeEvent<HTMLSelectElement>) => setColX(e.target.value)}
//               >
//                 <option value="">Select...</option>
//                 {columns.map((column, index) => (
//                   <option key={index} value={column}>
//                     {column}
//                   </option>
//                 ))}
//               </select>
//             </label>
//             <br />
//             <label className="form-label">
//               Select Y Axis Column:
//               <select
//                 className="form-select"
//                 value={colY}
//                 onChange={(e: ChangeEvent<HTMLSelectElement>) => setColY(e.target.value)}
//               >
//                 <option value="">Select...</option>
//                 {columns.map((column, index) => (
//                   <option key={index} value={column}>
//                     {column}
//                   </option>
//                 ))}
//               </select>
//             </label>
//             <br />
//             <label className="form-label">
//               Select Z Axis Column:
//               <select
//                 className="form-select"
//                 value={colZ}
//                 onChange={(e: ChangeEvent<HTMLSelectElement>) => setColZ(e.target.value)}
//               >
//                 <option value="">Select...</option>
//                 {columns.map((column, index) => (
//                   <option key={index} value={column}>
//                     {column}
//                   </option>
//                 ))}
//               </select>
//             </label>
//             <br />
//           </>
//         )}
//         <button className="form-button" type="submit">
//           Submit
//         </button>
//       </form>
//     </div>
//   );
// };

// // Define the App component
// const App: React.FC = () => {
//   const [columns, setColumns] = useState<string[]>([]);
//   const [chartType, setChartType] = useState<string>('');
//   const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
//   const [colX, setColX] = useState<string>('');
//   const [colY, setColY] = useState<string>('');
//   const [colZ, setColZ] = useState<string>('');

//   useEffect(() => {
//     const fetchColumns = async () => {
//       try {
//         const response = await fetch('/Data.csv'); // Adjust path if needed
//         const csvData = await response.text();
//         const rows = d3.csvParse(csvData);
//         const columnHeaders = rows.columns; // D3's csvParse method automatically extracts column names
//         setColumns(columnHeaders);
//       } catch (error) {
//         console.error('Error fetching columns:', error);
//         setColumns([]);
//       }
//     };

//     fetchColumns();
//   }, []);

//   const handleVisualizationSubmit = (
//     selectedChartType: string,
//     selectedCols: string[],
//     selectedColX: string,
//     selectedColY: string,
//     selectedColZ: string
//   ) => {
//     setChartType(selectedChartType);
//     setSelectedColumns(selectedCols);
//     setColX(selectedColX);
//     setColY(selectedColY);
//     setColZ(selectedColZ);
//   };

//   return (
//     <div className="App">
//       <LandingPage columns={columns} onSubmit={handleVisualizationSubmit} />
//       {chartType === 'column3d' && <LoadCsvData colX={colX} colY={colY} colZ={colZ} />}
//       {chartType === 'scatter' && <PlainThreeDScatterPlot cols={{ X: colX, Y: colY, Z: colZ }} />}
//       {chartType === 'scatter-color' && <ThreeDScatterPlot cols={{ X: colX, Y: colY, Z: colZ }} />}
//       {/* Placeholder for rendering other charts based on chartType and selectedColumns */}
//     </div>
//   );
// };

// export default App;
