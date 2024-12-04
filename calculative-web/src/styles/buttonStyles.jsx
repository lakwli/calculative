import { styled } from '@mui/material/styles';
import MuiButton from '@mui/material/Button';

const buttonStyles = {
  default: {
    color: '#1976d2', // Medium blue text
  },
  hover: {
    '&:hover': {
      color: '#63a4ff', // Lighter blue text
    },
  },
};

export const PrimaryButton = styled(({ active, ...other }) => (
  <MuiButton variant="contained" {...other} />
))(({ theme, active = true }) => ({
  backgroundColor: active ? theme.palette.primary.main : 'grey', // Primary color if active, grey if not
  color: theme.palette.primary.contrastText,
  textTransform: 'none', // Use 'none' for mixed case or 'capitalize' for title case
  '&:hover': {
    backgroundColor: active ? theme.palette.primary.dark : 'grey', // Darker primary color on hover if active, grey if not
  },
}));

export const SecondaryButton = styled(({ active, ...other }) => (
  <MuiButton variant="outlined" {...other} />
))(({ theme, active = true }) => ({
  borderColor: active ? theme.palette.primary.main : 'grey', // Use theme secondary color if active, grey if not
  color: active ? theme.palette.primary.main : 'grey',
  textTransform: 'none',
  '&:hover': {
    backgroundColor: '#E3F2FD',
    //backgroundColor: active ? theme.palette.secondary.light : 'grey', // Light secondary color on hover if active, grey if not
  },
}));

export const DestructiveSecondaryButton = styled(({ ...other }) => (
  <MuiButton variant="outlined" {...other} />
))(({ theme }) => ({
  borderColor: theme.palette.error.main, // Use theme error color
  color: theme.palette.error.main, // Use theme error color for text
  textTransform: 'none', // Use 'none' for mixed case or 'capitalize' for title case
  '&:hover': {
    backgroundColor: theme.palette.error.light, // Light error color on hover
  },
}));

export const DestructivePrimaryButton = styled(({ ...other }) => (
  <MuiButton variant="contained" {...other} />
))(({ theme }) => ({
  backgroundColor: theme.palette.error.main, // Use theme error color
  color: theme.palette.error.contrastText,
  textTransform: 'none', // Use 'none' for mixed case or 'capitalize' for title case
  '&:hover': {
    backgroundColor: theme.palette.error.dark, // Darker error color on hover
  },
}));

export const CustomsButton = styled(({ ...other }) => (
  <MuiButton {...other} />
))(({ theme }) => ({
  textTransform: 'none', 
}));

export default buttonStyles;