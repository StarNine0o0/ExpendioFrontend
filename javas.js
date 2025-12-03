const fecha = new Date();
const dia = String(fecha.getDate()).padStart(2, '0');
const mes = String(fecha.getMonth() + 1).padStart(2, '0');
const año = fecha.getFullYear();
const fechaFormateada = `${dia}/${mes}/${año}`;
document.getElementById("fechaActual").innerHTML = `${fechaFormateada} <img src="calendario.png">`;

function obtenerHora() {
    const fecha = new Date();
    let horas = fecha.getHours();
    let minutos = fecha.getMinutes();
    const ampm = horas >= 12 ? "p.m." : "a.m.";
    horas = horas % 12;
    horas = horas ? horas : 12;
    minutos = String(minutos).padStart(2, '0');
    const horaFormateada = `${horas}:${minutos} ${ampm}`;
    document.getElementById("horaActual").innerHTML = `${horaFormateada} <img src="reloj.png">`;
}

obtenerHora();
setInterval(obtenerHora, 60000);

const sucursalUsuario = 1;
const sucursales = [
    { id: 1, nombre: "Sucursal Centro" },
    { id: 2, nombre: "Sucursal Norte" }
];
const sucursalesDisponibles = sucursales.filter(s => s.id !== sucursalUsuario);
const selectSucursal = document.getElementById("sucursalSelect");
sucursalesDisponibles.forEach(s => {
    const option = document.createElement("option");
    option.value = s.id;
    option.textContent = s.nombre;
    selectSucursal.appendChild(option);
});

const usuarioActual = 3;
const almacenistaGeneral = 1;
const almacenistas = [
    { id: 1, nombre: "Almacenista General" },
    { id: 2, nombre: "Juan López" },
    { id: 3, nombre: "María Gómez" },
    { id: 4, nombre: "Carlos Pérez" },
    { id: 5, nombre: "Ana Torres" }
];
const disponibles = almacenistas.filter(a => a.id !== usuarioActual && a.id !== almacenistaGeneral);
const selectReceptor = document.getElementById("receptorSelect");
disponibles.forEach(a => {
    const option = document.createElement("option");
    option.value = a.id;
    option.textContent = a.nombre;
    selectReceptor.appendChild(option);
});

const unidadesActuales = parseInt(document.querySelector(".div5-8").textContent);
const unidadesAEnviar = parseInt(document.querySelector(".div6-8").textContent);
const unidadesRestantes = unidadesActuales - unidadesAEnviar;
document.querySelector(".div8-8").textContent = unidadesRestantes;


const nombreProductoDiv = document.getElementById("nombreProducto");
const unidadesActualesDiv = document.getElementById("unidadesActuales");
const cantidadEnviarSelect = document.getElementById("cantidadEnviar");
const stockRestanteDiv = document.getElementById("stockRestante");

const productoEjemplo = {
    nombre: "Producto A",
    unidadesActuales: 8
};

nombreProductoDiv.textContent = productoEjemplo.nombre;
unidadesActualesDiv.textContent = productoEjemplo.unidadesActuales;
stockRestanteDiv.textContent = productoEjemplo.unidadesActuales;
stockRestanteDiv.style.color = "white";

for (let i = 1; i <= productoEjemplo.unidadesActuales; i++) {
    const option = document.createElement("option");
    option.value = i;
    option.textContent = i;
    cantidadEnviarSelect.appendChild(option);
}

cantidadEnviarSelect.addEventListener("change", () => {
    const cantidad = parseInt(cantidadEnviarSelect.value);
    const stockRestante = productoEjemplo.unidadesActuales - cantidad;
    stockRestanteDiv.textContent = stockRestante;
    stockRestanteDiv.style.color = stockRestante < 3 ? "red" : "white";
});

const btnEnviar = document.getElementById("env");
function mostrarNotificacion(mensaje, tipo = "info") {
    const modal = document.createElement("div");
    modal.style.position = "fixed";
    modal.style.top = "0";
    modal.style.left = "0";
    modal.style.width = "100%";
    modal.style.height = "100%";
    modal.style.backgroundColor = "rgba(0,0,0,0.4)";
    modal.style.display = "flex";
    modal.style.justifyContent = "center";
    modal.style.alignItems = "center";
    modal.style.zIndex = "1000";

    const contenido = document.createElement("div");
    contenido.style.backgroundColor = tipo === "error" ? "#d35e5e" : "#179158";
    contenido.style.color = "white";
    contenido.style.padding = "20px 30px";
    contenido.style.borderRadius = "10px";
    contenido.style.fontSize = "18px";
    contenido.textContent = mensaje;

    modal.appendChild(contenido);
    document.body.appendChild(modal);

    setTimeout(() => {
        document.body.removeChild(modal);
    }, 2500);
}

btnEnviar.addEventListener("click", () => {
    if (!document.getElementById("sucursalSelect").value ||
        !document.getElementById("receptorSelect").value ||
        !cantidadEnviarSelect.value) {
        mostrarNotificacion("Por favor completa todos los campos", "error");
        return;
    }
    mostrarNotificacion("¡Enviado con éxito!", "success");
});
