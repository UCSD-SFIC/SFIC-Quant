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
];
