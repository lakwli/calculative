import React, { useState, useRef } from "react";
import "../styles/App.css";
import "../styles/irr.css";
import "../index.css";
import CustomTextField from "../styles/textfieldStyles";
import { PrimaryButton, SecondaryButton } from "../styles/buttonStyles";
import {
  Box,
  Select,
  MenuItem,
  FormControl,
  Typography,
  IconButton,
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
import AutorenewIcon from '@mui/icons-material/Autorenew';

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

  const startYear = firstDate.getFullYear();
  const endYear = lastDate.getFullYear();
  const years = new Set();
  for (let year = startYear; year <= endYear; year++) {
    years.add(year);
  }

  const allDates = [
    ...sortedCashflows.map((cf) => ({
      date: cf.date,
      isTransaction: true,
      cashflow: cf,
      isFinal: false,
    })),
  ];

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

  const lastTransaction = sortedCashflows[sortedCashflows.length - 1];
  const lastTransactionDate = new Date(lastTransaction.date);
  const preFinalDate = new Date(lastTransactionDate);
  preFinalDate.setDate(preFinalDate.getDate() - 1);

  allDates.push({
    date: preFinalDate.toISOString().split("T")[0],
    isTransaction: false,
    isPreFinal: true,
  });

  allDates.find((d) => d.date === lastTransaction.date).isFinal = true;
  allDates.sort((a, b) => new Date(a.date) - new Date(b.date));

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
      const totalMonths = i * 3;
      const yearsToAdd = Math.floor(totalMonths / 12);
      const remainingMonths = totalMonths % 12;
      newDate.setFullYear(baseDate.getFullYear() + yearsToAdd);
      newDate.setMonth(baseDate.getMonth() + remainingMonths);
    }

    flows.push({
      ...baseFlow,
      date: newDate.toISOString().split("T")[0],
    });
  }

  return flows;
};

