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

document.addEventListener("DOMContentLoaded", cargarThreads);
