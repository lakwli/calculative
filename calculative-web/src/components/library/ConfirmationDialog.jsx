import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

const ConfirmationDialog = ({
  open,
  onClose,
  title,
  message,
  primaryButtonLabel,
  secondaryButtonLabel,
  onPrimaryButtonClick,
  onSecondaryButtonClick,
  countdown,
  countdownTime,
  isPrimaryButtonNegative,
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <p>{message}</p>
      </DialogContent>
      <DialogActions>
        <Button onClick={onSecondaryButtonClick} color="primary">
          {secondaryButtonLabel}
        </Button>
        <Button
          onClick={onPrimaryButtonClick}
          color={isPrimaryButtonNegative ? 'secondary' : 'primary'}
        >
          {primaryButtonLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;