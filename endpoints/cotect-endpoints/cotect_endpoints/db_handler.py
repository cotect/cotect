import logging

from neo4j import GraphDatabase, Session
from neo4j.exceptions import ServiceUnavailable

from cotect_endpoints import utils
from cotect_endpoints.schema import (
    CaseContact,
    CasePlace,
    CaseReport,
    CaseSymptom,
    User,
)


def create_unique_constraint(tx, entity_type: str, property_name: str):
    constraint_name = (entity_type + "_" + property_name).strip().lower()

    constraint_stmt = (
        "CREATE CONSTRAINT "
        + constraint_name
        + " ON (n:"
        + entity_type
        + ") ASSERT n."
        + property_name
        + " IS UNIQUE"
    )

    tx.run(constraint_stmt)


def init_graph(tx):
    # TODO: Check if no contstaints are set
    create_unique_constraint(tx, "Place", "place_id")
    create_unique_constraint(tx, "User", "user_id")
    create_unique_constraint(tx, "Symptom", "symptom_id")


def delete_user(tx, user_id: str):
    delete_user_stmt = "MATCH (user:User { user_id: $user_id}) DETACH DELETE user;"
    tx.run(delete_user_stmt, user_id=user_id)


def add_user(tx, user: User, report: CaseReport):
    # Create or update a user
    user_stmt = (
        "MERGE (user:User { user_id: $user_id})\n"
        "ON CREATE SET user.created = timestamp()\n"
    )

    set_user_props = ""

    if report.age:
        set_user_props += " user.age = $age,"

    if report.gender:
        set_user_props += " user.gender = $gender,"

    if report.covid_test:
        set_user_props += " user.covid_test = $covid_test,"

    if report.covid_contact:
        set_user_props += " user.covid_contact = $covid_contact,"

    set_user_props = set_user_props.rstrip(",")

    if set_user_props:
        # TODO only set on ON CREATE?
        user_stmt += " SET " + set_user_props + "\n"

    tx.run(
        user_stmt,
        user_id=user.user_id,
        age=report.age,
        gender=report.gender,
        covid_test=report.covid_test,
        covid_contact=report.covid_contact,
    )


def add_place(tx, place: CasePlace):
    # Create or update place
    place_stmt = "MERGE (place:Place { place_id: $place_id})\n"
    place_stmt += "ON CREATE SET place.created = timestamp()\n"

    set_place_props = ""

    if place.latitude:
        set_place_props += " place.latitude = $latitude,"

    if place.longitude:
        set_place_props += " place.longitude = $longitude,"

    if place.place_name:
        set_place_props += " place.name = $place_name,"

    if place.place_types:
        set_place_props += " place.types = $place_types,"

    set_place_props = set_place_props.rstrip(",")

    if set_place_props:
        # TODO only set on ON CREATE
        place_stmt += " SET " + set_place_props + "\n"

    tx.run(
        place_stmt,
        place_id=place.place_id,
        place_name=place.place_name,
        place_types=place.place_types,
        latitude=place.latitude,
        longitude=place.longitude,
    )


def add_place_visit(tx, user: User, place: CasePlace):
    # Create or update place
    add_place(tx, place)

    # initialize with single element to prevent code duplication below
    visit_dates = [None]
    if place.visit_dates:
        visit_dates = place.visit_dates

    for visit_date in visit_dates:
        relation_date_check = ""
        if visit_date:
            relation_date_check = "{visit_date: $visit_date}"

        # Create has visited relation
        visit_stmt = (
            "MATCH (user:User {user_id: $user_id }), (place:Place {place_id: $place_id })\n"
            "MERGE (user)-[r:HAS_VISITED " + relation_date_check + "]->(place)\n"
            "ON CREATE SET r.created = timestamp()\n"
        )

        tx.run(
            visit_stmt,
            user_id=user.user_id,
            place_id=place.place_id,
            visit_date=visit_date,
        )


def add_residence(tx, user: User, place: CasePlace):

    # Create or update place
    add_place(tx, place)

    # Create has visited relation
    residence_stmt = (
        "MATCH (user:User {user_id: $user_id }), (place:Place {place_id: $place_id })\n"
        "MERGE (user)-[r:LOCATED_IN]->(place)\n"
        "ON CREATE SET r.created = timestamp()\n"
    )

    tx.run(residence_stmt, user_id=user.user_id, place_id=place.place_id)


