const MESSAGE_DURATION_MS = 5000

export class PageMessage {
  private readonly messageElement: HTMLElement
  private hideTimeoutId: number | undefined

  constructor(messageElement: HTMLElement) {
    this.messageElement = messageElement
  }

  public showSuccess = (message: string): void => {
    this.clearHideTimeout()

    this.messageElement.className = 'alert alert-success'
    this.messageElement.textContent = message

    this.hideTimeoutId = window.setTimeout(() => {
      this.clear()
    }, MESSAGE_DURATION_MS)
  }

  public clear = (): void => {
    this.clearHideTimeout()

    this.messageElement.className = ''
    this.messageElement.textContent = ''
  }

  private clearHideTimeout = (): void => {
    if (this.hideTimeoutId === undefined) {
      return
    }

    window.clearTimeout(this.hideTimeoutId)
    this.hideTimeoutId = undefined
  }
}
