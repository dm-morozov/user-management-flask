"""
Как получить пользователей из SQLite?
"""

import sqlite3

from .database import Database
from .models import UserData


class EmailAlreadyExistsError(Exception):
    """Пользователь с таким email уже существует."""


# Композиция: UserRepository содержит/использует Database
class UserRepository:
    def __init__(self, database: Database) -> None:
        self._database = database

    def get_all(self) -> list[UserData]:
        query = """
            SELECT id, name, email
            FROM users
            ORDER BY id
        """

        with self._database.connect() as connection:
            rows = connection.execute(query).fetchall()

        return [
            UserData(id=row["id"], name=row["name"], email=row["email"]) for row in rows
        ]

    def get_by_id(self, user_id: int) -> UserData | None:
        query = """
            SELECT id, name, email
            FROM users
            WHERE id = ?;
        """

        with self._database.connect() as connection:
            cursor = connection.execute(query, (user_id,))
            row = cursor.fetchone()

        # Пользователь в базе не найден
        if row is None:
            return None

        return UserData(
            id=row["id"],
            name=row["name"],
            email=row["email"],
        )

    def create_user(self, name: str, email: str) -> UserData:
        query = """
            INSERT INTO users (name, email)
            VALUES (?, ?);
        """

        try:
            with self._database.connect() as connection:
                cursor = connection.execute(query, (name, email))
                connection.commit()
                # SQLite сохраняет созданный идентификатор в переменную cursor.lastrowid
                user_id = cursor.lastrowid
        except sqlite3.IntegrityError as error:
            # абстракция: Repository скрывает технические детали хранения данных
            # backend.user_repository.EmailAlreadyExistsError: anna@gmail.com
            raise EmailAlreadyExistsError(email) from error

        if user_id is None:
            raise RuntimeError("Не удалось получить id созданного пользователя")

        return UserData(id=user_id, name=name, email=email)
