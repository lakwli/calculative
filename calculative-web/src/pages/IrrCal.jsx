import React, { useState } from "react";
import "../styles/App.css"; // Import existing styles
import "../styles/irr.css"; // Import existing styles
import "../index.css"; // Import existing styles
import CustomTextField from "../styles/textfieldStyles";
import { PrimaryButton, SecondaryButton } from "../styles/buttonStyles";
import {
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { NumericFormat } from "react-number-format";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

const calculateIRR = (cashflows) => {
  let guess = 0.1;
  const maxIterations = 100;
  const tolerance = 0.0000001;

  for (let i = 0; i < maxIterations; i++) {
    let npv = 0;
    let derivativeNPV = 0;
    const firstDate = new Date(cashflows[0].date);

    cashflows.forEach((cf) => {
      const date = new Date(cf.date);
      const years = (date - firstDate) / (365 * 24 * 60 * 60 * 1000);
      const amount = cf.type === "deposit" ? -cf.amount : cf.amount;

      npv += amount / Math.pow(1 + guess, years);
      derivativeNPV += (-years * amount) / Math.pow(1 + guess, years + 1);
    });

    const nextGuess = guess - npv / derivativeNPV;
    if (Math.abs(nextGuess - guess) < tolerance) {
      return nextGuess;
    }
    guess = nextGuess;
  }
  return guess;
};

const generateVerificationTable = (cashflows, irr) => {
  const sortedCashflows = [...cashflows].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );
  let balance = 0;
  const firstDate = new Date(sortedCashflows[0].date);
  const lastDate = new Date(sortedCashflows[sortedCashflows.length - 1].date);
  const result = [];
  let lastYearFraction = 0;

  // Get all years between first and last transaction
  const startYear = firstDate.getFullYear();
  const endYear = lastDate.getFullYear();
  const years = new Set();
  for (let year = startYear; year <= endYear; year++) {
    years.add(year);
  }

  // Process actual cashflows and EOY projections
  const allDates = [
    ...sortedCashflows.map((cf) => ({
      date: cf.date,
      isTransaction: true,
      cashflow: cf,
      isFinal: false,
    })),
  ];

  // Add EOY dates
  Array.from(years).forEach((year) => {
    const eoyDate = `${year}-12-31`;
    if (!sortedCashflows.some((cf) => cf.date === eoyDate)) {
      allDates.push({
        date: eoyDate,
        isTransaction: false,
        isFinal: false,
      });
    }
  });

  // Find the last actual transaction
  const lastTransaction = sortedCashflows[sortedCashflows.length - 1];
  const lastTransactionDate = new Date(lastTransaction.date);
  const preFinalDate = new Date(lastTransactionDate);
  preFinalDate.setDate(preFinalDate.getDate() - 1);

  // Add pre-final balance date
  allDates.push({
    date: preFinalDate.toISOString().split("T")[0],
    isTransaction: false,
    isPreFinal: true,
  });

  // Mark the last transaction
  allDates.find((d) => d.date === lastTransaction.date).isFinal = true;

  // Sort all dates
  allDates.sort((a, b) => new Date(a.date) - new Date(b.date));

  // Process each date
  allDates.forEach((entry) => {
    const date = new Date(entry.date);
    const yearFraction = (date - firstDate) / (365 * 24 * 60 * 60 * 1000);
    let growthAmount = 0;
    let transactionAmount = 0;

    if (yearFraction > 0) {
      const newBalance =
        balance * Math.pow(1 + irr, yearFraction - lastYearFraction);
      growthAmount = newBalance - balance;
      balance = newBalance;
    }

    if (entry.isTransaction) {
      const cf = entry.cashflow;
      transactionAmount = cf.type === "deposit" ? cf.amount : -cf.amount;

      // Update the final balance with both growth and transaction
      balance += transactionAmount;

      result.push({
        date: entry.date,
        type: cf.type === "deposit" ? "deposit" : "withdraw",
        amount: Math.abs(cf.amount),
        growthAmount: Math.round(growthAmount * 100) / 100,
        balance: Math.round(balance * 100) / 100,
        isEoy: false,
        isPreFinal: false,
        isFinal: entry.isFinal,
      });
    } else if (entry.isPreFinal) {
      result.push({
        date: entry.date,
        type: "Pre-Final Balance",
        amount: 0,
        growthAmount: Math.round(growthAmount * 100) / 100,
        balance: Math.round(balance * 100) / 100,
        isEoy: false,
        isPreFinal: true,
        isFinal: false,
      });
    } else {
      // EOY projection
      result.push({
        date: entry.date,
        type: "EOY Balance",
        amount: 0,
        growthAmount: Math.round(growthAmount * 100) / 100,
        balance: Math.round(balance * 100) / 100,
        isEoy: true,
        isPreFinal: false,
        isFinal: false,
      });
    }

    lastYearFraction = yearFraction;
  });

  return result;
};

