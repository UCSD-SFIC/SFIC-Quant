from dotenv import load_dotenv
import os
import pandas
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from typing import List, Dict, Any
load_dotenv()
import certifi
ca = certifi.where()

##Rememeber to install all the right packages before working
#Remember to set the mongo uri variable inside .env
uri = os.getenv("uri")
client = MongoClient(uri, server_api=ServerApi('1'), tlsCAFile=ca)

db = client.Holdings
holdings = db.Holdings

#Create one or more new holdings. Refer to schema from Github Issue Task 1: Holdings Schema #10
def createHolding(name: str, current_quantity: int, reinvest_dividend: bool, security_type: str, ticker: str, transactions: List[Dict[str, Any]]): 
    if(holdings.find_one({"ticker": ticker})):
       print("The database already has this ticker! Use updateHolding() to edit it")
       return
    holding = {
        "Name": name,
        "current_quantity": current_quantity,
        "reinvest_dividend": reinvest_dividend,
        "security_type": security_type,
        "ticker": ticker,
        "active": True,
        "transactions": transactions
    }
    
    # Insert the document into the collection
    result = holdings.insert_one(holding)
    print("Inserted holding with ID: ", result.inserted_id)
    return result.inserted_id

#Get one or more holdings by ticker
def getHoldings(holdingTickers):
    for holdingTicker in holdingTickers:
      query = holdings.find_one({"ticker": holdingTicker})
      if "active" in query and query["active"]:
        print(query)

#Get all holdings
...
def getAllHoldings():
    for holding in holdings.find():
      if "active" in holding and holding["active"]:
       print(holding)
...

#Update one or more holdings by ticker   
def updateHoldings(holdingsToUpdate, fieldsToUpdate):
  for holdingTicker in holdingsToUpdate:
    query = {"ticker": holdingTicker}
    result = holdings.update_one(query, {"$set":fieldsToUpdate})
  print("Updated {} holdings.", result.modified_count)
  ...
# Remove one or more holdings by ticker, meaning set to inactive
def deleteHoldings(holdingsToDelete):
    for holdingTicker in holdingsToDelete:
      query = {"ticker": holdingTicker}
      result = holdings.update_one(query, {"$set":{"active": False}})
    print("Deleted" , result.modified_count , "holdings.")

#Re activate any holdings we have deleted(set active to False)
def reActivateHoldings(holdingsToReactivate):
    for holdingTicker in holdingsToReactivate:
      query = {"ticker": holdingTicker}
      result = holdings.update_one(query, {"$set":{"active": True}})

    print("Reactivated ", result.modified_count , "holdings.")

# Add any individual transactions to the holding
def addTransactionToHolding(name: str, transaction: dict):
    result = holdings.update_one(
        {"ticker": name},  # Query to find the document by name
        {"$push": {"transactions": transaction}}  # $push operation
    )
    print("Added transaction ", result.name, " to holding: ")


##Test anything in here.
def main():
  try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
  except Exception as e:
      print(e)
  
if __name__ == "__main__":
    main()
