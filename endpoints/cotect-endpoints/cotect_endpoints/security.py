import logging
import os

import firebase_admin
from fastapi import HTTPException, Security, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from fastapi.security.api_key import APIKeyCookie, APIKeyHeader, APIKeyQuery
from firebase_admin import auth

from cotect_endpoints.utils import id_utils
from cotect_endpoints.schema import User

# Initialize logger
log = logging.getLogger(__name__)

firebase_app = None

firebase_credentials = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
if firebase_credentials and os.path.isfile(firebase_credentials):
    # Initilize firebase
    firebase_app = firebase_admin.initialize_app()
else:
    log.warning(
        "GOOGLE_APPLICATION_CREDENTIALS was not set with a valid path. Firebase will not be initalized."
    )

API_KEY_NAME = "api_token"

api_key_bearer = HTTPBearer(auto_error=False)
api_key_query = APIKeyQuery(name=API_KEY_NAME, auto_error=False)
api_key_header = APIKeyHeader(name=API_KEY_NAME, auto_error=False)
# Cookie security specification is not supported by swagger 2.0 specs
# api_key_cookie = APIKeyCookie(name=API_KEY_NAME, auto_error=False)


def get_active_user(
    api_key_bearer: HTTPAuthorizationCredentials = Security(api_key_bearer),
    api_key_query: str = Security(api_key_query),
    api_key_header: str = Security(api_key_header),
    # api_key_cookie: str = Security(api_key_cookie),
) -> User:
    # https://medium.com/data-rebels/fastapi-authentication-revisited-enabling-api-key-authentication-122dc5975680
    secret = id_utils.get_id_generation_secret()
    api_key = None

    if api_key_bearer:
        api_key = api_key_bearer.credentials
    elif api_key_query:
        api_key = api_key_query
    elif api_key_header:
        api_key = api_key_header
    else:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="No API Key was provided.",
        )
    #elif api_key_cookie:
    #    api_key = api_key_header
    

    if api_key == "demo":
        # Remove
        return User(
            user_id=id_utils.generate_user_id("+4917691377102", secret), verified=False,
        )

    if not firebase_app:
        # firebase app was not initalized
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Failed to verify user.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    try:
        decoded_token = auth.verify_id_token(
            api_key, app=firebase_app, check_revoked=False
        )

        if "phone_number" in decoded_token and decoded_token["phone_number"]:
            return User(
                user_id=id_utils.generate_user_id(decoded_token["phone_number"], secret),
                verified=True,
            )
        else:
            # use uid as fallback or for anonymous users
            return User(
                user_id=id_utils.generate_user_id(decoded_token["uid"], secret),
                verified=False,
            )
    except Exception as ex:
        log.info("Failed to validate firebase token: " + str(ex.msg))
        
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Failed to validate the firebase token.",
            headers={"WWW-Authenticate": "Bearer"},
        )
