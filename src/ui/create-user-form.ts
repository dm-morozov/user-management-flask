import type { CreateUserData } from '../types/user'

type CreateUserHandler = (data: CreateUserData) => void

export class CreateUserForm {
  private readonly formElement: HTMLFormElement
  private readonly messageElement: HTMLElement

  public reset = (): void => {
    this.formElement.reset()
    this.clearMessage()
  }

  constructor(formElement: HTMLFormElement) {
    this.formElement = formElement

    const messageElement = formElement.querySelector<HTMLElement>(
      '#create-user-message',
    )

    if (!messageElement) {
      throw new Error('Не найден элемент для сообщения формы')
    }

    this.messageElement = messageElement
  }

  public showError = (message: string): void => {
    this.messageElement.className = 'alert alert-danger'
    this.messageElement.textContent = message
  }

  public clearMessage = (): void => {
    this.messageElement.className = ''
    this.messageElement.textContent = ''
  }

  public onSubmit = (handler: CreateUserHandler): void => {
    this.formElement.addEventListener('submit', (event) => {
      event.preventDefault()
      this.clearMessage()

      const formData = new FormData(this.formElement)
      const name = formData.get('name')
      const email = formData.get('email')

      if (typeof name !== 'string' || typeof email !== 'string') {
        throw new Error('Не удалось получить данные формы пользователя')
      }

      handler({
        name: name.trim(),
        email: email.trim(),
      })
    })
  }
}
