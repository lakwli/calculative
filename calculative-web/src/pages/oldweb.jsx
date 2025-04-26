import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Grid,
  IconButton
} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';

const OldWeb = () => {
  // Form state
  const [formData, setFormData] = useState({
    age: '56',
    initialCapital: '1000000',
    yearlyWithdraw: '60000',
    inflation: '3.0',
    returnType: '',
    fixReturn: '9',
    index: '',
    backTestYear: '1999',
    divWithholdTax: '30'
  });

  // Stock fields state
  const [stocks, setStocks] = useState([{ id: 1, value: '' }]);
  const [allocation, setAllocation] = useState('');
  const [results, setResults] = useState([]);

  // Handle form input changes
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Format number with commas
  const formatNumber = (value) => {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Handle number input with formatting
  const handleNumberInput = (event) => {
    const { name, value } = event.target;
    const numericValue = value.replace(/,/g, '').replace(/\D/g, '');
    setFormData(prev => ({
      ...prev,
      [name]: formatNumber(numericValue)
    }));
  };

  // Handle percentage input
  const handlePercentInput = (event) => {
    const { name, value } = event.target;
    let cleanValue = value.replace(/[^0-9.]/g, '');
    const dotIndex = cleanValue.indexOf('.');
    if (dotIndex !== -1) {
      cleanValue = cleanValue.substring(0, dotIndex + 1) + 
                  cleanValue.substring(dotIndex + 1).replace(/\./g, '');
      if (cleanValue.length > dotIndex + 2) {
        cleanValue = cleanValue.substring(0, dotIndex + 2);
      }
    }
    if (parseFloat(cleanValue) > 99.9) {
      cleanValue = '99.9';
    }
    setFormData(prev => ({
      ...prev,
      [name]: cleanValue
    }));
  };

  // Add stock field
  const addStockField = () => {
    if (stocks.length < 3) {
      const newId = stocks[stocks.length - 1].id + 1;
      setStocks([...stocks, { id: newId, value: '' }]);
    }
  };

  // Remove stock field
  const removeStockField = (id) => {
    setStocks(stocks.filter(stock => stock.id !== id));
  };

  // Handle stock input change
  const handleStockChange = (id, value) => {
    setStocks(stocks.map(stock => 
      stock.id === id ? { ...stock, value: value.toUpperCase() } : stock
    ));
  };

  // Get portfolio data
  const getPortfolioData = () => {
    const portfolio = {};
    const stockValues = stocks.map(s => s.value).filter(Boolean);

    if (allocation === 'even') {
      const equalAllocation = 1 / stockValues.length;
      stockValues.forEach(stock => {
        portfolio[stock] = equalAllocation;
      });
    } else if (allocation) {
      const allocations = allocation.split('-').map(Number);
      stockValues.forEach((stock, index) => {
        if (allocations[index] !== undefined) {
          portfolio[stock] = allocations[index] / 100;
        }
      });
    } else if (stockValues.length === 1) {
      portfolio[stockValues[0]] = 1.0;
    }

    return portfolio;
  };

  // Handle form submission
  const handleSubmit = async () => {
    const data = {
      age: parseInt(formData.age),
      initialCapital: parseInt(formData.initialCapital.replace(/,/g, '')),
      yearlyWithdraw: parseInt(formData.yearlyWithdraw.replace(/,/g, '')),
      inflation: parseFloat(formData.inflation),
      returnType: formData.returnType,
      fixReturn: parseFloat(formData.fixReturn),
      index: formData.index,
      backTestYear: parseInt(formData.backTestYear),
      divWithholdTax: parseInt(formData.divWithholdTax),
      portfolio: getPortfolioData()
    };

    try {
        //const response = await fetch('http://localhost:5002/getCal', {
        const response = await fetch('https://api.numberwalk.com/getCal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      const responseData = await response.json();
      setResults(responseData);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Get allocation options based on number of stocks
  const getAllocationOptions = () => {
    const options = [{ value: 'even', label: 'Even' }];
    
    if (stocks.length === 2) {
      options.push(
        { value: '60-40', label: '60/40' },
        { value: '70-30', label: '70/30' }
      );
    } else if (stocks.length === 3) {
      options.push(
        { value: '50-30-20', label: '50/30/20' },
        { value: '60-20-20', label: '60/20/20' },
        { value: '60-30-10', label: '60/30/10' }
      );
    }
    
    return options;
  };

  return (
    <Container>
      <Typography variant="h4" align="center" gutterBottom>
        Retirement Simulation (Simple2)
      </Typography>

      <Box component="form" noValidate sx={{ mt: 3 }}>
        <Grid container spacing={3}>
          {/* Basic Information */}
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              label="Age (20-70)"
              name="age"
              value={formData.age}
              onChange={handleInputChange}
              type="number"
              inputProps={{ min: 20, max: 70 }}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              label="Initial Capital ($)"
              name="initialCapital"
              value={formData.initialCapital}
              onChange={handleNumberInput}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              label="Yearly Withdraw ($)"
              name="yearlyWithdraw"
              value={formData.yearlyWithdraw}
              onChange={handleNumberInput}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              label="Inflation (%)"
              name="inflation"
              value={formData.inflation}
              onChange={handlePercentInput}
            />
          </Grid>

          {/* Return Type Selection */}
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth>
              <InputLabel>Return Type</InputLabel>
              <Select
                name="returnType"
                value={formData.returnType}
                onChange={handleInputChange}
                label="Return Type"
              >
                <MenuItem value="S">Simple Return</MenuItem>
                <MenuItem value="M">Market Index</MenuItem>
                <MenuItem value="I">Stock/ETF</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Conditional Fields based on Return Type */}
          {formData.returnType === 'S' && (
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="Expected Return (%)"
                name="fixReturn"
                value={formData.fixReturn}
                onChange={handlePercentInput}
                type="number"
              />
            </Grid>
          )}

          {formData.returnType === 'M' && (
            <>
              <Grid item xs={12} sm={3}>
                <FormControl fullWidth>
                  <InputLabel>Index</InputLabel>
                  <Select
                    name="index"
                    value={formData.index}
                    onChange={handleInputChange}
                    label="Index"
                  >
                    <MenuItem value="^GSPC">S&P500</MenuItem>
                    <MenuItem value="^DJI">Nasdaq</MenuItem>
                    <MenuItem value="^IXIC">Dow Jones</MenuItem>
                    <MenuItem value="^RUT">Small Cap 2000</MenuItem>
                    <MenuItem value="^NYA">MSCI World</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth
                  label="Back Test Year"
                  name="backTestYear"
                  value={formData.backTestYear}
                  onChange={handleInputChange}
                  type="number"
                />
              </Grid>
            </>
          )}

          {formData.returnType === 'I' && (
            <>
              {/* Stock Fields */}
              {stocks.map((stock, index) => (
                <Grid item xs={12} sm={3} key={stock.id}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <TextField
                      fullWidth
                      label={`Stock ${index + 1}`}
                      value={stock.value}
                      onChange={(e) => handleStockChange(stock.id, e.target.value)}
                    />
                    {index === stocks.length - 1 && stocks.length < 3 && (
                      <IconButton onClick={addStockField} color="primary">
                        <AddCircleIcon />
                      </IconButton>
                    )}
                    {stocks.length > 1 && (
                      <IconButton onClick={() => removeStockField(stock.id)} color="error">
                        <RemoveCircleIcon />
                      </IconButton>
                    )}
                  </Box>
                </Grid>
              ))}

              {stocks.length > 1 && (
                <Grid item xs={12} sm={3}>
                  <FormControl fullWidth>
                    <InputLabel>Allocation</InputLabel>
                    <Select
                      value={allocation}
                      onChange={(e) => setAllocation(e.target.value)}
                      label="Allocation"
                    >
                      {getAllocationOptions().map(option => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              )}

              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth
                  label="Back Test Year"
                  name="backTestYear"
                  value={formData.backTestYear}
                  onChange={handleInputChange}
                  type="number"
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth
                  label="Dividend Tax (%)"
                  name="divWithholdTax"
                  value={formData.divWithholdTax}
                  onChange={handlePercentInput}
                  type="number"
                />
              </Grid>
            </>
          )}
        </Grid>

        <Box sx={{ mt: 3, mb: 3 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            startIcon={<AddCircleIcon />}
          >
            Generate
          </Button>
        </Box>

        {/* Results Table */}
        {results.length > 0 && (
          <TableContainer component={Paper} sx={{ mt: 3 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Age</TableCell>
                  <TableCell>Year</TableCell>
                  <TableCell align="right">Beginning Capital ($)</TableCell>
                  <TableCell align="right">Withdrawal ($)</TableCell>
                  <TableCell align="right">Capital After Withdrawal ($)</TableCell>
                  <TableCell align="right">Capital Gain ($)</TableCell>
                  <TableCell align="right">After Tax Dividend ($)</TableCell>
                  <TableCell align="right">End of Year Capital ($)</TableCell>
                  <TableCell align="right">After Tax Yearly Return (%)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {results.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{row['Age']}</TableCell>
                    <TableCell>{row['Year']}</TableCell>
                    <TableCell align="right">{row['Beginning Capital ($)']}</TableCell>
                    <TableCell align="right">{row['Withdrawal ($)']}</TableCell>
                    <TableCell align="right">{row['Capital After Withdrawal ($)']}</TableCell>
                    <TableCell align="right">{row['Capital Gain ($)']}</TableCell>
                    <TableCell align="right">{row['Net Dividend ($)']}</TableCell>
                    <TableCell align="right">{row['End of Year Capital ($)']}</TableCell>
                    <TableCell align="right">{row['Effective Return (%)']}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </Container>
  );
};

export default OldWeb;
