import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Thread from './pages/Thread'
import Threads from './pages/Threads'
function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Threads />}/>
        <Route path="/thread/:id" element={<Thread />}/>
      </Routes>
    </Router>
  )
}

export default App
