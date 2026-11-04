import { Page, APIRequestContext } from "@playwright/test"

interface Credentials {
  username: string,
  email: string,
  password: string
}

// Vacía la base de datos de pruebas, la misma que usa el backend con NODE_ENV=test.
const resetDb = async (request: APIRequestContext) => {
  await request.post('/api/testing/reset')
}

const createUser = async (request: APIRequestContext, user: Credentials) => {
  const response = await request.post('/api/users', { data: user })
  if (!response.ok()) {
    throw new Error(`No se pudo crear el usuario: ${response.status()} ${await response.text()}`)
  }
}

const login = async (page: Page, username: string, password: string) => {
  await page.goto('/login')
  await page.getByTestId('username').fill(username)
  await page.getByTestId('password').fill(password)
  await page.getByRole('button', { name: 'Sign In' }).click()
}

// Publica un thread desde el formulario de /threads. El autor es opcional.
const createPost = async (page: Page, content: string, author?: string) => {
  if (author) {
    await page.getByTestId('author').fill(author)
  }
  await page.getByTestId('content').fill(content)
  await page.getByRole('button', { name: 'Post' }).click()
}

export { resetDb, createUser, login, createPost }
