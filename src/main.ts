import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'
import './styles.css'

const appElement = document.querySelector<HTMLDivElement>('#app')

if (!appElement) {
  throw new Error("Не найден корневой элемент приложения с id 'app'")
}

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
