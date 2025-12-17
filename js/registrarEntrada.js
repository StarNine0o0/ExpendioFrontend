const API_URL = "http://localhost:8000/api";



// elementos del dom
const formulario = document.getElementById("formularioEntrada");

// Inputs
const lotes = document.getElementById("lotes");
const cantidadPorLote = document.getElementById("cantidadPorLote");
const cantidad = document.getElementById("cantidad");
const precioUnitario = document.getElementById("precioUnitario");
const costoTotal = document.getElementById("costoTotal");

// Modal guardar
const modalGuardar = document.getElementById("modalGuardar");

// Botones modal
const confirmarGuardar = document.getElementById("confirmarGuardar");
const editarGuardar = document.getElementById("editarGuardar");
const cancelarGuardar = document.getElementById("cancelarGuardar");

// Botón cancelar del formulario
const btnCancelar = document.getElementById("btnCancelar");

let compraActualId = null;

// ----- CARGAR PROVEEDORES -----
async function cargarProveedores() {
  try {
    const r = await fetch(`${API_URL}/proveedores`);
    if (!r.ok) throw new Error("Error en proveedores");

    const data = await r.json();
    const select = document.getElementById("proveedor");

    select.innerHTML = `<option value="">Seleccione un proveedor</option>`;

    data.forEach((p) => {
      const op = document.createElement("option");
      op.value = p.id_proveedores;
      op.textContent = p.nombre;
      select.appendChild(op);
    });
  } catch (e) {
    alert("No se pudieron cargar los proveedores");
  }
}

// ----- CARGAR PRODUCTOS -----
async function cargarProductos() {
  try {
    const r = await fetch(`${API_URL}/productos-activos`);
    if (!r.ok) throw new Error("Error en productos");

    const data = await r.json();
    const select = document.getElementById("producto");

    select.innerHTML = `<option value="">Seleccione un producto</option>`;

    data.forEach((p) => {
      const op = document.createElement("option");
      op.value = p.id_producto;
      op.textContent = p.nombre;
      select.appendChild(op);
    });
  } catch {
    alert("No se pudieron cargar los productos");
  }
}

// ----- CALCULOS -----
function calcularCantidadTotal() {
  const l = parseInt(lotes.value) || 0;
  const c = parseInt(cantidadPorLote.value) || 0;
  cantidad.value = l * c;
  calcularTotal();
}

function calcularTotal() {
  const cant = parseFloat(cantidad.value) || 0;
  const precio = parseFloat(precioUnitario.value) || 0;
  costoTotal.value = (cant * precio).toFixed(2);
}

lotes.addEventListener("input", calcularCantidadTotal);
cantidadPorLote.addEventListener("input", calcularCantidadTotal);
precioUnitario.addEventListener("input", calcularTotal);

// ----- GUARDAR ENTRADA -----
async function guardarEntrada(datos) {
  const r = await fetch(`${API_URL}/compras`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(datos),
  });

  const res = await r.json();
  if (!r.ok) throw new Error(res.message || "Error al guardar");
  return res;
}

// ----- MODALES -----
function abrirModal(m) {
  m.classList.add("activo");
}
function cerrarModal(m) {
  m.classList.remove("activo");
}

function limpiarFormulario() {
  formulario.reset();
  cantidad.value = 0;
  costoTotal.value = "0.00";
  compraActualId = null;
}

// ----- CARGA INICIAL -----
document.addEventListener("DOMContentLoaded", () => {
  cargarProveedores();
  cargarProductos();
});

// ----- PREVIEW EN MODAL -----
formulario.addEventListener("submit", (e) => {
  e.preventDefault();

  const proveedor = document.getElementById("proveedor");
  const producto = document.getElementById("producto");

  if (!proveedor.value) return alert("Seleccione un proveedor");
  if (!producto.value) return alert("Seleccione un producto");

  // Llenamos modal
  document.getElementById("modalProveedor").textContent =
    proveedor.options[proveedor.selectedIndex].text;

  document.getElementById("modalLotes").textContent = lotes.value;
  document.getElementById("modalCantidadPorLote").textContent =
    cantidadPorLote.value;
  document.getElementById("modalCantidad").textContent = cantidad.value;
  document.getElementById("modalPrecio").textContent = precioUnitario.value;
  document.getElementById("modalFecha").textContent =
    document.getElementById("fecha").value;
  document.getElementById("modalHora").textContent =
    document.getElementById("hora").value;
  document.getElementById("modalTotal").textContent = costoTotal.value;

  abrirModal(modalGuardar);
});

// ----- CONFIRMAR GUARDAR -----
confirmarGuardar.addEventListener("click", async () => {
  try {
    const datos = {
      id_proveedor: parseInt(document.getElementById("proveedor").value),
      fecha_compra: document.getElementById("fecha").value,
      numero_compra_factura: "FACT-" + Date.now(),
      total_compra: parseFloat(costoTotal.value),

      detalles: [
        {
          id_producto: parseInt(document.getElementById("producto").value),
          cantidad: parseInt(cantidad.value),
          subtotal: parseFloat(costoTotal.value),
          precio_unitario: parseFloat(precioUnitario.value),
        },
      ],
    };

    const res = await guardarEntrada(datos);
    compraActualId = res.data.id_compras;

    alert("Entrada registrada correctamente");
    cerrarModal(modalGuardar);
    limpiarFormulario();
  } catch (e) {
    alert("Error al guardar: " + e.message);
  }
});

// ----- EDITAR -----
editarGuardar.addEventListener("click", () => {
  cerrarModal(modalGuardar);
});

// ----- CANCELAR -----
cancelarGuardar.addEventListener("click", () => {
  cerrarModal(modalGuardar);
});

// ----- CERRAR AL DAR CLICK FUERA -----
window.addEventListener("click", (e) => {
  if (e.target === modalGuardar) cerrarModal(modalGuardar);
});

// ----- BOTÓN CANCELAR -----
btnCancelar.addEventListener("click", () => {
  limpiarFormulario();
});
