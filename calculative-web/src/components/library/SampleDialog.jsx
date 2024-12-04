import { makeStyles } from "@mui/styles";
import React , { useState } from "react";
import Draggable from "react-draggable";
import { ResizableBox } from "react-resizable";
import {
  Button,
  TextField,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  DialogContentText,
  Box,
  IconButton,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import CloseIcon from "@mui/icons-material/Close";

const useStyles = makeStyles((theme) => ({
  resizable: {
    position: "relative",
    "& .react-resizable-handle": {
      position: "absolute",
      width: 20,
      height: 20,
      bottom: 0,
      right: 0,
      background:
        "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2IDYiIHN0eWxlPSJiYWNrZ3JvdW5kLWNvbG9yOiNmZmZmZmYwMCIgeD0iMHB4IiB5PSIwcHgiIHdpZHRoPSI2cHgiIGhlaWdodD0iNnB4Ij48ZyBvcGFjaXR5PSIwLjMwMiI+PHBhdGggZD0iTSA2IDYgTCAwIDYgTCAwIDQuMiBMIDQgNC4yIEwgNC4yIDQuMiBMIDQuMiAwIEwgNiAwIEwgNiA2IEwgNiA2IFoiIGZpbGw9IiMwMDAwMDAiLz48L2c+PC9zdmc+')",
      "background-position": "bottom right",
      padding: "0 3px 3px 0",
      "background-repeat": "no-repeat",
      "background-origin": "content-box",
      "box-sizing": "border-box",
      cursor: "se-resize",
    },
  },
}));

const PaperComponent = (props) => {
  return (
    <Draggable
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} />
    </Draggable>
  );
};

export const DialogComponent = ({
  handleClose,
  title,
  children,
  anchorEl,
  id,
  homeRef,
}) => {
  const classes = useStyles();
  const [isHome, setIsHome] = useState(false);

  const handleHomeClick = () => {
    setIsHome(!isHome);
  };

  return (
    <div>
      <Dialog
        id={id}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        maxWidth={false}
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
        style={{ border: '3px solid #ddd', color: 'red'}}
        backgroundColor="red"
      >
        <ResizableBox 
         width={isHome ? homeRef.current.offsetWidth : 600}
         height={isHome ? homeRef.current.offsetHeight : 400}
         minConstraints={[200, 200]}
         maxConstraints={[800, 800]}
         BackdropProps={{ style: { backgroundColor: 'transparent' } }} // Make the backdrop transparent
   
         className={classes.resizable}>
          <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              {title}
              <Box>
            <IconButton onClick={handleHomeClick}>
              <HomeIcon />
            </IconButton>
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Box>
            </Box>
          </DialogTitle>

          <DialogContent>
            {/**<DialogContentText/>*/}

            {children}
          </DialogContent>

          {/** <DialogActions/>*/}
        </ResizableBox>
      </Dialog>
    </div>
  );
};
