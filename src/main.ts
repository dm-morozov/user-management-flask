import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'
import './styles.css'
import { fetchUserById, fetchUsers } from './api/users-api'
import { UsersTable } from './ui/users-table'

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

// композиция, ближе даже к агрегации (отношение "содержит")
const usersTable = new UsersTable(tableBody)

usersTable.onUserSelect((userId) => {
  void fetchUserById(userId)
    .then((selectedUser) => {
      console.log('Получен пользователь:', selectedUser)
    })
    .catch((error) => {
      console.error('Ошибка получения пользователя:', error)
    })
})

const loadUsers = async (): Promise<void> => {
  usersTable.renderMessage('Загрузка пользователей...')

  try {
    const users = await fetchUsers()
    usersTable.renderUsers(users)
  } catch {
    usersTable.renderMessage(
      'Не удалось загрузить пользователей. Проверьте, запущен ли сервер.',
      'text-danger',
    )
  }
}

await loadUsers()
