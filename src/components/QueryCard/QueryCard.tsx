import { useState } from "react";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import { Bar, Line, Pie } from "react-chartjs-2";
import Typography from "@mui/joy/Typography";
import Tabs from "@mui/joy/Tabs";
import TabList from "@mui/joy/TabList";
import Tab, { tabClasses } from "@mui/joy/Tab";
import TabPanel from "@mui/joy/TabPanel";
import OutputTable from "./OutputTable";
import Dropdown from "@mui/joy/Dropdown";
import Menu from "@mui/joy/Menu";
import MenuButton from "@mui/joy/MenuButton";
import MenuItem from "@mui/joy/MenuItem";
import styles from "./QueryCard.module.css";
import CircularProgress from "@mui/joy/CircularProgress";
import ListItemDecorator from "@mui/joy/ListItemDecorator";
import TableChartIcon from "@mui/icons-material/TableChart";
import InsertChartIcon from "@mui/icons-material/InsertChart";
import InsightsIcon from "@mui/icons-material/Insights";
import { Grid } from "@mui/material";
interface Props {
    tableData: any;
    // makeGenerateChartApiRequest: (question: string) => Promise<void>;
    makeGenerateChartApiRequest: (question: string) => void;
    chartData: any;

    isLoadingAnalysis: boolean;
    // makeGenerateSummaryApiRequest: (question: string) => Promise<void>;
    makeGenerateSummaryApiRequest: (question: string) => void;
    summaryData: string;
}

export default function QueryCard({ tableData, makeGenerateChartApiRequest, chartData, isLoadingAnalysis, makeGenerateSummaryApiRequest, summaryData }: Props) {
    const [selectedChart, setSelectedChart] = useState("Select Chart...");

    var columns: string[] = [];
    if (tableData.chartType === "table") {
        columns = Object.keys(tableData.chartData[0]);
    }

    return (
        // <Card>
        //     <CardContent>
        <Box
            sx={{
                borderRadius: "10px",
                boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)", // Adjust the values for your desired shadow
                p: 2,
                minHeight: "40vh"
            }}
        >
            <Typography level="title-md">EXPLORATORY ANALYSIS</Typography>

            {/* <Tabs aria-label="Basic tabs" defaultValue={0}>
                                <TabList variant="soft"> */}
            <Tabs aria-label="tabs" defaultValue={0} sx={{ bgcolor: "transparent", m: 1 }}>
                <TabList
                    disableUnderline
                    sx={{
                        p: 0.5,
                        gap: 0.5,
                        borderRadius: "xl",
                        bgcolor: "background.level1",
                        [`& .${tabClasses.root}[aria-selected="true"]`]: {
                            boxShadow: "sm",
                            bgcolor: "background.surface"
                        }
                        //   justifyContent: "center",
                    }}
                >
                    <Tab disableIndicator>
                        <ListItemDecorator>
                            <TableChartIcon />
                        </ListItemDecorator>
                        Table Output
                    </Tab>
                    <Tab disableIndicator>
                        <ListItemDecorator>
                            <InsertChartIcon />
                        </ListItemDecorator>
                        Visualization
                    </Tab>
                    <Tab disableIndicator>
                        <ListItemDecorator>
                            <InsightsIcon />
                        </ListItemDecorator>
                        Key Insights
                    </Tab>
                </TabList>
                <TabPanel value={0}>
                    {isLoadingAnalysis ? (
                        <Box>
                            <CircularProgress size="md" />
                        </Box>
                    ) : (
                        <Box>
                            {tableData.chartType === "table" ? (
                                <OutputTable data={tableData.chartData} columns={columns} />
                            ) : (
                                <>
                                    <p>Execute the GPT generated query to get table output here.</p>
                                </>
                            )}
                        </Box>
                    )}
                </TabPanel>
                <TabPanel value={1}>
                    {isLoadingAnalysis ? (
                        <Box>
                            <CircularProgress size="md" />
                        </Box>
                    ) : (
                        <Box>
                            {tableData.chartType === "table" ? (
                                <Box>
                                    <Dropdown>
                                        <MenuButton>{selectedChart}</MenuButton>
                                        <Menu>
                                            <MenuItem
                                                onClick={() => {
                                                    makeGenerateChartApiRequest("Generate a Line Chart for given data.");
                                                    makeGenerateSummaryApiRequest("");
                                                }}
                                            >
                                                Line Chart
                                            </MenuItem>
                                            <MenuItem
                                                onClick={() => {
                                                    makeGenerateChartApiRequest("Generate a Bar Chart for given data.");
                                                    makeGenerateSummaryApiRequest("");
                                                }}
                                            >
                                                Bar Chart
                                            </MenuItem>
                                            <MenuItem
                                                onClick={() => {
                                                    makeGenerateChartApiRequest("Generate a Pie Chart for given data.");
                                                    makeGenerateSummaryApiRequest("");
                                                }}
                                            >
                                                Pie Chart
                                            </MenuItem>
                                        </Menu>
                                    </Dropdown>
                                    {/* <Button
                                                        variant="outlined"
                                                        sx={{ mx: 1 }}
                                                        onClick={() => makeGenerateChartApiRequest("Generate a " + selectedChart + "for given data.")}
                                                    >
                                                        Generate Chart
                                                    </Button> */}

                                    <Grid container>
                                        <Grid item xs={12} md={7}>
                                            <Box>
                                                {chartData.chartType === "line" && (
                                                    <div className={styles.chart}>
                                                        <Line data={chartData.chartData} options={chartData.chartOptions} />
                                                    </div>
                                                )}
                                                {chartData.chartType === "bar" && (
                                                    <div className={styles.chart}>
                                                        <Bar data={chartData.chartData} options={chartData.chartOptions} />
                                                    </div>
                                                )}
                                                {chartData.chartType === "pie" && (
                                                    <div className={styles.chart}>
                                                        <Pie data={chartData.chartData} options={chartData?.chartOptions} />
                                                    </div>
                                                )}
                                            </Box>
                                        </Grid>

                                        <Grid item xs={12} md={5}>
                                            <div style={{ whiteSpace: "pre-wrap" }}>{summaryData}</div>
                                        </Grid>
                                    </Grid>
                                </Box>
                            ) : (
                                <>
                                    <p>Fetch table data for generating graph and Visualization</p>
                                </>
                            )}
                        </Box>
                    )}
                </TabPanel>
                <TabPanel value={2}>
                    {isLoadingAnalysis ? (
                        <Box>
                            <CircularProgress size="md" />
                        </Box>
                    ) : (
                        <Box>
                            {tableData.chartType === "table" ? (
                                <>
                                    <Button variant="outlined" onClick={() => makeGenerateSummaryApiRequest("")}>
                                        Generate a summary{" "}
                                    </Button>
                                    <div style={{ whiteSpace: "pre-wrap" }}>{summaryData}</div>
                                </>
                            ) : (
                                <>
                                    <p>Fetch table data for generating a summary on the data.</p>
                                </>
                            )}
                        </Box>
                    )}
                </TabPanel>
            </Tabs>
        </Box>
        //     </CardContent>
        // </Card>
    );
}
