import React, { useEffect, useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { PrimaryButton, SecondaryButton,DestructivePrimaryButton } from '../../styles/buttonStyles'; // Import custom buttons

const ConfirmationDialog = ({
  open,
  onClose,
  title,
  message,
  primaryButtonLabel,
  secondaryButtonLabel,
  onPrimaryButtonClick,
  onSecondaryButtonClick,
  countdown = false, // New parameter to control countdown
  countdownTime = 5, // Default countdown time in seconds
  isPrimaryButtonNegative = false, 
}) => {
  const [timeLeft, setTimeLeft] = useState(countdownTime);

  useEffect(() => {
    if (countdown && open) {
      setTimeLeft(countdownTime);
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime === 1) {
            clearInterval(timer);
            onPrimaryButtonClick(); // Automatically click the primary button
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [countdown, open, countdownTime, onPrimaryButtonClick]);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>
        {message}
          {countdown && (
            <div>
              <span>{primaryButtonLabel} in </span>
              <span style={{ 
                color: isPrimaryButtonNegative ? 'red' : 'blue', 
                textDecoration: 'underline', 
                fontSize: '1.2em' // Increase font size
              }}>
                {timeLeft}
              </span>
              <span> seconds...</span>
            </div>
          )}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <SecondaryButton onClick={onSecondaryButtonClick}>
          {secondaryButtonLabel}
        </SecondaryButton>
        {isPrimaryButtonNegative ? (
          <DestructivePrimaryButton onClick={onPrimaryButtonClick}>
            {primaryButtonLabel}
          </DestructivePrimaryButton>
        ) : (
          <PrimaryButton onClick={onPrimaryButtonClick}>
            {primaryButtonLabel}
          </PrimaryButton>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;