import React from "react";
import { Box, Typography, Stack, Container } from "@mui/material";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.svg";

const AppLayout = ({ children, routes }) => {
  return (
    <Box>
      <Box
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          bgcolor: "background.paper",
          position: "sticky",
          top: 0,
          zIndex: 1000,
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              py: 2,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <img src={logo} alt="Logo" style={{ height: "32px" }} />
              <Typography
                variant="h5"
                component="h1"
                sx={{
                  fontWeight: "bold",
                }}
              >
                Calculative
              </Typography>
            </Box>
            <Stack direction="row" spacing={2}>
              {routes.map((route) => (
                <Link
                  key={route.path}
                  to={route.path}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    sx={{
                      px: 2,
                      py: 1,
                      borderRadius: 1,
                      transition: "all 0.2s",
                      "&:hover": {
                        bgcolor: "action.hover",
                      },
                    }}
                  >
                    {route.icon}
                    <Typography sx={{ fontWeight: 500 }}>
                      {route.title}
                    </Typography>
                  </Stack>
                </Link>
              ))}
            </Stack>
          </Box>
        </Container>
      </Box>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {children}
      </Container>
    </Box>
  );
};

export default AppLayout;
