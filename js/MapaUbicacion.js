
const locales = {
    local1: {
        nombre: "Sucursal Centro",
        direccion: "Av. Juárez 123, Torreón",
        telefono: "871 123 4567",
        coordenadas: "25.65797° N, -103.3405° O",
       mapaEmbed: "https://www.google.com/maps/embed?pb=!4v1766522126584!6m8!1m7!1sxVQ1oOAn6HW3AR4ULhfPhQ!2m2!1d25.53450845703981!2d-103.2209098489051!3f339.39268884733923!4f-3.0695354395474936!5f0.7820865974627469",
        googleMaps: "https://maps.app.goo.gl/7npTYk42vJdSxRcx9"
    },
    local2: {
        nombre: "Sucursal Norte",
        direccion: "Blvd. Independencia 456, Torreón",
        telefono: "871 987 6543",
        coordenadas: "25.58012° N, -103.41022° O",
        mapaEmbed: "https://www.google.com/maps/embed?pb=LOCAL2",
        googleMaps: "https://maps.app.goo.gl/LOCAL2"
    }
};

// Estado actual
let localActual = "local1";

// Cambia TODA la información
function cambiarLocal(local) {
    localActual = local;

    // Mapa
    document.querySelector(".map-image").src = locales[local].mapaEmbed;

    // Información
    document.getElementById("direccion").innerHTML =
        `<strong>Dirección:</strong><br>${locales[local].direccion}`;
    document.getElementById("telefono").innerHTML =
        `<strong>Teléfono:</strong><br>${locales[local].telefono}`;
    document.getElementById("coordenadas").innerHTML =
        `<strong>Coordenadas:</strong><br>${locales[local].coordenadas}`;

    // Texto del botón
    const btnTexto = document.getElementById("btnCambiarLocal");
    btn.innerHTML = `
    <i class="fa-solid fa-store"></i>
    <span>${local === "local1" ? "Ir a Local 2" : "Ir a Local 1"}</span>
`;
}

// Alternar entre locales
function toggleLocal() {
    cambiarLocal(localActual === "local1" ? "local2" : "local1");9
}

// Copiar dirección
function copyAddress() {
    navigator.clipboard.writeText(locales[localActual].direccion)
        .then(() => alert("¡Dirección copiada!"));
}

// Abrir Google Maps
function abrirGoogleMaps() {
    window.open(locales[localActual].googleMaps, "_blank");
}

// Inicializar al cargar
document.addEventListener("DOMContentLoaded", () => {
    cambiarLocal("local1");
});

