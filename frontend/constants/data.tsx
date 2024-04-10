export interface Data {
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
  exposure: number
): Data {
  const pnl = (market_value - initial_value) * quantity;
  const cost = initial_value * quantity;
  const exposure_percentage = 100 * exposure;
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

export const rows = [
  // id ticker quantity security_type market_value initial_value change day_change exposure

  // assuming change is total change in share price, and inital value is cost basis per share, then i notice 2 things
  // 1. change is a redundant parameter to pass in. (simply market_value - initial_value) (other redundants too)

  // 2. THE BUG IN SORTING IS FROM THE IMPOSSIBLE DATA. the previous example data supposed impossible situation such as initial 120, market 100, and change and daily change of 120. (given that the market is 100, daily change <=100, change <=120-100)

  // With real data this would not be a problem.

  // TODO: remove clutter functions and import them back in as needed
  // api/fetch new data pipeline: fetch data -> clean data -> pass data into createData (restructure for easier access?)

  //replaced with mathematically possible values:
  //we now see sorting w/ negatives works as intended
  //and our pnl matches up with quantity * change in price
  createData(1, "AAPL", 169, "EQ", 100, 120, -20, 20, 0.5),
  createData(2, "GOOG", 200, "EQ", 120, 116, 4, -10, 0.15),
  createData(3, "META", 139, "EQ", 90, 67, 23, 23, 0.35),
  createData(4, "BR S&P 500", 99, "ETF", 256, 50, 206, -10, 0.35),
  createData(5, "BR S&P 510", 91, "ETF", 256, 50, 206, -10, 0.35),
  createData(6, "BR S&P 512", 92, "ETF", 256, 50, 206, -10, 0.35),
  createData(7, "BR S&P 503", 93, "ETF", 256, 50, 206, -10, 0.35),
  createData(8, "BR S&P 502", 94, "ETF", 256, 50, 206, -10, 0.35),
  createData(9, "BR AMZN", 95, "ETF", 256, 50, 206, -10, 0.35),
  createData(10, "BR NET", 96, "ETF", 256, 50, 206, -10, 0.35),
  createData(11, "BR QCOM", 97, "ETF", 256, 50, 206, -10, 0.35),
  createData(12, "BR APPL", 98, "ETF", 256, 50, 206, -10, 0.35),
  createData(13, "BR NVDA", 99, "ETF", 256, 50, 206, -10, 0.35),
  createData(14, "BR Dow", 90, "ETF", 256, 50, 206, -10, 0.35),
];


//TODO: In Real Data Version, This Section
//Will go under its own component to handle error checking

// Error Checking Logic
// Part 1: Duplicate IDs in Data
// TODO: as we add in data, develop/add additional error checking rules

function checkForDuplicateIds(rows: Data[]) {
  const seenIds = new Set<number>();
  for (const row of rows) {
    if (seenIds.has(row.id)) {
      throw new Error(`Duplicate ID detected at: ${row.id}`);
    }
    seenIds.add(row.id);
  }
}

// Part 2: Validate Data
// tbh change is redundant, as it should always be change = market val - initial val

function validateData(rows: Data[]) {
  rows.forEach((row, index) => {
    if (row.market_value <= 0) {
      throw new Error(`Invalid market_value for ID ${row.id} at index ${index}: must be greater than 0.`);
    }
    if (row.initial_value <= 0) {
      throw new Error(`Invalid initial_value for ID ${row.id} at index ${index}: must be greater than 0.`);
    }
    if (row.change !== row.market_value - row.initial_value) {
      throw new Error(`Invalid change for ID ${row.id} at index ${index}: does not equal market_value - initial_value.`);
    }
    if (row.day_change > row.market_value) {
      throw new Error(`Invalid day_change for ID ${row.id} at index ${index}: cannot be greater than market_value.`);
    }
  });
}


try {
  checkForDuplicateIds(rows);
  console.log("No Duplicate ID");
} catch (error) {
  console.error((error as Error).message);

}

try {
  validateData(rows);
  console.log("All data entries are valid.");
} catch (error) {
  console.error((error as Error).message);
}