def add_contact(tx, user: User, contact: CaseContact):

    contact_id = utils.generate_user_id(
        contact.phone_number, utils.get_id_generation_secret()
    )

    # Create contact user
    user_stmt = (
        "MERGE (user:User {user_id: $user_id})\n"
        "ON CREATE SET user.created = timestamp()\n"
    )

    tx.run(user_stmt, user_id=contact_id)

    # Create contact relation

    # initialize with single element to prevent code duplicates below
    contact_dates = [None]
    if contact.contact_dates:
        contact_dates = contact.contact_dates

    for contact_date in contact_dates:
        relation_date_check = ""
        if contact_date:
            relation_date_check = "{contact_date: $contact_date}"

        contact_stmt = (
            "MATCH (user:User {user_id: $user_id}), (contact:User {user_id: $contact_id})\n"
            "MERGE (user)-[r:IN_CONTACT " + relation_date_check + "]->(contact)\n"
            "ON CREATE SET r.created = timestamp()\n"
        )

        tx.run(
            contact_stmt,
            user_id=user.user_id,
            contact_id=contact_id,
            contact_date=contact_date,
        )


def add_symptom(tx, user: User, symptom: CaseSymptom):

    symptom_id = utils.generate_symptom_id(symptom.symptom_name)

    # Create or update symptom
    symptom_node_stmt = (
        "MERGE (symptom:Symptom {symptom_id: $symptom_id})\n"
        "ON CREATE SET symptom.symptom_name = $symptom_name, symptom.created = timestamp()\n"
    )

    tx.run(symptom_node_stmt, symptom_id=symptom_id, symptom_name=symptom.symptom_name)

    # Create symptom relation

    relation_date_check = ""
    if symptom.report_date:
        relation_date_check = "{report_date: $report_date}"

    symptom_relation_stmt = (
        "MATCH (user:User {user_id: $user_id }), (symptom:Symptom {symptom_id: $symptom_id })\n"
        "MERGE (user)-[r:HAS_SYMPTOM " + relation_date_check + "]->(symptom)\n"
        "ON CREATE SET r.created = timestamp()\n"
    )

    set_symptom_props = ""

    if symptom.severity:
        set_symptom_props += " r.severity = $severity,"

    set_symptom_props = set_symptom_props.rstrip(",")

    if set_symptom_props:
        symptom_relation_stmt += " SET " + set_symptom_props + "\n"

    tx.run(
        symptom_relation_stmt,
        user_id=user.user_id,
        report_date=symptom.report_date,
        symptom_id=symptom_id,
        severity=symptom.severity,
    )


def add_report(tx, user: User, report: CaseReport):
    add_user(tx, user, report)

    if report.residence:
        add_residence(tx, user, report.residence)

    if report.places:
        for place in report.places:
            add_place_visit(tx, user, place)

    if report.symptoms:
        for symptom in report.symptoms:
            add_symptom(tx, user, symptom)

    if report.contacts:
        for contact in report.contacts:
            add_contact(tx, user, contact)


class GraphHandler:
    def __init__(self, neo_uri: str, user: str, password: str):

        # Initialize logger
        self.log = logging.getLogger(__name__)

        # Initialized default variables
        self._neo_uri = neo_uri
        self._neo_auth = (user, password)

        # Lazy load graph driver
        self._driver = None

    def get_driver(self):
        if self._driver is None or self._driver.closed():
            # TODO improve driver configuration
            # encrypted = TLS encryption
            # Set connection timeouts?
            # max_connection_lifetime=30 * 60, max_connection_pool_size=50,
            # connection_acquisition_timeout=2 * 60
            # connection_timeout=15
            # max_retry_time=15
            self._driver = GraphDatabase.driver(
                self._neo_uri, auth=self._neo_auth, encrypted=False, keep_alive=True
            )

        return self._driver

    def check_connection(self):
        try:
            self.get_driver().session().begin_transaction().close()
        except ServiceUnavailable:
            # Failed to write to defunct connection Address -> reconnect graph driver
            self.close()
            self.get_driver()

    def close(self):
        if self._driver and not self._driver.closed():
            self._driver.close()

    def get_session(self) -> Session:
        self.check_connection()
        return self.get_driver().session()

    def init_graph(self):
        try:
            with self.get_session() as session:
                tx = session.begin_transaction()
                init_graph(tx)
                tx.commit()
        except Exception:
            self.log.info(
                "Could not initialize the graph constraints. Graph is probably already initialized."  # , ex,
            )

    def delete_user(self, user_id: str):
        with self.get_session() as session:
            tx = session.begin_transaction()
            delete_user(tx, user_id)
            tx.commit()

    def add_report(self, user: User, report: CaseReport):
        with self.get_session() as session:
            tx = session.begin_transaction()
            add_report(tx, user, report)
            tx.commit()

    def run_get_query(self, query: str):
        def fetch(tx, query):
            return tx.run(query)

        session = self.get_session()
        result = session.read_transaction(fetch, query)
        session.close()
        return result

    def run_post_query(self, query: str, data):
        def put(tx, query, data):
            return tx.run(query, **data).single().value()

        session = self.get_session()
        result = session.write_transaction(put, query, data)
        session.close()
        return result
