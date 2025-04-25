/**npm run dev*/
import React, { useState } from 'react';
import { ThemeProvider, CssBaseline, Container, IconButton, Box } from '@mui/material';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { lightTheme, darkTheme } from './theme/theme';
import RetirementSimulation from './pages/RetirementSimulation';
import IrrCal from './pages/IrrCal';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import Brightness2Icon from '@mui/icons-material/Brightness2';
import './styles/App.css';
import AppLayout from './components/layouts/AppLayout';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import CalculateIcon from '@mui/icons-material/Calculate';
import SavingsOutlinedIcon from '@mui/icons-material/SavingsOutlined';
import CalculateOutlinedIcon from '@mui/icons-material/CalculateOutlined';
import BatteryCharging80Icon from '@mui/icons-material/BatteryCharging80';
import KeyboardControlKeyIcon from '@mui/icons-material/KeyboardControlKey';

function App() {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const routes = [
    {
      path: "/retirement",
      element: <RetirementSimulation />,
      icon: <BatteryCharging80Icon />,
      title: "Save&Spend"
    },
    {
      path: "/irr",
      element: <IrrCal />,
      icon: <KeyboardControlKeyIcon />,
      title: "Fund&Return"
    }
  ];

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <Box sx={{ 
        minHeight: '100vh',
        bgcolor: 'background.default',
      }}>
        <BrowserRouter future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true
        }}>
          <IconButton 
            onClick={toggleDarkMode} 
            size="small"
            sx={{
              position: 'fixed',
              top: 16,
              right: 16,
              zIndex: 1200,
              padding: '4px',
              backgroundColor: theme => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
              backdropFilter: 'blur(10px)',
              '&:hover': {
                backgroundColor: theme => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)',
              }
            }}
          >
            {darkMode ? 
              <Brightness2Icon sx={{ fontSize: '1.2rem' }} /> : 
              <WbSunnyIcon sx={{ fontSize: '1.2rem' }} />
            }
          </IconButton>
          <AppLayout routes={routes}>
            <Routes>
              {routes.map(route => (
                <Route 
                  key={route.path} 
                  path={route.path} 
                  element={route.element} 
                />
              ))}
              <Route path="/" element={routes[0].element} />
            </Routes>
          </AppLayout>
        </BrowserRouter>
      </Box>
    </ThemeProvider>
  );
}
export default App;