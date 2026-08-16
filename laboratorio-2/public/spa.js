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

// P5.

// se obtiene el formulario por su id y se escucha el evento "submit"
document.getElementById("thread-form").addEventListener("submit", async (e) => {

	// preventDefault evita el comportamiento por defecto del formulario, que es recargar la página (SPA)
	e.preventDefault();
	
	const author = document.getElementById("author").value;
	const content = document.getElementById("content").value;
	
	// fetch envía un POST a /new con los datos del formulario
	const res = await fetch("/new", {
		method: "POST",
		// se indica que el body es JSON 
		headers: { "Content-Type": "application/json" },
		// JSON.stringify convierte el objeto js a un string JSON
		body: JSON.stringify({ author, content }),
	});

	// se verifica que la respuesta sea exitosa (status 200-299)
	if (!res.ok) {
		console.error("Error al crear el thread:", res.statusText);
		return;
	}

	// se parsea la respuesta JSON que contiene el thread recién creado
	const thread = await res.json();

	// se agrega el thread nuevo al listado usando la función auxiliar de P3 sin recargar la página
	const list = document.getElementById("threads");
	list.appendChild(createThreadItem(thread));

	// se limpia el formulario después de publicar
	e.target.reset();
});

// carga los threads existentes al abrir la página
loadThreads();