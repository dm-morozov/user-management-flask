// Контракт между Flask UserData и TypeScript User
export interface User {
  id: number
  name: string
  email: string
}

export interface CreateUserData {
  name: string
  email: string
}
