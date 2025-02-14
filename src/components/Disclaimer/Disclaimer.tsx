import React from "react";
import styles from "./Disclaimer.module.css";

interface Props {
    disclaimer?: string;
}

const Disclaimer = ({ disclaimer }: Props) => {
    return disclaimer ? (
        <h3 className={styles.disclaimer}>{disclaimer}</h3>
    ) : (
        <h3 className={styles.disclaimer}>
            This app harnesses advanced AI technology for its functionalities, meaning unexpected insights and occasional errors may occur. Please verify the
            information for accuracy.{" "}
        </h3>
    );
};

export default Disclaimer;
