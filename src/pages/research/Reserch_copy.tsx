import { useRef, useState, useEffect } from "react";
import { Checkbox, Panel, DefaultButton, TextField, SpinButton } from "@fluentui/react";
import { SparkleFilled } from "@fluentui/react-icons";

import research_logo from "../../assets/Logo_2.jpg";
import styles from "./Reserch.module.css";
import Disclaimer from "../../components/Disclaimer/Disclaimer";
import { tunedApi, Approaches, AskResponse, ChatRequest, ChatTurn } from "../../api";
import { Answer, AnswerError, AnswerLoading } from "../../components/Answer";
import { QuestionInput } from "../../components/QuestionInput";
import { ExampleList } from "../../components/Example";
import { UserChatMessage } from "../../components/UserChatMessage";
import { AnalysisPanel, AnalysisPanelTabs } from "../../components/AnalysisPanel";
import { SettingsButton } from "../../components/SettingsButton";
import { ClearChatButton } from "../../components/ClearChatButton";
import { FaBookMedical } from "react-icons/fa";
import { Box, Grid, Button, Paper, Typography, Backdrop, Tooltip } from "@mui/material";

const Research = () => {
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
            const history: ChatTurn[] = answers.map(a => ({ user: a[0], bot: a[1].answer }));
            const request: ChatRequest = {
                history: [...history, { user: question, bot: undefined }],
                approach: Approaches.Research,
                overrides: {
                    promptTemplate: promptTemplate.length === 0 ? undefined : promptTemplate,
                    excludeCategory: excludeCategory.length === 0 ? undefined : excludeCategory,
                    top: retrieveCount,
                    semanticRanker: useSemanticRanker,
                    semanticCaptions: useSemanticCaptions,
                    suggestFollowupQuestions: useSuggestFollowupQuestions
                }
            };
            const result = await tunedApi(request);
            setAnswers([...answers, [question, result]]);
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
        <div className={styles.container}>
            <div className={styles.commandsContainer}>
                <ClearChatButton className={styles.commandButton} onClick={clearChat} disabled={!lastQuestionRef.current || isLoading} />
                {/* <SettingsButton className={styles.commandButton} onClick={() => setIsConfigPanelOpen(!isConfigPanelOpen)} /> */}
            </div>
            <div className={styles.chatRoot}>
                <div className={styles.chatContainer}>
                    {!lastQuestionRef.current ? (
                        <div className={styles.chatEmptyState}>
                            {/* <SparkleFilled fontSize={"120px"} primaryFill={"rgba(115, 118, 225, 1)"} aria-hidden="true" aria-label="Chat logo" /> */}
                            <img src={research_logo} height={"100px"} />
                            <h1 className={styles.chatEmptyStateTitle}>Maximizing market insights </h1>
                            <h4 className={styles.chatEmptyStateSubTitle}>Research-backed competitive intelligence and sentiment analysis </h4>

                            {/* <h2 className={styles.chatEmptyStateSubtitle}>Ask anything or try an example</h2> */}
                            <p className={styles.disclaimerText}>
                                The LLM powered agent is designed to assist with Market Research Insights. While it strives to provide accurate and up-to-date
                                information,
                            </p>
                            <p className={styles.disclaimerText}>
                                it is important to note that it is an AI-based system and should not replace professional advice or expertise.{" "}
                            </p>
                            {/* <ExampleList onExampleClicked={onExampleClicked} /> */}

                            {/* Questions */}

                            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: 2 }}>
                                <Box sx={{ mx: 10, marginTop: 2, maxWidth: "70%" }}>
                                    <Grid container spacing={3}>
                                        <Grid item xs={12} sm={6} md={6}>
                                            <Box sx={{ height: "100%" }}>
                                                <Paper variant="outlined" sx={{ p: 2, borderRadius: "10px", height: "100%" }}>
                                                    <Box sx={{ display: "flex", flexDirection: "row", gap: 3 }}>
                                                        <Typography sx={{ fontSize: "0.75rem" }}>
                                                            what is the impact of covid on lung cancer treatment
                                                        </Typography>
                                                    </Box>
                                                </Paper>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={6}>
                                            <Box>
                                                <Paper variant="outlined" sx={{ p: 2, borderRadius: "10px" }}>
                                                    <Box sx={{ display: "flex", flexDirection: "row", gap: 3 }}>
                                                        <Typography sx={{ fontSize: "0.75rem" }}>
                                                            what is the impact of pandemic on the oncology treatment accessibility and adherence?{" "}
                                                        </Typography>
                                                    </Box>
                                                </Paper>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={6}>
                                            <Box>
                                                <Paper variant="outlined" sx={{ p: 2, borderRadius: "10px" }}>
                                                    <Box sx={{ display: "flex", flexDirection: "row", gap: 3 }}>
                                                        <Typography sx={{ fontSize: "0.75rem" }}>
                                                            what are the emerging trends in precision oncology?{" "}
                                                        </Typography>
                                                    </Box>
                                                </Paper>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </Box>
                        </div>
                    ) : (
                        <div className={styles.chatMessageStream}>
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
                                            answericon={<img src={research_logo} height={"20px"} />}
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
                                        sx={{ bgcolor: "white", color: "black", fontSize:"0.7rem" }}
                                        onClick={() => makeApiRequest("Generate a touchpoint email for drug apretude using legal 1")}
                                    >
                                        Generate a touchpoint email for drug apretude using legal 1
                                    </Button>
                                    {/* <Button variant="outlined" onClick={() => makeApiRequest("What are the Exit formalities")}>
                                    Exit formalities
                                </Button> */}
                                    <Button
                                        variant="contained"
                                        sx={{ bgcolor: "white", color: "black", fontSize:"0.7rem" }}
                                        onClick={() =>
                                            makeApiRequest("Generate an email focused on dosage to be sent to doctor alex for drug apretude using legal 2")
                                        }
                                    >
                                        Generate an email focused on dosage to be sent to doctor alex for drug apretude using legal 2
                                    </Button>
                                    <Button
                                        variant="contained"
                                        sx={{ bgcolor: "white", color: "black", fontSize:"0.7rem" }}
                                        onClick={() =>
                                            makeApiRequest("Generate an email focused on efficacy to be sent to doctor alex for drug apretude using legal 2")
                                        }
                                    >
                                        Generate an email focused on efficacy to be sent to doctor alex for drug apretude using legal 2
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
        </div>
    );
};

export default Research;
