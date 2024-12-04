import React, { forwardRef } from "react";
import {
  Box,
  Grid2,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInfinity,
  faCalendarAlt,
} from "@fortawesome/free-solid-svg-icons";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import {
  INCOME_START_OPTIONS,
  INCOME_END_AGE_OPTIONS,
  WITHDRAW_START_AGE_OPTIONS,
} from "../models/Constants";
import { useTheme } from "@mui/material/styles";
import TodayIcon from "@mui/icons-material/Today";
import { useSimul } from "../contexts/SimulContext";
import { useIncomeBoxLabelStyles } from "../styles/labelStyles";

const IncomeSummary = forwardRef((props, ref) => {
  const { onIncomeClick } = props;
  const { t } = useTranslation();
  const theme = useTheme();
  const { simul } = useSimul();
  const classes = useIncomeBoxLabelStyles();
  

  const incomes = simul.incomes;

  const abbreviateName = (name) => {
    const words = name.split(" ");
    if (words.length > 1)
      return words.map((word) => word[0].toUpperCase()).join("");
    return name.length > 10 ? name.slice(0, 10) + "..." : name;
  };

  const formatAmount = (amount) => {
    if (!amount) return "N/A";
    const numberAmount = Number(amount);
    return `$${numberAmount.toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}`;
  };

  const getEndAgeDisplay = (endAgeOption, endAgeValue) => {
    if (endAgeOption === INCOME_END_AGE_OPTIONS.ONETIME) {
      return null;
    } else if (endAgeOption === INCOME_END_AGE_OPTIONS.RETIREMENT) {
      if (simul.withdrawAgeOption === WITHDRAW_START_AGE_OPTIONS.LATER_AGE) {
        return `...${simul.withdrawAge - 1}`;
      } else if (
        simul.withdrawAgeOption ===
        WITHDRAW_START_AGE_OPTIONS.FOLLOW_PLAN_START_AGE
      ) {
        return <>...<TodayIcon /></>;
      } else {
        return "...?";
      }
    } else if (endAgeOption === INCOME_END_AGE_OPTIONS.FOREVER) {
      return <>...<FontAwesomeIcon icon={faInfinity} /></>;
    } else {
      return `...${endAgeValue}`;
    }
  };


  return (
    <Box ref={ref} sx={{ p: 2 }}>
      <Box
        display="grid"
        gridTemplateColumns="repeat(auto-fill, 120px)"
        gap={2}
        sx={{ overflowY: "auto", height: "calc(100% - 56px)" }}
      >
        
        {incomes.map((income, index) => (
          <Box
            key={index}
            onClick={() => onIncomeClick(income.id)}
            sx={{
              p: 1,
              backgroundColor:
                theme.palette.mode === "dark" ? "#555555" : "#ffffff",
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 1,
              width: "120px",
              position: "relative",
              fontSize: "0.875rem",
              color: theme.palette.text.primary,
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography className={classes.incomeBoxName}>
                {abbreviateName(income.name)}
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <Typography className={classes.amountBoxName}> 
                {formatAmount(income.amount)}</Typography>
            </Box>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <Box display="flex" alignItems="center">
                {income.startAgeOption ===
                INCOME_START_OPTIONS.STARTING_TODAY ? (
                  <TodayIcon />
                ) : (
                  income.startAgeValue
                )}
                
                {getEndAgeDisplay(income.endAgeOption, income.endAgeValue)}
              </Box>
              {income.growth > 0 && <ShowChartIcon />}
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
});

export default IncomeSummary;