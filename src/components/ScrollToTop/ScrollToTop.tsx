import React from "react";
import Button from "@mui/material/Button";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import Zoom from "@mui/material/Zoom";

const ScrollToTopButton = () => {
    const trigger = useScrollTrigger({
        disableHysteresis: true,
        threshold: 100
    });

    const handleClick = () => {
        const scrollToTop = () => {
            const currentPosition = window.scrollY;
            if (currentPosition > 0) {
                window.scrollTo(0, currentPosition - currentPosition / 6);
                window.requestAnimationFrame(scrollToTop);
            }
        };

        scrollToTop();
    };

    return (
        <Zoom in={trigger}>
            <Button
                onClick={handleClick}
                style={{
                    position: "fixed",
                    bottom: 16,
                    right: 16
                }}
                color="primary"
                variant="contained"
                size="large"
            >
                <KeyboardArrowUpIcon />
            </Button>
        </Zoom>
    );
};

export default ScrollToTopButton;
