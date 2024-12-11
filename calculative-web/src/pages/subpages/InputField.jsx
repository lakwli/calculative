import React, { useState, useRef, useEffect } from "react";
import { TextField, Box, Button } from "@mui/material";

import {
  FormControl,
  MenuItem,
  Select,
  InputLabel,
  Typography,
  Paper,
  IconButton,
} from "@mui/material";

import Grid from "@mui/material/Grid2";
import {
  MoneyFormatCustom,
  PercentageFormatCustom,
  Number2DigitFormatCustom,
} from "../../components/library/CompFormat";
import ReturnTypeCard from "../../components/ReturnTypeCard";
import IncomeDataInput from "../../components/IncomeDataInput";
import IncomeSummary from "../../components/IncomeSummary";
import Badge from "@mui/material/Badge";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { useSimul } from "../../contexts/SimulContext";
import {
  getWithdrawStartAgeOptions,
  WITHDRAW_START_AGE_OPTIONS,
  withdrawStartAgeOptionsMapping,
  withdrawStartAgeMessagesMapping,
} from "../../models/Constants";
import buttonStyles from "../../styles/buttonStyles";
import { useTranslation } from "react-i18next";
import SimpleResizableComponent from "../../components/library/SimpleResizableComponent";
import CustomTextField from "../../styles/textfieldStyles";
import { CustomsButton } from "../../styles/buttonStyles";

