import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Modal,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
  Switch,
  FormHelperText,
  FormControl,
  Typography,
  MenuItem,
  Select,
  InputLabel,
  Paper,
  Autocomplete,
} from "@mui/material";
import { Close as CloseIcon, Delete as DeleteIcon } from "@mui/icons-material";
import Grid from "@mui/material/Grid2";
import { v4 as uuidv4 } from "uuid";
import { useSimul } from "../contexts/SimulContext";
import Income from "../models/Income";
import { useTranslation } from "react-i18next";
import {
  getIncomeEndAgeOptions,
  INCOME_END_AGE_OPTIONS,
  getIncomeAmountTypes,
  INCOME_AMOUNT_TYPES,
  getIncomeStartOptions,
  INCOME_START_OPTIONS,
  RETURN_TYPES,
  FUND_TYPES,
  indexOptionsMapping,
} from "../models/Constants";
import {
  MoneyFormatCustom,
  PercentageFormatCustom,
  Number2DigitFormatCustom,
} from "./library/CompFormat";
import DatetimeUtils from "../utils/DateTimeUtils";
import { makeStyles } from "@mui/styles";
import {
  PrimaryButton,
  SecondaryButton,
  DestructiveSecondaryButton,
} from "../styles/buttonStyles";
import ConfirmationDialog from "./library/ConfirmationDialog";
import SaveIcon from "@mui/icons-material/Save";
import DoneOutlineIcon from "@mui/icons-material/DoneOutline";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import AddIcon from "@mui/icons-material/Add";
import PlusOneIcon from "@mui/icons-material/PlusOne";
import incomeTerms from '../data/incomeTerms.jsx';


