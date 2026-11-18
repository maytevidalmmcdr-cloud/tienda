let productos = JSON.parse(localStorage.getItem("productos")) || [];
let categorias = JSON.parse(localStorage.getItem("categorias")) || [];

function guardarProductos() {
    localStorage.setItem("productos", JSON.stringify(productos));
}

// Convertir imagen a Base64
function convertirImagen(archivo) {

    return new Promise((resolve, reject) => {

        const lector = new FileReader();

        lector.onload = () => resolve(lector.result);

        lector.onerror = () => reject("Error al leer la imagen");

        lector.readAsDataURL(archivo);

    });

}

// Escapar texto para mostrarlo de forma segura
function escaparHTML(texto) {
    return String(texto).replace(/[&<>"']/g, caracter => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[caracter]);
}

// Cargar categorías en los SELECT
function cargarCategorias() {

    categorias = JSON.parse(localStorage.getItem("categorias")) || [];

    const select = document.getElementById("categoria");
    const selectEditar = document.getElementById("categoriae");

    select.innerHTML = '<option value="">Seleccionar categoría</option>';
    selectEditar.innerHTML = "";

    categorias.forEach(categoria => {

        const nombre = escaparHTML(categoria);

        select.innerHTML += `
            <option value="${nombre}">${nombre}</option>
        `;

        selectEditar.innerHTML += `
            <option value="${nombre}">${nombre}</option>
        `;

    });

}

// Mostrar productos en la tabla y calcular totales de forma sencilla
function mostrarProductos() {

    const tabla = document.getElementById("tablaProductos");
    const tfoot = document.getElementById("totalesProductos");

    tabla.innerHTML = "";

    let sumaPrecios = 0;
    let sumaCantidad = 0;
    let sumaTotalGeneral = 0;

    productos.forEach((producto, index) => {

        const precio = Number(producto.precio) || 0;
        const cantidad = Number(producto.cantidad) || 0;

        sumaPrecios += precio;
        sumaCantidad += cantidad;
        sumaTotalGeneral += (precio * cantidad);

        tabla.innerHTML += `
            <tr class="text-center align-middle">

                <td>
                    ${
                        producto.imagen
                        ? `<img src="${producto.imagen}"
                            width="50" height="50"
                            style="object-fit:cover; border-radius:5px;"
                            alt="Producto">`
                        : "Sin imagen"
                    }
                </td>

                <td>${escaparHTML(producto.nombre)}</td>

                <td>$${precio.toFixed(2)}</td>

                <td>${cantidad}</td>

                <td>${escaparHTML(producto.categoria)}</td>

                <td>
                    <button class="btn btn-danger"
                        onclick="eliminarProducto(${index})">
                        <i class="bi bi-trash"></i>
                    </button>

                    <button class="btn btn-warning"
                        onclick="editarProducto(${index})">
                        <i class="bi bi-pencil"></i>
                    </button>
                </td>

            </tr>
        `;

    });

    // Totales sencillos alineados a cada columna respectiva
    tfoot.innerHTML = `
        <tr>
            <td></td>
            <td class="text-end">Suma:</td>
            <td>$${sumaPrecios.toFixed(2)}</td>
            <td>${sumaCantidad}</td>
            <td class="text-end">Total General:</td>
            <td>$${sumaTotalGeneral.toFixed(2)}</td>
        </tr>
    `;

}

// Abrir ventana para agregar
function abrirAgregarProducto() {

    document.getElementById("formAgregar").reset();

    document.getElementById("vistaPrevia").style.display = "none";

    cargarCategorias();

    if (categorias.length === 0) {

        Swal.fire({
            title: "No hay categorías",
            text: "Primero debes registrar una categoría.",
            icon: "warning",
            confirmButtonText: "Ir a categorías"
        }).then(resultado => {

            if (resultado.isConfirmed) {
                window.location.href = "categoria.html";
            }

        });

        return;
    }

    bootstrap.Modal.getOrCreateInstance(
        document.getElementById("modalAgregarProducto")
    ).show();

}

// Vista previa de imagen al agregar
document.getElementById("imagen").addEventListener("change", async function() {

    const archivo = this.files[0];

    if (!archivo) return;

    if (!archivo.type.startsWith("image/")) {
        Swal.fire("Error", "Selecciona un archivo de imagen válido", "error");
        this.value = "";
        return;
    }

    if (archivo.size > 2 * 1024 * 1024) {
        Swal.fire("Imagen demasiado grande", "Selecciona una imagen de máximo 2 MB", "warning");
        this.value = "";
        return;
    }

    try {
        const imagen = await convertirImagen(archivo);

        const vista = document.getElementById("vistaPrevia");

        vista.src = imagen;
        vista.style.display = "inline-block";

    } catch (error) {
        Swal.fire("Error", "No se pudo cargar la imagen", "error");
    }

});

// Guardar producto
document.getElementById("formAgregar").addEventListener("submit", async function(e) {

    e.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const precio = Number(document.getElementById("precio").value);
    const cantidad = Number(document.getElementById("cantidad").value);
    const categoria = document.getElementById("categoria").value;
    const archivo = document.getElementById("imagen").files[0];

    if (!nombre || !categoria || !Number.isFinite(precio) ||
        precio < 0 || !Number.isInteger(cantidad) || cantidad < 0) {

        Swal.fire("Atención", "Revisa los datos del producto", "warning");
        return;
    }

    if (archivo && (!archivo.type.startsWith("image/") ||
        archivo.size > 2 * 1024 * 1024)) {

        Swal.fire("Atención", "Selecciona una imagen válida de máximo 2 MB", "warning");
        return;
    }

    try {

        let imagen = "";

        if (archivo) {
            imagen = await convertirImagen(archivo);
        }

        productos.push({
            nombre: nombre,
            precio: precio,
            cantidad: cantidad,
            categoria: categoria,
            imagen: imagen
        });

        guardarProductos();
        mostrarProductos();

        bootstrap.Modal.getInstance(
            document.getElementById("modalAgregarProducto")
        ).hide();

        Swal.fire("Correcto", "Producto agregado", "success");

    } catch (error) {

        Swal.fire("Error", "No se pudo guardar el producto", "error");

    }

});

// Abrir ventana para editar
function editarProducto(index) {

    cargarCategorias();

    if (categorias.length === 0) {
        Swal.fire("Atención", "Primero registra una categoría", "warning");
        return;
    }

    const producto = productos[index];

    document.getElementById("posicion").value = index;
    document.getElementById("nombree").value = producto.nombre;
    document.getElementById("precioe").value = producto.precio;
    document.getElementById("cantidade").value = producto.cantidad;

    const select = document.getElementById("categoriae");

    select.value = producto.categoria;

    document.getElementById("imagene").value = "";

    const vista = document.getElementById("vistaPreviaEditar");

    vista.src = producto.imagen || "";
    vista.style.display = producto.imagen ? "inline-block" : "none";

    bootstrap.Modal.getOrCreateInstance(
        document.getElementById("modalEditarProducto")
    ).show();

}

// Vista previa al editar
document.getElementById("imagene").addEventListener("change", async function() {

    const archivo = this.files[0];

    if (!archivo) return;

    if (!archivo.type.startsWith("image/") ||
        archivo.size > 2 * 1024 * 1024) {

        Swal.fire("Atención", "Selecciona una imagen válida de máximo 2 MB", "warning");
        this.value = "";
        return;
    }

    try {

        const imagen = await convertirImagen(archivo);

        document.getElementById("vistaPreviaEditar").src = imagen;
        document.getElementById("vistaPreviaEditar").style.display = "inline-block";

    } catch (error) {

        Swal.fire("Error", "No se pudo cargar la imagen", "error");

    }

});

// Actualizar producto
document.getElementById("formEditar").addEventListener("submit", async function(e) {

    e.preventDefault();

    const index = Number(document.getElementById("posicion").value);

    const nombre = document.getElementById("nombree").value.trim();
    const precio = Number(document.getElementById("precioe").value);
    const cantidad = Number(document.getElementById("cantidade").value);
    const categoria = document.getElementById("categoriae").value;
    const archivo = document.getElementById("imagene").files[0];

    if (!nombre || !categoria || !Number.isFinite(precio) ||
        precio < 0 || !Number.isInteger(cantidad) || cantidad < 0) {

        Swal.fire("Atención", "Revisa los datos del producto", "warning");
        return;
    }

    if (archivo && (!archivo.type.startsWith("image/") ||
        archivo.size > 2 * 1024 * 1024)) {

        Swal.fire("Atención", "Selecciona una imagen válida de máximo 2 MB", "warning");
        return;
    }

    try {

        let imagen = productos[index].imagen || "";

        if (archivo) {
            imagen = await convertirImagen(archivo);
        }

        productos[index] = {
            nombre: nombre,
            precio: precio,
            cantidad: cantidad,
            categoria: categoria,
            imagen: imagen
        };

        guardarProductos();
        mostrarProductos();

        bootstrap.Modal.getInstance(
            document.getElementById("modalEditarProducto")
        ).hide();

        Swal.fire("Correcto", "Producto actualizado", "success");

    } catch (error) {

        Swal.fire("Error", "No se pudo actualizar el producto", "error");

    }

});

// Eliminar producto
function eliminarProducto(index) {

    Swal.fire({
        title: "¿Eliminar producto?",
        text: "Esta acción no se puede deshacer.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar"
    }).then(resultado => {

        if (resultado.isConfirmed) {

            productos.splice(index, 1);

            guardarProductos();
            mostrarProductos();

            Swal.fire("Eliminado", "Producto eliminado", "success");

        }

    });

}

// Cargar datos al iniciar
mostrarProductos();
cargarCategorias();