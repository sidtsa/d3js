import { renderToStaticMarkup } from "react-dom/server";
import { getCitationFilePath } from "../../api";

type HtmlParsedAnswer = {
    answerHtml: string;
    citations: string[];
    followupQuestions: string[];
};

export function parseAnswerToHtml(answer: string, onCitationClicked: (citationFilePath: string) => void): HtmlParsedAnswer {
    const citations: string[] = [];
    const followupQuestions: string[] = [];

    // Extract any follow-up questions that might be in the answer
    let parsedAnswer = answer.trim()

    // trim any whitespace from the end of the answer after removing follow-up questions


    // const parts = parsedAnswer.split(/\[([^\]]+)\]/g);

    // const fragments: string[] = parts.map((part, index) => {
    //     if (index % 2 === 0) {
    //         return part;
    //     } else {
    //         let citationIndex: number;
    //         if (citations.indexOf(part) !== -1) {
    //             citationIndex = citations.indexOf(part) + 1;
    //         } else {
    //             citations.push(part);
    //             citationIndex = citations.length;
    //         }

    //         const path = getCitationFilePath(part);

    //         return renderToStaticMarkup(
    //             <a className="supContainer" title={part} onClick={() => onCitationClicked(path)}>
    //                 <sup>{citationIndex}</sup>
    //             </a>
    //         );
    //     }
    // });

    return {
        answerHtml: parsedAnswer,
        citations,
        followupQuestions
    };
}
