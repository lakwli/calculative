import React, { useState, useEffect } from "react";
import {
  TextField,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  IconButton,
} from "@mui/material";
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Popper,
  Paper,
  Typography,
  Portal,
  Dialog,
  Box,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import { Number2DigitFormatCustom } from "./library/CompFormat";
import Grid from "@mui/material/Grid2";
import { useTheme } from "@mui/material";
import { useTableStyles } from "../styles/tableStyles"; // Import the useTableStyles function
import {
  PENSION_WITHDRAW_OPTION,
  getPensionWithdrawOptions,
} from "../models/Constants";
import { useTranslation } from "react-i18next";

const WithdrawAgeInput = ({ withdrawAge, updateWithdrawalAgeFunc, style }) => {
  const { t } = useTranslation();
  const [withdrawalOption, setWithdrawalOption] = useState(
    withdrawAge ? PENSION_WITHDRAW_OPTION.UPON : PENSION_WITHDRAW_OPTION.NOW
  );

  const [anchorEl, setAnchorEl] = useState(null);
  const [showMore, setShowMore] = useState(false);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const open = Boolean(anchorEl) && (tooltipVisible || showMore);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        anchorEl &&
        !anchorEl.contains(event.target) &&
        !event.target.closest(".MuiPopper-root")
      ) {
        setAnchorEl(null);
        setShowMore(false);
        setTooltipVisible(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [anchorEl]);

  const handleMouseEnter = (event) => {
    if (!showMore) {
      setTooltipVisible(true);
      setAnchorEl(event.currentTarget);
    }
  };

  const handleMouseLeave = () => {
    if (!showMore) {
      setTooltipVisible(false);
      setAnchorEl(null);
    }
  };

  const handleTooltipClick = (event) => {
    event.stopPropagation();
    if (showMore) {
      setAnchorEl(null);
      setShowMore(false);
      setTooltipVisible(false);
    } else {
      setAnchorEl(event.currentTarget);
      setShowMore(true);
      setTooltipVisible(true);
    }
  };

  const handleWithdrawalOptionChange = (e) => {
    const newOption = e.target.value;
    setWithdrawalOption(newOption);
    if (newOption === "now") {
      updateWithdrawalAgeFunc(""); // Set the age to blank
    }
  };

  const handleWithdrawAgeChange = (e) => {
    updateWithdrawalAgeFunc(e.target.value); // Only pass the value
  };

  const theme = useTheme(); // Use the theme hook to access the current theme
  const styles = useTableStyles(); // Use the useTableStyles function
  return (
    <Grid container spacing={0} style={style} size={{ xs: 12, sm: 6, md:6 }}>
      <Grid size={{ xs: 12, sm:withdrawalOption === PENSION_WITHDRAW_OPTION.UPON ? 6 : 12  , md: withdrawalOption === PENSION_WITHDRAW_OPTION.UPON ? 6 : 12 }}>
        <FormControl fullWidth>
          <InputLabel id="withdrawal-label">
            {t("labels.pensionWithdrawAge")}
          </InputLabel>
          <Select
            value={withdrawalOption}
            onChange={handleWithdrawalOptionChange}
            label="Withdrawable"
            renderValue={(selected) => (
              <div>
                {selected === PENSION_WITHDRAW_OPTION.NOW
                  ? t("pensionWithdrawOption.now")
                  : selected === PENSION_WITHDRAW_OPTION.WITHDRAW_AGE
                  ? t("pensionWithdrawOption.withdrawAge")
                  : t("pensionWithdrawOption.upon")}
              </div>
            )}
          >
            {getPensionWithdrawOptions(t).map((option) => (
              <MenuItem key={option.value} value={option.value}>
                <div>
                  {option.label}
                  
                  <Typography variant="caption" display="block">
                    {t(`pensionWithdrawOptionDescription.${option.value}`)}
                  </Typography>
                   
                </div>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      {withdrawalOption === PENSION_WITHDRAW_OPTION.UPON && (
        <Grid size={{ xs: 12, sm: withdrawalOption === PENSION_WITHDRAW_OPTION.UPON ? 6 : 12 , md: withdrawalOption === PENSION_WITHDRAW_OPTION.UPON ? 6 : 12 }}>
          <TextField
            fullWidth
            label={t("labels.age")}
            value={withdrawAge}
            onChange={handleWithdrawAgeChange} // Make sure to use the correct handler
            style={{ display: "block" }}
            slotProps={{
              input: {
                inputComponent: Number2DigitFormatCustom,
                inputProps: {
                  name: "withdrawAge",
                  style: { textAlign: "right" },
                },
                endAdornment: (
                  <IconButton
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    onClick={handleTooltipClick}
                    style={{ color: showMore ? "grey" : "inherit" }}
                  >
                    <InfoIcon />
                  </IconButton>
                ),
              },
            }}
          />
        </Grid>
      )}

      <Portal>
        <Popper
          open={open}
          anchorEl={anchorEl}
          placement="auto"
          style={{ zIndex: 9999, position: "fixed" }}
        >
          <Paper
            sx={{
              p: 2,
              maxWidth: 300,
              fontSize: "12px",
              borderRadius: "8px",
              backdropFilter: "blur(5px)",
              backgroundColor:
                theme.palette.mode === "light"
                  ? "rgba(0, 0, 0, 0.8)"
                  : "rgba(255, 255, 255, 0.8)",
              color: theme.palette.mode === "light" ? "#fff" : "#000",
            }}
          >
            <Typography variant="body2" sx={{ mt: 1 }}>
              Pension fund will not involved in withdrawals or rebalancing until
              this age.
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Mainly for whom:
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              <b>Retire Early</b>: Rely on other funds for withdrawal before
              this age.
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              <b>Plan for future retirement</b>: for wealth accumulation with contribution into this fund.
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Fund continue grow from interest and contribution
            </Typography>
            <Typography
              variant="caption"
              sx={{
                mt: 1,
                display: "block",
                fontStyle: "italic",
                color: "gray",
              }}
            >
              {showMore
                ? "Click button again to close"
                : "Click button for more"}
            </Typography>
            {showMore && (
              <Box>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Below is an example of a user having 3 funds and choosing to
                  rebalance yearly.
                </Typography>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={styles.headerRow}>
                        <TableCell sx={styles.cell}>Fund</TableCell>
                        <TableCell sx={styles.cell}>Allocation</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell sx={styles.cell}>
                          Pension Fund, Eligible Age: 56
                        </TableCell>
                        <TableCell sx={styles.cell}>50%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={styles.cell}>
                          <i>Fund B</i>
                        </TableCell>
                        <TableCell sx={styles.cell}>30%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={styles.cell}>
                          <i>Fund C</i>
                        </TableCell>
                        <TableCell sx={styles.cell}>20%</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Based on the above example:
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Until age <b>55</b>, withdrawals and rebalancing will only
                  apply to <i>Fund B</i> and <i>Fund C</i>. The target
                  allocation ratio for Fund B and Fund C would be 60/40, align
                  with their original ratio of 30/20 when with Fund A.
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Upon reaching age <b>56</b>, withdrawals and rebalancing will
                  apply to all three funds with a target allocation ratio of
                  50/30/20.
                </Typography>
              </Box>
            )}
          </Paper>
        </Popper>
      </Portal>
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>More Information</DialogTitle>
        <DialogContent>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Fund</TableCell>
                  <TableCell>Allocation Age 50</TableCell>
                  <TableCell>Allocation Age 56</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>Pension Fund, eligible 56 years old</TableCell>
                  <TableCell>30%</TableCell>
                  <TableCell>45%</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Fund B</TableCell>
                  <TableCell>30%</TableCell>
                  <TableCell>25%</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Fund C</TableCell>
                  <TableCell>20%</TableCell>
                  <TableCell>30%</TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Other funds will be rebalanced according to your allocation
              settings.
            </Typography>
          </TableContainer>
        </DialogContent>
      </Dialog>
    </Grid>
  );
};

export default WithdrawAgeInput;
