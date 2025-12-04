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
