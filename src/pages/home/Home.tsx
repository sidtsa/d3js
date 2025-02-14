import { useState, useEffect } from "react";

import ServicesCard from "../../components/Services/ServiceCard";
import managedServicesDB from "../../components/Services/ManagedServicesDB";
import managedServicesDoc from "../../components/Services/ManagedServicesDoc";
import managedServicesMulti from "../../components/Services/ManagedServicesMulti";
import managedServicesInteraction from "../../components/Services/ManagedServicesInteraction";
import managedServicesClinical from "../../components/Services/ManagedServicesClinical";
import managedServicesPA from "../../components/Services/ManagedServicesPA";
import defaultServices from "../../components/Services/DefaultServices";
import { SectionDivider } from "../../components/SectionDivider/SectionDivider";
import { Grid, Typography, Box, Card, CardContent, Button, Divider } from "@mui/material";
import styles from "./Home.module.css";
import banner from "../../assets/big_banner.png";

function Home() {
    return (
        <div className={styles.body}>
            <Box sx={{ height: 350, display: "flex", flex: 1, flexDirection: "row", backgroundImage: `url(${banner})`, backgroundSize: "cover" }}>
                <Box
                    sx={{
                        position: "relative",
                        p: { xs: 3, md: 6 },
                        pr: { md: 0 },
                        // marginRight: 15,
                        width: "40%"
                    }}
                >
                    <Typography component="h1" variant="h3" sx={{ fontWeight: 600, fontSize: "2rem", fontFamily: "Segoe UI", color: "#FFFFFF" }} gutterBottom>
                        Discover the Power of AI
                    </Typography>
                    <Typography variant="h5" color="inherit" sx={{ fontSize: "1rem", fontFamily: "Segoe UI", color: "#FFFFFF" }} paragraph>
                        Introducing our AI-powered applications for life sciences enterprise solutions. From Sales and Marketing to Data Analytics and Clinical
                        endeavors, our GenAI tools offer critical insights, enhancing efficiency. Experience the transformative power of AI as it revolutionizes
                        workflows, providing prompt responses and improved productivity. Embrace the future of enterprise technology with our advanced AI
                        applications.
                    </Typography>
                    <Button
                        sx={{ borderRadius: "25px", marginTop: 2, bgcolor: "#33B0E3", px: 4 }}
                        variant="contained"
                        href="https://insights.axtria.com/blog/building-robust-generative-ai-ready-datasets"
                        target="_blank"
                    >
                        Learn More
                    </Button>
                </Box>
                {/* <img src={banner} style={{ height: "100%" }}></img> */}
            </Box>
            {/* <Divider sx={{ my: 2 }}></Divider> */}
            <Box sx={{ mx: "30px", marginTop: 4 }}>
                <Box sx={{ my: 3 }}>
                    <Typography variant="h5" sx={{ fontSize: "25px" }}>
                        INSIGHTS GENERATION/SALES OPERATIONS
                    </Typography>
                    <Grid container alignItems="stretch">
                        {managedServicesDB.map((data, key) => (
                            <Grid item key={key} padding={2} xs={12} md={4}>
                                <ServicesCard data={data} />
                            </Grid>
                        ))}
                    </Grid>
                </Box>
                <Box sx={{ my: 2 }}>
                    <Typography variant="h5" sx={{ fontSize: "25px" }}>
                        MARKETING EXCELLENCE
                    </Typography>
                    <Grid container alignItems="stretch">
                        {managedServicesDoc.map((data, key) => (
                            <Grid item key={key} padding={2} xs={12} md={4}>
                                <ServicesCard data={data} />
                            </Grid>
                        ))}
                    </Grid>
                </Box>
                <Box sx={{ my: 2 }}>
                    <Grid container justifyContent="space-between" alignItems="stretch">
                        <Box sx={{ width: "33%" }}>
                            <Typography variant="h5" sx={{ fontSize: "25px" }}>
                                DATA ENABLEMENT
                            </Typography>
                            <Grid container alignItems="stretch">
                                {managedServicesMulti.map((data, key) => (
                                    <Grid item key={key} padding={2} xs={6} md={12}>
                                        <ServicesCard data={data} />
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>
                        <Box sx={{ width: "33%" }}>
                            <Typography variant="h5" sx={{ fontSize: "25px" }}>
                                INTERACTION
                            </Typography>
                            <Grid container alignItems="stretch">
                                {managedServicesInteraction.map((data, key) => (
                                    <Grid item key={key} padding={2} xs={6} md={12}>
                                        <ServicesCard data={data} />
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>
                        <Box sx={{ width: "33%" }}>
                            <Typography variant="h5" sx={{ fontSize: "25px" }}>
                                PATIENT SUPPORT
                            </Typography>
                            <Grid container alignItems="stretch">
                                {managedServicesPA.map((data, key) => (
                                    <Grid item key={key} padding={2} xs={6} md={12}>
                                        <ServicesCard data={data} />
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>
                    </Grid>
                </Box>
                <Box sx={{ my: 2 }}>
                    <Typography variant="h5" sx={{ fontSize: "25px" }}>
                        CLINICAL
                    </Typography>
                    <Grid container alignItems="stretch">
                        {managedServicesClinical.map((data, key) => (
                            <Grid item key={key} padding={2} xs={6} md={4}>
                                <ServicesCard data={data} />
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </Box>
        </div>
    );
}

export default Home;
