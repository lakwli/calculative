import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import {
  ToggleButton,
  ToggleButtonGroup,
  FormControl,
  InputLabel,
  TextField,
  Typography,
  Select,
  MenuItem,
  FormControlLabel,
  FormGroup,
  Switch,
  Stack,
  IconButton,
} from "@mui/material";
import Divider from "@mui/material/Divider";
import {
  PercentageFormatCustom,
  YearFormatCustom,
  Number1DigitFormatCustom,
} from "./library/CompFormat";
import PortfolioAllocationForm from "./PortfolioAllocationForm";
import { Card, CardHeader, CardContent } from "@mui/material";

import { useSimul } from "../contexts/SimulContext";

import Fund from "../models/Fund";
import {
  CHOICES,
  REBALANCE_OPTIONS,
  RETURN_TYPES,
  FUND_WITHDRAW_OPTION,
} from "../models/Constants"; // Add this line to import CHOICES and REBALANCE_OPTIONS
import { Tabs, Tab } from "@mui/material";
import tabStyles from "../styles/tabStyles"; // Import the styles
import { tabLabelStyles, sectionTitleStyles,controlLabelStyles } from "../styles/labelStyles"; // Import the label styles
import HomeIcon from "@mui/icons-material/Home"; // Example icon
import BarChartIcon from "@mui/icons-material/BarChart"; // Example icon
import ShowChartIcon from "@mui/icons-material/ShowChart"; // Example icon
import PieChartIcon from "@mui/icons-material/PieChart"; // Example icon
import { Chip, Tooltip } from "@mui/material";
import { getFundWithdrawOptions } from "../models/Constants";
import { useTranslation } from "react-i18next";
import InfoIcon from "@mui/icons-material/Info";
import MobileTooltip from "./library/MobileTooltip";

