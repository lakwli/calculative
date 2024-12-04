import React from 'react';
import { Tooltip, IconButton } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import { useIsMobile } from '../../utils/DeviceUtils';

const MobileTooltip = ({ title }) => {
    const isMobile = useIsMobile();
  
    return isMobile ? (
      <Tooltip 
        title={title}
        enterTouchDelay={0} // Show tooltip immediately on touch
        leaveTouchDelay={3000} // Keep tooltip visible for 3 seconds after touch
      >
        <IconButton>
          <InfoIcon />
        </IconButton>
      </Tooltip>
    ) : null;
  };

export default MobileTooltip;