const IncomeDataInput = ({ open, handleClose, incomeId }) => {
  const { simul, setSimul } = useSimul();
  const [incomeData, setIncomeData] = useState(new Income());
  const [confirmDialog4CloseOpen, setConfirmDialog4CloseOpen] = useState(false); // Track confirmation dialog state
  const [confirmDialog4DeleteOpen, setConfirmDialog4DeleteOpen] = useState(false);

  const [unsavedChanges, setUnsavedChanges] = useState(false); // Track unsaved changes
  const { t } = useTranslation();
  

  useEffect(() => {
    if (open) {
      if (incomeId) {
        const income = simul.incomes.find((inc) => inc.id === incomeId);
        if (income) {
          setIncomeData(income);
        }
      } else {
        const newIncomeData = new Income(); // Create a new instance
        setIncomeData(newIncomeData); // Set it in state
      }
      setUnsavedChanges(false); // Reset unsaved changes
    }
  }, [open, incomeId, simul.incomes]);

  const handleSaveIncome = () => {
    // Update the specific income data
    const updatedIncomes = simul.incomes.map((inc) =>
      inc.id === incomeId ? incomeData : inc
    );
    setSimul({ ...simul, incomes: updatedIncomes });
    setUnsavedChanges(false); // Reset unsaved changes
    handleClose();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setIncomeData((prev) => ({ ...prev, [name]: value }));
    setUnsavedChanges(true); // Set unsaved changes
  };

  const handleAmountTypeChange = (event, newAmountType) => {
    if (newAmountType !== null) {
      setIncomeData((prev) => ({ ...prev, amountType: newAmountType }));
      setUnsavedChanges(true); // Set unsaved changes
    }
  };

  const handleStartAgeOptionChange = (event) => {
    const value = event.target.value;
    setIncomeData((prev) => ({
      ...prev,
      startAgeOption: value,
      amountType: value === "starting" ? "today" : prev.amountType,
    }));
    setUnsavedChanges(true); // Set unsaved changes
  };

  const handleEndAgeOptionChange = (event) => {
    setIncomeData((prev) => ({ ...prev, endAgeOption: event.target.value }));
    setUnsavedChanges(true); // Set unsaved changes
  };

  const handleAddIncome = () => {
    const sequenceNumber = DatetimeUtils.generateSequenceNumber();
    const newIncomeData = {
      ...incomeData,
      id: uuidv4(),
      sequenceNumberCreate: sequenceNumber,
      sequenceNumberUpdate: sequenceNumber,
    }; // Generate a unique ID
    const updatedIncomes = [...simul.incomes, newIncomeData];

    setSimul({ ...simul, incomes: updatedIncomes });
    setUnsavedChanges(false); // Reset unsaved changes
    handleClose(); // No need to reset `incomeData` here
  };

  const handleAddIncomeAndNext = () => {
    const sequenceNumber = DatetimeUtils.generateSequenceNumber();
    const newIncomeData = {
      ...incomeData,
      id: uuidv4(),
      sequenceNumberCreate: sequenceNumber,
      sequenceNumberUpdate: sequenceNumber,
    }; // Generate a unique ID
    const updatedIncomes = [...simul.incomes, newIncomeData];

    setSimul({ ...simul, incomes: updatedIncomes });
    setUnsavedChanges(false); // Reset unsaved changes

    const nextIncomeData = new Income(); // Create a new instance
    setIncomeData(nextIncomeData);
  };
  const handleDeleteButtonClick = () => {
    setConfirmDialog4DeleteOpen(true);
  };

  const handleDeleteIncome = () => {
    // Delete income logic
    const updatedIncomes = simul.incomes.filter((inc) => inc.id !== incomeId);
    setSimul({ ...simul, incomes: updatedIncomes });
    handleClose();
  };
  const shouldDisplayGrowthRate =
    incomeData.endAgeOption !== INCOME_END_AGE_OPTIONS.ONETIME ||
    (incomeData.endAgeOption === INCOME_END_AGE_OPTIONS.ONETIME &&
      incomeData.startAgeOption === INCOME_START_OPTIONS.STARTING_LATER &&
      incomeData.amountType === INCOME_AMOUNT_TYPES.TODAY_ADJUST_GROWTH);

  const shouldDisplayGrowthRateHelperText = !(
    incomeData.startAgeOption === INCOME_START_OPTIONS.STARTING_LATER &&
    incomeData.endAgeOption === INCOME_END_AGE_OPTIONS.ONETIME
  );
  const shouldDisplayCustomGrowthRate =
    incomeData.startAgeOption === INCOME_START_OPTIONS.STARTING_LATER &&
    incomeData.endAgeOption === INCOME_END_AGE_OPTIONS.ONETIME;

  const getFundLabel = (fund, index) => {
    if (!fund.fundType) {
      return `<${index + 1} fund>`;
    }
    switch (fund.fundType) {
      case FUND_TYPES.PENSION:
        return t("fundTypeOptions.pension");
      case FUND_TYPES.CASH:
        return t("fundTypeOptions.cash");
      case FUND_TYPES.MARKET:
        return t(indexOptionsMapping[fund.index]) || `${index + 1}`;
      case FUND_TYPES.TICKER:
        return fund.ticker || `${index + 1}`;
      default:
        return `<${index + 1} fund>`;
    }
  };

  const handleConfirmClose = () => {
    setConfirmDialog4CloseOpen(false);
    handleClose();
  };

  const handleCloseButtonClick = () => {
    if (unsavedChanges) {
      setConfirmDialog4CloseOpen(true); // Show confirmation dialog
    } else {
      handleClose();
    }
  };

  const handleDialogClose = (event, reason) => {
    if (reason === "backdropClick" || reason === "escapeKeyDown") {
      handleCloseButtonClick();
    } else {
      handleClose();
    }
  };
  const handleCancelClose = () => {
    setConfirmDialog4CloseOpen(false);
  };
  /** incomeData.startAgeOption === INCOME_START_OPTIONS.STARTING_TODAY || (incomeData.startAgeOption === INCOME_START_OPTIONS.STARTING_LATER && 
    incomeData.endAgeOption !== INCOME_END_AGE_OPTIONS.ONETIME);*/








    const handleAutocompleteChangeName = (event, newValue) => {
      setIncomeData({ ...incomeData, name: newValue });
      handleInputChange({ target: { name: 'name', value: newValue } });
    };
  
    const handleInputChangeAutocompleteName = (event) => {
      const { value } = event.target;
    setIncomeData({ ...incomeData, name: value });
      handleInputChange(event);
    };

    
  return (
    <>
      <Modal open={open} onClose={handleDialogClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            maxHeight: '95vh', // Ensure the modal does not exceed the viewport height
            overflowY: 'auto', // Enable vertical scrolling
          }}
          className="z-index-subEntry"
        >
          <IconButton
            aria-label="close"
            onClick={handleCloseButtonClick}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
          <h2>{incomeId ? t("titles.changeIncome") : t("titles.addIncome")}</h2>
          



   


      <Autocomplete
        freeSolo
        options={incomeTerms}

        inputValue={incomeData.name}
        onInputChange={(event, newInputValue) => setIncomeData({ ...incomeData, name: newInputValue })}
        onChange={handleAutocompleteChangeName}
        renderInput={(params) => (
          <TextField
            {...params}
            fullWidth
            label="Name"
            name="name"
            margin="normal"
          />
        )}
      />


          <TextField
            fullWidth
            label={t("labels.incomeAmount")}
            name="amount"
            value={incomeData.amount}
            onChange={handleInputChange}
            margin="normal"
            slotProps={{
              input: {
                inputComponent: MoneyFormatCustom,
                inputProps: {
                  name: "amount",
                  style: { textAlign: "right" },
                },
              },
            }}
          />

          <Grid size={{ xs: 12, sm: 6, md: 6 }} sx={{ mt: 2, mb: 3 }}>
            <Paper
              variant="elevation"
              sx={{
                display: "flex",
                alignItems: "center",
                flexDirection: { xs: "column", sm: "row" },
              }}
            >
              <FormControl fullWidth>
                <InputLabel>{t("labels.incomeBeginAge")}</InputLabel>
                <Select
                  labelId="start-age-label"
                  id="start-age"
                  value={incomeData.startAgeOption}
                  onChange={handleStartAgeOptionChange}
                  defaultValue={INCOME_START_OPTIONS.STARTING_TODAY}
                  sx={{ minWidth: "120px" }}
                >
                  {getIncomeStartOptions(t).map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {incomeData.startAgeOption ===
                INCOME_START_OPTIONS.STARTING_LATER && (
                <TextField
                  name="startAgeValue"
                  value={incomeData.startAgeValue}
                  onChange={handleInputChange}
                  slotProps={{
                    input: {
                      inputComponent: Number2DigitFormatCustom,
                      inputProps: {
                        name: "startAgeValue",
                        style: { textAlign: "right" },
                      },
                    },
                  }}
                />
              )}
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 6 }} sx={{ mt: 2, mb: 2 }}>
            <Paper
              variant="elevation"
              sx={{
                display: "flex",
                alignItems: "center",
                flexDirection: { xs: "column", sm: "row" },
              }}
            >
              <FormControl fullWidth>
                <InputLabel>{t("labels.incomeEndYear")}</InputLabel>
                <Select
                  labelId="end-age-label"
                  id="end-age"
                  value={incomeData.endAgeOption}
                  onChange={handleEndAgeOptionChange}
                  sx={{ minWidth: "120px" }}
                >
                  {getIncomeEndAgeOptions(t, incomeData.startAgeOption).map(
                    (option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    )
                  )}
                </Select>
              </FormControl>

              {incomeData.endAgeOption === INCOME_END_AGE_OPTIONS.UNTIL && (
                <TextField
                  name="endAgeValue"
                  value={incomeData.endAgeValue}
                  onChange={handleInputChange}
                  slotProps={{
                    input: {
                      inputComponent: Number2DigitFormatCustom,
                      inputProps: {
                        name: "endAgeValue",
                        style: { textAlign: "right" },
                      },
                    },
                  }}
                />
              )}
            </Paper>
          </Grid>

          {incomeData.startAgeOption !==
            INCOME_START_OPTIONS.STARTING_TODAY && (
            <Grid size={{ xs: 12, sm: 6, md: 6 }} sx={{ mt: 1, mb: 0 }}>
              <FormControl fullWidth margin="normal">
                <InputLabel id="income-amount-type-label">
                  {t("labels.incomeAmountType")}
                </InputLabel>
                <Select
                  labelId="amount-type-label"
                  id="amount-type-id"
                  value={incomeData.amountType}
                  onChange={(event) =>
                    handleAmountTypeChange(event, event.target.value)
                  }
                  renderValue={(selected) => {
                    const selectedOption = getIncomeAmountTypes(t).find(
                      (option) => option.value === selected
                    );
                    return selectedOption ? selectedOption.label : "";
                  }}
                  sx={{ minWidth: "120px" }}
                >
                  {getIncomeAmountTypes(t).map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      <Box>
                        <Typography variant="body1">{option.label}</Typography>
                        <Typography variant="caption" display="block">
                          {option.description}
                        </Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>{t("explain.incomeAmountType")}</FormHelperText>
              </FormControl>
            </Grid>
          )}

          {shouldDisplayGrowthRate && (
            <Grid size={{ xs: 12, sm: 6, md: 6 }} sx={{ mt: 2, mb: 1 }}>
              <TextField
                fullWidth
                label={
                  shouldDisplayCustomGrowthRate
                    ? t("labels.incomeGrowthRate4StartLaterOneTime")
                    : t("labels.incomeGrowthRate")
                }
                name="growth"
                value={incomeData.growth}
                helperText={
                  shouldDisplayGrowthRateHelperText &&
                  t("explain.incomeGrowthRateForYearsIncome")
                }
                onChange={handleInputChange}
                slotProps={{
                  input: {
                    inputComponent: PercentageFormatCustom,
                    inputProps: {
                      name: "growth",
                      style: { textAlign: "right" },
                    },
                  },
                }}
              />
            </Grid>
          )}
          {simul.returnDetail.returnType === RETURN_TYPES.PORTFOLIO && (
            <Grid xs={12} sm={12} md={12} sx={{ mt: 3, mb: 1 }}>
              <FormControl fullWidth>
                <InputLabel id="income-amount-type-label">
                  {t("labels.incomeContributeTo")}
                </InputLabel>
                <Select defaultValue={"D"}>
                  <MenuItem key="w" value="D">
                    {t("options.notSpecificContribution")}
                  </MenuItem>
                  {simul.returnDetail.funds.map((fund, index) => (
                    <MenuItem key={fund.id} value={fund.id}>
                      {getFundLabel(fund, index)}
                    </MenuItem>
                  ))}
                </Select>

                <FormHelperText>
                  {t("explain.incomeContributeTo")}
                </FormHelperText>
              </FormControl>
            </Grid>
          )}
          {/* Add other text fields for income details */}
          <Box display="flex" justifyContent="space-between" mt={2}>
            {incomeId && (
              <Box display="flex" flexDirection="column" alignItems="left">
                <Typography variant="caption" color="error" sx={{ mb: 0 }}>
                  {t("explain.deleteWarning")}
                </Typography>
                <DestructiveSecondaryButton
                  startIcon={<DeleteIcon />}
                  onClick={handleDeleteButtonClick} // Handle delete and close action
                >
                  {t("buttons.delete")}
                </DestructiveSecondaryButton>
              </Box>
            )}
            <Box display="flex" alignItems="center" ml="auto">
              {incomeId ? (
                <Box>
                  <Typography variant="body2" color="error" sx={{ mb: 0 }}>
                    <br />
                  </Typography>
                  <PrimaryButton
                    onClick={handleSaveIncome}
                    active={unsavedChanges}
                    endIcon={<DoneOutlineIcon />}
                  >
                    {t("buttons.saveChanges")}
                  </PrimaryButton>
                </Box>
              ) : (
                <>
                  <SecondaryButton
                    onClick={handleAddIncomeAndNext}
                    endIcon={<PlusOneIcon />}
                    active={unsavedChanges}
                    sx={{ mr: 1 }}
                  >
                    {t("buttons.addAndNext")}
                  </SecondaryButton>
                  <PrimaryButton
                    endIcon={<AddIcon />}
                    active={unsavedChanges}
                    onClick={handleAddIncome}
                  >
                    {t("buttons.add")}
                  </PrimaryButton>
                </>
              )}
            </Box>
          </Box>
        </Box>
      </Modal>

      <ConfirmationDialog
        open={confirmDialog4CloseOpen}
        onClose={handleCancelClose}
        title={t("titles.discardChanges")}
        message={t("messages.unsavedChanges")}
        primaryButtonLabel={t("buttons.discardChanges")}
        secondaryButtonLabel={t("buttons.keepEditing")}
        onPrimaryButtonClick={handleConfirmClose}
        onSecondaryButtonClick={handleCancelClose}
        countdown={true} // Enable countdown
        countdownTime={3} // Set countdown time if needed
      />

      <ConfirmationDialog
        open={confirmDialog4DeleteOpen}
        onClose={() => setConfirmDialog4DeleteOpen(false)}
        title={t("titles.confirmDelete")}
        message={t("messages.confirmDeleteIncome")}
        primaryButtonLabel={t("buttons.confirmDelete")}
        secondaryButtonLabel={t("buttons.cancelDelete")}
        onPrimaryButtonClick={() => {
          handleDeleteIncome();
          setConfirmDialog4DeleteOpen(false);
        }}
        onSecondaryButtonClick={() => setConfirmDialog4DeleteOpen(false)}
        countdown={true} // Enable countdown if needed
        countdownTime={5} // Set countdown time if needed
        isPrimaryButtonNegative={true} // Set primary button as negative
      />
    </>
  );
};

export default IncomeDataInput;
