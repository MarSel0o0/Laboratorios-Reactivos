/** Lógica para manejar la aplicación SPA */

async function cargarThreads() {
  const lista = document.getElementById("threads");
  const response = await fetch("/data.json");
  const threads = await response.json();

  lista.innerHTML = "";
  if (threads.length === 0) {
    const vacio = document.createElement("li");
    vacio.textContent = "No hay threads todavía.";
    lista.appendChild(vacio);
    return;
  }

  for (const thread of threads) {
    const item = document.createElement("li");
    const fecha = new Date(thread.createdAt).toLocaleString();
    item.textContent = `${thread.author}: ${thread.content} (${fecha})`;
    item.id = `thread-${thread._id}`;
    lista.appendChild(item);
  }
}

async function createThread(event) {
  event.preventDefault();
  const form = event.target;
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  const response = await fetch("/new", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (response.ok) {
    form.reset();
    cargarThreads();
  } else {
    console.error("Error al crear el thread:", response.statusText);
  }
}

document.addEventListener("DOMContentLoaded", cargarThreads);
document
  .getElementById("new-thread-form")
  .addEventListener("submit", createThread);
