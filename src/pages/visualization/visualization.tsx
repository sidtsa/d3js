import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import * as d3 from 'd3';
import LoadCsvData from './LoadCsvData';
import { ThreeDScatterPlot } from './ThreeDcolorScatter';
import { PlainThreeDScatterPlot } from './ThreeDcolorScatter';
import { Box, Typography, Button, Dialog, DialogTitle, DialogContent } from '@mui/material'; // Import Dialog components
import bi_logo from '../../assets/bi_search.svg';
import bgimg from '../../assets/bgimage.png';
import Select from 'react-select';
import Heatmap from './Heatmap'; 

const Visualization: React.FC = () => {
  const [columns, setColumns] = useState<{ label: string; value: string }[]>([]);
  const [chartType, setChartType] = useState<string>('');
  const [selectedColumns, setSelectedColumns] = useState<{ label: string; value: string }[]>([]);
  const [colX, setColX] = useState<string>('');
  const [colY, setColY] = useState<string>('');
  const [colZ, setColZ] = useState<string>('');
  const [extraColumn, setExtraColumn] = useState<string>(''); // New state for extra column
  const [isChartVisible, setChartVisible] = useState<boolean>(false);
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  useEffect(() => {
    const fetchColumns = async () => {
      try {
        const response = await fetch('/10000_HCP_Ven_CLL.csv');
        const csvData = await response.text();
        const rows = d3.csvParse(csvData);
        const columnHeaders = rows.columns;
        const formattedColumns = columnHeaders.map(col => ({ label: col, value: col }));
        setColumns(formattedColumns);
      } catch (error) {
        console.error('Error fetching columns:', error);
        setColumns([]);
      }
    };

    fetchColumns();
  }, []);

  const handleMultiSelectChange = (selectedOptions: { label: string; value: string }[]) => {
    setSelectedColumns(selectedOptions);
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (selectedColumns.length === 3) {
      const [xAxis, yAxis, zAxis] = selectedColumns;
      setColX(xAxis.value);
      setColY(yAxis.value);
      setColZ(zAxis.value);
      setChartVisible(true);
    } else {
      alert('Please select exactly 3 columns.');
    }
  };

  return (
    <Box sx={{ backgroundImage: `url(${bgimg})`, height: `calc(100vh - 60px)` }}>
      <Box sx={{ px: 12, py: 2, backgroundImage: `url(${bgimg})` }}>
        <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "2rem" }}>
          <Box>
            <img src={bi_logo} style={{ height: "65px" }} />
          </Box>
          <Box>
            <Typography sx={{ color: "#105185", fontSize: "1.4rem", fontFamily: "Segoe UI", letterSpacing: "0px", opacity: 1, fontWeight: 600 }}>
              Assistant to generate reports from disparate data sources
            </Typography>
            <Typography sx={{ color: "#105185", fontSize: "0.75rem", fontFamily: "Segoe UI", letterSpacing: "0px", opacity: 1, fontWeight: 600 }}>
              Seamlessly generate enterprise-wide business intelligence reports with unprecedented ease
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box className="visualization-container" sx={{ padding: 2, backgroundImage: `url(${bgimg})` }}>
        <center>
          <form onSubmit={handleSubmit} className="form">
            <h2>Choose from the options below to generate reports</h2>
            
            <Button variant="contained" color="primary" onClick={handleOpenDialog} sx={{ marginBottom: 2 }}>
              Show Heatmap
            </Button>
            
            <label className="form-label">
              <strong>Chart Type: </strong>
              <select
                className="form-select"
                value={chartType}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => setChartType(e.target.value)}
              >
                <option value="">Select...</option>
                <option value="scatter-color">3D Colored Scatter Graph</option>
                <option value="scatter">3D Scatter Graph</option>
                <option value="column3d">3D Column Chart</option>
                <option value="heatmap">Heatmap</option>
              </select>
            </label>
            <br />
            <br />
            {(chartType === 'scatter-color' || chartType === 'scatter' || chartType === 'column3d' || chartType === 'heatmap') && (
              <>
                <label className="form-label">
                  <strong>Attributes:</strong> <br />
                  <Select
                    isMulti
                    options={columns}
                    onChange={handleMultiSelectChange}
                    value={selectedColumns}
                    styles={{
                      container: (provided) => ({
                        ...provided,
                        width: '500px',
                      }),
                    }}
                  />
                </label>
                <br />
              </>
            )}

            {chartType === 'scatter-color' && (
              <label className="form-label">
                <strong>Extra Column for Color Coding:</strong> <br />
                <select
                  className="form-select"
                  value={extraColumn}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) => setExtraColumn(e.target.value)}
                >
                  <option value="">Select an extra column...</option>
                  {columns.map(col => (
                    <option key={col.value} value={col.value}>{col.label}</option>
                  ))}
                </select>
              </label>
            )}

            <button className="form-button" type="submit">
              Submit
            </button>
          </form>
        </center>

        {chartType === 'column3d' && isChartVisible && <LoadCsvData colX={colX} colY={colY} colZ={colZ} />}
        {chartType === 'scatter' && isChartVisible && (
          <PlainThreeDScatterPlot cols={{ X: colX, Y: colY, Z: colZ }} />
        )}
        {chartType === 'scatter-color' && isChartVisible && (
          <ThreeDScatterPlot cols={{ X: colX, Y: colY, Z: colZ }} extraColumn={extraColumn} />
        )}

        <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="md">
          <DialogContent>
            <Heatmap />
          </DialogContent>
        </Dialog>
      </Box>
    </Box>
  );
};

export default Visualization;