import { useRef, useState, useEffect } from "react";

//import {FaDatabase} from "react-icons/fa"
import styles from "./Exploratory.module.css";
import { Approaches, ChatRequest, ChatTurn, metadataInfoApi, metadataSetApi, EdaResponse, expApi } from "../../api";
import { QuestionInput } from "../../components/QuestionInput";
import { Box, Grid, Button, Paper, Typography, Backdrop, Tooltip } from "@mui/material";
import AnswerQuery from "../../components/AnswerQuery/AnswerQuery";
import QueryCard from "../../components/QueryCard/QueryCard";
import ScrollToTopButton from "../../components/ScrollToTop/ScrollToTop";
import RefreshIcon from "@mui/icons-material/Refresh";
import CircularProgress from "@mui/material/CircularProgress";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { calcLength, motion } from "framer-motion";
import BasicModal from "../../components/Modal/Modal";
import { datamodel } from "../Documentation";
import self from "../../assets/self_service.svg";
import bgimg from "../../assets/bgimage.png";
import data from "../../assets/self_data.png";
import insight from "../../assets/self_insight.png";
import viz from "../../assets/self_viz.png";
import Metadata, { meta } from "./Metadata";

const ExpAssistant = () => {
    const [metadataUpdating, setMetadataUpdating] = useState<boolean>(false);
    const [metadataInfo, setMetadataInfo] = useState<string>("");
    const [error, setError] = useState<unknown>();
    const [isLoadingAnalysis, setIsLoadingAnalysis] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [answer, setAnswer] = useState<string>("");
    const [queryBoxDisabled, setQueryBoxDisabled] = useState<boolean>(true);
    const [tableResult, setTableResult] = useState<any>("");
    const [answers, setAnswers] = useState<[user: string, response: EdaResponse][]>([]);
    // const [lockContext, setLockContext] = useState<boolean>(false);
    const [summary, setSummary] = useState<string>("");
    const [chartResult, setChartResult] = useState<any>("");
    const lastQuestionRef = useRef<string>("");
    const queryGen = useRef<HTMLDivElement | null>(null);
    const [openModal, setOpenModal] = useState(false);

    const handleOpenModal = () => {
        setOpenModal(true);
    };

    const makeSetMetadataRequest = async () => {
        setMetadataUpdating(true);
        try {
            const response = await metadataSetApi();
            console.log(response);
            makeMetadataInfoApiRequest();
        } catch (e) {
            setMetadataInfo("Error in API");
        }
        setMetadataUpdating(false);
    };
    const makeMetadataInfoApiRequest = async () => {
        try {
            const response = await metadataInfoApi();
            setMetadataInfo(response.data);
            console.log(response);
        } catch (e) {
            setMetadataInfo("Error in API");
        }
    };

    useEffect(() => {
        makeMetadataInfoApiRequest();
    }, []);

    const onQueryChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setAnswer(event.target.value);
    };

    const makeApiRequest = async (question: string) => {
        lastQuestionRef.current = question;
        setQueryBoxDisabled(true);
        error && setError(undefined);
        setIsLoading(true);
        setTableResult("");
        setChartResult("");

        try {
            const history: ChatTurn[] = answers.map(a => ({ user: a[0], bot: a[1].answer }));
            const request: ChatRequest = {
                history: [{ user: question, bot: undefined }],
                approach: Approaches.EdaAssistant,
                overrides: {
                    promptTemplate: "",
                    excludeCategory: answer,
                    top: 0,
                    semanticRanker: false,
                    semanticCaptions: false,
                    suggestFollowupQuestions: false
                }
            };
            const result = await expApi(request);
            setAnswers([[question, result]]);
            console.log(result.answer);
            setAnswer(result.answer);
            // makeExecuteDBApiRequest(result.answer);
        } catch (e) {
            setError(e);
            console.log(e);
            alert("Exception occured " + e);
        } finally {
            setIsLoading(false);
        }
    };

    const makeExecuteDBApiRequest = async (question: string) => {
        // lastQuestionRef.current = question;
        setQueryBoxDisabled(true);
        error && setError(undefined);
        setIsLoadingAnalysis(true);
        setSummary("");
        setChartResult("");

        try {
            const history: ChatTurn[] = answers.map(a => ({ user: a[0], bot: a[1].answer }));
            const request: ChatRequest = {
                history: [{ user: question, bot: undefined }],
                approach: Approaches.EdaRunQuery,
                overrides: {
                    promptTemplate: tableResult,
                    excludeCategory: answer,
                    top: 0,
                    semanticRanker: false,
                    semanticCaptions: false,
                    suggestFollowupQuestions: false
                }
            };
            const result = await expApi(request);
            // setAnswers([[question, result]]);
            // console.log(result.answer);
            // setAnswer(result.answer);
            setTableResult(result.tableData);
        } catch (e) {
            setError(e);
            console.log(e);
            alert("Exception occured " + e);
        } finally {
            setIsLoadingAnalysis(false);
        }
    };
    const makeGenerateChartApiRequest = async (question: string) => {
        // lastQuestionRef.current = question;
        setQueryBoxDisabled(true);
        error && setError(undefined);
        setIsLoadingAnalysis(true);

        try {
            const history: ChatTurn[] = answers.map(a => ({ user: a[0], bot: a[1].answer }));
            const request: ChatRequest = {
                history: [{ user: question, bot: undefined }],
                approach: Approaches.EdaAssistant,
                overrides: {
                    promptTemplate: tableResult,
                    excludeCategory: answer,
                    top: 0,
                    semanticRanker: true,
                    semanticCaptions: false,
                    suggestFollowupQuestions: false
                }
            };
            const result = await expApi(request);
            setAnswers([[question, result]]);
            console.log(result.tableData);

            setChartResult(result.tableData);
        } catch (e) {
            setError(e);
            console.log(e);
            alert("Exception occured " + e);
        } finally {
            setIsLoadingAnalysis(false);
        }
    };

    const makeGenerateSummaryApiRequest = async (question: string) => {
        // lastQuestionRef.current = question;
        setQueryBoxDisabled(true);
        error && setError(undefined);
        setIsLoadingAnalysis(true);

        try {
            const history: ChatTurn[] = answers.map(a => ({ user: a[0], bot: a[1].answer }));
            const request: ChatRequest = {
                history: [{ user: question, bot: undefined }],
                approach: Approaches.EdaAssistant,
                overrides: {
                    promptTemplate: tableResult,
                    excludeCategory: answer,
                    top: 0,
                    semanticRanker: true,
                    semanticCaptions: false,
                    suggestFollowupQuestions: false
                }
            };
            const result = await expApi(request);
            setAnswers([[question, result]]);
            console.log(result.answer);
            setSummary(result.answer);
        } catch (e) {
            setError(e);
            console.log(e);
            alert("Exception occured " + e);
        } finally {
            setIsLoadingAnalysis(false);
        }
    };

    const onEditQueryClicked = () => {
        setQueryBoxDisabled(false);
    };
    useEffect(() => queryGen.current?.scrollIntoView({ behavior: "smooth" }), [isLoading]);

    return (
        <>
            <Box sx={{ height: `calc(100vh - 60px)`, backgroundImage: `url(${bgimg})` }}>
                {/* <div style={{margin: '0 auto'}}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        {metadataUpdating ? <div style={{ marginRight: '2px', textAlign: 'center' }}>Updating Metadata...</div>
                        :
                        <div style={{ marginRight: '2px', textAlign: 'center' }}>
                        The Snowflake Metadata was last updated on {metadataInfo}
                        <DefaultButton text="UPDATE METADATA" onClick={() => makeSetMetadataRequest()} />
                    </div>
                    
                        }
                        
                    </div>
                    
                </div> */}
                {/* <div style={{margin: '0 auto', padding: 10}}>  
                {!lastQuestionRef.current ? <VoiceSelectPannel onVoiceSelectPannelToggel={onVoiceSelectPannelToggel } /> : <></>}
                </div> */}
                <Box sx={{ px: 12, py: 2, bgcolor: "white" }}>
                    <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "2rem" }}>
                        <Box>
                            <img src={self} style={{ height: "65px" }} />
                        </Box>
                        <Box>
                            <Typography
                                sx={{ color: "#105185", fontSize: "1.75rem", fontFamily: "Segoe UI", letterSpacing: "0px", opacity: 1, fontWeight: 600 }}
                            >
                                AI Exploration Analysis
                            </Typography>
                            <Typography sx={{ color: "#105185", fontSize: "1rem", fontFamily: "Segoe UI", letterSpacing: "0px", opacity: 1, fontWeight: 600 }}>
                                Query, visualize, and analyze your data with a conversational interface
                            </Typography>
                        </Box>
                    </Box>
                </Box>

                <Box sx={{ display: "flex", flexDirection: "row" }}>
                    <Box sx={{ display: "flex", flex: 1, my: 1, justifyContent: "flex-end" }}>
                        <Tooltip title={"Last Updated on " + metadataInfo} arrow>
                            <Button
                                sx={{
                                    color: "#1f5b8b",
                                    letterSpacing: "0.00",
                                    mx: 2,
                                    borderRadius: "20px",
                                    border: "1px solid #1f5b8b",
                                    fontSize: "10px",
                                    height: "25px"
                                }}
                                onClick={() => handleOpenModal()}
                                startIcon={<AutoAwesomeIcon sx={{ color: "blue" }} />}
                            >
                                {" "}
                                Know Your Data{" "}
                            </Button>
                        </Tooltip>
                        <BasicModal
                            open={openModal}
                            handleClose={() => {
                                setOpenModal(false);
                            }}
                            title={"DB View"}
                            content={meta}
                        />
                    </Box>
                    <Box sx={{ display: "flex", my: 1, flexDirection: "row", justifyContent: "flex-end", marginRight: 8 }}>
                        <Tooltip title={"Last Updated on " + metadataInfo} arrow>
                            <Button
                                sx={{
                                    color: "#1f5b8b",
                                    letterSpacing: "0",
                                    mx: 2,
                                    borderRadius: "20px",
                                    border: "1px solid #1f5b8b",
                                    fontSize: "10px",
                                    height: "25px"
                                }}
                                onClick={() => makeSetMetadataRequest()}
                                startIcon={<RefreshIcon sx={{ color: "blue" }} />}
                            >
                                {" "}
                                Update metadata{" "}
                            </Button>
                        </Tooltip>
                    </Box>
                </Box>

                <div>
                    <Backdrop sx={{ color: "#fff", zIndex: theme => theme.zIndex.drawer + 1 }} open={metadataUpdating}>
                        <CircularProgress color="inherit" />
                    </Backdrop>
                </div>
                {/* <div className={styles.commandsContainer}>
                <ClearChatButton className={styles.commandButton} onClick={clearChat} disabled={!lastQuestionRef.current || isLoading}  />

            </div> */}
                {/* <div className={ !lastQuestionRef.current ? styles.chatInput : styles.chatInputTop}> */}

                <div className={styles.chatRoot}>
                    <div className={styles.chatContair}>
                        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: 2 }}>
                            <Typography variant="h6">Discover what you can do with AI Advisor</Typography>
                            <Box sx={{ mx: 10, marginTop: 2, marginBottom: 2 }}>
                                <Grid container spacing={5}>
                                    <Grid item sm={6} md={4}>
                                        <Box>
                                            <Paper variant="outlined" sx={{ p: 2, borderRadius: "10px" }}>
                                                <Box sx={{ display: "flex", flexDirection: "row", gap: 3 }}>
                                                    <img src={data} style={{ height: "40px" }}></img>
                                                    <Box>
                                                        <Typography sx={{ fontWeight: 600, fontSize: "0.75rem" }}>Talk to your data</Typography>
                                                        <Typography sx={{ fontSize: "0.65rem" }}>
                                                            Engage with your database(s) through an intelligent interface, streamlining data interpretation and
                                                            decision-making processes.
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </Paper>
                                        </Box>
                                    </Grid>
                                    <Grid item sm={6} md={4} spacing={2}>
                                        <Box>
                                            <Paper variant="outlined" sx={{ p: 2, borderRadius: "10px" }}>
                                                <Box sx={{ display: "flex", flexDirection: "row", gap: 3 }}>
                                                    <img src={viz} style={{ height: "40px" }}></img>
                                                    <Box>
                                                        <Typography sx={{ fontWeight: 600, fontSize: "0.75rem" }}>Visualize Data</Typography>
                                                        <Typography sx={{ fontSize: "0.65rem" }}>
                                                            Leverage advanced conversational tools to transform complex data sets into intuitive and interactive
                                                            visualizations for swift analysis.
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </Paper>
                                        </Box>
                                    </Grid>
                                    <Grid item sm={6} md={4} spacing={2}>
                                        <Box>
                                            <Paper variant="outlined" sx={{ p: 2, borderRadius: "10px" }}>
                                                <Box sx={{ display: "flex", flexDirection: "row", gap: 3 }}>
                                                    <img src={insight} style={{ height: "40px" }}></img>
                                                    <Box>
                                                        <Typography sx={{ fontWeight: 600, fontSize: "0.75rem" }}>Generate Insights</Typography>
                                                        <Typography sx={{ fontSize: "0.65rem" }}>
                                                            Utilize AI-driven systems to delve into your data, uncovering valuable insights and guiding you
                                                            through informed decision-making.
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </Paper>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Box>

                        {/* <div className={!lastQuestionRef.current ? styles.chatInput : styles.chatInputFlex}>
                            <QuestionInput
                                clearOnSend={false}
                                placeholder="Type a new question"
                                disabled={isLoading}
                                onSend={question => makeApiRequest(question)}
                            />
                        </div> */}
                        <div className={!lastQuestionRef.current ? styles.chatInput : styles.chatInputFlex}>
                            {
                                <>
                                    <Box sx={{ display: "flex", flexDirection: "row", gap: "1rem", my: 2 }}>
                                        <Button
                                            variant="contained"
                                            sx={{ bgcolor: "white", color: "black", fontSize: "0.7rem" }}
                                            onClick={() => makeApiRequest("Please identify segment/macrobrick with lower than average sales in year 2021")}
                                        >
                                            Please identify segment/macrobrick with lower than average sales in year 2021
                                        </Button>
                                        <Button
                                            variant="contained"
                                            sx={{ bgcolor: "white", color: "black", fontSize: "0.7rem" }}
                                            onClick={() =>
                                                makeApiRequest(
                                                    "What are quarter on quarter sales for each segment/macrobrick in 2021? Please take financial quarter into consideration"
                                                )
                                            }
                                        >
                                            What are quarter on quarter sales for each segment/macrobrick in 2021? Please take financial quarter into
                                            consideration
                                        </Button>
                                        {/* <Button variant="outlined" onClick={() => makeApiRequest("What are the Exit formalities")}>
                                    Exit formalities
                                </Button> */}
                                        <Button
                                            variant="contained"
                                            sx={{ bgcolor: "white", color: "black", fontSize: "0.7rem" }}
                                            onClick={() => makeApiRequest("What is month on month sales growth for each segment/macrobrick in 2022?")}
                                        >
                                            What is month on month sales growth for each segment/macrobrick in 2022?
                                        </Button>
                                        {/* <Button variant="outlined" onClick={() => makeApiRequest("What are the priorities")}>
                                    Priorities
                                </Button> */}
                                    </Box>
                                </>
                            }
                            <QuestionInput clearOnSend placeholder="Type a new question" disabled={isLoading} onSend={question => makeApiRequest(question)} />
                        </div>
                    </div>
                </div>
            </Box>
            <motion.div
                key={lastQuestionRef.current} // Adding a key to trigger animation when lastQuestionRef changes
                initial={{ opacity: 0, y: -20 }} // Initial styles (invisible and moved up)
                animate={{ opacity: 1, y: 0 }} // Animation styles (visible and at its original position)
                transition={{ duration: 0.75 }} // Animation duration
            >
                {lastQuestionRef.current && (
                    <Box sx={{ minHeight: `calc(100vh - 80px)`, backgroundImage: `url(${bgimg})` }}>
                        <ScrollToTopButton />
                        <Box sx={{ mx: "24px", py: 2 }}>
                            {/* <QueryCard isLoading={false} isLoadingAnalysis={false} makeGenerateSummaryApiRequest={(question) => {}} answer="ok" makeGenerateChartApiRequest={(question) => {}} onClickEditQuery={()=>{}} onClickExecuteQuery={()=>{}} onQueryChange={()=>{}} queryBoxDisabled={false} tableData={""} chartData={""} summaryData={""}/> */}
                            <AnswerQuery
                                queryBoxDisabled={queryBoxDisabled}
                                isLoading={isLoading}
                                answer={answer}
                                onClickExecuteQuery={() => makeExecuteDBApiRequest(answer)}
                                onQueryChange={onQueryChange}
                                onClickEditQuery={onEditQueryClicked}
                            />
                            <Box sx={{ my: 2 }}>
                                <QueryCard
                                    tableData={tableResult}
                                    makeGenerateChartApiRequest={makeGenerateChartApiRequest}
                                    chartData={chartResult}
                                    isLoadingAnalysis={isLoadingAnalysis}
                                    makeGenerateSummaryApiRequest={makeGenerateSummaryApiRequest}
                                    summaryData={summary}
                                />
                            </Box>
                        </Box>

                        <div ref={queryGen} />
                    </Box>
                )}
            </motion.div>
        </>
    );
};

export default ExpAssistant;
