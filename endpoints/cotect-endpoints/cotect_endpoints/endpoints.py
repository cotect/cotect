import logging
import os
import sys
import time

from fastapi import Depends, FastAPI, Query, status
from starlette.responses import Response

from cotect_endpoints.__version__ import __version__
from cotect_endpoints.db_handler import GraphHandler
from cotect_endpoints.schema import CaseReport, User
from cotect_endpoints.security import get_active_user
from cotect_endpoints.utils import endpoint_utils

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
    summary="Creates or updates the user case report.",
    status_code=status.HTTP_201_CREATED,
    response_class=Response,
    tags=["reports"],
)
def update_report(report: CaseReport, user: User = Depends(get_active_user)):
    graph_handler.add_report(user, report)


@app.delete(
    "/reports",
    summary="Deletes a user with all reported information.",
    status_code=status.HTTP_204_NO_CONTENT,
    response_class=Response,
    tags=["reports"],
)
def delete_report(user: User = Depends(get_active_user)):
    """
    Deletes the user node and all of the node relations.
    """
    graph_handler.delete_user(user.user_id)


@app.get(
    "/assessments/user",
    summary="Returns the current risk assessment for a user.",
    response_class=Response,
    tags=["assessments"],
)
def get_user_assessment(user: User = Depends(get_active_user)):
    pass


@app.get(
    "/assessments/place",
    summary="Returns the current risk assessment for a place.",
    response_class=Response,
    tags=["assessments"],
)
def get_place_assessment(
    user: User = Depends(get_active_user),
    latitude: float = Query(None, ge=-90, le=90, description="Latitude of place."),
    longitude: float = Query(None, ge=-180, le=180, description="Longitude of place."),
    place_id: str = Query(
        None, min_length=3, description="Google places id - alternative to lat/long."
    ),
):
    pass


@app.get(
    "/healthz",
    status_code=status.HTTP_200_OK,
    response_class=Response,
    summary="Check server health status.",
    tags=["administration"],
)
def check_health():
    # TODO: Check server health
    pass


# Use function names as operation IDs
endpoint_utils.use_route_names_as_operation_ids(app)
