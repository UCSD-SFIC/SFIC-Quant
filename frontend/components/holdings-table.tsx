import * as React from 'react';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import { visuallyHidden } from '@mui/utils';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';

interface Data {
  id: number;
  ticker: string;
  quantity: number;
  security_type: string;
  market_value: number;
  initial_value: number;
  change: number;
  day_change: number;
  cost: number;
  exposure_percentage: number;
  pnl: number;
}

function createData(
  id: number,
  ticker: string,
  quantity: number,
  security_type: string,
  market_value: number,
  initial_value: number,
  change: number,
  day_change: number,
  exposure: number,
): Data {
  // Calculate pnl
  const pnl = (market_value - initial_value) * quantity;
  const cost = initial_value * quantity;
  const exposure_percentage = 100*exposure;
  return {
    id,
    ticker,
    quantity,
    security_type,
    market_value,
    initial_value,
    change,
    day_change,
    cost,
    exposure_percentage,
    pnl,
  };
}

const rows = [ //put Data into rows
//   id ticker quantity security_type market_value initial_value change day_change exposure
  createData(1,'AAPL', 169, 'EQ', 100, 120, 120, 120, 0.5),
  createData(2,'GOOG', 200, 'EQ', 120, 116, 120, 120, 0.15),
  createData(3,'META', 139, 'EQ', 90, 67, 120, 120, 0.35),
  createData(4,'BR S&P 500', 99, 'ETF', 256, 50, 120, -10, 0.35),
];

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key,
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string },
) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
// stableSort() brings sort stability to non-modern browsers (notably IE11). If you
// only support modern browsers you can replace stableSort(exampleArray, exampleComparator)
// with exampleArray.slice().sort(exampleComparator)
function stableSort<T>(array: readonly T[], comparator: (a: T, b: T) => number) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

interface HeadCell {
  disablePadding: boolean;
  id: keyof Data;
  label: string;
  numeric: boolean;
}

const headCells: readonly HeadCell[] = [
  {
    id: 'ticker',
    numeric: false,
    disablePadding: true,
    label: 'Equity',
  },
  {
    id: 'quantity',
    numeric: true,
    disablePadding: false,
    label: 'Quantity',
  },
  {
    id: 'security_type',
    numeric: true,
    disablePadding: false,
    label: 'Type',
  },
  {
    id: 'change',
    numeric: true,
    disablePadding: false,
    label: 'Price (Change)',
  },
  {
    id: 'market_value',
    numeric: true,
    disablePadding: false,
    label: 'Market Price',
  },
  {
    id: 'day_change',
    numeric: true,
    disablePadding: false,
    label: 'Day Change',
  },
  {
    id: 'cost',
    numeric: true,
    disablePadding: false,
    label: 'Cost',
  },
  {
    id: 'pnl',
    numeric: true,
    disablePadding: false,
    label: 'Gain/Loss',
  },
  {
    id: 'exposure_percentage',
    numeric: true,
    disablePadding: false,
    label: '% of Account',
  },
];

