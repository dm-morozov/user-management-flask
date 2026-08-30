
# User Management Flask

Учебное fullstack-приложение для управления пользователями. Backend написан на
Flask и хранит данные в SQLite. Frontend разрабатывается на Vanilla TypeScript,
Vite и Bootstrap.

## Требования

- Python 3.14+
- Node.js 20.19+
- Yarn 1.22+

## Локальный запуск

### Backend

Создайте и активируйте виртуальное окружение, затем установите зависимости:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r backend\requirements.txt
```

Запустите Flask из корня проекта:

```powershell
flask --app backend.app run --debug
```

API будет доступен по адресу `http://127.0.0.1:5000`.

### Frontend

Во втором терминале установите зависимости и запустите Vite:

```powershell
yarn install
yarn dev
```

Frontend будет доступен по адресу `http://127.0.0.1:5173`.

## API

| Метод | Endpoint | Назначение |
| --- | --- | --- |
| `GET` | `/users` | Получить всех пользователей |
| `GET` | `/users/<id>` | Получить пользователя по идентификатору |
| `POST` | `/users` | Создать пользователя |

Пример тела запроса для создания пользователя:

```json
{
  "name": "Анна",
  "email": "anna@example.com"
}
```

## Проверка frontend

```powershell
yarn validate
yarn build
```
