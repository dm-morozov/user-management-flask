import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'
import './styles.css'

// Контракт между Flask UserData и TypeScript User
interface User {
  id: number
  name: string
  email: string
}

const USERS_API_URL = 'http://localhost:5000/users'

async function fetchUsers(): Promise<User[]> {
  const response = await fetch(USERS_API_URL)

  if (!response.ok) {
    throw new Error(`Не удалось загрузить пользователей: ${response.status}`)
  }

  return (await response.json()) as User[]
}

const appElement = document.querySelector<HTMLDivElement>('#app')

if (!appElement) {
  throw new Error("Не найден корневой элемент приложения с id 'app'")
}

const users = await fetchUsers()
console.log('Загруженные пользователи:', users)

appElement.innerHTML = `
  <main class="container py-5">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1 class="h2 mb-0">Пользователи</h1>

      <button id="add-user-button" class="btn btn-primary" type="button">Добавить пользователя</button>
    </div>
    <div id="message-container"></div>

    <div class="table-responsive">
      <table class="table table-hover align-middle">
        <thead class="table-light">
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Имя</th>
            <th scope="col">email</th>
          </tr>
        </thead>
        <tbody id="users-table-body"></tbody>
      </table>
    </div>
  </main>
`

const tableBody =
  document.querySelector<HTMLTableSectionElement>('#users-table-body')

if (!tableBody) {
  throw new Error('Не найдено тело таблицы пользователей')
}

const renderUsers = (users: User[]): void => {
  // Очищает новые строки перед обновлвением списка
  tableBody.replaceChildren()
  console.log('привет')

  for (const user of users) {
    const row = document.createElement('tr')
    row.dataset.userId = String(user.id)

    const values = [String(user.id), user.name, user.email]
    for (const value of values) {
      const cell = document.createElement('td')
      console.log(cell)
      cell.textContent = value
      row.append(cell)
    }

    tableBody.append(row)
  }
}

renderUsers(users)
