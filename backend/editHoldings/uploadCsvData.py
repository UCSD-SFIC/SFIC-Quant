from editHolding import *

load_dotenv()
holdingsPath = os.getenv("PATH_TO_HOLDINGS_CSV")
transactionsPath = os.getenv("PATH_TO_TRANSACTIONS_CSV")

def uploadPositions():
 #Upload positions to db
  positionsDF = pandas.read_csv(holdingsPath)
  for ind in positionsDF.index:
    ticker = positionsDF["Symbol"][ind]
    name = positionsDF["Description"][ind]
    current_quantity = positionsDF["Quantity"][ind]
    reinvest_dividend = not(positionsDF["Reinvest Dividends?"][ind] == "No") 
    security_type = positionsDF["Security Type"][ind]
    createHolding(name, current_quantity, reinvest_dividend, security_type, ticker, [])

def uploadTransactions():
   #upload transactions to db
  transactionsDF = pandas.read_csv(transactionsPath)
  transactions = [{transactionsDF['Symbol'][index]: {'change': transactionsDF['Amount'][index], \
                      'date': transactionsDF['Date'][index], \
                        'price': transactionsDF['Price'][index], \
                          'transaction type': transactionsDF['Action'][index]}} \
                            for index in transactionsDF.index]
  for ind in range(1,len(transactions)):
    addTransactionToHolding(list(transactions[ind].keys())[0], list(transactions[ind].values())[0])

def main():
  #Check server connection.
  try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
  except Exception as e:
      print(e)
      
if __name__ == "__main__":
    main()