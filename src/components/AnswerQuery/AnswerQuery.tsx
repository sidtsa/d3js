import { Box, CircularProgress } from "@mui/material";
import React, { useState } from "react";
import Textarea from "@mui/joy/Textarea";
import Typography from "@mui/joy/Typography";
import IconButton from "@mui/material/IconButton";
import { Edit } from "@mui/icons-material";
import SendIcon from "@mui/icons-material/Send";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import Tooltip from "@mui/material/Tooltip";

interface Props {
    answer: string;
    onClickExecuteQuery: () => {};
    onQueryChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
    onClickEditQuery: () => void;
    queryBoxDisabled: boolean;
    isLoading: boolean;
}

const AnswerQuery = ({ answer, isLoading, queryBoxDisabled, onClickExecuteQuery, onQueryChange, onClickEditQuery }: Props) => {
    return (
        <Box
            sx={{
                borderRadius: "10px",
                boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)", // Adjust the values for your desired shadow
                p: 2,
                display: "flex",
                flexDirection: "column"
            }}
        >
            <Typography level="title-md">GPT GENERATED QUERY</Typography>

            <Box sx={{ m: 1 }}>
                {isLoading ? (
                    <Box>
                        <CircularProgress size="30px" />
                    </Box>
                ) : (
                    <div>
                        <Textarea
                            placeholder="Get generated Query here…"
                            disabled={queryBoxDisabled}
                            onChange={onQueryChange}
                            sx={{ minHeight: 50, fontSize: 12 }}
                            value={answer}
                            variant="plain"
                        />
                    </div>
                )}

                {/* <Divider sx={{ my: 0.7 }} /> */}
                {/* <Button
                                    disabled={answer == ""}
                                    onClick={() => {
                                        const textArea = document.createElement("textarea");
                                        textArea.value = answer;
                                        document.body.appendChild(textArea);
                                        textArea.select();
                                        document.execCommand("copy");
                                        document.body.removeChild(textArea);
                                        alert("Query copied to clipboard!");
                                    }}
                                    startDecorator={<ContentCopyIcon />}
                                >
                                    Copy Query
                                </Button> */}
                {/* <Button variant="solid" onClick={onClickEditQuery} startDecorator={<EditIcon />}> */}
                <Tooltip title="Copy Query" arrow>
                    <IconButton
                        disabled={answer == ""}
                        sx={{ mx: 2 }}
                        color="primary"
                        onClick={() => {
                            navigator.clipboard.writeText(answer);
                        }}
                    >
                        <ContentCopyIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Edit Query" arrow>
                    <IconButton disabled={answer == ""} aria-label="Edit Query" onClick={onClickEditQuery} color="primary">
                        <Edit />
                    </IconButton>
                </Tooltip>

                {/* <Button disabled={answer == ""} startDecorator={<SendIcon />} onClick={onClickExecuteQuery} sx={{ mx: 2 }}> */}
                <Tooltip title="Execute Query" arrow>
                    <IconButton disabled={answer == ""} onClick={onClickExecuteQuery} sx={{ mx: 2 }} color="primary">
                        <SendIcon />
                    </IconButton>
                </Tooltip>
            </Box>
        </Box>
    );
};

export default AnswerQuery;
