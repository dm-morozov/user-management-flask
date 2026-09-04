"""Знает про HTTP и Flask."""

from pathlib import Path

from flask import Flask, Response, jsonify, render_template, request
from flask_cors import CORS

from .database import Database
from .user_repository import EmailAlreadyExistsError, UserRepository

BACKEND_DIR = Path(__file__).resolve().parent
DATABASE_PATH = BACKEND_DIR / "instance" / "users.db"
SCHEMA_PATH = BACKEND_DIR / "schema.sql"

database = Database(DATABASE_PATH)
database.initialize(SCHEMA_PATH)

user_repository = UserRepository(database)

app = Flask(__name__)

CORS(
    app,
    resources={
        r"/users(?:/.*)?$": {
            "origins": [
                "http://127.0.0.1:5173",
                "http://localhost:5173",
                "https://dm-morozov.github.io",
            ]
        }
    },
)


@app.get("/")
def home() -> str:
    return render_template("api-index.html")


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


@app.post("/users")
def create_user() -> Response:
    # silent=True означает: если клиент прислал невалидный JSON,
    # Flask вернёт None, а не сразу выбросит стандартную HTML-ошибку.
    data = request.get_json(silent=True)  # получаем JSON-объект из тела запроса

    if not isinstance(data, dict):
        response = jsonify(
            {
                "error": {
                    "code": "invalid_request_body",
                    "message": "Тело запроса должно быть JSON-объектом",
                }
            }
        )

        # 400 - клиент отправил некорректный запрос
        response.status_code = 400
        return response

    name = data.get("name")

    if not isinstance(name, str) or not name.strip():
        response = jsonify(
            {
                "error": {
                    "code": "invalid_name",
                    "message": "Имя должно быть непустой строкой",
                }
            }
        )

        response.status_code = 400
        return response

    name = name.strip()

    email = data.get("email")

    if not isinstance(email, str) or not email.strip():
        response = jsonify(
            {
                "error": {
                    "code": "invalid_email",
                    "message": "Email должен быть непустой строкой",
                }
            }
        )

        response.status_code = 400
        return response

    email = email.strip()

    try:
        created_user = user_repository.create_user(name, email)
    except EmailAlreadyExistsError:
        response = jsonify(
            {
                "error": {
                    "code": "email_already_exists",
                    "message": f"Пользователь с email '{email}' уже существует",
                }
            }
        )
        response.status_code = 409
        return response

        # отлично, теперь ошибка контролируема:
        # Invoke-WebRequest:
        # {
        # "error": {
        #     "code": "email_already_exists",
        #     "message": "..."
        # }
        # }

    response = jsonify(created_user)
    response.status_code = 201
    return response

    # Проверка работы:
    # Invoke-WebRequest `
    #   -Method Post `
    #   -Uri "http://127.0.0.1:5000/users" `
    #   -ContentType "application/json" `
    #   -Body '{"name":"Анна","email":"anna@gmail.com"}'

    # При попытке создать заного: sqlite3.IntegrityError: UNIQUE constraint failed: users.email
    # Ошибка 500 Internal Server Error
    # Так как ошибка не самого сервера, а из-за клиента, который отправил комфликтующий email.
    # Нужен 409 Conflict
