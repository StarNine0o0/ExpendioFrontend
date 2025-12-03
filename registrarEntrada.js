const API_URL = "http://localhost:8000/api";

// elementos del dom
const formulario = document.getElementById("formularioEntrada");

// Inputs
const lotes = document.getElementById("lotes");
const cantidadPorLote = document.getElementById("cantidadPorLote");
const cantidad = document.getElementById("cantidad");
const precioUnitario = document.getElementById("precioUnitario");
const costoTotal = document.getElementById("costoTotal");

// Modales
const modalGuardar = document.getElementById("modalGuardar");
const modalEliminar = document.getElementById("modalEliminar");
const modalCancelar = document.getElementById("modalCancelar");

// Botones
const btnEliminar = document.getElementById("btnEliminar");
const btnCancelar = document.getElementById("btnCancelar");

const confirmarGuardar = document.getElementById("confirmarGuardar");
const editarGuardar = document.getElementById("editarGuardar");
const cancelarGuardar = document.getElementById("cancelarGuardar");

const confirmarEliminar = document.getElementById("confirmarEliminar");
const cancelarEliminar = document.getElementById("cancelarEliminar");

const confirmarCancelar = document.getElementById("confirmarCancelar");
const cancelarCancelar = document.getElementById("cancelarCancelar");

let compraActualId = null;
// cargar a nuestros proveedotes
async function cargarProveedores() {
  try {
    const r = await fetch(`${API_URL}/proveedores`);
    if (!r.ok) throw new Error("Error en proveedores");

    const data = await r.json();

    const input = document.getElementById("proveedor");
    const select = document.createElement("select");

    select.id = "proveedor";
    select.required = true;

    select.innerHTML = `<option value="">Seleccione un proveedor</option>`;

    data.forEach((p) => {
      const op = document.createElement("option");
      op.value = p.id_proveedores;
      op.textContent = p.nombre;
      select.appendChild(op);
    });

    input.parentNode.replaceChild(select, input);
  } catch (e) {
    alert("No se pudieron cargar los proveedores");
  }
}
// cargar productos
async function cargarProductos() {
  try {
    const r = await fetch(`${API_URL}/productos`);
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
// calcular la cantidad total
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
// guardar la entrada
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
// eliminar
async function eliminarEntrada(id) {
  const r = await fetch(`${API_URL}/compras/${id}`, {
    method: "DELETE",
    headers: { Accept: "application/json" },
  });

  if (!r.ok) throw new Error("Error al eliminar");
  return await r.json();
}
// funciones para los modales
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
// eventos
document.addEventListener("DOMContentLoaded", () => {
  cargarProveedores();
  cargarProductos();
});
// submit (PREVIEW EN MODAL)
formulario.addEventListener("submit", (e) => {
  e.preventDefault();

  const proveedor = document.getElementById("proveedor");
  const producto = document.getElementById("producto");

  if (!proveedor.value) return alert("Seleccione un proveedor");
  if (!producto.value) return alert("Seleccione un producto");

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
// confirmamos que queremos guardar
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
// confirmamos la eliminacion
btnEliminar.addEventListener("click", () => {
  if (!compraActualId) return alert("No hay entrada para eliminar");
  abrirModal(modalEliminar);
});
confirmarEliminar.addEventListener("click", async () => {
  try {
    await eliminarEntrada(compraActualId);
    alert("Entrada eliminada");
    cerrarModal(modalEliminar);
    limpiarFormulario();
  } catch (e) {
    alert("Error al eliminar: " + e.message);
  }
});
// metodo para cancelar
btnCancelar.addEventListener("click", () => abrirModal(modalCancelar));
confirmarCancelar.addEventListener("click", () => {
  cerrarModal(modalCancelar);
  limpiarFormulario();
});
// cerrar al tocar fuera del modal
window.addEventListener("click", (e) => {
  if (e.target === modalGuardar) cerrarModal(modalGuardar);
  if (e.target === modalEliminar) cerrarModal(modalEliminar);
  if (e.target === modalCancelar) cerrarModal(modalCancelar);
});
