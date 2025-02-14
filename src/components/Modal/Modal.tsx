import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import ReactMarkdown from "react-markdown";

const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "80%",
    maxHeight: "80%",
    bgcolor: "background.paper",
    border: "2px solid #000",
    overflowY: "scroll",
    boxShadow: 24,
    p: 4
};

interface Props {
    open: boolean;
    handleClose: () => void;
    title: string;
    content: string;
}

export default function BasicModal({ open, handleClose, title, content }: Props) {
    return (
        <div>
            <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        {title}
                    </Typography>
                    <ReactMarkdown>{content}</ReactMarkdown>
                </Box>
            </Modal>
        </div>
    );
}
