from dotenv import load_dotenv
import os
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
load_dotenv()
import certifi
ca = certifi.where()


uri = os.getenv("uri")
client = MongoClient(uri, server_api=ServerApi('1'),tlsCAFile=ca)
db = client.Holdings
holdings = db.Holdings
##Rememeber to install all the right packages before working



## GO TO THE FOLLOWING LINK TO DOWNLOAD THE PRIVATE KEY, go to sfic quant, keys and either download the existing one if you can, or make a new one if you can't

## https://console.cloud.google.com/iam-admin/serviceaccounts?project=sfic-quant-platform&supportedpurview=project


## UNCOMMENT THIS AND SET IT to the THE PRIVATE KEY CONFIG that you download, itll be a json file
# PATH_TO_FB_CONFIG_BACKEND='YOUR PATH TO CONFIG GOES HERE'





 #create one or more new holdings. Refer to schema from Github Issue Task 1: Holdings Schema #10
def createHoldings(): 
     print("Hello World!")


#get one or more holdings by ticker
def getHoldings(holdings):
  holdingsStrings = []
  for holding in holdings:
    holding = holdings_ref.document(holding).get()
    holdingsStrings.append(holding.to_dict())
  return holdingsStrings   

#get all holdings
...
def getAllHoldings():
    for holding in holdings.find():
       print(holding)
...

#update one or more holdings by ticker   
def updateHoldings(): 
  print("!")
...
# remove one or more holdings by ticker
def deleteHoldings():
      print("Hello World!")

##Test prints in here.
def main():
  try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
  except Exception as e:
      print(e)
  
  getAllHoldings()

if __name__ == "__main__":
    main()
