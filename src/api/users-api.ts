import type { ApiErrorResponse } from '../types/api'
import type { CreateUserData, User } from '../types/user'

const USERS_API_URL = `${import.meta.env.VITE_API_URL}/users`

export async function fetchUsers(): Promise<User[]> {
  const response = await fetch(USERS_API_URL)

  if (!response.ok) {
    throw new Error(`Не удалось загрузить пользователей: ${response.status}`)
  }

  return (await response.json()) as User[]
}

export async function fetchUserById(userId: number): Promise<User> {
  const response = await fetch(`${USERS_API_URL}/${userId}`)
  if (!response.ok) {
    const errorResponse = (await response.json()) as ApiErrorResponse
    throw new Error(errorResponse.error.message)
  }

  return (await response.json()) as User
}

export async function createUser(data: CreateUserData): Promise<User> {
  const response = await fetch(USERS_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const errorResponse = (await response.json()) as ApiErrorResponse
    throw new Error(errorResponse.error.message)
  }

  return (await response.json()) as User
}
