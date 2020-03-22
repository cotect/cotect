import logging
import os
import sys
import time

from fastapi import Depends, FastAPI, status
from starlette.responses import Response

from cotect_endpoints.__version__ import __version__
from cotect_endpoints.db_handler import GraphHandler
from cotect_endpoints.schema import CaseReport, User
from cotect_endpoints.security import get_active_user

# Initialize logger
log = logging.getLogger(__name__)

# Get environment variables
NEO4J_URI = os.getenv("NEO4J_URI")

if not NEO4J_URI:
    log.error(
        "Please set NEO4J_URI enviornment variable with a valid neo4j bolt URI. Process will exit."
    )
    time.sleep(10)
    sys.exit(1)

NEO4J_AUTH = os.getenv("NEO4J_AUTH")
try:
    neo_user, neo_password = NEO4J_AUTH.split("/")
except Exception:
    log.warning(
        "Unable to parse NEO4J_AUTH. Using empty user and password for neo4j database."
    )
    # Unable to par
    neo_user, neo_password = "", ""

# Initialize API
app = FastAPI(
    title="Cotect User Endpoints",
    description="User endpoints REST API for cotect project.",
    version=__version__,
)

graph_handler = GraphHandler(NEO4J_URI, neo_user, neo_password)
graph_handler.init_graph()


@app.post(
    "/reports",
    summary="Creates or updates the user's case report.",
    status_code=status.HTTP_201_CREATED,
    response_class=Response,
)
def update_report(report: CaseReport, user: User = Depends(get_active_user)):
    graph_handler.add_report(user, report)


@app.delete(
    "/users/me",
    summary="Deletes a user.",
    status_code=status.HTTP_204_NO_CONTENT,
    response_class=Response,
)
def delete_user(user: User = Depends(get_active_user)):
    """
    Deletes the user's node and all of the node's relations.
    """
    graph_handler.delete_user(user.user_id)


@app.get(
    "/assessment",
    summary="Returns the latest risk assessment.",
    response_class=Response,
)
def get_assessment(user: User = Depends(get_active_user)):
    pass
