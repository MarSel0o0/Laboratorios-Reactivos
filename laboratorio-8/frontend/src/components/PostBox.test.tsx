import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import PostBox from './PostBox'
import type { Post } from '../types/posts'

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

const renderPostBox = (post: Post) =>
  render(
    <MemoryRouter>
      <PostBox post={post} action="reply" setToast={vi.fn()} />
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
})
