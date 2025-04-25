import { styled } from '@mui/material/styles';
import MuiTextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import ClearIcon from '@mui/icons-material/Clear';
import { useIsSmOrSmaller } from '../utils/DeviceUtils'; // Import the utility function

export const CustomTextField = styled(({ clearable, showlabelifonlysm = "false", ...other }) => {
  const isSmOrSmaller = useIsSmOrSmaller();
  const { label, ...rest } = other;

  return (
    <MuiTextField
      {...rest}
      label={showlabelifonlysm === "true"? (isSmOrSmaller ? label : '') : label}
    />
  );
})(({ theme }) => ({
  '& .MuiInputBase-root': {
    height: '40px',
  },
  
  // Add specific styling for the calendar icon in dark mode
  '& input[type="date"]::-webkit-calendar-picker-indicator': {
    filter: theme.palette.mode === 'dark' ? 'invert(1)' : 'none'
  },
  
  '& .MuiSvgIcon-root': {
    color: theme.palette.text.primary
  },
  
  '& .MuiInputAdornment-root': {
    color: theme.palette.text.primary
  },
  
  '& .MuiIconButton-root': {
    color: theme.palette.text.primary
  },

  ...theme.components?.CustomTextField?.styleOverrides
}));

export default CustomTextField;