import { styled } from '@mui/material/styles';
import MuiTextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import ClearIcon from '@mui/icons-material/Clear';
import { useIsSmOrSmaller } from '../utils/DeviceUtils'; // Import the utility function

export const CustomTextField = styled(({ clearable, showlabelifonlysm = "false", ...other }) => {
  const isSmOrSmaller = useIsSmOrSmaller();

  // Filter out showLabelIfOnlySM prop
  const { label, ...rest } = other;

  return (
    <MuiTextField
      {...rest}
      label={showlabelifonlysm === "true"? (isSmOrSmaller ? label : '') : label}
     
    />
  );
})(({ theme }) => ({
  //'& .MuiInputBase-root': {
   // color: theme.palette.text.primary,
  //},
  //'& .MuiInputLabel-root': {
  //  color: theme.palette.text.secondary,
 // },
 // '& .MuiOutlinedInput-root': {
 //   '& fieldset': {
//      borderColor: theme.palette.primary.main,
 //   },
  //  '&:hover fieldset': {
 //     borderColor: theme.palette.primary.dark,
 //   },
 //   '&.Mui-focused fieldset': {
//      borderColor: theme.palette.primary.dark,
 //   },
  //},
}));

export default CustomTextField;