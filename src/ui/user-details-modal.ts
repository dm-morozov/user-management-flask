import { Modal } from 'bootstrap'
import type { User } from '../types/user'

export class UserDetailsModal {
  private readonly modal: Modal
  private readonly userIdElement: HTMLElement
  private readonly userNameElement: HTMLElement
  private readonly userEmailElement: HTMLElement

  constructor(modalElement: HTMLElement) {
    this.modal = new Modal(modalElement)

    const userIdElement =
      modalElement.querySelector<HTMLElement>('#user-details-id')
    const userNameElement =
      modalElement.querySelector<HTMLElement>('#user-details-name')
    const userEmailElement = modalElement.querySelector<HTMLElement>(
      '#user-details-email',
    )

    if (!userIdElement) {
      throw new Error('Не найден элемент для отображения ID пользователя')
    }

    if (!userNameElement) {
      throw new Error('Не найден элемент для отображения имени пользователя')
    }

    if (!userEmailElement) {
      throw new Error('Не найден элемент для отображения email пользователя')
    }

    this.userIdElement = userIdElement
    this.userNameElement = userNameElement
    this.userEmailElement = userEmailElement
  }

  show(user: User): void {
    this.userIdElement.textContent = String(user.id)
    this.userNameElement.textContent = user.name
    this.userEmailElement.textContent = user.email

    this.modal.show()
  }
}
