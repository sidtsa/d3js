import { Outlet, NavLink, Link } from "react-router-dom";
import { Typography, IconButton, Divider, Box } from "@mui/material";
import styles from "./Layout.module.css";

import axtria_logo from "../../assets/Axtria_Logo.png";
import home from "../../assets/home.svg";
import UserMenu from "../../components/UserMenu/UserMenu";
import LogoutIcon from "../../assets/logout.svg";
import { logout } from "../../api";

const Layout = () => {
    const handleLogout = async () => {
        console.log("logout");
        try {
            logout();
            // await axios.get('/logout');
            //window.location.reload()
            window.location.href = "/login";
        } catch (error) {
            console.log(error);
        }

        // handleClose();
    };
    return (
        <div className={styles.layout}>
            <header className={styles.header} role={"banner"}>
                <div className={styles.headerContainer}>
                    <Link to="/">
                        <img src={axtria_logo} height="50" style={{ marginLeft: "20px", padding: 3 }} />
                    </Link>
                    {/* <nav>
                        <ul className={styles.headerNavList}>
                            <li>
                                <NavLink to="/" className={({ isActive }) => (isActive ? styles.headerNavPageLinkActive : styles.headerNavPageLink)}>
                                    Chat
                                </NavLink>
                            </li>
                            <li className={styles.headerNavLeftMargin}>
                                <NavLink to="/qa" className={({ isActive }) => (isActive ? styles.headerNavPageLinkActive : styles.headerNavPageLink)}>
                                    Ask a question
                                </NavLink>
                            </li>
                            <li className={styles.headerNavLeftMargin}>
                                <a href="https://aka.ms/entgptsearch" target={"_blank"} title="Github repository link">
                                    <img
                                        src={github}
                                        alt="Github logo"
                                        aria-label="Link to github repository"
                                        width="20px"
                                        height="20px"
                                           className={styles.githubLogo}
                                    />
                                </a>
                            </li>
                        </ul>
                    </nav> */}
                    <Box sx={{ display: "flex", flex: 1, mx: 3, alignItems: "center" }}>
                        <Divider orientation="vertical" flexItem />
                        <Typography sx={{ fontWeight: 600, fontSize: "2.5rem", mx: 3, color: "#33B0E3", letterSpacing: "0px" }}>
                            AI <span style={{ color: "#105185" }}>Studio</span>
                        </Typography>

                        {/* <img src={tsa_logo} height="40" style={{ borderRadius: "5px", marginRight: "30px" }} /> */}

                        <Link to="/">
                            <img src={home} style={{ height: "35px", margin: "auto" }} />
                        </Link>
                    </Box>

                    <IconButton onClick={handleLogout}>
                        <img src={LogoutIcon} style={{ height: "35px", margin: "auto" }} />
                    </IconButton>
                    <Box sx={{ mx: 1 }}>
                        <UserMenu />
                    </Box>
                </div>
            </header>

            <Outlet />
        </div>
    );
};

export default Layout;

// import {AppBar, Box, Toolbar, Typography, IconButton } from '@mui/material';
// import { Outlet, NavLink, Link } from "react-router-dom";
// import tsa_logo from "../../assets/TSA-Logo-plate_v2.png"
// import axtria_logo from "../../assets/Axtria_Logo.png"

// const Layout = () => {

//   return (
//     <div>
//     <AppBar sx={{ bgcolor: '#212121'}} >
//         <Toolbar>
//         <Link to='/'>< img  src={axtria_logo} height='40' /></Link>
//         <Typography style={{paddingLeft: "35%"}} sx={{flexGrow: 1 }}>Axtria OpenAI</Typography>
//       < img src={tsa_logo} height='40' style={{borderRadius: "5px"}} />
//         </Toolbar>
//     </AppBar>
//     <Outlet />
//     </div>

//   )
// }

// export default Layout;
