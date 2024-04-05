from pymongo import MongoClient
import intrinio_sdk as intrinio
from intrinio_sdk.rest import ApiException
from dotenv import load_dotenv
import os
import pandas as pd
import yfinance
import json

from flask import Flask, jsonify, request, Response, send_from_directory
from flask_cors import CORS, cross_origin

load_dotenv()

intrinio.ApiClient().set_api_key(os.environ.get("INTRINIO_KEY"))
intrinio.ApiClient().allow_retries(True)

db_client = MongoClient(os.environ.get("MONGO_URI"))
holdings_col = db_client["Holdings"]["Holdings"]

app = Flask(__name__, static_folder='build')
CORS(app, resources={r"/*": {"origins": "*"}})
app.config['CORS_HEADERS'] = 'Content-Type'

@app.route("/refresh_cached_data/", methods=["GET"])
@cross_origin()
def refresh_cached_data():
    try:
        tickers = []
        company_names = []
        current_quantity = []
        security_type = []
        cost_basis = []
        realtime_price = []
        pnl = []
        market_value = []
        return_30D = []
        return_1Y = []

        ticker_cursor = holdings_col.find({"Cost Basis": {"$exists": True}})
        for ticker_document in ticker_cursor:
            print(ticker_document["ticker"])
            if (ticker_document["active"] and ticker_document["ticker"] not in ["LVMUY", "MSBHF", "NTDOY", "VFSTX", "QQQ", "Cash & Cash Investments", "Account Total"]):
                tickers.append(ticker_document["ticker"])
                company_names.append(ticker_document["Name"])
                current_quantity.append(ticker_document["current_quantity"])
                security_type.append(ticker_document["security_type"])
                cost_basis.append(float(ticker_document["Cost Basis"].replace("$", "")))
                intrinio_ticker = ticker_document["ticker"]
                if intrinio_ticker == "BRK/B":
                    intrinio_ticker = "BRKB"
                intrinio_response = intrinio.SecurityApi().get_security_realtime_price(intrinio_ticker)
                realtime_price.append(intrinio_response.last_price)
                market_value_for_ticker = intrinio_response.last_price * float(ticker_document["current_quantity"])
                market_value.append(market_value_for_ticker)
                pnl.append(market_value_for_ticker - float(ticker_document["Cost Basis"].replace("$", "")))
        
        historical_data = yfinance.download(' '.join([ticker.replace("/", "-") for ticker in tickers]), period="1y", interval="1d")
        close_column = 'Adj Close'
        if 'Adj Close' not in historical_data:
            close_column = 'Close'
        
        for i, ticker in enumerate(tickers):
            ticker = ticker.replace("/", "-")
            return_30D.append(((realtime_price[i] / historical_data.loc[:, (close_column, ticker)].iloc[-30]) - 1) * 100)
            return_1Y.append(((realtime_price[i] / historical_data.loc[:, (close_column, ticker)].iloc[0]) - 1) * 100)

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

        realtime_data_df["Exposure Percentage"] = realtime_data_df["Market Value"] / sum(realtime_data_df["Market Value"]) * 100

        realtime_data_df.to_json("realtime_data.json")
        return jsonify({"message": "success"})
    except Exception as e:
        print(str(e))
        return jsonify({'error': str(e)})

@app.route("/get_realtime_data/", methods=["GET"])
@cross_origin()
def get_realtime_data():
    try:
        holdings_data_file = open("realtime_data.json")
        holdings_data = json.load(holdings_data_file)
        holdings_data_file.close()

        return jsonify({"holdings_data": holdings_data})
    except Exception as e:
        print(str(e))
        return jsonify({'error': str(e)})

if __name__ == '__main__':
    app.run(debug=True, port=5000, threaded=True)