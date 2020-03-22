from datetime import date
from enum import Enum
from typing import List, Optional

from pydantic import BaseModel, Field

# Field validation
# https://pydantic-docs.helpmanual.io/usage/schema/#field-customisation


class User(BaseModel):
    user_id: str
    verified: bool = False


class CovidTest(str, Enum):
    not_tested = "not-tested"
    tested_negative = "tested-negative"
    tested_positive = "tested-positive"
    tested_pending = "tested-pending"


class Gender(str, Enum):
    male = "male"
    female = "female"
    other = "other"


class CasePlace(BaseModel):
    place_id: str
    visit_dates: Optional[List[date]] = None
    latitude: Optional[float] = Field(None, ge=-90, le=90)
    longitude: Optional[float] = Field(None, ge=-180, le=180)
    place_name: Optional[str] = None
    place_types: Optional[List[str]] = None


class CaseContact(BaseModel):
    phone_number: str
    contact_dates: Optional[List[date]] = None


class CaseSymptom(BaseModel):
    symptom_name: str
    report_date: Optional[date] = None
    severity: Optional[str] = None


class CaseReport(BaseModel):
    age: Optional[int] = Field(None, ge=0, le=150)
    gender: Optional[Gender] = None
    residence: Optional[CasePlace] = None
    covid_test: Optional[CovidTest] = None
    covid_contact: Optional[bool] = None
    symptoms: List[CaseSymptom] = []
    places: List[CasePlace] = []
    contacts: List[CaseContact] = []
