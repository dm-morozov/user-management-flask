"""Знает про HTTP и Flask."""

from pathlib import Path

from flask import Flask, Response, jsonify

from .database import Database
from .user_repository import UserRepository

BACKEND_DIR = Path(__file__).resolve().parent
DATABASE_PATH = BACKEND_DIR / "instance" / "users.db"
SCHEMA_PATH = BACKEND_DIR / "schema.sql"

database = Database(DATABASE_PATH)
database.initialize(SCHEMA_PATH)

user_repository = UserRepository(database)

app = Flask(__name__)


@app.get("/")
def home() -> str:
    return "User management App"


@app.get("/users")
def get_users() -> Response:
    users = user_repository.get_all()
    return jsonify(users)


@app.get("/users/<int:user_id>")
def get_user(user_id: int) -> Response:
    user = user_repository.get_by_id(user_id)

    if user is None:
        response = jsonify(
            {
                "error": {
                    # техническое значение для TS
                    "code": "user_not_found",
                    # для человека
                    "message": f"Пользователь с id {user_id} не найден",
                }
            }
        )

        response.status_code = 404
        return response

    return jsonify(user)
