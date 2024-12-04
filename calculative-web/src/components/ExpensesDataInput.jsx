import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Modal,
  TextField,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
  Switch,
  FormControl,
  Typography,
  MenuItem,
  Select,
  InputLabel,
  Paper,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import Grid from "@mui/material/Grid2";
import { v4 as uuidv4 } from "uuid";
import { useSimul } from "../contexts/SimulContext";
import Income from "../models/Income";
import AddFundModal from "./AddFundModal";

const IncomeDataInput = ({ open, handleClose }) => {
  const { simul, setSimul } = useSimul();
  const [incomeData, setIncomeData] = useState(new Income());
  const [isFundModalOpen, setIsFundModalOpen] = useState(false);

  // Reset the properties of the Income instance every time the modal opens
  useEffect(() => {
    if (open) {
      const newIncomeData = new Income(); // Create a new instance
      setIncomeData(newIncomeData); // Set it in state
    }
  }, [open]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setIncomeData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAmountTypeChange = (event, newAmountType) => {
    if (newAmountType !== null) {
      setIncomeData((prev) => ({ ...prev, amountType: newAmountType }));
    }
  };

  const handleStartAgeChange = (event) => {
    const value = event.target.value;
    setIncomeData((prev) => ({
      ...prev,
      startAge: value,
      amountType: value === "starting" ? "today" : prev.amountType,
    }));
  };

  const handleEndAgeChange = (event) => {
    setIncomeData((prev) => ({ ...prev, endAge: event.target.value }));
  };

  const handleGrowthOptionChange = (event) => {
    setIncomeData((prev) => ({ ...prev, growthOption: event.target.value }));
  };

  const handleFrequencyChange = (event, newFrequency) => {
    if (newFrequency !== null) {
      setIncomeData((prev) => ({ ...prev, frequency: newFrequency }));
    }
  };

  const handleAdd = () => {
    const newIncomeData = { ...incomeData, id: uuidv4() }; // Generate a unique ID
    const updatedIncomes = [...simul.incomes, newIncomeData];

    setSimul({ ...simul, incomes: updatedIncomes });

    handleClose(); // No need to reset `incomeData` here
  };

  const handleOpenFundModal = () => {
    setIsFundModalOpen(true);
  };

  const handleCloseFundModal = () => {
    setIsFundModalOpen(false);
  };

  return (
    <Modal open={open} onClose={handleClose}>
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
        }}
      >
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <h2>Add Income</h2>
        <TextField
          fullWidth
          label="Name"
          name="name"
          value={incomeData.name}
          onChange={handleInputChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Amount"
          name="amount"
          value={incomeData.amount}
          onChange={handleInputChange}
          margin="normal"
        />

        <Grid size={{ xs: 12, sm: 6, md: 6 }} sx={{ mt: 2, mb: 1 }}>
          <Paper
            variant="elevation"
            sx={{
              display: "flex",
              alignItems: "center",
              flexDirection: { xs: "column", sm: "row" },
            }}
          >
            <FormControl fullWidth>
              <InputLabel>Begin At Age</InputLabel>
              <Select
                labelId="start-age-label"
                id="start-age"
                value={incomeData.startAge}
                onChange={handleStartAgeChange}
                sx={{ minWidth: "120px" }}
              >
                <MenuItem value="starting">Starting Age</MenuItem>
                <MenuItem value="later">Later Age</MenuItem>
              </Select>
            </FormControl>

            {incomeData.startAge === "later" && (
              <TextField
                name="startAgeValue"
                value={incomeData.startAgeValue}
                onChange={handleInputChange}
              />
            )}
          </Paper>
        </Grid>

        {incomeData.startAge !== "starting" && (
          <FormControl fullWidth margin="normal">
            <InputLabel id="adjust-income-growth-label">Amount Type</InputLabel>
            <Select
              labelId="adjust-income-growth-label"
              id="adjust-income-growth"
              value={incomeData.amountType}
              onChange={(event) =>
                handleAmountTypeChange(event, event.target.value)
              }
              sx={{ minWidth: "120px" }}
            >
              <MenuItem value="future">
                Future Amount, When Income Begin
              </MenuItem>
              <MenuItem value="today">
                Today Amount, To Adjust Using Growth
              </MenuItem>
            </Select>
          </FormControl>
        )}

        <FormControl fullWidth margin="normal">
          <ToggleButtonGroup
            value={incomeData.frequency}
            exclusive
            onChange={handleFrequencyChange}
            fullWidth
            sx={{ mb: 1 }}
          >
            <ToggleButton value="E">Annually</ToggleButton>
            <ToggleButton value="O">Once</ToggleButton>
          </ToggleButtonGroup>
        </FormControl>

        {incomeData.frequency !== "O" && (
          <Grid size={{ xs: 12, sm: 6, md: 6 }} sx={{ mt: 1, mb: 3 }}>
            <Paper
              variant="elevation"
              sx={{
                display: "flex",
                alignItems: "center",
                flexDirection: { xs: "column", sm: "row" },
              }}
            >
              <FormControl fullWidth>
                <InputLabel>Income Receiving Years</InputLabel>
                <Select
                  labelId="end-age-label"
                  id="end-age"
                  value={incomeData.endAge}
                  onChange={handleEndAgeChange}
                  sx={{ minWidth: "120px" }}
                >
                  <MenuItem value="forever">Forever</MenuItem>
                  <MenuItem value="retirement">Until Retirement</MenuItem>
                  <MenuItem value="until">Limit Years</MenuItem>
                </Select>
              </FormControl>

              {incomeData.endAge === "until" && (
                <TextField
                  name="endYears"
                  value={incomeData.endYears}
                  onChange={handleInputChange}
                />
              )}
            </Paper>
          </Grid>
        )}

        {incomeData.frequency === "E" ||
        (incomeData.startAge !== "starting" &&
          incomeData.frequency === "O" &&
          incomeData.amountType === "today") ? (
          <Grid size={{ xs: 12, sm: 6, md: 6 }} sx={{ mt: 2, mb: 1 }}>
            <Paper
              variant="elevation"
              sx={{
                display: "flex",
                alignItems: "center",
                flexDirection: { xs: "column", sm: "row" },
              }}
            >
              <FormControl fullWidth>
                <InputLabel>Income Growth Rate</InputLabel>
                <Select
                  labelId="income-growth-label"
                  id="income-growth-option"
                  value={incomeData.growthOption}
                  onChange={handleGrowthOptionChange}
                  sx={{ minWidth: "120px" }}
                >
                  <MenuItem value="O">Define Rate</MenuItem>
                  <MenuItem value="I">Inflation</MenuItem>
                  <MenuItem value="N">Never Growth</MenuItem>
                </Select>
              </FormControl>

              {incomeData.growthOption === "O" && (
                <TextField
                  fullWidth
                  name="growth"
                  value={incomeData.growth}
                  onChange={handleInputChange}
                />
              )}
            </Paper>
          </Grid>
        ) : null}

<Grid xs={12} sm={12} md={12} sx={{ mt: 3, mb: 1 }}>
  <FormControl fullWidth>
    <InputLabel>Only Contribute To</InputLabel>
    <Select defaultValue={"D"}>
      <MenuItem value="D">System Decide</MenuItem>
      {simul.returnDetail.funds.map((fund, index) => (
        <MenuItem value={fund.id}>
          {fund.fundType || `${index + 1}`} {fund.index || fund.ticker}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 0 }}>
    <Button variant="text" size="small" onClick={handleOpenFundModal}>
      + Add Fund
    </Button>
  </Box>
</Grid>

        <Button variant="contained" onClick={handleAdd} sx={{ mt: 1 }}>
          Add
        </Button>
      </Box>
    </Modal>
  );
};

export default IncomeDataInput;
