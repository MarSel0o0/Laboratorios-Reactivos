import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PostForm from './PostForm'

describe('<PostForm />', () => {
  test('llama a onSubmit con el contenido y el autor ingresados', async () => {
    const onSubmit = vi.fn()
    render(<PostForm onSubmit={onSubmit} />)

    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/name/i), 'marcelo')
    await user.type(screen.getByLabelText(/comment/i), 'Hola mundo')
    await user.click(screen.getByRole('button', { name: 'Post' }))

    expect(onSubmit).toHaveBeenCalledTimes(1)
    expect(onSubmit).toHaveBeenCalledWith({
      content: 'Hola mundo',
      author: 'marcelo',
      parent: undefined,
    })
  })

  test('llama a onSubmit con el contenido y el autor ingresados para un comentario', async () => {
    const onSubmit = vi.fn()
    render(<PostForm parentId={1} onSubmit={onSubmit} />)

    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/name/i), 'marcelo')
    await user.type(screen.getByLabelText(/comment/i), 'Hola mundo')
    await user.click(screen.getByRole('button', { name: 'Post' }))

    expect(onSubmit).toHaveBeenCalledTimes(1)
    expect(onSubmit).toHaveBeenCalledWith({
      content: 'Hola mundo',
      author: 'marcelo',
      parent: 1,
    })
  })
})
