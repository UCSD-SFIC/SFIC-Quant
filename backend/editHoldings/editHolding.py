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
    formatted_transactions = []

    ##wouldn't need it for now but probably will need when
    for transaction in transactions:
        formatted_transaction = {
            "change": transaction.get("change"),
            "date": transaction.get("date"),
            "price": transaction.get("price"),
            "transaction_type": transaction.get("transaction_type")
        }
        formatted_transactions.append(formatted_transaction)
    
    holding = {
        "Name": name,
        "current_quantity": current_quantity,
        "reinvest_dividend": reinvest_dividend,
        "security_type": security_type,
        "ticker": ticker,
        "transactions": formatted_transactions,
        "active": True
    }
    
    # Insert the document into the collection
    result = holdings.insert_one(holding)
    return result.inserted_id


#get one or more holdings by ticker
def getHoldings(holdingNames):
    for holdingName in holdingNames:
      query = holdings.find_one({"Name": holdingName})
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
def updateHoldings(): 
  print("!")
...
# remove one or more holdings by ticker
def deleteHoldings(holdingsToDelete):
    for holdingName in holdingsToDelete:
      query = {"Name": holdingName}
      result = holdings.update_one(query, {"$set":{"active": False}})

def reActivateHoldings(holdingsToReactivate):
    for holdingName in holdingsToReactivate:
      query = {"Name": holdingName}
      result = holdings.update_one(query, {"$set":{"active": True}})

##Test prints in here.
def main():
  try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
  except Exception as e:
      print(e)
  
  #getAllHoldings()
  deleteHoldings(["GOOGL_TST"])
  getHoldings(["GOOGL_TST", "APPL_TST"])

if __name__ == "__main__":
    main()
