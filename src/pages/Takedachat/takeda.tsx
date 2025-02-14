//SalesIQ

import { useRef, useState, useEffect } from "react";
import { Checkbox, Panel, DefaultButton, TextField, SpinButton } from "@fluentui/react";
import { SparkleFilled } from "@fluentui/react-icons";
import health from "../../assets/medical.png";
import { MdQuestionAnswer } from "react-icons/md";
import styles from "./Compqna.module.css";
import Disclaimer from "../../components/Disclaimer/Disclaimer";
import { takedaapi, Approaches, AskResponse, ChatRequest, ChatTurn } from "../../api";
import { Answer, AnswerError, AnswerLoading } from "../../components/Answer";
import { QuestionInput } from "../../components/QuestionInput";
import { ExampleList } from "../../components/Example";
import { UserChatMessage } from "../../components/UserChatMessage";
import { AnalysisPanel, AnalysisPanelTabs } from "../../components/AnalysisPanel";
import { SettingsButton } from "../../components/SettingsButton";
import { ClearChatButton } from "../../components/ClearChatButton";
import { FaBookMedical } from "react-icons/fa";
import bi_logo from "../../assets/sales_iq.svg";
import bgimg from "../../assets/bgimage.png";
import { Box, Grid, Button, Paper, Typography, Backdrop, Tooltip } from "@mui/material";
const Takeda = () => {
    const [isConfigPanelOpen, setIsConfigPanelOpen] = useState(false);
    const [promptTemplate, setPromptTemplate] = useState<string>("");
    const [retrieveCount, setRetrieveCount] = useState<number>(3);
    const [useSemanticRanker, setUseSemanticRanker] = useState<boolean>(true);
    const [useSemanticCaptions, setUseSemanticCaptions] = useState<boolean>(false);
    const [excludeCategory, setExcludeCategory] = useState<string>("");
    const [useSuggestFollowupQuestions, setUseSuggestFollowupQuestions] = useState<boolean>(false);

    const lastQuestionRef = useRef<string>("");
    const chatMessageStreamEnd = useRef<HTMLDivElement | null>(null);

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<unknown>();

    const [activeCitation, setActiveCitation] = useState<string>();
    const [activeAnalysisPanelTab, setActiveAnalysisPanelTab] = useState<AnalysisPanelTabs | undefined>(undefined);

    const [selectedAnswer, setSelectedAnswer] = useState<number>(0);
    const [answers, setAnswers] = useState<[user: string, response: AskResponse][]>([]);

    const makeApiRequest = async (question: string) => {
        lastQuestionRef.current = question;

        error && setError(undefined);
        setIsLoading(true);
        setActiveCitation(undefined);
        setActiveAnalysisPanelTab(undefined);

        try {
            // Log the question to debug
            console.log("Sending question:", question);

            const request = { question: question }; // Only send the question field

            const response = await fetch("/takeda", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(request)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log("Received response:", result); // Log the response to debug

            setAnswers([...answers, [question, { answer: result.response, thoughts: "", data_points: [] }]]);
        } catch (e) {
            setError(e);
        } finally {
            setIsLoading(false);
        }
    };

    const clearChat = () => {
        lastQuestionRef.current = "";
        error && setError(undefined);
        setActiveCitation(undefined);
        setActiveAnalysisPanelTab(undefined);
        setAnswers([]);
    };

    useEffect(() => chatMessageStreamEnd.current?.scrollIntoView({ behavior: "smooth" }), [isLoading]);

    const onPromptTemplateChange = (_ev?: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
        setPromptTemplate(newValue || "");
    };

    const onRetrieveCountChange = (_ev?: React.SyntheticEvent<HTMLElement, Event>, newValue?: string) => {
        setRetrieveCount(parseInt(newValue || "3"));
    };

    const onUseSemanticRankerChange = (_ev?: React.FormEvent<HTMLElement | HTMLInputElement>, checked?: boolean) => {
        setUseSemanticRanker(!!checked);
    };

    const onUseSemanticCaptionsChange = (_ev?: React.FormEvent<HTMLElement | HTMLInputElement>, checked?: boolean) => {
        setUseSemanticCaptions(!!checked);
    };

    const onExcludeCategoryChanged = (_ev?: React.FormEvent, newValue?: string) => {
        setExcludeCategory(newValue || "");
    };

    const onUseSuggestFollowupQuestionsChange = (_ev?: React.FormEvent<HTMLElement | HTMLInputElement>, checked?: boolean) => {
        setUseSuggestFollowupQuestions(!!checked);
    };

    const onExampleClicked = (example: string) => {
        makeApiRequest(example);
    };

    const onShowCitation = (citation: string, index: number) => {
        if (activeCitation === citation && activeAnalysisPanelTab === AnalysisPanelTabs.CitationTab && selectedAnswer === index) {
            setActiveAnalysisPanelTab(undefined);
        } else {
            setActiveCitation(citation);
            setActiveAnalysisPanelTab(AnalysisPanelTabs.CitationTab);
        }

        setSelectedAnswer(index);
    };

    const onToggleTab = (tab: AnalysisPanelTabs, index: number) => {
        if (activeAnalysisPanelTab === tab && selectedAnswer === index) {
            setActiveAnalysisPanelTab(undefined);
        } else {
            setActiveAnalysisPanelTab(tab);
        }

        setSelectedAnswer(index);
    };

    return (
        <Box sx={{ backgroundImage: `url(${bgimg})`, height: `calc(100vh - 60px)` }}>
            <Box sx={{ px: 12, py: 2, bgcolor: "white" }}>
                <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "2rem" }}>
                    <Box>
                        <img src={bi_logo} style={{ height: "65px" }} />
                    </Box>
                    <Box>
                        <Typography sx={{ color: "#105185", fontSize: "1.4rem", fontFamily: "Segoe UI", letterSpacing: "0px", opacity: 1, fontWeight: 600 }}>
                            AI chatbot to interact with your data in natural language
                        </Typography>
                        <Typography sx={{ color: "#105185", fontSize: "0.75rem", fontFamily: "Segoe UI", letterSpacing: "0px", opacity: 1, fontWeight: 600 }}>
                            An AI assistant for answering questions related to Takeda Data.
                        </Typography>
                    </Box>
                </Box>
            </Box>
            <div className={styles.chatRoot}>
                <div className={styles.chatContainer}>
                    {!lastQuestionRef.current ? (
                        <div className={styles.chatEmptyState}>
                            {/* <SparkleFilled fontSize={"120px"} primaryFill={"rgba(115, 118, 225, 1)"} aria-hidden="true" aria-label="Chat logo" /> */}
                            {/* <MdQuestionAnswer fontSize={"100px"} fill={"rgba(180, 50, 50, 1)"} style={{ marginBottom: "10px" }} />

                            <h1 className={styles.chatEmptyStateTitle}>SalesIQ QnA</h1>
                            <h4 className={styles.chatEmptyStateSubTitle}>AI Assistant for answering questions related to SalesIQ.</h4> */}

                            {/* <h2 className={styles.chatEmptyStateSubtitle}>Ask anything or try an example</h2> */}
                            <Box sx={{ my: 2, textAlign: "center", mx: 8 }}>
                                <p className={styles.disclaimerText}>This AI-powered agent is tailored to answer your queries related to your data.</p>
                                <p className={styles.disclaimerText}>
                                    While it aims for accuracy, it’s essential to acknowledge its AI nature and not substitute for professional advice or
                                    expertise.{" "}
                                </p>
                            </Box>
                            {/* Questions */}

                            {/* <ExampleList onExampleClicked={onExampleClicked} /> */}
                        </div>
                    ) : (
                        <div className={styles.chatMessageStream}>
                            <div className={styles.commandsContainer}>
                                <ClearChatButton className={styles.commandButton} onClick={clearChat} disabled={!lastQuestionRef.current || isLoading} />
                                {/* <SettingsButton className={styles.commandButton} onClick={() => setIsConfigPanelOpen(!isConfigPanelOpen)} /> */}
                            </div>
                            {answers.map((answer, index) => (
                                <div key={index}>
                                    <UserChatMessage message={answer[0]} />
                                    <div className={styles.chatMessageGpt}>
                                        <Answer
                                            key={index}
                                            answer={answer[1]}
                                            isSelected={selectedAnswer === index && activeAnalysisPanelTab !== undefined}
                                            onCitationClicked={c => onShowCitation(c, index)}
                                            onThoughtProcessClicked={() => onToggleTab(AnalysisPanelTabs.ThoughtProcessTab, index)}
                                            onSupportingContentClicked={() => onToggleTab(AnalysisPanelTabs.SupportingContentTab, index)}
                                            onFollowupQuestionClicked={q => makeApiRequest(q)}
                                            showFollowupQuestions={useSuggestFollowupQuestions && answers.length - 1 === index}
                                        />
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <>
                                    <UserChatMessage message={lastQuestionRef.current} />
                                    <div className={styles.chatMessageGptMinWidth}>
                                        <AnswerLoading />
                                    </div>
                                </>
                            )}
                            {error ? (
                                <>
                                    <UserChatMessage message={lastQuestionRef.current} />
                                    <div className={styles.chatMessageGptMinWidth}>
                                        <AnswerError error={error.toString()} onRetry={() => makeApiRequest(lastQuestionRef.current)} />
                                    </div>
                                </>
                            ) : null}
                            <div ref={chatMessageStreamEnd} />
                        </div>
                    )}

                    <div className={styles.chatInput}>
                        {!lastQuestionRef.current ? (
                            <>
                                <Box sx={{ display: "flex", flexDirection: "row", gap: "1rem", my: 2 }}>
                                    <Button
                                        variant="contained"
                                        sx={{ bgcolor: "white", color: "black", fontSize: "0.7rem" }}
                                        onClick={() => makeApiRequest("What are the sales trend in comparision to competitors for me in jan 2024")}
                                    >
                                        What are the sales trend in comparision to competitors for me in jan 2024
                                    </Button>
                                    {/* <Button variant="outlined" onClick={() => makeApiRequest("What are the Exit formalities")}>
                                    Exit formalities
                                </Button> */}
                                    <Button
                                        variant="contained"
                                        sx={{ bgcolor: "white", color: "black", fontSize: "0.7rem" }}
                                        onClick={() => makeApiRequest("How many emails did i send, and how many were delivered and clicked for the last quarter")}
                                    >
                                        How many emails did i send, and how many were delivered and clicked for the last quarter
                                    </Button>
                                    <Button
                                        variant="contained"
                                        sx={{ bgcolor: "white", color: "black", fontSize: "0.7rem" }}
                                        onClick={() => makeApiRequest("What is the current market share TRX for client product in my region compare to competitors")}
                                    >
                                        What is the current market share TRX for client product in my region compare to competitors
                                    </Button>
                                    {/* <Button variant="outlined" onClick={() => makeApiRequest("What are the priorities")}>
                                    Priorities
                                </Button> */}
                                </Box>
                            </>
                        ) : (
                            <></>
                        )}
                        <QuestionInput clearOnSend placeholder="Type a new question" disabled={isLoading} onSend={question => makeApiRequest(question)} />
                    </div>
                </div>

                {answers.length > 0 && activeAnalysisPanelTab && (
                    <AnalysisPanel
                        className={styles.chatAnalysisPanel}
                        activeCitation={activeCitation}
                        onActiveTabChanged={x => onToggleTab(x, selectedAnswer)}
                        citationHeight="810px"
                        answer={answers[selectedAnswer][1]}
                        activeTab={activeAnalysisPanelTab}
                    />
                )}

                {/* <Panel
                    headerText="Configure answer generation"
                    isOpen={isConfigPanelOpen}
                    isBlocking={false}
                    onDismiss={() => setIsConfigPanelOpen(false)}
                    closeButtonAriaLabel="Close"
                    onRenderFooterContent={() => <DefaultButton onClick={() => setIsConfigPanelOpen(false)}>Close</DefaultButton>}
                    isFooterAtBottom={true}
                >
                    <TextField
                        className={styles.chatSettingsSeparator}
                        defaultValue={promptTemplate}
                        label="Override prompt template"
                        multiline
                        autoAdjustHeight
                        onChange={onPromptTemplateChange}
                    />

                    <SpinButton
                        className={styles.chatSettingsSeparator}
                        label="Retrieve this many documents from search:"
                        min={1}
                        max={50}
                        defaultValue={retrieveCount.toString()}
                        onChange={onRetrieveCountChange}
                    />
                    <TextField className={styles.chatSettingsSeparator} label="Exclude category" onChange={onExcludeCategoryChanged} />
                    <Checkbox
                        className={styles.chatSettingsSeparator}
                        checked={useSemanticRanker}
                        label="Use semantic ranker for retrieval"
                        onChange={onUseSemanticRankerChange}
                    />
                    <Checkbox
                        className={styles.chatSettingsSeparator}
                        checked={useSemanticCaptions}
                        label="Use query-contextual summaries instead of whole documents"
                        onChange={onUseSemanticCaptionsChange}
                        disabled={!useSemanticRanker}
                    />
                    <Checkbox
                        className={styles.chatSettingsSeparator}
                        checked={useSuggestFollowupQuestions}
                        label="Suggest follow-up questions"
                        onChange={onUseSuggestFollowupQuestionsChange}
                    />
                </Panel> */}
            </div>
        </Box>
    );
};

export default Takeda;
