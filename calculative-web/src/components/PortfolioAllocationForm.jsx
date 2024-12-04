import React, { useState,useEffect } from "react";
import Grid from "@mui/material/Grid2";
import {
  IconButton,
  Box,
  Tooltip,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
  Button,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { v4 as uuidv4 } from "uuid";
import { FUND_TYPES, getFundTypes } from "../models/Constants";
import { useTranslation } from "react-i18next";
import CustomTextField from "../styles/textfieldStyles";
import { CustomsButton } from "../styles/buttonStyles";

import {
  PercentageNoDecimalFormatCustom,
  Number2DigitFormatCustom,
  PercentageFormatCustom,
} from "./library/CompFormat";
import WithdrawAgeInput from "./WithdrawAgeInput";
import { useSimul } from "../contexts/SimulContext";
import Fund from "../models/Fund";
import { useHeaderLabelStyles } from "../styles/labelStyles";
import { useRowStyles } from "../styles/tableStyles"; // Import the useRowStyles function
import { INDEX_OPTIONS, getIndexOptions } from "../models/Constants";

const PortfolioAllocationForm = () => {
  const { simul, setSimul } = useSimul();
  const headerLabelStyles = useHeaderLabelStyles();
  const rowStyles = useRowStyles();
  const { t } = useTranslation();
  const [totalInitAlloc, setTotalInitAlloc] = useState(0);
  const [total2ndAlloc, setTotal2ndAlloc] = useState(0);
  const [total3rdAlloc, setTotal3rdAlloc] = useState(0);
  useEffect(() => {
    const newTotalInitAlloc = simul.returnDetail.funds.reduce(
      (total, fund) => total + parseFloat(fund.portfolio1Allocation || 0),
      0
    );
    setTotalInitAlloc(newTotalInitAlloc);

    const newTotal2ndAlloc = simul.returnDetail.funds.reduce(
      (total, fund) => total + parseFloat(fund.portfolio2Allocation || 0),
      0
    );
    setTotal2ndAlloc(newTotal2ndAlloc);

    const newTotal3rdAlloc = simul.returnDetail.funds.reduce(
      (total, fund) => total + parseFloat(fund.portfolio3Allocation || 0),
      0
    );
    setTotal3rdAlloc(newTotal3rdAlloc);
  }, [simul.returnDetail.funds]);

  const handleAddFund = () => {
    const newFund = new Fund();

    const updatedFunds = [...simul.returnDetail.funds, newFund];
    setSimul({
      ...simul,
      returnDetail: {
        ...simul.returnDetail,
        funds: updatedFunds,
      },
    });
  };

  const handleFundTypeChange = (id) => (event) => {
    const newFunds = simul.returnDetail.funds.map((fund) =>
      fund.id === id ? { ...fund, fundType: event.target.value } : fund
    );
    setSimul({
      ...simul,
      returnDetail: {
        ...simul.returnDetail,
        funds: newFunds,
      },
    });
  };

  const handleAllocationChange = (id, property) => (event) => {
    // const newValue = event.target.value;

    // Check if the incoming data is the same as the existing data
    //const existingValue = simul.returnDetail.funds.find(fund => fund.id === id)[property];
    //if (existingValue === newValue) {
    // return;
    ////}

    const newFunds = simul.returnDetail.funds.map((fund) =>
      fund.id === id ? { ...fund, [property]: event.target.value } : fund
    );

    setSimul({
      ...simul,
      returnDetail: {
        ...simul.returnDetail,
        funds: newFunds,
      },
    });

    if (property === "portfolio1Allocation") {
      const newTotalInitAlloc = newFunds.reduce(
        (total, fund) => total + parseFloat(fund.portfolio1Allocation || 0),
        0
      );
      setTotalInitAlloc(newTotalInitAlloc);
    } else if (property === "portfolio2Allocation") {
      const newTotal2ndAlloc = newFunds.reduce(
        (total, fund) => total + parseFloat(fund.portfolio2Allocation || 0),
        0
      );
      setTotal2ndAlloc(newTotal2ndAlloc);
    } else if (property === "portfolio3Allocation") {
      const newTotal3rdAlloc = newFunds.reduce(
        (total, fund) => total + parseFloat(fund.portfolio3Allocation || 0),
        0
      );
      setTotal3rdAlloc(newTotal3rdAlloc);
    }
  };

  const handleDeleteFund = (id) => {
    const newFunds = simul.returnDetail.funds.filter((fund) => fund.id !== id);
    setSimul({
      ...simul,
      returnDetail: {
        ...simul.returnDetail,
        funds: newFunds,
      },
    });
  };
  const updateWithdrawAge = (id, value) => {
    const newFunds = simul.returnDetail.funds.map((fund) =>
      fund.id === id ? { ...fund, withdrawAge: value } : fund
    );
    setSimul({
      ...simul,
      returnDetail: {
        ...simul.returnDetail,
        funds: newFunds,
      },
    });
  };

  return (
    <Grid container spacing={0.9}>
      {" "}
      {/* Ensure GAP in the overall GRID */}
      <Grid size={{ xs: 12, sm: 12, md: 12 }}>
        <Grid container spacing={2} alignItems="center">
          {" "}
          {/* Ensure alignment */}
          {/* Header Fund */}
          <Grid size={{ xs: 12, sm: 0.7, md: 0.7 }}>
            {" "}
            <Box component="div" sx={headerLabelStyles}>
              #
            </Box>
          </Grid>
          <Grid size={{ xs: 12, sm: 6.5, md: 6.5 }}>
            <Box component="div" sx={headerLabelStyles}>
              Liquid Assets (Funds)
            </Box>
          </Grid>
          <Grid id="GridAllocPercH" size={{ xs: 12, sm: 1.6, md: 1.6 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box component="div" sx={headerLabelStyles}>
                {t("labels.allocationInitialH")}
              </Box>
              <TextField
                label="Age"
                style={{ display: "none" }}
                sx={{ width: "40%" }}
                slotProps={{
                  input: {
                    inputComponent: Number2DigitFormatCustom,
                    inputProps: { name: "age", style: { textAlign: "right" } },
                  },
                }}
              />
            </Box>
          </Grid>
          <Grid size={{ xs: 12, sm: 1.6, md: 1.6 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box component="div" sx={headerLabelStyles}>
                {t("labels.allocation2ndH")}
              </Box>
              <TextField
                label="Age"
                sx={{ width: "40%" }}
                slotProps={{
                  input: {
                    inputComponent: Number2DigitFormatCustom,
                    inputProps: { name: "age", style: { textAlign: "right" } },
                  },
                }}
              />
            </Box>
          </Grid>
          <Grid size={{ xs: 12, sm: 1.6, md: 1.6 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box component="div" sx={headerLabelStyles}>
                {t("labels.allocation3rdH")}
              </Box>
              <TextField
                label="Age"
                sx={{ width: "40%" }}
                slotProps={{
                  input: {
                    inputComponent: Number2DigitFormatCustom,
                    inputProps: { name: "age", style: { textAlign: "right" } },
                  },
                }}
              />
            </Box>
          </Grid>
        </Grid>{" "}
        {/* END header */}
      </Grid>
      {simul.returnDetail.funds.map((fund, displayIndex) => (
        <Grid
          size={{ xs: 12, sm: 12, md: 12 }}
          key={`fund#${fund.id}`}
          sx={{
            ...(displayIndex % 2 === 0 ? rowStyles.evenRow : rowStyles.oddRow), // Apply odd/even row styles
            ...rowStyles.rowHover, // Apply hover style
          }} // Apply odd/even row styles
        >
          <Grid container spacing={2} alignItems="center">
            <Grid size={{ xs: 12, sm: 0.7, md: 0.7 }}>
              {displayIndex + 1}
              <IconButton onClick={() => handleDeleteFund(fund.id)}>
                <DeleteIcon />
              </IconButton>
            </Grid>
            <Grid size={{ xs: 12, sm: 6.5, md: 6.5 }}>
              <Paper
                variant="elevation"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  flexDirection: { xs: "column", sm: "row" },
                }}
              >
                <FormControl
                  fullWidth
                  style={{ flex: fund.fundType ? "0 0 35%" : "0 0 100%" }}
                >
                  <InputLabel>Fund Type</InputLabel>
                  <Select
                    value={fund.fundType || ""}
                    onChange={handleFundTypeChange(fund.id)}
                    displayEmpty
                  >
                    {getFundTypes(t).map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <>
                  {/* Render Return field for cash and pension funds */}
                  {(fund.fundType === FUND_TYPES.CASH ||
                    fund.fundType === FUND_TYPES.PENSION) && (
                    <TextField
                      fullWidth
                      label={t("labels.allocationFundReturn")}
                      value={fund.return}
                      onChange={handleAllocationChange(fund.id, "return")}
                      style={{
                        flex:
                          fund.fundType === FUND_TYPES.CASH ? "1" : "0 0 25%",
                      }}
                      slotProps={{
                        input: {
                          inputComponent: PercentageFormatCustom,
                          inputProps: {
                            name: "return",
                            style: { textAlign: "right" },
                          },
                        },
                      }}
                    />
                  )}

                  {/* Render Withdraw Age field only for the pension fund */}
                  {fund.fundType === FUND_TYPES.PENSION && (
                    <WithdrawAgeInput
                      withdrawAge={fund.withdrawAge}
                      updateWithdrawalAgeFunc={(value) =>
                        updateWithdrawAge(fund.id, value)
                      }
                      style={{ flex: "1", display: "flex" }}
                    />
                  )}
                </>

                {fund.fundType === FUND_TYPES.MARKET && (
                  <FormControl fullWidth>
                    <InputLabel>Index</InputLabel>
                    <Select
                      labelId="index-select-label"
                      id="index-select"
                      value={fund.index}
                      defaultValue={INDEX_OPTIONS.SP500}
                      onChange={handleAllocationChange(fund.id, "index")}
                      label="Index"
                    >
                      {getIndexOptions(t).map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
                {fund.fundType === FUND_TYPES.TICKER && (
                  <TextField
                    fullWidth
                    label="Ticker"
                    value={fund.ticker}
                    onChange={handleAllocationChange(fund.id, "ticker")}
                    sx={{ display: "block" }}
                  />
                )}
              </Paper>
            </Grid>

            <Grid id="GridAllocPercInitD" size={{ xs: 12, sm: 1.6, md: 1.6 }}>
              <CustomTextField
                showlabelifonlysm="true"
                label={t("labels.allocationInitial")}
                fullWidth
                value={fund.portfolio1Allocation}
                onChange={handleAllocationChange(
                  fund.id,
                  "portfolio1Allocation"
                )}
                slotProps={{
                  input: {
                    inputComponent: PercentageNoDecimalFormatCustom,
                    inputProps: {
                      name: "portfolio1Allocation",
                      style: { textAlign: "right" },
                    },
                  },
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 1.6, md: 1.6 }}>
              <CustomTextField
                showlabelifonlysm="true"
                label={t("labels.allocation2nd")}
                fullWidth
                value={fund.portfolio2Allocation}
                onChange={handleAllocationChange(
                  fund.id,
                  "portfolio2Allocation"
                )}
                slotProps={{
                  input: {
                    inputComponent: PercentageNoDecimalFormatCustom,
                    inputProps: {
                      name: "portfolio2Allocation",
                      style: { textAlign: "right" },
                    },
                  },
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 1.6, md: 1.6 }}>
              <CustomTextField
                showlabelifonlysm="true"
                label={t("labels.allocation3rd")}
                fullWidth
                value={fund.portfolio3Allocation}
                onChange={handleAllocationChange(
                  fund.id,
                  "portfolio3Allocation"
                )}
                slotProps={{
                  input: {
                    inputComponent: PercentageNoDecimalFormatCustom,
                    inputProps: {
                      name: "portfolio3Allocation",
                      style: { textAlign: "right" },
                    },
                  },
                }}
              />
            </Grid>
          </Grid>
        </Grid>
      ))}
      <Grid size={{ xs: 12, sm: 12, md: 12 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid size={{ xs: 12, sm: 0.7, md: 0.7 }}></Grid>
          <Grid size={{ xs: 12, sm: 11.3, md: 6.5 }}>
            <Box sx={{ mt: 0, textAlign: "left" }}>
              <CustomsButton
                variant="text"
                color="primary"
                onClick={handleAddFund}
              >
                {t("buttons.addFund")}
              </CustomsButton>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, sm: 0.7, md: 1.6 }}>
            <Box id="boxInitAlloc" sx={{ mt: 0, mr: 1.5, textAlign: "right",color: totalInitAlloc === 100 ? "success.main" : totalInitAlloc === 0 ?"": "error.main", }}>
              {" "}
              {totalInitAlloc}%
            </Box>
          </Grid>
          <Grid size={{ xs: 12, sm: 0.7, md: 1.6 }}>
            <Box id="box2ndAlloc" sx={{ mt: 0, mr: 1.5, textAlign: "right",color: total2ndAlloc === 100 ? "success.main" : total2ndAlloc === 0 ?"": "error.main", }}>
              {total2ndAlloc}%
            </Box>
          </Grid>
          <Grid size={{ xs: 12, sm: 0.7, md: 1.6 }}>
            <Box id="box3rdAlloc" sx={{ mt: 0, mr: 1.5, textAlign: "right",color: total3rdAlloc === 100 ? "success.main" :  total3rdAlloc === 0 ?"": "error.main", }}>
              {" "}
              {total3rdAlloc}%
            </Box>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default PortfolioAllocationForm;
