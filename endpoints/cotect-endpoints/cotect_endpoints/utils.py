import hashlib
import logging
import os
import re

import phonenumbers

log = logging.getLogger(__name__)

_SIMPLIFY_STRING_PATTERN = re.compile(r"[^a-zA-Z0-9-]")


def safe_str(obj) -> str:
    try:
        return str(obj)
    except UnicodeEncodeError:
        return obj.encode("ascii", "ignore").decode("ascii")


def simplify(text: str) -> str:
    return _SIMPLIFY_STRING_PATTERN.sub("-", safe_str(text).strip()).lower()


def generate_symptom_id(symptom_name: str) -> str:
    return simplify(symptom_name)


def normalize_phone(phone_number: str) -> str:
    try:
        return phonenumbers.format_number(
            # TODO better region handling
            phonenumbers.parse(phone_number, "DE"),
            phonenumbers.PhoneNumberFormat.E164,
        )
    except phonenumbers.phonenumberutil.NumberParseException:
        # TODO: what should happen here?
        log.info("Failed to parse phone number: " + str(phone_number))
        return phone_number


def generate_user_id(phone_number: str, secret: str) -> str:
    hashed_number = hashlib.sha1(
        normalize_phone(phone_number).encode("utf-8")
    ).hexdigest()

    return hashlib.sha1((hashed_number + secret).encode("utf-8")).hexdigest()


def is_valid_phonenumber(phone_number: str):
    return phonenumbers.is_possible_number(phonenumbers.parse(phone_number, "DE"))


def get_id_generation_secret() -> str:
    return os.getenv("ID_GENERATION_SECRET", "default")