function InputField() {
  const { t } = useTranslation();
  const { simul, setSimul } = useSimul();
  const [openIncomeModal, setOpenIncomeModal] = useState(false);
  const [showIncomeSummary, setShowIncomeSummary] = useState(false);
  const [selectedIncomeId, setSelectedIncomeId] = useState(null); // Add
  const incomeBadgeRef = useRef(null);

  const handleIncomeBadgeClick = () => {
    //setAnchorElInc(anchorElInc ? null : event.currentTarget);
    const popperElement = document.getElementById("income-summary-popper");
    // console.log("popperElement", popperElement);
    setShowIncomeSummary(!showIncomeSummary); // Ensure the summary screen is shown

    // Control visibility using the ID
    //const popperElement = document.getElementById("income-summary-popper");
    if (popperElement) {
      popperElement.style.display = showIncomeSummary ? "none" : "block";
    }
  };

  const handleIncomeSummaryClose = (event) => {
    //setAnchorElInc(anchorElInc ? null : event.currentTarget);
    setShowIncomeSummary(false);

    // Control visibility using the ID
    const popperElement = document.getElementById("income-summary-popper");
    if (popperElement) {
      popperElement.style.display = "none";
    }
  };

  const handleOpenIncomeForUpdateModal = (incomeId) => {
    setSelectedIncomeId(incomeId);
    setOpenIncomeModal(true); // Open IncomeDataInput in edit mode
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setSimul({
      ...simul,
      [name]: value,
    });
  };

  const handleOpenIncomeForAddModal = () => {
    setSelectedIncomeId(null);
    setOpenIncomeModal(true);
  };

  const handleCloseIncomeModal = () => {
    setOpenIncomeModal(false);
  };

  return (
    <Box sx={{ mt: 1 }}>
      <Grid container spacing={2} sx={{ mt: 2, mb: 3 }}>
        <Grid size={{ xs: 12, sm: 12, md: 2 }}>
          <CustomTextField
            clearable
            id="age"
            label={t("labels.planStartAge")}
            type="number"
            fullWidth
            value={simul.age}
            onChange={handleChange}
            slotProps={{
              input: {
                inputComponent: Number2DigitFormatCustom,
                inputProps: { name: "age", style: { textAlign: "right" } },
              },
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 12, md: 3.3 }}>
          <CustomTextField
            clearable
            id="initialCapital"
            label="Initial Capital"
            fullWidth
            value={simul.initialCapital}
            onChange={handleChange}
            slotProps={{
              input: {
                inputComponent: MoneyFormatCustom,
                inputProps: {
                  name: "initialCapital",
                  style: { textAlign: "right" },
                },
              },
            }}
            sx={{ mt: { xs: 2, sm: 0 } }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 12, md: 3.7 }} sx={{ mt: 0, mb: 0 }}>
          <Paper
            variant="elevation"
            sx={{
              display: "flex",
              alignItems: "center",
              flexDirection: { xs: "column", sm: "row" },
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
              <FormControl
                sx={{
                  flex: simul.withdrawAgeOption === "L" ? 7 : 1,
                  minWidth: 150,
                }}
              >
                <InputLabel>{t("labels.withdrwalStartAge")}</InputLabel>
                <Select
                  labelId="withdrawAge-label"
                  id="withdrawAge-option"
                  value={simul.withdrawAgeOption}
                  onChange={handleChange}
                  name="withdrawAgeOption"
                  renderValue={(selected) =>
                    t(withdrawStartAgeOptionsMapping[selected])
                  }
                >
                  {getWithdrawStartAgeOptions(t).map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      <Box>
                        {option.label}
                        <Typography variant="caption" display="block">
                          {t(withdrawStartAgeMessagesMapping[option.value])}
                        </Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {simul.withdrawAgeOption ===
                WITHDRAW_START_AGE_OPTIONS.LATER_AGE && (
                <CustomTextField
                  id="withdrawAge"
                  label={t("labels.withdrawAge")}
                  value={simul.withdrawAge}
                  onChange={handleChange}
                  name="withdrawAge"
                  slotProps={{
                    input: {
                      inputComponent: Number2DigitFormatCustom,
                      inputProps: {
                        name: "withdrawAge",
                        style: { textAlign: "right" }, // Align text to the right
                      },
                    },
                  }}
                  sx={{
                    flex: 3,
                    ml: 0, // Remove margin-left to ensure no gap
                    "& .MuiOutlinedInput-root": {
                      borderTopLeftRadius: 0,
                      borderBottomLeftRadius: 0,
                    },
                  }}
                />
              )}
            </Box>
          </Paper>
        </Grid>

        {simul.withdrawAgeOption !==
          WITHDRAW_START_AGE_OPTIONS.NO_WITHDRAWALS && (
          <Grid size={{ xs: 12, sm: 12, md: 1.7 }}>
            <CustomTextField
              clearable
              id="yearlyWithdraw"
              label="Yearly Withdraw"
              fullWidth
              value={simul.yearlyWithdraw}
              onChange={handleChange}
              slotProps={{
                input: {
                  inputComponent: MoneyFormatCustom,
                  inputProps: {
                    name: "yearlyWithdraw",
                    style: { textAlign: "right" },
                  },
                },
              }}
            />
          </Grid>
        )}
        <Grid size={{ xs: 12, sm: 12, md: "grow" }}>
          <CustomTextField
            id="inflation"
            label="Inflation"
            fullWidth
            value={simul.inflation}
            onChange={handleChange}
            slotProps={{
              input: {
                inputComponent: PercentageFormatCustom,
                inputProps: {
                  name: "inflation",
                  style: { textAlign: "right" },
                },
              },
            }}
          />
        </Grid>
      </Grid>

      {/* Second Card */}
      <Grid container spacing={2}>
        <Grid size={12}>
          <ReturnTypeCard />
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid size={6}>
          <Box
            sx={{
              mt: 1,
              mb: 1,
              display: "flex",
              alignItems: "center", // Ensure items are aligned vertically
              justifyContent: "flex-start",
              position: "relative",
            }}
          >
            <CustomsButton
              variant="text"
              sx={{
                ...buttonStyles.default,
                ...buttonStyles.hover,
              }}
              onClick={handleOpenIncomeForAddModal}
            >
              {t("buttons.addIncome")}
            </CustomsButton>
            {simul.incomes.length > 0 && (
              <IconButton
                name="incomeBadgeIcon"
                onClick={handleIncomeBadgeClick}
                ref={incomeBadgeRef}
              >
                <Badge
                  badgeContent={simul.incomes.length}
                  name="incomeBadge"
                  color="primary"
                  sx={{
                    ml: 1,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <AttachMoneyIcon />
                </Badge>
              </IconButton>
            )}
            {simul.incomes.length > 0 && (
              <SimpleResizableComponent
                handleClose={handleIncomeSummaryClose}
                title={t("titles.incomeSummary")}
                //anchorEl={anchorElInc}
                anchorEl={incomeBadgeRef.current}
                id="income-summary-popper"
              >
                <IncomeSummary onIncomeClick={handleOpenIncomeForUpdateModal} />
              </SimpleResizableComponent>
            )}
          </Box>
        </Grid>
      </Grid>

      {/* Income Data Input Modal */}
      <IncomeDataInput
        open={openIncomeModal}
        incomeId={selectedIncomeId}
        handleClose={handleCloseIncomeModal}
      />
    </Box>
  );
}

export default InputField;
