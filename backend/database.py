"""
Управляет соединением и транзакцией.

Отвечает на вопрос:
Как безопасно подключиться к SQLite?
"""

import sqlite3
from collections.abc import Generator
from contextlib import contextmanager
from pathlib import Path


class Database:
    def __init__(self, path: Path) -> None:
        self._path = path  # инкапсуляция, внутреннее состояние класса (app.db)

    @contextmanager
    def connect(
        self,
    ) -> Generator[
        sqlite3.Connection,  # отдаёт yield
        None,  # значение через send()
        None,  # значение return
    ]:
        # Убеждаемся, что папка существует, если нет - создаем
        self._path.parent.mkdir(parents=True, exist_ok=True)

        connection = sqlite3.connect(self._path)

        # результат SELECT удобнее для чтения.
        # Теперь не row[0], row["id"]
        connection.row_factory = sqlite3.Row

        try:
            yield connection
            connection.commit()
        except Exception:
            connection.rollback()
            raise
        finally:
            connection.close()

    def initialize(self, schema_path: Path) -> None:
        schema = schema_path.read_text(encoding="utf-8")

        with self.connect() as connection:
            connection.executescript(schema)
