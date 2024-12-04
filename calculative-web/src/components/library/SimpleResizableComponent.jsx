import React, { useRef, useState,useEffect } from 'react';
import { Box, IconButton, Popper } from '@mui/material';
import { ResizableBox } from 'react-resizable';
import Draggable from 'react-draggable';
import 'react-resizable/css/styles.css';
import DeviceUtils from '../../utils/DeviceUtils';

const SimpleResizableComponent = ({ handleClose, title, children, anchorEl, id }) => {
  const nodeRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const isDesktop = DeviceUtils.isDesktopOS();


  return (
    <Popper
      id={id}
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      placement="bottom-start"
      modifiers={[
        {
          name: "offset",
          options: {
            offset: [0, 10], // Adjust the offset to make the popper closer to the icon
          },
        },
      ]}
      className="z-index-subscreen" 
    >
      <Draggable
        nodeRef={nodeRef}
        handle=".drag-handle"
        onStart={() => setIsDragging(true)}
        onStop={() => setIsDragging(false)}
      >
        <div ref={nodeRef} style={{ width: 'fit-content', height: 'fit-content' }}>
          {isDesktop ? (
            <ResizableBox
              width={340}
              height={180}
              minConstraints={[200, 200]}
              maxConstraints={[600, 600]}
              onResizeStart={() => setIsResizing(true)}
              onResizeStop={() => setIsResizing(false)}
              style={{ border: '1px solid #ddd', backgroundColor: '#f7f7f7', color: '#333' }}
            >
              <Box display="flex" flexDirection="column" width="100%" height="100%">
                <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ backgroundColor: '#f7f7f7', padding: '5px 10px' }}>
                  <Box className="drag-handle" sx={{ cursor: 'move', flexGrow: 1 }}>
                    <h3 style={{ margin: 0, fontSize: '1.25rem' }}>{title}</h3>
                  </Box>
                  <IconButton onClick={handleClose} sx={{ position: 'absolute', top: 5, right: 5 }}>
                    <span>&times;</span>
                  </IconButton>
                </Box>
                <Box flexGrow={1} overflow="auto" p={1} mt={0}>
                  {children}
                </Box>
              </Box>
            </ResizableBox>
          ) : (
            <Box display="flex" flexDirection="column" width={300} height={400} style={{ border: '1px solid #ddd', backgroundColor: '#f7f7f7', color: '#333' }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ backgroundColor: '#e0e0e0', padding: '5px 10px' }}>
                <Box className="drag-handle" sx={{ cursor: 'move', flexGrow: 1 }}>
                  <h3 style={{ margin: 0, fontSize: '1.25rem' }}>{title}</h3>
                </Box>
                <IconButton onClick={handleClose} sx={{ position: 'absolute', top: 5, right: 5 }}>
                  <span>&times;</span>
                </IconButton>
              </Box>
              <Box flexGrow={1} overflow="auto" p={1} mt={0}>
                {children}
              </Box>
            </Box>
          )}
        </div>
      </Draggable>
    </Popper>
  );
};

export default SimpleResizableComponent;