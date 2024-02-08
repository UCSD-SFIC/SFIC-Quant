# Welcome to Cloud Functions for Firebase for Python!
# To get started, simply uncomment the below code or create your own.
# Deploy with `firebase deploy`

from firebase_functions import https_fn
from firebase_admin import initialize_app, firestore

initialize_app()


@https_fn.on_request()
def on_request_example(req: https_fn.Request) -> https_fn.Response:
    firestore_client = firestore.client()
    holdings = firestore_client.collection("holdings").stream()
    holdings_data = []
    for holding in holdings:
        holdings_data.append(holding.to_dict())
    return https_fn.Response(str(holdings_data))