
let categorias = JSON.parse(localStorage.getItem("categorias")) || [];

function guardarEnLocalStorage() {
    localStorage.setItem("categorias", JSON.stringify(categorias));
}

function mostrarCategorias() {

    const tabla = document.getElementById("tablaCategorias");

    tabla.innerHTML = "";

    categorias.forEach((categoria, index) => {

        tabla.innerHTML += `
            <tr class="text-center">
                <td>${escaparHTML(categoria)}</td>

                <td>
                    <button class="btn btn-danger"
                        onclick="eliminarCategoria(${index})">
                        <i class="bi bi-trash"></i>
                    </button>

                    <button class="btn btn-warning"
                        onclick="editarCategoria(${index})">
                        <i class="bi bi-pencil"></i>
                    </button>
                </td>
            </tr>
        `;

    });

}

function escaparHTML(texto) {
    return String(texto).replace(/[&<>"']/g, caracter => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[caracter]);
}

function abrirAgregar() {

    document.getElementById("nombreCategoria").value = "";

    bootstrap.Modal.getOrCreateInstance(
        document.getElementById("modalAgregar")
    ).show();

}

function guardarCategoria() {

    const nombre = document.getElementById("nombreCategoria").value.trim();

    if (nombre === "") {
        Swal.fire("Atención", "Escribe el nombre de la categoría", "warning");
        return;
    }

    const existe = categorias.some(
        categoria => categoria.toLowerCase() === nombre.toLowerCase()
    );

    if (existe) {
        Swal.fire("Atención", "Esta categoría ya existe", "warning");
        return;
    }

    categorias.push(nombre);

    guardarEnLocalStorage();
    mostrarCategorias();

    bootstrap.Modal.getInstance(
        document.getElementById("modalAgregar")
    ).hide();

    Swal.fire("Correcto", "Categoría agregada", "success");

}

function editarCategoria(index) {

    document.getElementById("posicionCategoria").value = index;

    document.getElementById("nombreCategoriaEditar").value =
        categorias[index];

    bootstrap.Modal.getOrCreateInstance(
        document.getElementById("modalEditar")
    ).show();

}

function actualizarCategoria() {

    const index = Number(document.getElementById("posicionCategoria").value);

    const nuevoNombre = document.getElementById("nombreCategoriaEditar").value.trim();

    if (nuevoNombre === "") {
        Swal.fire("Atención", "Escribe el nombre de la categoría", "warning");
        return;
    }

    const existe = categorias.some((categoria, i) =>
        i !== index && categoria.toLowerCase() === nuevoNombre.toLowerCase()
    );

    if (existe) {
        Swal.fire("Atención", "Esa categoría ya existe", "warning");
        return;
    }

    const nombreAnterior = categorias[index];

    // Actualizar también los productos que usan esta categoría.
    let productos = JSON.parse(localStorage.getItem("productos")) || [];

    productos.forEach(producto => {
        if (producto.categoria === nombreAnterior) {
            producto.categoria = nuevoNombre;
        }
    });

    localStorage.setItem("productos", JSON.stringify(productos));

    categorias[index] = nuevoNombre;

    guardarEnLocalStorage();
    mostrarCategorias();

    bootstrap.Modal.getInstance(
        document.getElementById("modalEditar")
    ).hide();

    Swal.fire("Correcto", "Categoría actualizada", "success");

}

function eliminarCategoria(index) {

    const nombre = categorias[index];

    let productos = JSON.parse(localStorage.getItem("productos")) || [];

    const estaEnUso = productos.some(
        producto => producto.categoria === nombre
    );

    if (estaEnUso) {
        Swal.fire(
            "No se puede eliminar",
            "Esta categoría está asignada a uno o más productos.",
            "warning"
        );
        return;
    }

    Swal.fire({
        title: "¿Eliminar categoría?",
        text: "Esta acción no se puede deshacer.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar"
    }).then(resultado => {

        if (resultado.isConfirmed) {

            categorias.splice(index, 1);

            guardarEnLocalStorage();
            mostrarCategorias();

            Swal.fire("Eliminada", "Categoría eliminada", "success");

        }

    });

}

mostrarCategorias();
