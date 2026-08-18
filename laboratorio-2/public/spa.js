/////////////////////////////////////////////////////////////////////////////
///////////////////////// FUNCIONES AUXILIARES /////////////////////////////
////////////////////////////////////////////////////////////////////////////

/**
 * Dibuja los threads en cualquier data que los contenga.
 * Lo uso principalmente para reciclar código
 * @param data La data de donde se extraen los threads
 */
let draw = function (data) {
    let ul = document.createElement("ul");
    ul.setAttribute("class", "threads");

    data.forEach(function (thread) {
        let li = document.createElement("li");
        ul.appendChild(li);
        li.appendChild(document.createTextNode(`${thread.author}: ${thread.content}`));
    });
    document.getElementById("threads").appendChild(ul);
};

/////////////////////////////////////////////////////////////////////////////
//////////////////// LÓGICA PARA CARGAR EL HOME ////////////////////////////
////////////////////////////////////////////////////////////////////////////

// variable para manejar las request GET de data.json
let xhttp = new XMLHttpRequest();


// Callback para cuando se trata de conseguir los threads de la base de datos.
xhttp.onreadystatechange = function () {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
        // Actualizamos el arreglo de threads porque reciclamos código con la función draw
        threads = JSON.parse(this.responseText);
        console.log(threads);
        draw(threads);
    }
};

// Preparar y enviar la petición
xhttp.open("GET", "/data.json", true);
xhttp.send();

/////////////////////////////////////////////////////////////////////////////
//////////////////// LÓGICA PARA PROCESAR EL FORM //////////////////////////
////////////////////////////////////////////////////////////////////////////

// variable para manejar la request POST de cada thread
let xhttpForPost = new XMLHttpRequest();

// Lista local de threads
let threads = [];

// Lógica para recibir el formulario y envíar el thread
let form = document.getElementById("threads_form");
form.onsubmit = function (e) {

    // Se previene que se siga el flujo por defecto del submit: envíar la request con POST.
    // De esta forma cumplimos con que sea SPA.
    e.preventDefault();

    // Creamos el thread extrayendo el contenido de los inputs, según el orden en que vienen en el html.
    let thread = {
        author: e.target.elements[0].value,
        content: e.target.elements[1].value,
    }

    // Guardamos el thread en nuestra variable local
    threads.push(thread);
    // Lo enviamos al servidor. Como no se explicitó que debía manejarse el caso de que el servidor no recibiera la request,
    // tampoco se hace lógica con respeto a eso
    sendToServer(thread);
    // Redibujamos los threads para que aparezca el nuevo
    redrawThreads();
    // Borramos lo que escribimos en los inputs.
    e.target.elements[0].value = "";
    e.target.elements[1].value = "";
};

// Limpia lo que está al interior del div que contiene los threads y los vuelve a dibujar en él
let redrawThreads = function () {
    // Obtenemos el div que contiene la lista de threads
    let threadList = document.getElementById("threads");
    // Y lo vaciamos
    threadList.innerHTML = "";
    // Dibujamos todos los threads (los que existían + el recién agregado)
    draw(threads);
};


let sendToServer = function (thread) {
    xhttpForPost.open("POST", "/new", true);
    xhttpForPost.setRequestHeader("Content-Type", "application/json");
    xhttpForPost.send(JSON.stringify(thread));
};