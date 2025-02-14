import { useRef, useState, useEffect } from "react";
import { Checkbox, Panel, DefaultButton, TextField, SpinButton } from "@fluentui/react";
import { SparkleFilled } from "@fluentui/react-icons";
import research from "../../assets/Logo_2.jpg";
import { SiOpenai } from "react-icons/si";
import styles from "./BiAnalysis.module.css";
import { Grid, Paper, Backdrop, Tooltip, Button } from "@mui/material";
import { biApi, Approaches, AskResponse, ChatRequest, ChatTurn } from "../../api";
import { PlainAnswer, PlainAnswerError, PlainAnswerLoading } from "../../components/PlainAnswer";
import { QuestionInput } from "../../components/QuestionInput";
import { ExampleList } from "../../components/Example";
import { UserChatMessage } from "../../components/UserChatMessage";
import { AnalysisPanel, AnalysisPanelTabs } from "../../components/AnalysisPanel";
import { ClearChatButton } from "../../components/ClearChatButton";
import Disclaimer from "../../components/Disclaimer/Disclaimer";
import { Box, Typography } from "@mui/material";
import bi_logo from "../../assets/bi_search.svg";
import bgimg from "../../assets/bgimage.png";

const BiAnalysis = () => {
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
                approach: Approaches.Medical,
                overrides: {
                    promptTemplate: promptTemplate.length === 0 ? undefined : promptTemplate,
                    excludeCategory: excludeCategory.length === 0 ? undefined : excludeCategory,
                    top: retrieveCount,
                    semanticRanker: useSemanticRanker,
                    semanticCaptions: useSemanticCaptions,
                    suggestFollowupQuestions: useSuggestFollowupQuestions
                }
            };
            const result = await biApi(request);
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
        <Box sx={{ backgroundImage: `url(${bgimg})`, height: `calc(100vh - 60px)` }}>
            <Box sx={{ px: 12, py: 2, bgcolor: "white" }}>
                <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "2rem" }}>
                    <Box>
                        <img src={bi_logo} style={{ height: "65px" }} />
                    </Box>
                    <Box>
                        <Typography sx={{ color: "#105185", fontSize: "1.4rem", fontFamily: "Segoe UI", letterSpacing: "0px", opacity: 1, fontWeight: 600 }}>

                            Effortless BI report integration with GenAI-ready datasets
                        </Typography>
                        <Typography sx={{ color: "#105185", fontSize: "0.75rem", fontFamily: "Segoe UI", letterSpacing: "0px", opacity: 1, fontWeight: 600 }}>
                            Seamlessly query, retrieve details, and integrate enterprise-wide business intelligence reports with unprecedented ease from
                            GenAI-ready datasets (GRD).
                        </Typography>
                    </Box>
                </Box>
            </Box>
            <div className={styles.chatRoot}>
                <div className={styles.chatContainer}>
                    {!lastQuestionRef.current ? (
                        <div className={styles.chatEmptyState}>
                            {/* <SparkleFilled fontSize={"120px"} primaryFill={"rgba(115, 118, 225, 1)"} aria-hidden="true" aria-label="Chat logo" /> */}

                            {/* <h2 className={styles.chatEmptyStateSubtitle}>Ask anything or try an example</h2> */}
                            <Disclaimer />
                            {/* <ExampleList onExampleClicked={onExampleClicked} /> */}
                            {/* Questions */}
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
                                        <PlainAnswer
                                            key={index}
                                            answer={answer[1]}
                                            isSelected={selectedAnswer === index && activeAnalysisPanelTab !== undefined}
                                            onCitationClicked={c => onShowCitation(c, index)}
                                            onThoughtProcessClicked={() => onToggleTab(AnalysisPanelTabs.ThoughtProcessTab, index)}
                                            onSupportingContentClicked={() => onToggleTab(AnalysisPanelTabs.SupportingContentTab, index)}
                                            onFollowupQuestionClicked={q => makeApiRequest(q)}
                                            showFollowupQuestions={useSuggestFollowupQuestions && answers.length - 1 === index}
                                            answericon={<SiOpenai fontSize={"25px"} />}
                                        />
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <>
                                    <UserChatMessage message={lastQuestionRef.current} />
                                    <div className={styles.chatMessageGptMinWidth}>
                                        <PlainAnswerLoading />
                                    </div>
                                </>
                            )}
                            {error ? (
                                <>
                                    <UserChatMessage message={lastQuestionRef.current} />
                                    <div className={styles.chatMessageGptMinWidth}>
                                        <PlainAnswerError error={error.toString()} onRetry={() => makeApiRequest(lastQuestionRef.current)} />
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
                                        onClick={() => makeApiRequest("Give me Goal Attainment report of sales rep?")}
                                    >
                                        Give me Goal Attainment report of sales rep?
                                    </Button>
                                    {/* <Button variant="outlined" onClick={() => makeApiRequest("What are the Exit formalities")}>
                                    Exit formalities
                                </Button> */}
                                    <Button
                                        variant="contained"
                                        sx={{ bgcolor: "white", color: "black", fontSize:"0.7rem" }}
                                        onClick={() => makeApiRequest("Who are top writers by Trx/NRx?")}
                                    >
                                        Who are top writers by Trx/NRx?
                                    </Button>
                                    <Button
                                        variant="contained"
                                        sx={{ bgcolor: "white", color: "black", fontSize:"0.7rem" }}
                                        onClick={() => makeApiRequest("Give me claims summary based on type of claims and claims who reimbursed?")}
                                    >
                                        Give me claims summary based on type of claims and claims who reimbursed?
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

export default BiAnalysis;
