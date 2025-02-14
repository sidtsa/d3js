// DATA ENABLEMENT 

import coding from "../../assets/coding.svg";
import video from "../../assets/photo_video.svg";

const size = 50;

const style = {
    fontSize: size,
    color: "#ffffff"
};

const managedServicesMulti = [
    // {
    //     name: "AI Coding Assistant",
    //     description: "Streamline your coding endeavours with an AI-powered assistant, simplifying code generation, testing, and review tasks. ",
    //     link: ["https:/axtriagenailab.axtria.com/Your_coding_assistant"],
    //     icon: <img src={coding} style={style} />,
    //     color: "#221850",
    //     target: "_blank"
    // },
    {
        name: "Rep AI Advisor ",
        description: "Harness a conversational interface for queries, unlocking profound insights from your sales database(s) using video, text, and images. ",
        link: ["https://axtriagenailab.axtria.com/Analyse_images_or_videos"],
        icon: <img src={video} style={style} />,
        color: "#c23350",
        target: "_blank"
    }
];

export default managedServicesMulti;
