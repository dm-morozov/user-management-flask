import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'
import './styles.css'
import { fetchUserById, fetchUsers } from './api/users-api'
import { UsersTable } from './ui/users-table'
import { UserDetailsModal } from './ui/user-details-modal'

const appElement = document.querySelector<HTMLDivElement>('#app')

if (!appElement) {
  throw new Error("Не найден корневой элемент приложения с id 'app'")
}

// modal подключает стили Bootstrap Modal
// fade добавляет плавное появление
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

  <div
    id="user-details-modal"
    class="modal fade"
    tabindex="-1"
    aria-labelledby="user-details-modal-title"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h2 id="user-details-modal-title" class="modal-title fs-5">
            Информация о пользователе
          </h2>

          <button
            class="btn-close"
            type="button"
            data-bs-dismiss="modal"
            aria-label="Закрыть"
          ></button>
        </div>

        <div class="modal-body">
          <p><strong>ID:</strong> <span id="user-details-id"></span></p>
          <p><strong>Имя:</strong> <span id="user-details-name"></span></p>
          <p><strong>Email:</strong> <span id="user-details-email"></span></p>
        </div>
      </div>
    </div>
  </div>
`
const modalElement = document.querySelector<HTMLElement>('#user-details-modal')

if (!modalElement) {
  throw new Error('Не найдено модальное окно пользователя')
}

const userDetailsModal = new UserDetailsModal(modalElement)

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
      userDetailsModal.show(selectedUser)
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
