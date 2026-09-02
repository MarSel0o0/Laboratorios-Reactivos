<<<<<<< HEAD
import PostBox from "./components/PostBox";
=======
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Threads from './pages/Threads.tsx'
import Thread from './pages/Thread.tsx'
>>>>>>> 1e10fbf290d1f60f68980ad27ca7a2157f224a13

function App() {
  return (
<<<<<<< HEAD
    <div>
      <PostBox author="Seba" content="Hola como estas" parent={1} />
    </div>
  );
=======
    <BrowserRouter>
      <h1>Pila Completa</h1>
      <Routes>
        <Route path="/" element={<Threads />} />
        <Route path="/threads/:id" element={<Thread />} />
      </Routes>
    </BrowserRouter>
  )
>>>>>>> 1e10fbf290d1f60f68980ad27ca7a2157f224a13
}

export default App;