const generateCashflows = (baseFlow, occurrence) => {
  if (!occurrence || occurrence.count <= 1) return [baseFlow];

  const flows = [];
  const baseDate = new Date(baseFlow.date);

  for (let i = 0; i < occurrence.count; i++) {
    const newDate = new Date(baseDate);

    if (occurrence.frequency === "year") {
      newDate.setFullYear(baseDate.getFullYear() + i);
    } else if (occurrence.frequency === "quarter") {
      newDate.setMonth(baseDate.getMonth() + i * 3);
    }

    flows.push({
      ...baseFlow,
      date: newDate.toISOString().split("T")[0],
    });
  }

  return flows;
};

const IrrCal = () => {
  const [cashflows, setCashflows] = useState([
    {
      id: 1,
      date: "",
      amount: "",
      type: "deposit",
      occurrence: { frequency: "none", count: 1 },
    },
    {
      id: 2,
      date: "",
      amount: "",
      type: "received",
      occurrence: { frequency: "none", count: 1 },
    },
  ]);
  const [result, setResult] = useState(null);
  const [draggedId, setDraggedId] = useState(null);

  const handleDragStart = (e, id) => {
    setDraggedId(id);
    e.currentTarget.classList.add("dragging");
  };

// Update the drag handlers
const handleDragEnd = (e) => {
  e.currentTarget.classList.remove('dragging');
  setDraggedId(null);
  // Remove drag-over class from all rows
  document.querySelectorAll('.cashflow-row').forEach(row => {
    row.classList.remove('drag-over');
  });
};


  const handleDragOver = (e, id) => {
    e.preventDefault();
    if (draggedId === id) return;

      // Remove drag-over class from all rows first
  document.querySelectorAll('.cashflow-row').forEach(row => {
    row.classList.remove('drag-over');
  });
  // Add drag-over class only to current target
  e.currentTarget.classList.add('drag-over');

    const draggedIndex = cashflows.findIndex((cf) => cf.id === draggedId);
    const hoverIndex = cashflows.findIndex((cf) => cf.id === id);

    if (draggedIndex === -1 || hoverIndex === -1) return;

    const draggedRow = e.currentTarget.parentNode.children[draggedIndex];
    const hoverRow = e.currentTarget.parentNode.children[hoverIndex];

    if (draggedRow && hoverRow) {
      const hoverBoundingRect = hoverRow.getBoundingClientRect();
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = e.clientY - hoverBoundingRect.top;

      // Only perform the move when mouse has crossed half of the item's height
      if (draggedIndex < hoverIndex && clientOffset < hoverMiddleY) return;
      if (draggedIndex > hoverIndex && clientOffset > hoverMiddleY) return;

      // Perform the reorder
      const newCashflows = [...cashflows];
      const [removed] = newCashflows.splice(draggedIndex, 1);
      newCashflows.splice(hoverIndex, 0, removed);
      setCashflows(newCashflows);
    }
  };

  const handleDragEnter = (e) => {
    e.currentTarget.classList.add("drag-over");
  };

  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove("drag-over");
  };

  const handleAddCashflow = () => {
    setCashflows([
      ...cashflows,
      {
        id: Date.now(),
        date: "",
        amount: "",
        type: "deposit",
        occurrence: { frequency: "none", count: 1 },
      },
    ]);
  };

  const handleRemoveCashflow = (id) => {
    setCashflows(cashflows.filter((cf) => cf.id !== id));
  };

  const handleCashflowChange = (id, field, value) => {
    setCashflows(
      cashflows.map((cf) => (cf.id === id ? { ...cf, [field]: value } : cf))
    );
  };

  const handleOccurrenceChange = (id, field, value) => {
    setCashflows(
      cashflows.map((cf) =>
        cf.id === id
          ? {
              ...cf,
              occurrence: {
                ...cf.occurrence,
                [field]: value,
              },
            }
          : cf
      )
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const isValid = cashflows.every(
      (cf) =>
        cf.date &&
        cf.amount &&
        !isNaN(parseFloat(cf.amount)) &&
        parseFloat(cf.amount) > 0
    );

    if (!isValid) {
      alert("Please fill all fields with valid values");
      return;
    }

    const expandedCashflows = cashflows
      .flatMap((cf) =>
        generateCashflows(
          {
            date: cf.date,
            amount: parseFloat(cf.amount),
            type: cf.type,
          },
          cf.occurrence
        )
      )
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    const irr = calculateIRR(expandedCashflows);
    const verificationTable = generateVerificationTable(expandedCashflows, irr);

    setResult({
      irr: irr * 100,
      table: verificationTable,
    });
  };

  return (
    <Box sx={{ mt: 1 }}>
      <Grid container spacing={2}>
      {/** 
        <Grid size={{ xs: 12, sm: 12 }}>
          <Typography variant="h4" gutterBottom>
            Dynamic Cashflow IRR Calculator
          </Typography>
        </Grid> */}

        <Grid size={{ xs: 12, sm: 12 }}>
          <form onSubmit={handleSubmit}>
            <Box sx={{ width: "100%", mt: 2, mb: 3 }}>
              {cashflows.map((cf) => (
                <Box
                  key={cf.id}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    mb: 2,
                    width: "100%",
                    "& .MuiFormControl-root": {
                      height: "40px",
                    },
                    "& .MuiInputBase-root": {
                      height: "40px",
                    },
                  }}
                  className="cashflow-row"
                  draggable="true"
                  onDragStart={(e) => handleDragStart(e, cf.id)}
                  onDragEnd={handleDragEnd}
                  onDragOver={(e) => handleDragOver(e, cf.id)}
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                >
                  <Box
                    sx={{ width: "30px", cursor: "move", textAlign: "center" }}
                  >
                    ⋮⋮
                  </Box>

                  <FormControl sx={{ minWidth: "150px" }} size="small">
                    
                    <Select
                      value={cf.type}
                      onChange={(e) =>
                        handleCashflowChange(cf.id, "type", e.target.value)
                      }
                    >
                      <MenuItem value="deposit">Contribute</MenuItem>
                      <MenuItem value="received">Received</MenuItem>
                    </Select>
                  </FormControl>

                  <CustomTextField
                    size="small"
                    type="date"
                    value={cf.date}
                    onChange={(e) =>
                      handleCashflowChange(cf.id, "date", e.target.value)
                    }
                    required
                    sx={{ width: "180px" }}
                    InputLabelProps={{ shrink: true }}
                  />

                  <NumericFormat
                    customInput={CustomTextField}
                    size="small"
                    value={cf.amount}
                    onValueChange={(values) =>
                      handleCashflowChange(cf.id, "amount", values.value)
                    }
                    thousandSeparator
                    prefix="$"
                    placeholder="Amount"
                    decimalScale={2}
                    required
                    sx={{ width: "120px" }}
                  />

                  <FormControl sx={{ minWidth: "120px" }} size="small">
                    <Select
                      value={cf.occurrence.frequency}
                      onChange={(e) =>
                        handleOccurrenceChange(
                          cf.id,
                          "frequency",
                          e.target.value
                        )
                      }
                    >
                      <MenuItem value="none">One time</MenuItem>
                      <MenuItem value="year">Yearly</MenuItem>
                      <MenuItem value="quarter">Quarterly</MenuItem>
                    </Select>
                  </FormControl>

                  <Box sx={{ width: "80px" }}>
                    {cf.occurrence.frequency !== "none" ? (
                      <CustomTextField
                        size="small"
                        type="number"
                        value={cf.occurrence.count}
                        onChange={(e) => {
                          const value = Math.min(
                            999,
                            parseInt(e.target.value) || 0
                          );
                          handleOccurrenceChange(cf.id, "count", value);
                        }}
                        inputProps={{
                          min: "1",
                          max: "999",
                          maxLength: 3,
                        }}
                        required
                        fullWidth
                      />
                    ) : (
                      <Box sx={{ height: "40px" }} />
                    )}
                  </Box>

                  <Box sx={{ width: "40px" }}>
                    {cashflows.length > 2 && (
                      <SecondaryButton
                        type="button"
                        onClick={() => handleRemoveCashflow(cf.id)}
                        className="remove-btn"
                        size="small"
                        sx={{
                          minWidth: "36px",
                          height: "36px",
                          p: 0,
                          color: "error.main",
                          border: "none",
                          outline: "none",
                          "&:focus": {
                            outline: "none",
                            border: "none",
                          },
                          "&:hover": {
                            backgroundColor: (theme) =>
                              alpha(theme.palette.error.main, 0.08),
                            border: "none",
                            outline: "none",
                            "& .MuiSvgIcon-root": {
                              color: "error.dark",
                            },
                          },
                        }}
                      >
                        <DeleteOutlineIcon fontSize="small" />
                      </SecondaryButton>
                    )}
                  </Box>
                </Box>
              ))}
            </Box>

            <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
              <SecondaryButton
                type="button"
                onClick={handleAddCashflow}
                className="add-btn"
              >
                Add Cashflow
              </SecondaryButton>

              <PrimaryButton type="submit" className="submit-btn">
                Calculate IRR
              </PrimaryButton>
            </Box>
          </form>
        </Grid>

        {result && (
          <Grid xs={12} className="results" sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom>
              Results
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontSize: "1.25rem",
                fontWeight: 600,
                color: "primary.main",
                mb: 3,
              }}
            >
              Internal Rate of Return (IRR): {result.irr.toFixed(2)}%
            </Typography>

            <Typography variant="h6" gutterBottom>
              Verification Table
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontStyle: "italic",
                color: "text.secondary",
                mb: 2,
              }}
            >
              This table demonstrates the equivalent scenario of a fixed-term
              deposit with an annual compounding rate matching the calculated
              IRR, validating the return calculation over the investment period.
            </Typography>

            <TableContainer
              component={Paper}
              sx={{
                mb: 4,
                boxShadow: 2,
                borderRadius: 1,
                overflow: "hidden",
                "& .MuiTableHead-root": {
                  bgcolor: (theme) =>
                    theme.palette.mode === "light" ? "grey.800" : "grey.100",
                },
                "& .MuiTableHead-root .MuiTableCell-head": {
                  color: (theme) =>
                    theme.palette.mode === "light"
                      ? "common.white"
                      : "common.black",
                  fontWeight: 600,
                },
              }}
            >
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell align="right">Amount</TableCell>
                    <TableCell align="right">Growth</TableCell>
                    <TableCell align="right">Balance</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {result.table.map((row, index) => (
                    <TableRow
                      key={index}
                      sx={(theme) => ({
                        "&.eoy-row": {
                          backgroundColor:
                            theme.palette.mode === "light"
                              ? alpha(theme.palette.primary.main, 0.08)
                              : alpha(theme.palette.primary.main, 0.15),
                          "& td": {
                            color: theme.palette.primary.main,
                            fontWeight: 600,
                            borderBottom: `2px solid ${theme.palette.primary.main}`,
                          },
                        },
                        "&.pre-final-row": {
                          backgroundColor:
                            theme.palette.mode === "light"
                              ? alpha(theme.palette.success.main, 0.08)
                              : alpha(theme.palette.success.main, 0.15),
                          "& td": {
                            color: theme.palette.success.main,
                            fontWeight: 600,
                            borderBottom: `2px solid ${theme.palette.success.main}`,
                          },
                        },
                        "&:hover": {
                          backgroundColor:
                            theme.palette.mode === "light"
                              ? alpha(theme.palette.action.hover, 0.1)
                              : alpha(theme.palette.action.hover, 0.2),
                        },
                      })}
                      className={
                        row.isEoy
                          ? "eoy-row"
                          : row.isPreFinal
                          ? "pre-final-row"
                          : ""
                      }
                    >
                      <TableCell>{row.date}</TableCell>
                      <TableCell>{row.type}</TableCell>
                      <TableCell align="right" sx={{ fontFamily: "monospace" }}>
                        $
                        {row.type === "withdraw"
                          ? `-${row.amount.toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}`
                          : row.amount.toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                      </TableCell>
                      <TableCell align="right" sx={{ fontFamily: "monospace" }}>
                        $
                        {row.growthAmount.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </TableCell>
                      <TableCell align="right" sx={{ fontFamily: "monospace" }}>
                        $
                        {row.balance.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default IrrCal;
