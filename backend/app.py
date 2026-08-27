from flask import Flask

app = Flask(__name__)


@app.get("/")
def home() -> str:
    return "User management App"
