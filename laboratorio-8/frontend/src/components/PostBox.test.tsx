import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import PostBox from './PostBox'
import threads from '../services/threads'
import type { Post } from '../types/posts'

vi.mock('../services/threads', () => ({
  default: { update: vi.fn() },
}))

const makePost = (overrides: Partial<Post> = {}): Post => ({
  id: 2,
  content: 'Contenido de prueba',
  author: 'marcelo',
  thread: 1,
  parent: null,
  createdAt: '2025-01-01T12:00:00.000Z',
  updatedAt: '2025-01-01T12:00:00.000Z',
  likes: 0,
  dislikes: 0,
  ...overrides,
})

const renderPostBox = (post: Post, setToast = vi.fn()) =>
  render(
    <MemoryRouter>
      <PostBox post={post} action="reply" setToast={setToast} />
    </MemoryRouter>,
  )

describe('<PostBox />', () => {
  test('renderiza el contenido y el nombre del autor', () => {
    renderPostBox(makePost({ content: 'Hola mundo', author: 'marcelo' }))

    expect(screen.getByText('Hola mundo')).toBeInTheDocument()
    expect(screen.getByText('marcelo')).toBeInTheDocument()
  })

  test('renderiza "Anonymous" si no hay autor', () => {
    renderPostBox(makePost({ author: null }))

    expect(screen.getByText('Anonymous')).toBeInTheDocument()
  })

  test('renderiza el ID del comentario al que responde', () => {
    renderPostBox(makePost({ id: 5, thread: 1, parent: 3 }))

    expect(screen.getByRole('link', { name: '>>3' })).toBeInTheDocument()
  })

  test('no renderiza referencia si no responde a nadie', () => {
    renderPostBox(makePost({ parent: null }))

    expect(screen.queryByText(/>>/)).not.toBeInTheDocument()
  })

  test('presionar dos veces "like" llama dos veces a setToast', async () => {
    vi.mocked(threads.update).mockResolvedValue(makePost())
    const setToast = vi.fn()
    renderPostBox(makePost(), setToast)

    const user = userEvent.setup()
    const button = screen.getByRole('button', { name: 'like post' })

    await user.click(button)
    await user.click(button)

    await waitFor(() => expect(setToast).toHaveBeenCalledTimes(2))
    expect(setToast).toHaveBeenCalledWith({
      message: 'Me gusta registrado',
      severity: 'success',
    })
  })
})
