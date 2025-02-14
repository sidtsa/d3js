// DATA ENABLEMENT

import coding from "../../assets/coding.svg";
import self_service from "../../assets/self_service.svg";

const size = 50;

const style = {
    fontSize: size,
    color: "#ffffff"
};

const managedServicesMulti = [
    // {
    //     name: "AI Advisor for Axtria DataMAx™ ",
    //     description: "Leverage an LLM-based model, finely tuned to Axtria DataMAx™, providing insightful responses on product features and capabilities. ",
    //     link: ["#/axtriabot"],
    //     icon: <img src={self_service} style={style} />,
    //     color: "#221850",
    //     target: "_self"
    // },

    {
        name: "AI Coding Assistant",
        description: "Streamline your coding endeavours with an AI-powered assistant, simplifying code generation, testing, and review tasks. ",
        link: ["https://axtriagenailab.axtria.com/Your_coding_assistant"],
        icon: <img src={coding} style={style} />,
        color: "#221850",
        target: "_blank"
    }
];

export default managedServicesMulti;
