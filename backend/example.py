import time
# from flask import Flask, jsonify, request, Response, send_from_directory
# from flask_cors import CORS, cross_origin
from pymongo import MongoClient
import intrinio_sdk as intrinio
from intrinio_sdk.rest import ApiException
from dotenv import load_dotenv
import os
import pandas as pd

load_dotenv()

intrinio.ApiClient().set_api_key(os.environ.get("INTRINIO_KEY"))
intrinio.ApiClient().allow_retries(True)

db_client = MongoClient(os.environ.get("MONGO_URI"))
holdings_col = db_client["Holdings"]["Holdings"]

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
        account_total = 1

        ticker_cursor = holdings_col.find({"ticker": {"$ne": "TST"}, "Cost Basis": {"$exists": True}})
        for ticker_document in ticker_cursor:
            print(ticker_document["ticker"])
            if (ticker_document["active"] and ticker_document["ticker"] not in ["LVMUY", "BRK/B", "MSBHF", "NTDOY", "VFSTX", "Cash & Cash Investments"]):
                if ticker_document["ticker"] == "Account Total":
                    account_total = float(ticker_document["Cost Basis"].replace("$", ""))
                    continue
                tickers.append(ticker_document["ticker"])
                company_names.append(ticker_document["Name"])
                current_quantity.append(ticker_document["current_quantity"])
                security_type.append(ticker_document["security_type"])
                cost_basis.append(float(ticker_document["Cost Basis"].replace("$", "")))
                intrinio_response = intrinio.SecurityApi().get_security_realtime_price(ticker_document["ticker"])
                realtime_price.append(intrinio_response.last_price)
                market_value_for_ticker = intrinio_response.last_price * float(ticker_document["current_quantity"])
                market_value.append(market_value_for_ticker)
                pnl.append(market_value_for_ticker - float(ticker_document["Cost Basis"].replace("$", "")))
            
        realtime_data_df = pd.DataFrame({
            "Name": company_names,
            "Ticker": tickers,
            "Current Quantity": current_quantity,
            "Security Type": security_type,
            "Cost Basis": cost_basis,
            "Realtime Price": realtime_price,
            "Market Value": market_value,
            "PnL": pnl
        })

        realtime_data_df["Exposure Percentage"] = realtime_data_df["Market Value"] / sum(realtime_data_df["Market Value"]) * 100

        return realtime_data_df
    except Exception as e:
        print(str(e))
        return {'error': str(e)}

def get_realtime_data():
    try:
        return
    except Exception as e:
        print(str(e))
        return {'error': str(e)}

print(refresh_cached_data())