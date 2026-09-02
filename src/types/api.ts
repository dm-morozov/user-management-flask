// Форма взаимодействия с API

export interface ApiErrorResponse {
  error: {
    code: string
    message: string
  }
}