const IrrCal = () => {
  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const [cashflows, setCashflows] = useState([
    {
      id: 1,
      date: getTomorrowDate(),
      amount: "",
      type: "deposit",
      occurrence: { frequency: "none", count: 1 }
    },
    {
      id: 2,
      date: "",
      amount: "",
      type: "received",
      occurrence: { frequency: "none", count: 1 }
    },
  ]);
  const [result, setResult] = useState(null);
  const [draggedId, setDraggedId] = useState(null);
  const formRef = useRef(null);

  const handleDragStart = (e, id) => {
    setDraggedId(id);
    e.currentTarget.classList.add("dragging");
  };

  const handleDragEnd = (e) => {
    e.currentTarget.classList.remove('dragging');
    setDraggedId(null);
    document.querySelectorAll('.cashflow-row').forEach(row => {
      row.classList.remove('drag-over');
    });
  };

  const handleDragOver = (e, id) => {
    e.preventDefault();
    if (draggedId === id) return;

    document.querySelectorAll('.cashflow-row').forEach(row => {
      row.classList.remove('drag-over');
    });
    e.currentTarget.classList.add('drag-over');

    const draggedIndex = cashflows.findIndex((cf) => cf.id === draggedId);
    const hoverIndex = cashflows.findIndex((cf) => cf.id === id);

    if (draggedIndex === -1 || hoverIndex === -1) return;

    const draggedRow = e.currentTarget.parentNode.children[draggedIndex];
    const hoverRow = e.currentTarget.parentNode.children[hoverIndex];

    if (draggedRow && hoverRow) {
      const hoverBoundingRect = hoverRow.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = e.clientY - hoverBoundingRect.top;

      if (draggedIndex < hoverIndex && clientOffset < hoverMiddleY) return;
      if (draggedIndex > hoverIndex && clientOffset > hoverMiddleY) return;

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

  const handleAutoFill = (currentId) => {
    const currentIndex = cashflows.findIndex(cf => cf.id === currentId);
    if (currentIndex <= 0) return;

    const currentFlow = cashflows[currentIndex];
    const prevFlow = cashflows[currentIndex - 1];
    if (!prevFlow || prevFlow.type !== currentFlow.type || !prevFlow.date || prevFlow.occurrence.frequency === 'none') return;

    const prevDate = new Date(prevFlow.date);
    const newDate = new Date(prevDate);
    if (prevFlow.occurrence.frequency === 'year') {
      newDate.setFullYear(prevDate.getFullYear() + prevFlow.occurrence.count);
    } else if (prevFlow.occurrence.frequency === 'quarter') {
      const totalMonths = prevFlow.occurrence.count * 3;
      const yearsToAdd = Math.floor(totalMonths / 12);
      const remainingMonths = totalMonths % 12;
      newDate.setFullYear(prevDate.getFullYear() + yearsToAdd);
      newDate.setMonth(prevDate.getMonth() + remainingMonths);
    }
    
    handleCashflowChange(currentId, "date", newDate.toISOString().split('T')[0]);
  };

  const canAutoFill = (currentId) => {
    const currentIndex = cashflows.findIndex(cf => cf.id === currentId);
    if (currentIndex <= 0) return false;

    const currentFlow = cashflows[currentIndex];
    const prevFlow = cashflows[currentIndex - 1];

    return currentFlow.type === prevFlow.type &&
           prevFlow.date && 
           prevFlow.occurrence.frequency !== 'none' &&
           prevFlow.occurrence.count > 0;
  };

  const handleAddCashflow = () => {
    const lastCashflow = cashflows[cashflows.length - 1];
    setCashflows([
      ...cashflows,
      {
        id: Date.now(),
        date: "",
        amount: "",
        type: lastCashflow.type,
        occurrence: { frequency: "none", count: 1 }
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

  const clearAllValidation = () => {
    if (!formRef.current) return;
    const inputs = formRef.current.querySelectorAll('input');
    inputs.forEach(input => {
      input.setCustomValidity('');
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    clearAllValidation();

    // Missing required fields validation
    const missingRequired = cashflows.some(cf => !cf.date || !cf.amount);
    if (missingRequired) {
      const form = formRef.current;
      if (form) {
        const emptyField = form.querySelector('input[required]:invalid');
        if (emptyField) {
          emptyField.setCustomValidity('This field is required');
          emptyField.reportValidity();
          return;
        }
      }
      return;
    }

    const invalidAmount = cashflows.some(cf => {
      const amount = parseFloat(cf.amount);
      return isNaN(amount) || amount <= 0;
    });

    if (invalidAmount) {
      const firstInvalidInput = document.querySelector(`input[data-type="amount"]:invalid`);
      if (firstInvalidInput) {
        firstInvalidInput.setCustomValidity('Amount must be greater than zero');
        firstInvalidInput.reportValidity();
        return;
      }
    }

    // Process cashflows and calculate IRR
    const expandedCashflows = cashflows.flatMap((cf) =>
      generateCashflows(
        {
          date: cf.date,
          amount: parseFloat(cf.amount),
          type: cf.type,
        },
        cf.occurrence
      )
    ).sort((a, b) => new Date(a.date) - new Date(b.date));

    const totalContributions = expandedCashflows
      .filter(cf => cf.type === 'deposit')
      .reduce((sum, cf) => sum + parseFloat(cf.amount), 0);

    const totalReceived = expandedCashflows
      .filter(cf => cf.type === 'received')
      .reduce((sum, cf) => sum + parseFloat(cf.amount), 0);

    if (totalReceived <= totalContributions) {
      const message = `Total received must exceed $${totalContributions.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
      
      cashflows.forEach(cf => {
        if (cf.type === 'received') {
          const input = document.getElementById(`amount-${cf.id}`);
          if (input) {
            input.setCustomValidity(message);
            input.reportValidity();
            setTimeout(() => {
              if (input && document.contains(input)) {
                input.setCustomValidity('');
              }
            }, 5000);
          }
        }
      });
      return;
    }

    const irr = calculateIRR(expandedCashflows);
    const verificationTable = generateVerificationTable(expandedCashflows, irr);

    setResult({
      irr: irr * 100,
      table: verificationTable,
    });
  };

  return (
    <Box sx={{ mt: 1 }}>
      <Grid container spacing={0} sx={{ mt: 1 }}>
        <Grid item xs={12} sx={{ px: 3 }}>
          <Paper elevation={2} sx={{ width: '100%', p: 3, borderRadius: 2, mb: 3, background: 'linear-gradient(to right, #ffffff, #f8f9fa)', boxSizing: 'border-box' }}>
            <Typography variant="body1" sx={{ mb: 2, color: 'text.secondary', lineHeight: 1.6 }}>
              A person told you that there is a good return saving fund that could help you build your wealth over time.
            </Typography>

            <Typography variant="body1" sx={{ mb: 2, color: 'text.secondary', lineHeight: 1.6 }}>
              The investment structure is interesting - you contribute some money initially and continue with regular contributions each year for a specified period.
            </Typography>

            <Typography variant="body1" sx={{ mb: 2, color: 'text.secondary', lineHeight: 1.6 }}>
              What makes this fund unique is its tiered return structure: you'll receive a certain percentage return for the first few years, followed by higher returns in subsequent years, and even higher returns in the later years. As a bonus, at the end of a 20-year term, you'll receive an additional amount, bringing your total returns to an enticing sum.
            </Typography>

            <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary', lineHeight: 1.6 }}>
              Is this sound good to you? Let's use this calculator to find out if the returns match your expectations!
            </Typography>

            <Typography variant="h5" gutterBottom sx={{ color: 'text.primary', fontWeight: 500, mb: 3 }}>
              Fund Return Calculator
            </Typography>
            <form ref={formRef} onSubmit={handleSubmit} noValidate>
              <Box sx={{ 
                width: "100%", 
                mb: 3,
                '& .MuiFormControl-root, & input[type="date"]': {
                  backgroundColor: '#ffffff',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  },
                  '&:focus-within': {
                    boxShadow: '0 0 0 2px rgba(25, 118, 210, 0.2)'
                  }
                }
              }}>
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
                    <Box sx={{ width: "30px", cursor: "move", textAlign: "center" }}>⋮⋮</Box>

                    <FormControl sx={{ minWidth: "150px" }} size="small">
                      <Select
                        value={cf.type}
                        onChange={(e) => handleCashflowChange(cf.id, "type", e.target.value)}
                      >
                        <MenuItem value="deposit">Contribute</MenuItem>
                        <MenuItem value="received">Received</MenuItem>
                      </Select>
                    </FormControl>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, minWidth: '220px' }}>
                      <input
                        type="date"
                        value={cf.date}
                        onChange={(e) => {
                          handleCashflowChange(cf.id, "date", e.target.value);
                          e.target.setCustomValidity('');
                        }}
                        onInvalid={(e) => {
                          if (!e.target.value) {
                            e.target.setCustomValidity('Please select a date');
                          }
                        }}
                        required
                        aria-label="Date"
                        style={{
                          width: "180px",
                          height: "40px",
                          padding: "8.5px 14px",
                          border: "1px solid rgba(0, 0, 0, 0.23)",
                          borderRadius: "4px",
                          fontSize: "1rem",
                          fontFamily: '"Roboto","Helvetica","Arial",sans-serif',
                          cursor: "pointer",
                          backgroundColor: "transparent",
                          color: "inherit"
                        }}
                      />
                      <IconButton
                        size="small"
                        onClick={() => handleAutoFill(cf.id)}
                        disabled={!canAutoFill(cf.id)}
                        sx={{
                          opacity: canAutoFill(cf.id) ? 1 : 0.3,
                          transition: 'opacity 0.2s',
                          width: '32px',
                          height: '32px'
                        }}
                      >
                        <AutorenewIcon fontSize="small" />
                      </IconButton>
                    </Box>

                    <NumericFormat
                      customInput={CustomTextField}
                      id={`amount-${cf.id}`}
                      data-type="amount"
                      size="small"
                      value={cf.amount}
                      onValueChange={(values) => {
                        handleCashflowChange(cf.id, "amount", values.value);
                        const input = document.getElementById(`amount-${cf.id}`);
                        if (input) {
                          input.setCustomValidity('');
                        }
                      }}
                      thousandSeparator
                      prefix="$"
                      placeholder="Amount"
                      decimalScale={2}
                      required
                      min="0.01"
                      isAllowed={(values) => {
                        const { floatValue } = values;
                        return floatValue === undefined || floatValue > 0;
                      }}
                      sx={{ width: "120px", "& input": { textAlign: "right" } }}
                    />

                    <FormControl sx={{ minWidth: "120px" }} size="small">
                      <Select
                        value={cf.occurrence.frequency}
                        onChange={(e) => handleOccurrenceChange(cf.id, "frequency", e.target.value)}
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
                            const value = Math.min(999, parseInt(e.target.value) || 0);
                            handleOccurrenceChange(cf.id, "count", value);
                          }}
                          inputProps={{
                            min: "1",
                            max: "999",
                            maxLength: 3,
                          }}
                          required
                          fullWidth
                          sx={{ "& input": { textAlign: "right" } }}
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
                              backgroundColor: (theme) => alpha(theme.palette.error.main, 0.08),
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
                  sx={{
                    backgroundColor: 'rgba(25, 118, 210, 0.04)',
                    '&:hover': {
                      backgroundColor: 'rgba(25, 118, 210, 0.08)'
                    }
                  }}
                >
                  Add Cashflow
                </SecondaryButton>

                <PrimaryButton 
                  type="submit" 
                  className="submit-btn"
                  sx={{
                    boxShadow: '0 2px 4px rgba(25, 118, 210, 0.2)',
                    '&:hover': {
                      boxShadow: '0 4px 8px rgba(25, 118, 210, 0.3)'
                    }
                  }}
                >
                  Calculate IRR
                </PrimaryButton>
              </Box>
            </form>
          </Paper>
        </Grid>

        {result && (
          <Grid item xs={12} sx={{ mt: 6, px: 3 }}>
            <Paper 
              elevation={3} 
              sx={{ 
                width: '100%',
                p: 3, 
                mb: 4,
                borderRadius: 2,
                background: 'linear-gradient(to right, #f5f7fa, #ffffff)',
                position: 'relative',
                overflow: 'hidden',
                boxSizing: 'border-box'
              }}
            >
              <Box sx={{ position: 'relative', zIndex: 1 }}>
                <Typography variant="h5" gutterBottom sx={{ color: 'text.primary', fontWeight: 500 }}>
                  Calculated Results
                </Typography>
                <Typography 
                  variant="h3" 
                  sx={{ 
                    color: 'primary.main',
                    fontWeight: 700,
                    mb: 2,
                    display: 'flex',
                    alignItems: 'baseline',
                    gap: 1
                  }}
                >
                  {result.irr.toFixed(2)}%
                  <Typography component="span" variant="h6" sx={{ color: 'text.secondary', fontWeight: 400 }}>
                    Internal Rate of Return
                  </Typography>
                </Typography>
              </Box>
            </Paper>

            <Paper elevation={2} sx={{ width: '100%', p: 3, borderRadius: 2, boxSizing: 'border-box' }}>
              <Typography variant="h6" gutterBottom sx={{ color: 'text.primary', fontWeight: 500 }}>
                Verification Table
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3, maxWidth: '800px' }}>
                This table demonstrates the equivalent scenario of a fixed-term deposit with an annual compounding rate matching the calculated IRR, validating the return calculation over the investment period.
              </Typography>

              <TableContainer sx={{ 
                borderRadius: 1,
                overflow: 'hidden',
                '& .MuiTable-root': {
                  borderCollapse: 'separate',
                  borderSpacing: '0'
                }
              }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ 
                        backgroundColor: 'primary.main',
                        color: 'common.white',
                        fontWeight: 500,
                        '&:first-of-type': { borderTopLeftRadius: 8 },
                        '&:last-of-type': { borderTopRightRadius: 8 }
                      }}>Date</TableCell>
                      <TableCell sx={{ backgroundColor: 'primary.main', color: 'common.white', fontWeight: 500 }}>Type</TableCell>
                      <TableCell align="right" sx={{ backgroundColor: 'primary.main', color: 'common.white', fontWeight: 500 }}>Amount</TableCell>
                      <TableCell align="right" sx={{ backgroundColor: 'primary.main', color: 'common.white', fontWeight: 500 }}>Growth</TableCell>
                      <TableCell align="right" sx={{ backgroundColor: 'primary.main', color: 'common.white', fontWeight: 500 }}>Balance</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {result.table.map((row, index) => (
                      <TableRow 
                        key={index}
                        sx={{
                          backgroundColor: row.isEoy ? 'action.hover' : 'inherit',
                          '&:last-child td': { borderBottom: 0 },
                          '&:hover': {
                            backgroundColor: 'action.hover',
                          }
                        }}
                      >
                        <TableCell sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
                          {row.date}
                        </TableCell>
                        <TableCell sx={{ 
                          borderBottom: '1px solid',
                          borderColor: 'divider',
                          color: row.type === 'deposit' ? 'error.main' : row.type === 'received' ? 'success.main' : 'text.secondary',
                          fontWeight: row.type === 'Pre-Final Balance' ? 500 : 400
                        }}>
                          {row.type}
                        </TableCell>
                        <TableCell align="right" sx={{ 
                          fontFamily: "monospace",
                          borderBottom: '1px solid',
                          borderColor: 'divider',
                          color: row.amount > 0 ? (row.type === 'deposit' ? 'error.main' : 'success.main') : 'text.secondary'
                        }}>
                          {row.amount > 0 ? `$${row.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}` : '-'}
                        </TableCell>
                        <TableCell align="right" sx={{ 
                          fontFamily: "monospace",
                          borderBottom: '1px solid',
                          borderColor: 'divider',
                          color: row.growthAmount > 0 ? 'success.main' : row.growthAmount < 0 ? 'error.main' : 'text.secondary'
                        }}>
                          ${row.growthAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                        </TableCell>
                        <TableCell align="right" sx={{ 
                          fontFamily: "monospace",
                          borderBottom: '1px solid',
                          borderColor: 'divider',
                          fontWeight: row.isFinal || row.isPreFinal ? 600 : 400
                        }}>
                          ${row.balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default IrrCal;
