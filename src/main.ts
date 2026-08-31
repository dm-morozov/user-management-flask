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
            <th scope="col">Email</th>
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

const renderTableMessage = (
  message: string,
  textClass = 'text-body-secondary',
): void => {
  const row = document.createElement('tr')
  const cell = document.createElement('td')

  cell.colSpan = 3
  cell.classList.add('py-4', 'text-center', textClass)
  cell.textContent = message

  row.append(cell)
  tableBody.replaceChildren(row)
}

const renderUsers = (users: User[]): void => {
  // Очищает старые строки перед обновлением списка
  tableBody.replaceChildren()

  if (users.length === 0) {
    renderTableMessage('Пользователей пока нет. Добавьте первого пользователя.')
    return
  }

  for (const user of users) {
    const row = document.createElement('tr')
    row.dataset.userId = String(user.id)

    const values = [String(user.id), user.name, user.email]
    for (const value of values) {
      const cell = document.createElement('td')
      cell.textContent = value
      row.append(cell)
    }

    tableBody.append(row)
  }
}

tableBody.addEventListener('click', (event) => {
  const target = event.target

  if (!(target instanceof Element)) {
    return
  }

  const row = target.closest<HTMLTableRowElement>('tr[data-user-id]')

  if (!row || !tableBody.contains(row)) {
    return
  }

  const userId = Number(row.dataset.userId)

  if (!Number.isInteger(userId)) {
    return
  }

  console.log('Выбран пользователь:', userId)
})

const loadUsers = async (): Promise<void> => {
  renderTableMessage('Загрузка пользователей...')

  try {
    const users = await fetchUsers()
    renderUsers(users)
  } catch {
    renderTableMessage(
      'Не удалось загрузить пользователей. Проверьте, запущен ли сервер.',
      'text-danger',
    )
  }
}

await loadUsers()