function ReturnTypeCard({}) {
  const { simul, setSimul } = useSimul();
  const { t } = useTranslation();
  const [haveStock, setHaveStock] = useState(true);

  const [showFields, setShowFields] = useState({
    fixReturnField: true,
    indexField: false,
    stocksContainer: false,
    backTestYearField: false,
    divWithholdTaxField: false,
    rebalanceFreq: false,
  });

  const handleReturnDetailChange = (event) => {
    const { name, value } = event.target;
    const updatedReturnDetail = {
      ...simul.returnDetail,
      [name]: value,
    };
    setSimul({ ...simul, returnDetail: updatedReturnDetail });
  };

  const handleHaveStockOptionChange = (event) => {
    setHaveStock(event.target.checked);
  };

  const handleReturnTypeChange = (event, newReturnType) => {
    if (newReturnType !== null) {
      let updatedFunds = simul.returnDetail.funds;
      if (
        newReturnType === RETURN_TYPES.PORTFOLIO &&
        updatedFunds.length === 0
      ) {
        updatedFunds = [new Fund(), new Fund()];
      }

      const updatedReturnDetail = {
        ...simul.returnDetail,
        returnType: newReturnType,
        funds: updatedFunds,
      };
      setSimul({ ...simul, returnDetail: updatedReturnDetail });
      switch (newReturnType) {
        case RETURN_TYPES.BASIC:
          setShowFields({
            fixReturnField: true,
            indexField: false,
            tickerField: false,
            stocksContainer: false,
            backTestYearField: false,
            divWithholdTaxField: false,
            rebalanceFreq: false,
          });
          break;
        case RETURN_TYPES.MARKETINDEX:
          setShowFields({
            fixReturnField: false,
            indexField: true,
            tickerField: false,
            stocksContainer: false,
            backTestYearField: true,
            divWithholdTaxField: false,
            rebalanceFreq: false,
          });
          break;
        case RETURN_TYPES.STOCK:
          setShowFields({
            fixReturnField: false,
            indexField: false,
            tickerField: true,
            stocksContainer: false,
            backTestYearField: true,
            divWithholdTaxField: true,
            rebalanceFreq: false,
          });
          break;
        case RETURN_TYPES.PORTFOLIO:
          setShowFields({
            fixReturnField: false,
            indexField: false,
            tickerField: false,
            stocksContainer: true,
            backTestYearField: true,
            divWithholdTaxField: true,
            rebalanceFreq: true,
          });
          break;
        default:
          setShowFields({
            fixReturnField: false,
            indexField: false,
            tickerField: false,
            stocksContainer: false,
            backTestYearField: false,
            divWithholdTaxField: false,
            rebalanceFreq: false,
          });
          break;
      }
    }
  };

  return (
    <Card elevation={6}>
      <CardContent>
        <Box sx={{ flexGrow: 1 }}>
          {/** <Typography sx={sectionTitleStyles}>Capital Return</Typography>  */}
          <Grid container sx={{ mt: 0, mb: 2 }}>
            <Box sx={{ width: "100%" }}>
              <Tabs
                value={simul.returnDetail.returnType}
                onChange={handleReturnTypeChange}
                aria-label="return type tabs"
                variant="scrollable" // Make tabs scrollable
                scrollButtons="auto" // Show scroll buttons when needed
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                }} // Ensure full width
              >
                <Tab
                  icon={<HomeIcon />}
                  label={<Typography sx={tabLabelStyles}>Basic</Typography>}
                  value={RETURN_TYPES.BASIC}
                  sx={{
                    ...tabStyles.unselected,
                    ...(simul.returnDetail.returnType === RETURN_TYPES.BASIC &&
                      tabStyles.selected),
                    ...tabStyles.hover,
                    textTransform: "none", // Ensure text is not transformed to uppercase
                    flex: 1, // Ensure each tab takes up equal space
                  }}
                />
                <Tab
                  icon={<BarChartIcon />} // Add icon
                  label={<Typography sx={tabLabelStyles}>Index</Typography>}
                  value={RETURN_TYPES.MARKETINDEX}
                  sx={{
                    ...tabStyles.unselected,
                    ...(simul.returnDetail.returnType ===
                      RETURN_TYPES.MARKETINDEX && tabStyles.selected),
                    ...tabStyles.hover,
                    textTransform: "none", // Ensure text is not transformed to uppercase
                    flex: 1, // Ensure each tab takes up equal space
                  }}
                />
                <Tab
                  icon={<ShowChartIcon />} // Add icon
                  label={<Typography sx={tabLabelStyles}>Stock</Typography>}
                  value={RETURN_TYPES.STOCK}
                  sx={{
                    ...tabStyles.unselected,
                    ...(simul.returnDetail.returnType === RETURN_TYPES.STOCK &&
                      tabStyles.selected),
                    ...tabStyles.hover,
                    textTransform: "none", // Ensure text is not transformed to uppercase
                    flex: 1, // Ensure each tab takes up equal space
                  }}
                />
                <Tab
                  icon={<PieChartIcon />} // Add icon
                  label={<Typography sx={tabLabelStyles}>Portfolio</Typography>}
                  value={RETURN_TYPES.PORTFOLIO}
                  sx={{
                    ...tabStyles.unselected,
                    ...(simul.returnDetail.returnType ===
                      RETURN_TYPES.PORTFOLIO && tabStyles.selected),
                    ...tabStyles.hover,
                    textTransform: "none", // Ensure text is not transformed to uppercase
                    flex: 1, // Ensure each tab takes up equal space
                  }}
                />
              </Tabs>
            </Box>
          </Grid>

          <Grid
            container
            spacing={{ xs: 2, md: 3 }}
            columns={{ xs: 4, sm: 8, md: 12 }}
            sx={{ mt: 4 }}
            id="dynamicFields"
          >
            {showFields.fixReturnField && (
              <Grid size={{ xs: 12, sm: 12, md: 12 }}>
                <TextField
                  id="fixReturn"
                  label="Expected Return"
                  value={simul.returnDetail.expectedReturn}
                  fullWidth
                  slotProps={{
                    input: {
                      inputComponent: PercentageFormatCustom,
                      inputProps: {
                        name: "expectedReturn",
                        onChange: handleReturnDetailChange,
                      },
                    },
                  }}
                />
              </Grid>
            )}

            {showFields.indexField && (
              <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                <FormControl fullWidth>
                  <InputLabel id="index-label">Market Index</InputLabel>
                  <Select
                    labelId="index-label"
                    id="index"
                    value={simul.returnDetail.index || ""}
                    name="index"
                    onChange={handleReturnDetailChange}
                    defaultValue="^GSPC"
                  >
                    <MenuItem value="^GSPC">S&P500</MenuItem>
                    <MenuItem value="^DJI">Nasdaq</MenuItem>
                    <MenuItem value="^IXIC">Dow Jones</MenuItem>
                    <MenuItem value="^RUT">Small Cap 2000</MenuItem>
                    <MenuItem value="^NYA">MSCI World</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            )}

            {showFields.tickerField && (
              <Grid size={{ xs: 12, sm: `grow`, md: `grow` }}>
                <TextField
                  id="ticker"
                  label={`Ticker`}
                  value={simul.returnDetail.ticker || ""}
                  name="ticker"
                  onChange={handleReturnDetailChange}
                  fullWidth
                />
              </Grid>
            )}

            {showFields.rebalanceFreq && (
              <>
                <Grid
                  container
                  spacing={2}
                  alignItems="left"
                  size={{ xs: 12, sm: 12, md: 8.7 }}
                >
                  <Grid size={{ xs: 12, sm: 12, md: 2 }}>
                    <FormGroup>
                      <Typography sx={controlLabelStyles}>{t("titles.haveStock")}</Typography>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={haveStock}
                            onChange={handleHaveStockOptionChange}
                            name="haveStockOption"
                            color="primary"
                          />
                        }
                      />
                    </FormGroup>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 12, md: 2 }}>
                    <FormGroup>
                      <Typography
                        sx={{
                          ...controlLabelStyles,
                          color: haveStock ? "text.primary" : "text.disabled",
                        }}
                      >
                        {t("labels.allocationRebalance")}
                      </Typography>
                      <Box
                            sx={{ display: "flex", alignItems: "center" }}
                          >
                      <MobileTooltip title={t("explain.rebalanceOption")} />
                      <Tooltip title={t("explain.rebalanceOption")}>
                        <FormControlLabel
                          control={
                            <Switch
                              disabled={!haveStock}
                              checked={
                                simul.returnDetail.rebalanceOption ===
                                REBALANCE_OPTIONS.ANNUALLY
                              }
                              onChange={(event) =>
                                handleReturnDetailChange({
                                  target: {
                                    name: "rebalanceOption",
                                    value: event.target.checked
                                      ? REBALANCE_OPTIONS.ANNUALLY
                                      : CHOICES.NO,
                                  },
                                })
                              }
                              name="rebalanceOption"
                              color="primary"
                            />
                          }
                        />
                      </Tooltip>
                      </Box>
                    </FormGroup>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 12, md: 5.3 }}>
                    <FormControl id="frmFundWithdrawOption">
                      <Typography
                      
                        sx={{
                          mb: 0,
                          ...controlLabelStyles,
                          color:
                            haveStock &&
                            simul.returnDetail.rebalanceOption ===
                              REBALANCE_OPTIONS.NO
                              ? "text.primary"
                              : "text.disabled",
                        }}
                      >
                        {t("labels.withdrawFrom")}
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 1,
                          mt: 0,
                        }}
                      >
                        {getFundWithdrawOptions(t).map((option) => (
                          <Box
                            key={option.value}
                            sx={{ display: "flex", alignItems: "center" }}
                          >
                            <MobileTooltip
                              title={t(
                                `fundWithdrawOptionDescription.${option.value}`
                              )}
                            />

                            <Tooltip
                              key={option.value}
                              title={t(
                                `fundWithdrawOptionDescription.${option.value}`
                              )}
                            >
                              <Chip
                                disabled={!(haveStock &&
                                  simul.returnDetail.rebalanceOption ===
                                    REBALANCE_OPTIONS.NO)}
                                label={option.label}
                                variant="outlined"
                                color={
                                  simul.returnDetail.fundWithdrawOption ===
                                  option.value
                                    ? "primary"
                                    : "default"
                                }
                                onClick={() =>
                                  handleReturnDetailChange({
                                    target: {
                                      name: "fundWithdrawOption",
                                      value: option.value,
                                    },
                                  })
                                }
                              />
                            </Tooltip>
                          </Box>
                        ))}
                      </Box>
                    </FormControl>
                    {/**<TextField sx={{ visibility: "hidden", width: "1%" }} />*/}
                  </Grid>

                  <Grid size={{ xs: 12, sm: 12, md: 2.5, }}>
                    <TextField
                    disabled={!(haveStock &&
                      simul.returnDetail.rebalanceOption ===
                        REBALANCE_OPTIONS.NO && 
                        simul.returnDetail.fundWithdrawOption === FUND_WITHDRAW_OPTION.RETURN_EXCEED)}
                      label={t("labels.withdrawAnnualizedReturn")}
                      value={simul.returnDetail.withdrawAnnualizedReturn || ""}
                      sx={{
                        display: "block",
                        width: "100%",
                        ml: 0,
                        mr: 0,
                        mt: 2,
                      }}
                      slotProps={{
                        input: {
                          inputComponent: PercentageFormatCustom,
                          inputProps: {
                            name: "withdrawAnnualizedReturn",
                            onChange: handleReturnDetailChange,
                            style: { textAlign: "right" },
                          },
                        },
                      }}
                    />
                  </Grid>
                </Grid>
              </>
            )}

            {showFields.divWithholdTaxField && (
              <Grid
                size={{
                  xs: 12,
                  sm: "grow",
                  md:
                    simul.returnDetail.returnType !== RETURN_TYPES.PORTFOLIO
                      ? "grow"
                      : 1.5,
                }}
              >
                
                <TextField
                  id="divTax"
                  disabled={(! haveStock && simul.returnDetail.returnType === RETURN_TYPES.PORTFOLIO)}
                  label={t("labels.divTax")}
                  value={simul.returnDetail.divTax || ""}
                  fullWidth
                  sx={{ mt: simul.returnDetail.returnType === RETURN_TYPES.PORTFOLIO?2:0 }}
                  slotProps={{
                    input: {
                      inputComponent: PercentageFormatCustom,                     
                      inputProps: {
                        name: "divTax",
                        onChange: handleReturnDetailChange,
                        style: { textAlign: "right" },
                      },
                    },
                  }}
                />
              </Grid>
            )}

            {showFields.backTestYearField && (
              <Grid
                size={{
                  xs: 12,
                  sm: `grow`,
                  md: "grow",
                }}
              >
                <TextField
                  id="backTestYear"
                  disabled={(! haveStock && simul.returnDetail.returnType === RETURN_TYPES.PORTFOLIO)}
                  label={t("labels.backTestYear")}
                  sx={{ mt: simul.returnDetail.returnType === RETURN_TYPES.PORTFOLIO?2:0 }}
                 
                  value={simul.returnDetail.backTestYear || ""}
                  type="number"
                  fullWidth
                  slotProps={{
                    input: {
                      inputComponent: YearFormatCustom,
                      inputProps: {
                        name: "backTestYear",
                        onChange: handleReturnDetailChange,
                        style: { textAlign: "right" },
                      },
                    },
                  }}
                />
              </Grid>
            )}
          </Grid>

          <Grid container spacing={2} id="portfolioAllocation">
            <Grid size={{ xs: 12, sm: 12, md: 12 }}>
              {showFields.stocksContainer && (
                <Grid
                  xs={12}
                  sx={{ mt: { xs: 3, sm: 3, md: 4, lg: 4, xl: 4 } }}
                >
                  <PortfolioAllocationForm />
                </Grid>
              )}
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
}

export default ReturnTypeCard;
