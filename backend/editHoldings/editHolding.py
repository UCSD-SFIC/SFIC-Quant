from dotenv import load_dotenv
import os
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from typing import List, Dict, Any
load_dotenv()
import certifi
ca = certifi.where()


uri = os.getenv("uri")
client = MongoClient(uri, server_api=ServerApi('1'),tlsCAFile=ca)

##Rememeber to install all the right packages before working



## GO TO THE FOLLOWING LINK TO DOWNLOAD THE PRIVATE KEY, go to sfic quant, keys and either download the existing one if you can, or make a new one if you can't

## https://console.cloud.google.com/iam-admin/serviceaccounts?project=sfic-quant-platform&supportedpurview=project


## UNCOMMENT THIS AND SET IT to the THE PRIVATE KEY CONFIG that you download, itll be a json file
# PATH_TO_FB_CONFIG_BACKEND='YOUR PATH TO CONFIG GOES HERE'


 #create one or more new holdings. Refer to schema from Github Issue Task 1: Holdings Schema #10

db = client.Holdings
holdings = db.Holdings
def createHolding(name: str, current_quantity: int, reinvest_dividend: bool, security_type: str, ticker: str, transactions: List[Dict[str, Any]]): 
    if(holdings.find_one({"ticker": ticker})):
       print("The database already has this ticket! Use updateHolding to edit it")
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
    return result.inserted_id


#get one or more holdings by ticker
def getHoldings(holdingTickers):
    for holdingTicker in holdingTickers:
      query = holdings.find_one({"ticker": holdingTicker})
      if "active" in query and query["active"]:
        print(query)

#get all holdings
...
def getAllHoldings():
    for holding in holdings.find():
      if "active" in holding and holding["active"]:
       print(holding)
...

#update one or more holdings by ticker   
def updateHoldings(holdingsToUpdate, fieldsToUpdate):
  for holdingTicker in holdingsToUpdate:
    query = {"ticker": holdingTicker}
    result = holdings.update_one(query, {"$set":fieldsToUpdate})
...
# remove one or more holdings by ticker, meaning set to inactive
def deleteHoldings(holdingsToDelete):
    for holdingTicker in holdingsToDelete:
      query = {"ticker": holdingTicker}
      result = holdings.update_one(query, {"$set":{"active": False}})

def reActivateHoldings(holdingsToReactivate):
    for holdingTicker in holdingsToReactivate:
      query = {"ticker": holdingTicker}
      result = holdings.update_one(query, {"$set":{"active": True}})


def addTransactionToHolding(name: str, transaction: dict):
    result = holdings.update_one(
        {"ticker": name},  # Query to find the document by name
        {"$push": {"transactions": transaction}}  # $push operation
    )


##Test prints in here.
def main():
  try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
  except Exception as e:
      print(e)
  
  #getAllHoldings()
  #reActivateHoldings(["GOOGL"])
  #getHoldings(["GOOGL", "APPL"])

  transaction = {
    "change": 999,
    "date": "99-99-2093",
    "price": 999,
    "transaction_type": "buy"
  }
  #addTransactionToHolding("GOOGL", transaction)
  #getHoldings(["GOOGL"])

  createHolding("Invesco QQQ Trust Series 1 Test", 20, False, "ETFs & Closed End Funds", "QQQ" ,[transaction])
  getHoldings(["QQQ"])

if __name__ == "__main__":
    main()