interface EnhancedTableProps {
  numSelected: number;
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Data) => void;
  //onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { order, orderBy, numSelected, rowCount, onRequestSort } =
    props;
  const createSortHandler =
    (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead>
      <TableRow sx={{
          backgroundColor: '#AACCFF', // Example: a shade of blue or 'inherit'
          // Place other styling options here as needed
        }}>
        {headCells.map((headCell) => (
          <TableCell
            sx={{
              fontWeight: 'bold', // This makes the text bold
            }}
            key={headCell.id}
            align={'center' /*headCell.numeric 'right' ? 'left' */}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

interface EnhancedTableToolbarProps {
  numSelected: number;
}

function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
  const { numSelected } = props;

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: '1 1 100%' }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: '1 1 100%' }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Holdings Table
        </Typography>
      )}
      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <IconButton>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
}
export default function HoldingsTable() {
  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<keyof Data>('id');
  const [selected, setSelected] = React.useState<readonly number[]>([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [searchText, setSearchText] = React.useState('');

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Data,
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  /*
  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };
  */

  /*const handleClick = (event: React.MouseEvent<unknown>, id: number) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: readonly number[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
    setSelected(newSelected);
  };
  */

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDense(event.target.checked);
  };

  const isSelected = (id: number) => selected.indexOf(id) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  /*
  const visibleRows = React.useMemo(
    () =>
      stableSort(rows, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage,
      ),
    [order, orderBy, page, rowsPerPage],
  );
  */

  const visibleRows = React.useMemo(
    () =>
      stableSort(rows.filter(row => row.ticker.toLowerCase().includes(searchText.toLowerCase())), getComparator(order, orderBy))
      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [order, orderBy, page, rowsPerPage, searchText],
  );

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <Box sx={{ p: 2 }}>
          <TextField
            label="Search by Ticker"
            variant="outlined"
            fullWidth
            onChange={(e) => setSearchText(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>
        <EnhancedTableToolbar numSelected={selected.length} />
        <TableContainer>
          <Table
            sx={{ minWidth: 750}}
            aria-labelledby="tableTitle"
            size={dense ? 'small' : 'medium'}
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              //onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {visibleRows.map((row, index) => {
                const isItemSelected = isSelected(row.id);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    //onClick={(event) => handleClick(event, row.id)}
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.id}
                    selected={isItemSelected}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell
                      align="center"
                      component="th"
                      id={labelId}
                      scope="row"
                      padding="none"
                    >
                      {row.ticker}
                    </TableCell>
                    <TableCell align="center">
                      {row.quantity}</TableCell>
                    <TableCell align="center">
                      {row.security_type}</TableCell>
                    <TableCell align="center"
                    sx={{
                      color: (theme) =>
                        row.pnl > 0
                          ? theme.palette.success.main // Green for positive values
                          : row.pnl < 0
                          ? theme.palette.error.main // Red for negative values
                          : theme.palette.text.primary, // Default text color for zero or undefined
                    }}>
                      {'$'+row.change.toFixed(2)}</TableCell>
                    <TableCell align="center"
                    sx={{
                      color: (theme) =>
                        row.pnl > 0
                          ? theme.palette.success.main // Green for positive values
                          : row.pnl < 0
                          ? theme.palette.error.main // Red for negative values
                          : theme.palette.text.primary, // Default text color for zero or undefined
                    }}>
                      {'$'+row.market_value.toFixed(2)}</TableCell>
                    <TableCell align="center"
                    sx={{
                      color: (theme) =>
                        row.day_change > 0
                          ? theme.palette.success.main // Green for positive values
                          : row.day_change < 0
                          ? theme.palette.error.main // Red for negative values
                          : theme.palette.text.primary, // Default text color for zero or undefined
                    }}>
                      {row.day_change > 0 ? '$'+row.day_change.toFixed(2) : '$('+(-row.day_change).toFixed(2)+')'} {/* 2 decimal places*/}
                    {row.day_change > 0 ? (
                      <ArrowUpwardIcon style={{ color: 'green', verticalAlign: 'middle' }} />
                    ) : row.day_change < 0 ? (
                      <ArrowDownwardIcon style={{ color: 'red', verticalAlign: 'middle' }} />
                    ) : null}
                    </TableCell>
                    <TableCell align="center">
                    {'$'+row.cost.toFixed(2)}</TableCell>
                    <TableCell align="center"
                    sx={{
                      color: (theme) =>
                        row.pnl > 0
                          ? theme.palette.success.main // Green for positive values
                          : row.pnl < 0
                          ? theme.palette.error.main // Red for negative values
                          : theme.palette.text.primary, // Default text color for zero or undefined
                    }}>
                    {row.pnl > 0 ? '$'+row.pnl.toFixed(2) : '$('+(-row.pnl).toFixed(2)+')'} {/* 2 decimal places*/}
                    {row.pnl > 0 ? (
                      <ArrowUpwardIcon style={{ color: 'green', verticalAlign: 'middle' }} />
                    ) : row.pnl < 0 ? (
                      <ArrowDownwardIcon style={{ color: 'red', verticalAlign: 'middle' }} />
                    ) : null}
                  </TableCell>
                  <TableCell align="center">
                    {row.exposure_percentage.toFixed(2)+ '%'}</TableCell>
                  </TableRow>
                );
              })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: (dense ? 33 : 53) * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Dense padding"
      />
    </Box>
  );
}
