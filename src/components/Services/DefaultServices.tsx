import gpt from "../../assets/gpt.svg";
import curie from "../../assets/curie.svg";
import codex from "../../assets/codex.svg";

const size = 50;
const style = {
    fontSize: size,
    color: "#ffffff"
};
const defaultServices = [
    {
        name: "GPT Model",
        description: "GPT language model that is trained on massive amounts of data and is capable of generating natural language text.",
        link: ["#/chat"],
        icon: <img src={gpt} style={style} />,
        color: "#a659f4",
        target: "_self"
    },

    {
        name: "Curie Model",
        description: "Powerful and fast, capable of nuanced tasks like sentiment classification and summarization. Good at Q&A",
        link: ["#/chat"],
        icon: <img src={curie} style={style} />,
        color: "#418595",
        target: "_self"
    },

    {
        name: "Codex Model",
        description: "The Codex model is proficient in over a dozen programming languages and can write, debug code",
        link: ["#/chat"],
        icon: <img src={codex} style={style} />,
        color: "#2d5827",
        target: "_self"
    }
];

export default defaultServices;
