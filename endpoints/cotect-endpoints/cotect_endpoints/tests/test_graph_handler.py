from cotect_endpoints.schema import User, CaseReport, CasePlace, CaseSymptom, CaseContact
from datetime import date
from cotect_endpoints.db_handler import GraphHandler
# add neo4j logging
from logging import getLogger, StreamHandler, DEBUG


# ```python
# from firebase_admin import auth
# user = auth.get_user("", app=default_app)
# user.phone_number
# auth.delete_user(uid, app=None)
# id_token = ""
# ```

# ```python
# # https://fastapi.tiangolo.com/tutorial/sql-databases/#note
# def get_db():
#     try:
#         db = SessionLocal()
#         yield db
#     finally:
#         db.close()
#
# def get_db(db_state=Depends(reset_db_state)):
#     try:
#         database.db.connect()
#         yield
#     finally:
#         if not database.db.is_closed():
#             database.db.close()
# ```



handler = StreamHandler()
handler.setLevel(DEBUG)
getLogger("neo4j").addHandler(handler)

user = User(user_id="1", verified=True)

report = CaseReport()
report.age = 20
report.gender = "male"
report.residence = CasePlace(
        place_id="berlin",
        latitude=1.5,
        longitude=19
    )

report.covid_test = "tested-negative"
report.symptoms = [
    CaseSymptom(symptom_name="Caugh", report_date=date.today(), severity="mild"),
    CaseSymptom(symptom_name="Headache", report_date=date.today()),
    CaseSymptom(symptom_name="Fever", report_date=date.today(), severity="37.5"),
]

report.places = [
    CasePlace(
        place_id="my-place-1",
        visit_date=date.today(),
        latitude=1.1,
        longitude=1.2,
        place_name="test",
        place_types=["testtype", "type-2"],
    ),
    CasePlace(
        place_id="my-place-3",
        latitude=1.5,
        longitude=19
    ),
    CasePlace(
        place_id="my-place-4",
        latitude=1.9,
        longitude=19
    )
]

report.contacts = [
    CaseContact(phone_number="+4917691377102", contact_date = date.today()),
    CaseContact(phone_number="+49176947102", contact_date = date.today()),
    CaseContact(phone_number="+491769 1377102", contact_date = date.today()),
    CaseContact(phone_number="+49176934432", contact_date = date.today()),
]

graph_handler = GraphHandler("bolt://docker.for.mac.localhost:7687", "", "")
graph_handler.init_graph()
graph_handler.add_report(user, report)

graph_handler.get_driver

graph_handler.get_session().begin_transaction().close()

graph_handler.get_driver().close()

# +
from neo4j.exceptions import ServiceUnavailable

try:
    graph_handler.get_session().begin_transaction().close()
except ServiceUnavailable:
    graph_handler.close()
# -

graph_handler.add_report(user, report)
