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
  await page.getByRole('button', { name: 'Post', exact: true }).click()
}

interface PostData {
  content: string,
  author: string
}

// Thread y comentarios de ejemplo, usados tanto para crearlos como para verificarlos.
const sampleThread: PostData = {
  content: 'Thread de ejemplo creado desde el backend',
  author: 'Autor del thread'
}

const sampleComments: PostData[] = [
  { content: 'Primer comentario de ejemplo', author: 'Autor uno' },
  { content: 'Segundo comentario de ejemplo', author: 'Autor dos' }
]

// Crea un thread con sus comentarios mediante llamadas directas al backend. Devuelve el id del thread.
const createThread = async (
  request: APIRequestContext,
  thread: PostData = sampleThread,
  comments: PostData[] = sampleComments
) => {
  const threadResponse = await request.post('/api/threads', { data: thread })
  if (!threadResponse.ok()) {
    throw new Error(`No se pudo crear el thread: ${threadResponse.status()} ${await threadResponse.text()}`)
  }
  const { id } = await threadResponse.json()

  for (const comment of comments) {
    const commentResponse = await request.post(`/api/threads/${id}`, { data: comment })
    if (!commentResponse.ok()) {
      throw new Error(`No se pudo crear el comentario: ${commentResponse.status()} ${await commentResponse.text()}`)
    }
  }
  return id as string
}

export { resetDb, createUser, login, createPost, createThread, sampleThread, sampleComments }
