// Variable para manejar las request GET de data.json
var xhttp = new XMLHttpRequest();

// Variable para manejar la request POST de cada thread
var xhttpForPost = new XMLHttpRequest();

// Lista local de threads
let threads = [];

/**
 * Dibuja los threads en cualquier data que los contenga.
 * Lo uso principalmente para reciclar código
 * @param data La data de donde se extraen los threads
 */
var draw = function (data) {
    var ul = document.createElement("ul");
    ul.setAttribute("class", "threads");

    data.forEach(function (thread) {
        var li = document.createElement("li");
        ul.appendChild(li);
        li.appendChild(document.createTextNode(thread.content));
    });
    document.getElementById("threads").appendChild(ul);
};

// Callback para cuando se trata de conseguir los threads de la base de datos.
xhttp.onreadystatechange = function () {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
        const data = JSON.parse(this.responseText);
        threads = data;
        console.log(threads);
        draw(threads);
    }
};

// Preparar y enviar la petición
xhttp.open("GET", "/data.json", true);
xhttp.send();


// Lógica para recibir el formulario y envíar el thread
var form = document.getElementById("threads_form");
form.onsubmit = function (e) {
    e.preventDefault();

    var thread = {
        author: e.target.elements[0].value,
        content: e.target.elements[1].value,
    }

    threads.push(thread);
    sendToServer(thread);
    redrawThreads();
    e.target.elements[0].value = "";
    e.target.elements[1].value = "";
};

// Limpia lo que está al interior del div que contiene los threads y los vuelve a dibujar en él
var redrawThreads = function () {
    var threadList = document.getElementById("threads");
    threadList.innerHTML = "";
    draw(threads);
};


var sendToServer = function (thread) {
    xhttpForPost.open("POST", "/new", true);
    xhttpForPost.setRequestHeader("Content-Type", "application/json");
    xhttpForPost.send(JSON.stringify(thread));
};