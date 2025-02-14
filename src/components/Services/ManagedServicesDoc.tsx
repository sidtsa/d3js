// MARKETING EXCELLENCE

import sales_iq from "../../assets/self_service.svg";
import medical from "../../assets/medical.svg";
import research from "../../assets/reasearch_as.svg";
import axtria_prd from "../../assets/ax_product.svg";
import email from "../../assets/email_gen.svg";

const size = 50;

const style = {
    fontSize: size,
    color: "#ffffff"
};

const managedServicesDoc = [
    // {
    //     name: "SalesIQ QnA",
    //     description: "AI Powered Response Tool for IC related Queries",
    //     link: ["#/compqna"],
    //     icon: <img src={sales_iq} style={style} />,
    //     color: "#927350",
    //     target: "_self"
    // },

    // {
    //     "name":"Data Model Generation",
    //     "description":"Autogenerated data models with relationships for connected database objects",
    //     "link": ['/datamodel'],
    //     "icon":<TbChecklist style={{ fontSize: size }}/>,
    //     "color": "#927350",
    //     "target":"_self"

    // },

    // {
    //     name: "AI MedQuery",
    //     description: "Access a dedicated GenAI-powered chatbot ready to swiftly address all Standard Response Document (SRD)-related queries. ",
    //     link: ["#/srd"],
    //     icon: <img src={medical} style={style} />,
    //     color: "#a12571",
    //     target: "_self"
    // },

    {
        name: "AI Content Generator & Reviewer",
        description:
            "Revolutionize your marketing strategy with an AI-powered email generation and review tool, crafting impactful communications effortlessly.",
        link: ["https://axtriagenailab.axtria.com/Email_content_&_review"],
        icon: <img src={email} style={style} />,
        color: "#ff5489",
        target: "_blank"
    },
    // {
    //     name: "Medical QnA",
    //     description: "AI powered chatbot to answer all of your medical questions",
    //     link: ["#/medibot"],
    //     icon: <img src={medical} style={style} />,
    //     color: "#721850",
    //     target: "_self"
    // },
    {
        name: "AI Research Assistant",
        description: "Harness the power of generating competitive intelligence and sentiment analysis from market research studies. ",
        link: ["#/research"],
        icon: <img src={research} style={style} />,
        color: "#23f489",
        target: "_self"
    }
    // {
    //     name: "Axtria Product QnA",
    //     description: "GPT language model tuned on Axtria products and can answer questions related to Axtria products and services",
    //     link: ["#/axtriabot"],
    //     icon: <img src={axtria_prd} style={style} />,
    //     color: "#418595",
    //     target: "_self"
    // },
];

export default managedServicesDoc;
