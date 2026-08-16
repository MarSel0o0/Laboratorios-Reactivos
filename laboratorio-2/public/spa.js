/** Lógica para manejar la aplicación SPAs */

// P3.

// recibe un thread (objeto con author, content, etc) y devuelve un elemento
// <li> armado, función auxiliar
function createThreadItem(thread) {
	// crea un nuevo elemento <li> en memoria
	const item = document.createElement("li");
	const fecha = new Date(thread.createdAt).toLocaleString();
	item.textContent = `${thread.author}: ${thread.content} (${fecha})`;
	// se le asigna un id único basado en el _id que genera MongoDB
	item.id = `th-${thread._id}`;

	return item
}

// pide los threads al servidor y los carga al DOM, async <-> await 
async function loadThreads() {
	// elemento <ul id="threads"> donde van a estar los threads
	const list = document.getElementById("threads");

	const res = await fetch("/data.json");
	const threads = await res.json();
	
	list.innerHTML = "";
	// se recorre el arreglo de threads uno por uno, llamando a la función aux 
	for (const thread of threads) {
	    list.appendChild(createThreadItem(thread));
	}
}