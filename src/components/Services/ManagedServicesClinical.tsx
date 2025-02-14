//CLINICAL

import medical from "../../assets/medical.svg";
import smart_protocol from "../../assets/protocol.svg";

const size = 50;

const style = {
    fontSize: size,
    color: "#ffffff"
};

const managedServices = [
    {
        name: "Medical AI Advisor",
        description: "Seamlessly access medical insights with a GenAI-powered chatbot that caters to all your clinical inquiries. ",
        link: ["#/medibot"],
        icon: <img src={medical} style={style} />,
        color: "#721850",
        target: "_self"
    },

    {
        name: "Smart Protocol Design",
        description: "AI powered clinical trials protocol design assistant",
        link: ["#/ct"],
        icon: <img src={smart_protocol} style={style} />,
        color: "#49ac15",
        target: "_self"
    },
    {
        name: "CSR Content Generation Using GenAI ",
        description:
            "Elevate your research with accuracy and efficiency by seamlessly generating high quality clinical study report (CSR) content using GenAI. ",
        link: ["http://10.11.140.218:8502/"],
        icon: <img src={smart_protocol} style={style} />,
        color: "#49ac15",
        target: "_blank"
    }
];

export default managedServices;
