// tableStyles.js
import { useTheme } from '@mui/material/styles';

export const useTableStyles = () => {
  const theme = useTheme();
  return {
    headerRow: {
      backgroundColor: theme.palette.mode === 'light' ? '#f0f0f0' : '#424242',
    },
    cell: {
      color: theme.palette.mode === 'light' ? '#000' : '#fff',
      backgroundColor: theme.palette.mode === 'light' ? '#fff' : '#333', // Adjust background color for better contrast
    },
  };
};

//use in portfolio table
export const useRowStyles = () => {
  const theme = useTheme();
  return {
    evenRow: {
      backgroundColor: theme.palette.mode === 'light' ? '#f9f9f9' : '#424242', // Light grey for light theme, dark grey for dark theme
      borderBottom: `1px solid ${theme.palette.divider}`, // Add border between rows
    },
    oddRow: {
      backgroundColor: theme.palette.mode === 'light' ? '#ffffff' : '#303030', // White for light theme, darker grey for dark theme
      borderBottom: `1px solid ${theme.palette.divider}`, // Add border between rows
    },
    rowHover: {
      '&:hover': {
        backgroundColor: theme.palette.mode === 'light' ? '#e0e0e0' : '#505050', // More contrasting hover color
      },
    },
  };
};