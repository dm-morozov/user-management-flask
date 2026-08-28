"""
Как получить пользователей из SQLite?
"""

from .database import Database
from .models import UserData


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
