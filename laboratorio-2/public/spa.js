/** Lógica para manejar la aplicación SPAs */

const threadsList = document.getElementById("threads");
const newThreadForm = document.getElementById("new-thread-form");

/** Crea el <li> correspondiente a un thread y lo agrega al listado. */
function renderThread(thread) {
  const li = document.createElement("li");

  const meta = document.createElement("strong");
  const fecha = new Date(thread.createdAt).toLocaleString();
  // textContent (no innerHTML) para no interpretar el autor/contenido
  // como HTML si un usuario escribe etiquetas.
  meta.textContent = `${thread.author} — ${fecha}`;

  const content = document.createElement("p");
  content.textContent = thread.content;

  li.appendChild(meta);
  li.appendChild(content);
  threadsList.appendChild(li);
}

/** P3: pide el listado completo a GET /data.json y lo dibuja, sin recargar
 *  la página (fetch + AJAX en vez de que el servidor arme el HTML). */
async function loadThreads() {
  const response = await fetch("/data.json");
  const threads = await response.json();
  threadsList.innerHTML = "";
  threads.forEach(renderThread);
}

/** P5: intercepta el submit del formulario, envía los datos por POST /new
 *  como JSON y agrega el thread recién creado al listado sin recargar. */
newThreadForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const author = document.getElementById("author").value;
  const content = document.getElementById("content").value;

  const response = await fetch("/new", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ author, content }),
  });

  if (!response.ok) {
    console.error("No se pudo crear el thread");
    return;
  }

  const thread = await response.json();
  renderThread(thread);
  newThreadForm.reset();
});

loadThreads();
