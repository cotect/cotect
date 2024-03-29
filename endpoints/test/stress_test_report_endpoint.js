/*
 * Cotect User Endpoints
 * User endpoints REST API for cotect project.
 *
 * OpenAPI spec version: 0.1.2
 *
 * NOTE: This class is auto generated by OpenAPI Generator.
 * https://github.com/OpenAPITools/openapi-generator
 *
 * OpenAPI generator version: 4.3.1-SNAPSHOT
 */

import http from "k6/http";
import { group, check, sleep, fail } from "k6";

const BASE_URL = "https://cotect-backend.endpoints.cotect.cloud.goog";
const AUTH_TOKEN = "demo"
// Sleep duration between successive requests.
// You might want to edit the value of this variable or remove calls to the sleep function on the script.
const SLEEP_DURATION = 0.1;

function randomFloat(from, to) {
    return from + (to - from) * Math.random()
}

function randomInt(from, to) {
    return from + Math.floor((to - from) * Math.random())
}

function randomChoice(choices) {
    return choices[Math.floor(Math.random() * choices.length)]
}

function randomDate() {
    let start = new Date(2020, 1, 1)
    let end = new Date()
    let date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    return date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate()
}

function randomDates(num) {
    let dates = []
    for (let i = 0; i < num; ++i) {
        dates.push(randomDate())
    }
    return dates
}

function randomString() {
    return Math.random().toString(36).substring(2, 15)
}


function generate_symptoms() {
    let symptoms = []
    for (let i = 0; i < randomInt(0, 5); ++i) {
        symptoms.push({
            "symptom_name": randomChoice(["Symptom1", "Symptom2", "Symptom3",
                "Symptom4", "Symptom5", "Symptom6", "Symptom7", "Symptom8", "Symptom9"]),
            "report_date": randomDate(),
            "severity": randomChoice(["severity1", "severity2", "severity3"])
        })
    }
    return symptoms
}

function generate_place() {
    return {
        "place_id": randomString(),
        "visit_dates": randomDates(randomInt(1, 7)),
        "latitude": randomFloat(-90, 90),
        "longitude": randomFloat(-180, 180),
        "place_name": randomString(),
        "place_types": []
    }
}

function generate_places() {
    return Array.from({ length: 10 }, _ => generate_place())
}

function generate_contacts() {
    return Array.from({ length: 10 }, _ => ({
        "phone_number": String(Math.random()).substring(2, 11),
        "contact_dates": randomDates(randomInt(1, 7))
    }))
}

function generate_body() {
    return {
        "age": randomInt(0, 150),
        "gender": randomChoice(["male", "female", "other"]),
        "residence": generate_place(),
        "covid_test": randomChoice(["not-tested", "tested-negative", "tested-positive", "tested-pending"]),
        "covid_contact": randomChoice([true, false]),
        "symptoms": generate_symptoms(),
        "places": generate_places(),
        "contacts": generate_contacts()
    }
}

export default function () {
    group("/reports", () => {
        let url = BASE_URL + `/reports`;
        let body = JSON.stringify(generate_body())
        let params = { headers: { "Content-Type": "application/json", "Accept": "application/json", "Authorization": "Bearer " + AUTH_TOKEN } };

        // create report
        let request = http.post(url, body, params);
        let successful = check(request, {
            "Successful Response": (r) => r.status === 201
        });
        if (!successful) {
            fail(`Failed to create report: error code ${request.status}, API response was: \n${request.body} \n with request body:\n ${body}`)
        }
        sleep(SLEEP_DURATION);

        // delete report
        request = http.del(url, null, params);
        successful = check(request, {
            "Successful Response": (r) => r.status === 204
        });
        if (!successful) {
            fail(`Failed to delete report: error code ${request.status}, API response was: \n${request.body} \n with request body:\n ${body}`)
        }
        sleep(SLEEP_DURATION);
    });
}
