# Frontend CI/CD

```yaml
name: Frontend CI/CD

on:
  push:
    branches:
      - main
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v7

      - name: Set up Node.js
        uses: actions/setup-node@v7
        with:
          node-version: '24'
          cache: yarn

      - name: Install dependencies
        run: yarn install --frozen-lockfile

      - name: Validate project
        run: yarn validate

      - name: Build project
        run: yarn build

      - name: Configure GitHub Pages
        uses: actions/configure-pages@v6

      - name: Upload Pages artifact
        uses: actions/upload-pages-artifact@v5
        with:
          path: dist

  deploy:
    needs: build
    runs-on: ubuntu-latest

    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}

    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v5
```

## Общая схема

Workflow выполняет две работы:

```text
push в main
    │
    ▼
build
├── скачать репозиторий
├── установить Node.js
├── установить зависимости
├── проверить TypeScript и ESLint
├── собрать frontend
└── передать папку dist GitHub
    │
    ▼
deploy
└── опубликовать dist на GitHub Pages
```

## Название и условия запуска

```yaml
name: Frontend CI/CD
```

Название, которое будет видно во вкладке **Actions**.

```yaml
on:
  push:
    branches:
      - main
  workflow_dispatch:
```

Workflow запускается:

- автоматически после `push` в `main`;
- вручную кнопкой **Run workflow** благодаря `workflow_dispatch`.

## Права

```yaml
permissions:
  contents: read
  pages: write
  id-token: write
```

- `contents: read` — прочитать репозиторий;
- `pages: write` — опубликовать сайт;
- `id-token: write` — подтвердить GitHub, что публикация выполняется разрешённым workflow.

Это не пароль от аккаунта. GitHub выдаёт временный токен только на время запуска.

## Защита от одновременных публикаций

```yaml
concurrency:
  group: pages
  cancel-in-progress: true
```

Если быстро отправить несколько коммитов, старая незавершённая публикация будет отменена. GitHub продолжит только последнюю.

## Работа `build`

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
```

GitHub создаёт временную виртуальную машину с Linux. После завершения workflow она удаляется.

### Получение кода

```yaml
- name: Checkout repository
  uses: actions/checkout@v7
```

Машина изначально пустая. `checkout` скачивает в неё текущую версию репозитория.

### Подготовка Node.js

```yaml
- name: Set up Node.js
  uses: actions/setup-node@v7
  with:
    node-version: '24'
    cache: yarn
```

Устанавливается Node.js 24.

```yaml
cache: yarn
```

GitHub сохраняет кеш загруженных Yarn-пакетов. При следующих запусках зависимости будут загружаться быстрее. Это не кеширует `node_modules`.

### Установка зависимостей

```yaml
- name: Install dependencies
  run: yarn install --frozen-lockfile
```

`--frozen-lockfile` запрещает автоматически менять `yarn.lock`.

Логика такая:

> CI должен воспроизводить уже зафиксированное окружение, а не самостоятельно подбирать новые версии пакетов.

Если `package.json` и `yarn.lock` противоречат друг другу, workflow завершится ошибкой.

### Проверка кода — CI

```yaml
- name: Validate project
  run: yarn validate
```

В нашем `package.json` эта команда запускает:

```text
TypeScript typecheck → ESLint
```

Если типы или линтер не проходят, следующие шаги не выполняются. Это часть **Continuous Integration**.

### Production-сборка

```yaml
- name: Build project
  run: yarn build
```

Vite автоматически использует `.env.production` и создаёт папку:

```text
dist/
```

Именно внутри неё находится готовый браузерный HTML, CSS и JavaScript.

### Передача результата

```yaml
- name: Configure GitHub Pages
  uses: actions/configure-pages@v6
```

Подготавливает настройки GitHub Pages.

```yaml
- name: Upload Pages artifact
  uses: actions/upload-pages-artifact@v5
  with:
    path: dist
```

`artifact` — результат одной работы, сохранённый GitHub. Здесь это архив папки `dist`.

## Работа `deploy`

```yaml
deploy:
  needs: build
```

`needs: build` означает:

> Не начинать публикацию, пока `build` не завершился успешно.

Если ESLint, TypeScript или сборка упадут, сломанный сайт опубликован не будет.

```yaml
environment:
  name: github-pages
  url: ${{ steps.deployment.outputs.page_url }}
```

GitHub создаёт окружение `github-pages` и сохраняет в нём адрес опубликованного сайта.

Синтаксис:

```yaml
${{ ... }}
```

означает выражение GitHub Actions, а не JavaScript или переменную Bash.

```yaml
- name: Deploy to GitHub Pages
  id: deployment
  uses: actions/deploy-pages@v5
```

Этот шаг берёт загруженный `dist` и публикует его. Это уже часть **Continuous Deployment**.

Итог:

```text
CI = Install → Validate → Build
CD = Upload → Deploy
```
