import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Threads from './pages/Threads.tsx'
import Thread from './pages/Thread.tsx'

function App() {
  return (
    <BrowserRouter>
      <h1>Pila Completa</h1>
      <Routes>
        <Route path="/" element={<Threads />} />
        <Route path="/threads/:id" element={<Thread />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
