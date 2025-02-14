// PATIENT ANALYTICS

import self_service from "../../assets/self_service.svg";


const size = 50;

const style = {
    fontSize: size,
    color: "#ffffff"
};

const managedServices = [
    {
        name: "Disease Area Coach",
        description: "Harness an empathetic conversational interface for queries, unlocking profound insights from your patient database(s). ",
        link: ["#/dac"],
        icon: <img src={self_service} style={style} />,
        color: "#32a850",
        target: "_self"
    },    
];

export default managedServices;
