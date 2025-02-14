import * as React from "react";
import AspectRatio from "@mui/joy/AspectRatio";
import Link from "@mui/joy/Link";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import Chip from "@mui/joy/Chip";
import Typography from "@mui/joy/Typography";
import styles from "./ServiceCard.module.css";
import { Box } from "@mui/material";

interface ServicesCardProps {
    data: {
        link: string[];
        color: string;
        icon: JSX.Element;
        name: string;
        description: string;
        target: string;
    };
}

const ServicesCard: React.FC<ServicesCardProps> = props => {
    return (
        <Card
            variant="outlined"
            orientation="horizontal"
            sx={{
                "&:hover": { boxShadow: "md", borderColor: "neutral.outlinedHoverBorder" },
                borderRadius: "10px",
                minHeight: 150,
                px: 4
            }}
        >
            <AspectRatio ratio="1" sx={{ width: 70, my: "auto" }}>
                <Box
                    sx={{
                        width: 50,
                        background: props.data.color
                        // boxShadow: `inset 0 0 10px rgba(0, 0, 0, 0.2)`
                    }}
                >
                    {props.data.icon}
                </Box>
            </AspectRatio>
            <CardContent sx={{ my: "auto" }}>
                <Typography level="title-lg" id="card-description"  sx={{ fontSize:"1.2rem"}}>
                    {props.data.name}
                </Typography>
                <Typography level="body-sm" aria-describedby="card-description" mb={1}  sx={{ fontSize:"0.8rem"}}>
                    <Link overlay underline="none" href={props.data.link[0]} target={props.data.target} sx={{ color: "text.tertiary" }}>
                        {props.data.description}
                    </Link>
                </Typography>
            </CardContent>
        </Card>
    );
};
export default ServicesCard;
