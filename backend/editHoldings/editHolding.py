import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
from dotenv import load_dotenv

load_dotenv('backend/.env')

##Rememeber to install all the right packages before working



## GO TO THE FOLLOWING LINK TO DOWNLOAD THE PRIVATE KEY, go to sfic quant, keys and either download the existing one if you can, or make a new one if you can't

## https://console.cloud.google.com/iam-admin/serviceaccounts?project=sfic-quant-platform&supportedpurview=project


## UNCOMMENT THIS AND SET IT to the THE PRIVATE KEY CONFIG that you download, itll be a json file
# PATH_TO_FB_CONFIG_BACKEND='YOUR PATH TO CONFIG GOES HERE'

cred = credentials.Certificate(PATH_TO_FB_CONFIG_BACKEND)

app = firebase_admin.initialize_app(cred)

db = firestore.client()
holdings_ref = db.collection("holdings")
docs = holdings_ref.stream()


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
    
def getAllHoldings(): 
     holdingsStrings = []
     for doc in docs:
            holdingsStrings.append(f"{doc.id} => {doc.to_dict()}");
     return holdingsStrings

#update one or more holdings by ticker   
def updateHoldings(): 
  print("!")

# remove one or more holdings by ticker
def deleteHoldings():
      print("Hello World!")


##Test prints in here.
def main():
    #print("Running tests:")
    #print("getAllHoldings():\n")
    #print(getAllHoldings())
    print("getHoldings():")
    holdings = ["TST"]
    print(getHoldings(holdings))

if __name__ == "__main__":
    main()
