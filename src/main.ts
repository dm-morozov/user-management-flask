import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'
import './styles.css'

// Контракт между Flask UserData и TypeScript User
interface User {
  id: number
  name: string
  email: string
}

const USERS_API_URL = 'http://localhost:5000/users'

async function fetchUsers(): Promise<User[]> {
  const response = await fetch(USERS_API_URL)

  if (!response.ok) {
    throw new Error(`Не удалось загрузить пользователей: ${response.status}`)
  }

  return (await response.json()) as User[]
}

const appElement = document.querySelector<HTMLDivElement>('#app')

if (!appElement) {
  throw new Error("Не найден корневой элемент приложения с id 'app'")
}

const users = await fetchUsers()
console.log('Загруженные пользователи:', users)

appElement.innerHTML = `
  <main class="container py-5">
    <div class="alert alert-primary" role="alert">
      Bootstrap успешно подключён
    </div>

    <button class="btn btn-primary" type="button">
      Добавить пользователя
    </button>
  </main>
`
