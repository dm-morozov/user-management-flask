import type { User } from '../types/user'

type UserSelectHandler = (userId: number) => void

// инкапсуляция
export class UsersTable {
  private readonly tableBody: HTMLTableSectionElement

  constructor(tableBody: HTMLTableSectionElement) {
    this.tableBody = tableBody
  }

  public renderMessage = (
    message: string,
    textClass = 'text-body-secondary',
  ): void => {
    const row = document.createElement('tr')
    const cell = document.createElement('td')

    cell.colSpan = 3
    cell.classList.add('py-4', 'text-center', textClass)
    cell.textContent = message

    row.append(cell)
    this.tableBody.replaceChildren(row)
  }

  public renderUsers = (users: User[]): void => {
    // Очищает старые строки перед обновлением списка
    this.tableBody.replaceChildren()

    if (users.length === 0) {
      this.renderMessage(
        'Пользователей пока нет. Добавьте первого пользователя.',
      )
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

      this.tableBody.append(row)
    }
  }

  public onUserSelect = (handler: UserSelectHandler): void => {
    this.tableBody.addEventListener('click', (event) => {
      const target = event.target

      if (!(target instanceof Element)) {
        return
      }

      const row = target.closest<HTMLTableRowElement>('tr[data-user-id]')

      if (!row || !this.tableBody.contains(row)) {
        return
      }

      const userId = Number(row.dataset.userId)

      if (!Number.isInteger(userId)) {
        return
      }

      handler(userId)
    })
  }
}
