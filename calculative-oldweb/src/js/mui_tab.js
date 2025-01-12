import React from 'react';
import ReactDOM from 'react-dom';
import { Tabs, Tab, Box, Typography, TabContext, TabList, TabPanel } from '@mui/material';

function MuiTabs() {
  const [value, setValue] = React.useState('1');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <TabContext value={value}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <TabList onChange={handleChange} aria-label="simple tabs example">
          <Tab label="Tab 1" value="1" />
        </TabList>
      </Box>
      <TabPanel value="1">
        <Typography>Tab 1 content</Typography>
      </TabPanel>
    </TabContext>
  );
}

ReactDOM.render(<MuiTabs />, document.getElementById('root'));
