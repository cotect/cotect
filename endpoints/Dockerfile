FROM tiangolo/uvicorn-gunicorn-fastapi:python3.7

COPY ./cotect-endpoints/ /app

RUN pip install -e /app

# Default Configuration
ENV MODULE_NAME="cotect_endpoints.endpoints" \
    ID_GENERATION_SECRET="please-change" \
    GOOGLE_APPLICATION_CREDENTIALS="/app/cotect-dev-firebase-adminsdk.json"  \
    NEO4J_AUTH="" \
    NEO4J_URI=""