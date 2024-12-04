import { useTheme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';

const tabLabelStyles = {
  fontSize: '1rem', // Increase font size for prominence
  fontWeight: 500, // Example style
  color: 'inherit', // Inherit color from parent
  textTransform: 'none', // Prevent text from being converted to uppercase
};

const sectionTitleStyles = {
  fontSize: '1.25rem', // Larger font size for section title
  fontWeight: 600, // Bold weight for section title
  marginBottom: '1rem', // Space below the title
};

//use in portfolio Header
const useHeaderLabelStyles = () => {
  const theme = useTheme();
  return {
    fontSize: '1rem', // Example style for font size
    fontWeight: 'bold', // Bold font weight
    color: theme.palette.mode === 'light' ?  '#424242' : '#e0e0e0', // Grey color for light and dark themes
    textAlign: 'left', // Align text to the left
    padding: '8px 0', // Padding for spacing
  };
};

const useIncomeBoxLabelStyles = makeStyles((theme) => ({
  incomeBoxName: {
    //fontWeight: 'bold',
    fontSize: '0.8rem', // Slightly larger font size
    color: theme.palette.text.primary,
  },amountBoxName: {
    fontWeight: 'bold',
    fontSize: '1.2rem', // Slightly larger font size
    color: theme.palette.text.primary,
  },
}));


const controlLabelStyles = {
  fontSize: '0.930rem', // Smaller font size
  fontWeight: 'normal', // Normal font weight
};


export { tabLabelStyles, sectionTitleStyles,  useHeaderLabelStyles, useIncomeBoxLabelStyles,controlLabelStyles};