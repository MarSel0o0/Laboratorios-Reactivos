import PostBox from "./components/PostBox";

function App() {
  // P2: reemplace este contenido por la página principal, con el listado de
  // threads.
  //
  // P3: para llegar a la vista detallada de un thread hay que decidir qué
  // página mostrar. Con React Router, el esqueleto queda así:
  //
  //   <BrowserRouter>
  //     <Routes>
  //       <Route path="/" element={<Threads />} />
  //       <Route path="/:id" element={<Thread />} />
  //     </Routes>
  //   </BrowserRouter>
  return (
    <div>
      <PostBox author="Seba" content="Hola como estas" parent={1} />
    </div>
  );
}

export default App;
