import React from 'react';
import { DataGrid } from '@mui/x-data-grid';

const columns = [
  { field: 'age', headerName: 'Age', width: 130 },
  { field: 'year', headerName: 'Year', width: 130 },
  { field: 'beginningCapital', headerName: 'Beginning Capital ($)', width: 200 },
  { field: 'withdrawal', headerName: 'Withdrawal ($)', width: 150 },
  { field: 'capitalAfterWithdrawal', headerName: 'Capital After Withdrawal ($)', width: 230 },
  { field: 'capitalGain', headerName: 'Capital Gain ($)', width: 150 },
  { field: 'afterTaxDividend', headerName: 'After Tax Dividend ($)', width: 200 },
  { field: 'endOfYearCapital', headerName: 'End of Year Capital ($)', width: 200 },
  { field: 'afterTaxYearlyReturn', headerName: 'After Tax Yearly Return (%)', width: 250 },
];

const rows = [
  { id: 1, age: 56, year: 2021, beginningCapital: 1000000, withdrawal: 60000, capitalAfterWithdrawal: 940000, capitalGain: 90000, afterTaxDividend: 27000, endOfYearCapital: 1057000, afterTaxYearlyReturn: 10.57 },
  // Add more rows as needed
];

function ResultTable() {
  return (
    <div style={{ height: 400, width: '100%', marginTop: 20 }}>
      <DataGrid rows={rows} columns={columns} pageSize={5} checkboxSelection />
    </div>
  );
}

export default ResultTable;
