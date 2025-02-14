import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter, Routes, Route } from "react-router-dom";

import "./index.css";

import Layout from "./pages/layout/Layout";
import Takeda from "./pages/Takedachat/takeda";
import Catalogue from "./pages/Datacatalogue/datacatalogue";
import Qvd from "./pages/qvd/qvd";
import Visualization from "./pages/visualization/visualization";
import NoPage from "./pages/NoPage";
import Chat from "./pages/chat/Chat";
import Home from "./pages/home/Home";
import Medibot from "./pages/medibot/Medibot";
import AxtriaBot from "./pages/axtriabot/AxtriaBot";
import SelfService from "./pages/selfService/SelfService";
import Dac from "./pages/DAC/dac";
import Documentation from "./pages/Documentation";
import Datamodel from "./pages/Datamodel";
import { initializeIcons } from "@fluentui/react";
import EmailAssitant from "./pages/emailGenerator/EmailAssistant";
import Compqna from "./pages/compqna/Compqna";
import Research from "./pages/research/Reserch";
import BiAnalysis from "./pages/bi/BiAnalysis";
import SRD from "./pages/srd/SRD";
import LeaverJoiner from "./pages/leaverJoiner/LeaverJoiner";
import Ct from "./pages/ct/Ct";
import ExpAssistant from "./pages/exploratory/Exploratory";
// import CodeAssistant from "./pages/CodeAssistant/CodeAssistant";

initializeIcons();

export default function App() {
    return (
        <HashRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="dbqa" element={<SelfService />} />
                    <Route path="medibot" element={<Medibot />} />
                    <Route path="axtriabot" element={<AxtriaBot />} />
                    <Route path="srd" element={<SRD />} />
                    <Route path="chat" element={<Chat />} />
                    <Route path="doc" element={<Documentation />} />
                    <Route path="datamodel" element={<Datamodel />} />
                    <Route path="emailGen" element={<EmailAssitant />} />
                    <Route path="compqna" element={<Compqna />} />
                    <Route path="takeda" element={<Takeda />} />
                    <Route path="catalogue" element={<Catalogue />} />
                    <Route path="qvd" element={<Qvd />} />
                    <Route path="vis" element={<Visualization />} />
                    <Route path="research" element={<Research />} />
                    <Route path="bi" element={<BiAnalysis />} />
                    <Route path="lj" element={<LeaverJoiner />} />
                    <Route path="ct" element={<Ct />} />
                    <Route path="dac" element={<Dac />} />
                    <Route path="exp" element={<ExpAssistant />} />
                    {/* <Route path="code" element={<CodeAssistant />} /> */}
                    <Route path="*" element={<NoPage />} />
                </Route>
            </Routes>
        </HashRouter>
    );
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
