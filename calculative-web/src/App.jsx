import React, { useState } from 'react';
import { ThemeProvider, CssBaseline, Container, IconButton, Box } from '@mui/material';
import { lightTheme, darkTheme } from './theme/theme'; // Import the themes from theme.js
import RetirementSimulation from './pages/RetirementSimulation'; // Corrected import path for RetirementSimulation
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import Brightness2Icon from '@mui/icons-material/Brightness2';
import './styles/App.css';

function App() {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <Container className="App">
        <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
          <h1 style={{ margin: 0 }}>CashFlow Simulation 3</h1>
          <IconButton onClick={toggleDarkMode} size="small" aria-label="toggle dark mode">
            {darkMode ? <Brightness2Icon /> : <WbSunnyIcon />}
          </IconButton>
        </Box>
         <RetirementSimulation/> 
        
       {/**<IncomeSummaryClient /> * 
        */}
      </Container>
    </ThemeProvider>
  );
}

{/**
        <RetirementSimulation/> */}

export default App;
