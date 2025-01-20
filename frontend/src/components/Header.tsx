import React from "react";
import { Box, Typography, IconButton } from "@mui/material";
import { FaCloud, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
    onLogout?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogout }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        if (onLogout) {
            onLogout();
        }
        localStorage.clear();
        navigate("/login");
    };

    return (
        <Box
            sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                p: 2,
                backgroundColor: "rgba(255, 255, 255, 0.6)",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                zIndex: 10,
            }}
        >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <FaCloud size={36} style={{ color: "#004c8c" }} />
                <Typography
                    variant="h4"
                    fontWeight="bold"
                    sx={{
                        fontFamily: "Poppins, sans-serif",
                        textShadow: "1px 1px 3px rgba(0, 0, 0, 0.3)",
                    }}
                >
                    CloudPulse
                </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center" }}>
                {/* Log Out IconButton */}
                <IconButton
                    onClick={handleLogout}
                    sx={{
                        backgroundColor: "rgba(255, 255, 255, 0.5)",
                        color: "#004c8c",
                        "&:hover": { backgroundColor: "#f44336", color: "#ffffff" },
                        borderRadius: "50%",
                        p: 1.5,
                        mr: 5,
                    }}
                >
                    <FaSignOutAlt size={24} />
                </IconButton>
            </Box>
        </Box>
    );
};

export default Header;