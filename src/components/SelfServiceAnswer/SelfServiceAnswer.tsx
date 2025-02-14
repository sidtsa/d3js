import { useMemo,useState,useEffect, useRef } from "react";
import { Stack, ActionButton } from "@fluentui/react";
import DOMPurify from "dompurify";
// import { useSpeechSynthesis } from 'react-speech-kit';
import {FaDatabase} from "react-icons/fa"
import styles from "./SelfServiceAnswer.module.css";
import icon from '../../assets/patient-self-service.png'

import { AskResponse, getCitationFilePath } from "../../api";
import { parseAnswerToHtml } from "./SelfServiceAnswerParser";
import { SelfServiceAnswerIcon } from "./SelfServiceAnswerIcon";
import { Button } from "@mui/material";
import TextToSpeech from "../TextToSpeech/TextToSpeech";

interface Props {
    answer: AskResponse;
    isSelected?: boolean;
    onCitationClicked: (filePath: string) => void;
    onThoughtProcessClicked: () => void;
    onSupportingContentClicked: () => void;
    onFollowupQuestionClicked?: (question: string) => void;
    showFollowupQuestions?: boolean;
    answericon?: any,
    voiceActive: boolean
}

export const SelfServiceAnswer = ({
    answer,
    isSelected,
    onCitationClicked,
    onThoughtProcessClicked,
    onSupportingContentClicked,
    onFollowupQuestionClicked,
    showFollowupQuestions,
    answericon = SelfServiceAnswerIcon,
    voiceActive
}: Props) => {
    const parsedAnswer = useMemo(() => parseAnswerToHtml(answer.answer, onCitationClicked), [answer]);
    const sanitizedAnswerHtml = parsedAnswer.answerHtml;
    const [speaking,setSpeaking] = useState<boolean>(false)
    const visualization = useMemo(() => answer.data_points[0], [answer])
    const [imageUrl,setImageUrl] = useState<string | null>(null)
    const [imageVisible,setImageVisible] = useState<boolean>(false)
    const count = useRef(0)
    const handleShowImage  = (blobData: string) => {
        // Parse the blob data and create a blob object
        const byteCharacters = atob(blobData);
        const byteArrays = [];
        for (let i = 0; i < byteCharacters.length; i++) {
          byteArrays.push(byteCharacters.charCodeAt(i));
        }
        const byteArray = new Uint8Array(byteArrays);
        const blob = new Blob([byteArray], { type: 'image/jpeg' });

        // Create an object URL from the blob
        const imgUrl = URL.createObjectURL(blob);
        setImageUrl(imgUrl)
        setImageVisible(true)
        // Open the image in a new tab
        //window.open(imageUrl);
      };

    // const onEnd = () => {
    //     setSpeaking(false)
    //   };
    // const { speak,cancel, voices } = useSpeechSynthesis({onEnd});
    // const voice = voices[1] || null;
    // // const handleSpeak = (text: string) => {
    // //     if (text.trim() !== '') {
    // //         speak({ text , voice});
    // //     }
    // //   };

    // const handleSpeakClick = () => {
    //     console.log(voiceActive)
    //     if ('speechSynthesis' in window && count.current <2 && voiceActive) {
    //       const speech = new SpeechSynthesisUtterance(sanitizedAnswerHtml);
    //       speech.lang = 'en-US'; // Set the language, adjust this based on your needs
    //       speech.volume = 1; // Volume range: 0 to 1
    //       speech.rate = 1; // Speed rate range: 0.1 to 10
    //       speech.pitch = 1; // Pitch range: 0 to 2
    //       window.speechSynthesis.speak(speech);
    //     } else {
    //       console.log('Text-to-speech not supported in this browser.');
    //     }
    //   };

    //   useEffect(() => {
    //     count.current = count.current + 1
    //     handleSpeakClick();
    // },[sanitizedAnswerHtml])
      




    return (
        <Stack className={`${styles.answerContainer} ${isSelected && styles.selected}`} verticalAlign="space-between">
            <Stack.Item>
                <Stack horizontal horizontalAlign="space-between">
                {/* <FaDatabase  fontSize={"20px"} fill={"rgba(28, 75, 220, 1)"} aria-hidden="true" aria-label="Answer logo" /> */}
                <img src={icon} height={"40px"} />
                    <div>
                        {/* <IconButton
                            style={{ color: "black" }}
                            iconProps={{ iconName: "Lightbulb" }}
                            title="Show thought process"
                            ariaLabel="Show thought process"
                            onClick={() => onThoughtProcessClicked()}
                            disabled={!answer.thoughts}
                        /> */}
                        {/* <IconButton
                            style={{ color: "black" }}
                            iconProps={{ iconName: "ClipboardList" }}
                            title="Show supporting content"
                            ariaLabel="Show supporting content"
                            onClick={() => onSupportingContentClicked()}
                            disabled={!answer.data_points.length}
                        /> */}

                            {/* <ActionButton
                                style={{ color: "black" }}
                                iconProps={{ iconName: "ClipboardList" }}
                                title="Copy Text"
                                ariaLabel="Copy text to clipboard"
                                onClick={() => {
                                    navigator.clipboard.writeText(parsedAnswer.answerHtml);
                                }}
                                disabled={parsedAnswer.answerHtml === "" ? true : false}
                            >
                                Copy
                            </ActionButton> */}
                            {/* {speaking ? 
                            <ActionButton 
                                iconProps={{ iconName: 'Stop' }}
                                // onClick ={ ()  => { 
                                //     cancel()
                                //     setSpeaking(false)
                                // }
                                // }
                                >Stop</ActionButton>
                            :
                            <ActionButton
                                iconProps= {{ iconName: 'Play' }}
                                // onClick={()  => {
                                //     const text = parsedAnswer.answerHtml 
                                //     speak({text, voice})
                                //     setSpeaking(true)
                                // } }
                            > Play
                            </ActionButton>
                            
                           
                    } */}
                    </div>
                </Stack>
            </Stack.Item>

            <Stack.Item grow>
                <div className={styles.answerText} dangerouslySetInnerHTML={{ __html: sanitizedAnswerHtml }}></div>
            </Stack.Item>

            {/* {!!parsedAnswer.citations.length && (
                <Stack.Item>
                    <Stack horizontal wrap tokens={{ childrenGap: 5 }}>
                        <span className={styles.citationLearnMore}>Citations:</span>
                        {parsedAnswer.citations.map((x, i) => {
                            const path = getCitationFilePath(x);
                            return (
                                <a key={i} className={styles.citation} title={x} onClick={() => onCitationClicked(path)}>
                                    {`${++i}. ${x}`}
                                </a>
                            );
                        })}
                    </Stack>
                </Stack.Item>
            )} */}

            {answer.thoughts === "true" ? 
            <>
                { imageVisible ? 
                    <>
                    <Button onClick={() => setImageVisible(false)}>Hide Visualization</Button>
                    {imageUrl && <img src={imageUrl} style={{ margin: 'auto' ,marginTop: "10px", width: '500px', height: 'auto' }} alt="Image" />}
                    </>
                :
                    <>
                    <Button onClick={() => handleShowImage(visualization)}>Show Visualization</Button>
                    </>
                }
    
            </>
            :
            <>
            </>}

            {!!parsedAnswer.followupQuestions.length && showFollowupQuestions && onFollowupQuestionClicked && (
                <Stack.Item>
                    <Stack horizontal wrap className={`${!!parsedAnswer.citations.length ? styles.followupQuestionsList : ""}`} tokens={{ childrenGap: 6 }}>
                        <span className={styles.followupQuestionLearnMore}>Follow-up questions:</span>
                        {parsedAnswer.followupQuestions.map((x, i) => {
                            return (
                                <a key={i} className={styles.followupQuestion} title={x} onClick={() => onFollowupQuestionClicked(x)}>
                                    {`${x}`}
                                </a>
                            );
                        })}
                    </Stack>
                </Stack.Item>
            )}
        </Stack>
    );
};
