import os

os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "/workspace/firebase-secret.json"
os.environ["ID_GENERATION_SECRET"] = "secret"
os.environ["NEO4J_URI"] = "bolt://docker.for.mac.localhost:7687"
os.environ["NEO4J_AUTH"] = ""

from cotect_endpoints.endpoints import app
