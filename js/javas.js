
    // Fecha actual
    const fecha = new Date();
    const dia = String(fecha.getDate()).padStart(2, '0');
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const año = fecha.getFullYear();
    const fechaFormateada = `${dia}/${mes}/${año}`;
    document.getElementById("fechaActual").value = fechaFormateada;

    // Hora actual
    function obtenerHora() {
        const fecha = new Date();
        let horas = fecha.getHours();
        let minutos = fecha.getMinutes();
        const ampm = horas >= 12 ? "p.m." : "a.m.";
        horas = horas % 12;
        horas = horas ? horas : 12;
        minutos = String(minutos).padStart(2, '0');
        const horaFormateada = `${horas}:${minutos} ${ampm}`;
        document.getElementById("horaActual").value = horaFormateada;
    }

    obtenerHora();
    setInterval(obtenerHora, 60000);

    // Sucursales
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

    // Receptores
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

    // Producto ejemplo
    const nombreProductoDiv = document.getElementById("nombreProducto");
    const unidadesActualesDiv = document.getElementById("unidadesActuales");
    const cantidadEnviarSelect = document.getElementById("cantidadEnviar");
    const stockRestanteDiv = document.getElementById("stockRestante");
    const totalRestanteDiv = document.getElementById("totalRestante");

    const productoEjemplo = {
        nombre: "Producto A",
        unidadesActuales: 8
    };

    nombreProductoDiv.textContent = productoEjemplo.nombre;
    unidadesActualesDiv.textContent = productoEjemplo.unidadesActuales;
    stockRestanteDiv.textContent = productoEjemplo.unidadesActuales;
    totalRestanteDiv.textContent = productoEjemplo.unidadesActuales;

    for (let i = 1; i <= productoEjemplo.unidadesActuales; i++) {
        const option = document.createElement("option");
        option.value = i;
        option.textContent = i;
        cantidadEnviarSelect.appendChild(option);
    }

    cantidadEnviarSelect.addEventListener("change", () => {
        const cantidad = parseInt(cantidadEnviarSelect.value) || 0;
        const stockRestante = productoEjemplo.unidadesActuales - cantidad;
        stockRestanteDiv.textContent = stockRestante;
        totalRestanteDiv.textContent = stockRestante;
    });

    // Notificaciones
    function mostrarNotificacion(mensaje, tipo = "info") {
        const modal = document.createElement("div");
        modal.className = "notification-modal";

        const contenido = document.createElement("div");
        contenido.className = `notification-content ${tipo === "error" ? "error" : "success"}`;
        contenido.textContent = mensaje;

        modal.appendChild(contenido);
        document.body.appendChild(modal);

        setTimeout(() => {
            modal.remove();
        }, 2500);
    }

    const btnEnviar = document.getElementById("env");
    btnEnviar.addEventListener("click", () => {
        if (!document.getElementById("sucursalSelect").value ||
            !document.getElementById("receptorSelect").value ||
            !cantidadEnviarSelect.value) {
            mostrarNotificacion("Por favor completa todos los campos", "error");
            return;
        }
        mostrarNotificacion("¡Enviado con éxito!", "success");
    });

    const btnCancelar = document.getElementById("can");
    btnCancelar.addEventListener("click", () => {
        mostrarNotificacion("Operación cancelada", "error");
    });
