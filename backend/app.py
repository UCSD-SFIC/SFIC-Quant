from pymongo import MongoClient
import intrinio_sdk as intrinio
from dotenv import load_dotenv
import os
import pandas as pd
import yfinance

from flask import Flask, jsonify
from flask_cors import CORS, cross_origin

load_dotenv()

# Set API key for the Intrinio API client
intrinio.ApiClient().set_api_key(os.environ.get("INTRINIO_KEY"))
intrinio.ApiClient().allow_retries(True)

# Connect to MongoDB instance
db_client = MongoClient(os.environ.get("MONGO_URI"))

# Access the 'Holdings' and 'Realtime Data' collection within the 'Holdings' database in MongoDB.
holdings_col = db_client["Holdings"]["Holdings"]
realtime_data_col = db_client["Holdings"]["Realtime Data"]

# Initialize Flask application.
app = Flask(__name__, static_folder='build')
CORS(app, resources={r"/*": {"origins": "*"}})
app.config['CORS_HEADERS'] = 'Content-Type'

# This route is used to refresh our cache with realtime data on current holdings
@app.route("/refresh_cached_data/", methods=["GET"])
@cross_origin()
def refresh_cached_data():
    '''
    TO DO: add field to holdings data that marks if real time data is available
    '''
    try:
        # Initialize lists to store holdings data
        tickers = []
        company_names = []
        current_quantity = []
        security_type = []
        cost_basis = []
        realtime_price = []
        pnl = [] # profit and loss values
        market_value = [] 
        return_30D = [] # 30-day return values
        return_1Y = [] # 1-year return values

        # Retrieve data from MongoDB Holdings Collection
        # Iterate over the retrieved documents to extract relevant data.
        ticker_cursor = holdings_col.find({"Cost Basis": {"$exists": True}})
        for ticker_document in ticker_cursor:
            # print(ticker_document["ticker"]) ##--- USED FOR DEBUGGING
            
            # filter for tickers that we have Intrinio Real Time Data access to
            # "Cash & Cash Investments" & "Account Total" are not securities
            # other values present in not in arr are tickers that are internationally based, but US traded securities that Intrinio doesn't have real time data access for
            if (ticker_document["active"] and ticker_document["ticker"] not in ["LVMUY", "MSBHF", "NTDOY", "VFSTX", "QQQ", "Cash & Cash Investments", "Account Total"]):
                # Append data from the dataframe to their respective columns
                tickers.append(ticker_document["ticker"])
                company_names.append(ticker_document["Name"])
                current_quantity.append(ticker_document["current_quantity"])
                security_type.append(ticker_document["security_type"])
                
                # Convert cost basis to float after removing "$" symbol
                cost_basis.append(float(ticker_document["Cost Basis"].replace("$", "")))
                
                # Modify ticker symbol if necessary for fetching real-time price
                intrinio_ticker = ticker_document["ticker"]
                if intrinio_ticker == "BRK/B":
                    intrinio_ticker = "BRKB"
                    
                # Fetch real-time price using an API call
                intrinio_response = intrinio.SecurityApi().get_security_realtime_price(intrinio_ticker)
                realtime_price.append(intrinio_response.last_price)
                
                # Calculate market value for each holding
                market_value_for_ticker = intrinio_response.last_price * float(ticker_document["current_quantity"])
                market_value.append(market_value_for_ticker)
                
                # Calculate profit and loss for each holding
                pnl.append(market_value_for_ticker - float(ticker_document["Cost Basis"].replace("$", "")))
        
        # Download historical data from yahoo finance for the last year
        historical_data = yfinance.download(' '.join([ticker.replace("/", "-") for ticker in tickers]), period="1y", interval="1d")
        
        # Check if the close column should be adjusted close or just close, adjusted close is the most likely case
        close_column = 'Adj Close'
        if 'Adj Close' not in historical_data:
            close_column = 'Close'
        
        # Calculate our 30 day and 1 year returns
        for i, ticker in enumerate(tickers):
            ticker = ticker.replace("/", "-")
            return_30D.append(((realtime_price[i] / historical_data.loc[:, (close_column, ticker)].iloc[-30]) - 1) * 100)
            return_1Y.append(((realtime_price[i] / historical_data.loc[:, (close_column, ticker)].iloc[0]) - 1) * 100)

        # Create Dataframe for realtime data
        realtime_data_df = pd.DataFrame({
            "Name": company_names,
            "Ticker": tickers,
            "Current Quantity": current_quantity,
            "Security Type": security_type,
            "Cost Basis": cost_basis,
            "Realtime Price": realtime_price,
            "Market Value": market_value,
            "PnL": pnl,
            "Return 30D (%)": return_30D,
            "Return 1Y (%)": return_1Y
        })

        # Calculate Exposure as a %
        realtime_data_df["Exposure Percentage"] = realtime_data_df["Market Value"] / sum(realtime_data_df["Market Value"]) * 100

        realtime_data_records = realtime_data_df.to_dict(orient="records")

        # Update realtime data collection in mongo (Realtime Data acts as our cache somewhat)
        realtime_data_col.delete_many({})
        if isinstance(realtime_data_records, list):
            realtime_data_col.insert_many(realtime_data_records)  
        else:
            realtime_data_col.insert_one(realtime_data_records)
        
        return jsonify({"message": "success"})
    except Exception as e:
        print(str(e))
        return jsonify({'error': str(e)})

# The frontend will interact with this route in order to retrieve cached realtime data
@app.route("/get_realtime_data/", methods=["GET"])
@cross_origin()
def get_realtime_data():
    try:
        # Read all data in Realtime Data collection and append to holdings data
        cursor = realtime_data_col.find({}, {'_id': False})
        holdings_data = []
        for doc in cursor:
            holdings_data.append(doc)

        return jsonify({"holdings_data": holdings_data})
    except Exception as e:
        print(str(e))
        return jsonify({'error': str(e)})

if __name__ == '__main__':
    app.run(debug=True, port=5000, threaded=True)