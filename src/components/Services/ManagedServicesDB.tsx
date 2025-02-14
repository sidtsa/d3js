// INSIGHTS GENERATION/SALES OPERATIONS

import self_service from "../../assets/self_service.svg";
import bi_search from "../../assets/bi_search.svg";
import medical from "../../assets/medical.svg";
import leaver from "../../assets/leaver_joiner.svg";
import research from "../../assets/reasearch_as.svg";
// import { MdQuestionAnswer } from "react-icons/md";

const size = 50;

const style = {
    fontSize: size
};

const managedServicesDB = [
    {
        name: "AI Advisor",
        description: "Harness a conversational interface for queries, unlocking profound insights from your database(s)",
        link: ["#/dbqa"],
        icon: <img src={self_service} style={style} />,
        color: "#32a850",
        target: "_self"
    },
    {
        name: "AI QVD",
        description: "Harness a conversational interface for queries, unlocking profound insights from your database(qvd)",
        link: ["#/qvd"],
        icon: <img src={self_service} style={style} />,
        color: "#32a900",
        target: "_self"
    },
    {
        name: " AI-driven Reporting Insights",
        description:
            "Seamlessly query, retrieve details, and integrate enterprise-wide business intelligence reports with unprecedented ease from GenAI-ready datasets (GRD). ",
        link: ["#/bi"],
        icon: <img src={bi_search} style={style} />,
        color: "#c2a350",
        target: "_self"
    },
    {
        name: "AI MedQuery",
        description: "Access a dedicated GenAI-powered chatbot ready to swiftly address all Standard Response Document (SRD)-related queries. ",
        link: ["#/srd"],
        icon: <img src={medical} style={style} />,
        color: "#a12571",
        target: "_self"
    },
    {
        name: "AI Workforce Manager",
        description: "Empower your workforce with an AI-driven onboarding and offboarding assistant, adept at swiftly addressing related queries.",
        link: ["#/lj"],
        icon: <img src={leaver} style={style} />,
        color: "#4c2a95",
        target: "_self"
    },

    {
        name: "AI Advisor for Axtria SalesIQ™",
        description: "Elevate sales operations with an AI-powered response tool to address incentive compensation (IC) queries. ",
        link: ["#/compqna"],
        icon: <img src={self_service} style={style} />,
        color: "#927350",
        target: "_self"
    },
    {
        name: "AI Based WebIQ",
        description: "A dedicated GenAI powered chatbot to gain key insights from any website directly",
        link: ["https://axtriagenailab.axtria.com/Talk_directly_to_web"],
        icon: <img src={research} style={style} />,
        color: "#927350",
        target: "_blank"
    },
    // {
    //     name: "Takeda ChatBot",
    //     description: "Ask queries in natural language about your data ",
    //     link: ["#/takeda"],
    //     icon: <img src={self_service} style={style} />,
    //     color: "#927350",
    //     target: "_self"
    // },
    {
        name: "AI Data Catalogue",
        description:
            "A GenAI-powered data catalog enabling data stewards to swiftly search and retrieve data level information using natural language queries.",
        link: ["#/catalogue"],
        icon: <img src={self_service} style={style} />,
        color: "#927350",
        target: "_self"
    },
    {
        name: "AI Exploration Analysis",
        description: "Empower users to derive key insights directly from the database by combining code generation capabilities of GenAI and data cataloguing.",
        link: ["#/exp"],
        icon: <img src={self_service} style={style} />,
        color: "#927350",
        target: "_self"
    },
    {
        name: "AI Visualization",
        description: "Empower your workforce with an AI-driven dashboards, adept at swiftly generating enterprise-wide business intelligence reports of user's choice.",
        link: ["#/vis"],
        icon: <img src={bi_search} style={style}/>,
        color: "#4c2a95",
        target: "_self"
    }
];

export default managedServicesDB;
