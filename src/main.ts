import { Modal } from 'bootstrap'
import { createUser, fetchUserById, fetchUsers } from './api/users-api'
import { UsersTable } from './ui/users-table'
import { UserDetailsModal } from './ui/user-details-modal'
import { CreateUserForm } from './ui/create-user-form'
import { PageMessage } from './ui/page-message'

const modalElement = document.querySelector<HTMLElement>('#user-details-modal')

if (!modalElement) {
  throw new Error('Не найдено модальное окно пользователя')
}

const userDetailsModal = new UserDetailsModal(modalElement)

const createUserFormElement =
  document.querySelector<HTMLFormElement>('#create-user-form')

if (!createUserFormElement) {
  throw new Error('Не найдена форма создания пользователя')
}

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

const createUserForm = new CreateUserForm(createUserFormElement)

const createUserModalElement =
  document.querySelector<HTMLElement>('#create-user-modal')

if (!createUserModalElement) {
  throw new Error('Не найдено модальное окно создания пользователя')
}

const createUserModal = new Modal(createUserModalElement)

const pageMessageElement =
  document.querySelector<HTMLElement>('#message-container')

if (!pageMessageElement) {
  throw new Error('Не найден контейнер сообщений страницы')
}

const pageMessage = new PageMessage(pageMessageElement)

createUserForm.onSubmit((newUserData) => {
  pageMessage.clear()

  void createUser(newUserData)
    .then(() => loadUsers())
    .then(() => {
      createUserForm.reset()
      createUserModal.hide()
      pageMessage.showSuccess(
        `Пользователь «${newUserData.name}» успешно добавлен`,
      )
    })
    .catch((error) => {
      const message =
        error instanceof Error ? error.message : 'Произошла неизвестная ошибка'

      createUserForm.showError(message)
    })
})

await loadUsers()
