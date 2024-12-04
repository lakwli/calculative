import { createTheme } from '@mui/material/styles';

const commonTextFieldStyles = {
  variant: 'outlined',
  fullWidth: true,
  size: 'small',
};


const commonSelectStyles = {
  variant: 'outlined', // Ensure this is set to 'filled'
  fullWidth: true,
  size: 'small',
};

const commonComponents = {
  MuiTextField: {
    defaultProps: commonTextFieldStyles,
    /**
    styleOverrides: {
      root: {
        '& .MuiInputBase-root': {
          fontSize: '0.95rem', // Adjust font size
          padding: '4px 8px', // Adjust padding
          height: '30px',
        },
      },
    }, */
  },
  /**
  MuiInputLabel: {
    styleOverrides: {
      outlined: {
        transform: 'translate(14px, 5px) scale(1)', // Adjust the label position
        '&.MuiInputLabel-shrink': {
          transform: 'translate(14px, -11px) scale(0.75)', // Adjust the label position when shrunk
        },
      },
    },
  },*/
  MuiSelect: {
    defaultProps: commonSelectStyles,
    /**
    styleOverrides: {
      root: {
        '& .MuiInputBase-root': {
          fontSize: '0.95rem', // Adjust font size
          padding: '4px 8px', // Adjust padding
          height: '30px', // Adjust height
        },
      },
    },*/
  },
  /**
  MuiOutlinedInput: {
    styleOverrides: {
      input: {
        padding: '4px 8px', // Adjust padding
        height: '30px', // Adjust height
        fontSize: '0.95rem', // Adjust font size
      },
    },
  },*/
};

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    error: {
      main: '#d32f2f', // Error color
    },
    text: {
      primary: '#000000', // Black for light mode
      secondary: '#333333', // Dark grey for light mode
    },
  },
  typography: {
    h1: {
      color: '#000000', // Black for light mode
    },
    h2: {
      color: '#333333', // Dark grey for light mode
    },
  },
  components:  commonComponents,
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
    },
    secondary: {
      main: '#f48fb1',
    },
    error: {
      main: '#f44336', // Error color
    },
    text: {
      primary: '#ffffff', // White for dark mode
      secondary: '#cccccc', // Light grey for dark mode
    },
  },
  typography: {
    h1: {
      color: '#ffffff', // White for dark mode
    },
    h2: {
      color: '#cccccc', // Light grey for dark mode
    },
  },
  components:  commonComponents,
});
