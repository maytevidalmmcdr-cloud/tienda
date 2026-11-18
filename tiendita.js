
var btnSave = document.getElementById("btnSave");
var btnEdit = document.getElementById("btnEdit");
var productos = [];



btnSave.onclick = () => {

    let txtNombre = document.getElementById("nombre");
    let txtPrecio = document.getElementById("precio");
    let txtCantidad = document.getElementById("cantidad");
    if(txtNombre.value == "" || txtPrecio.value == "" || txtCantidad.value == ""){
        alert("ERROR: CAMPOS VACIOS");
        return;
    }

    const producto = {
        nombre: txtNombre.value,
        precio: txtPrecio.value,
        cantidad: txtCantidad.value
    };

    productos.push(producto);
    localStorage.setItem("productos", JSON.stringify(productos));
    document.getElementById("addProductos").close();
    txtNombre.value = "";
    txtPrecio.value = "";
    txtCantidad.value = "";

    cargarProductos();

};




btnEdit.onclick = () => {

    let txtNombre = document.getElementById("nombree");
    let txtPrecio = document.getElementById("precioe");
    let posicion = document.getElementById("posicion");
    let txtCantidad = document.getElementById("cantidade");

    if(txtNombre.value == "" || txtPrecio.value == "" || txtCantidad.value == ""){
        alert("ERROR: CAMPOS VACIOS");
        return;
    }

    productos[posicion.value].nombre = txtNombre.value;
    productos[posicion.value].precio = txtPrecio.value;
    productos[posicion.value].cantidad = txtCantidad.value;

    localStorage.setItem("productos", JSON.stringify(productos));
    document.getElementById("editProducto").close();

    txtNombre.value = "";
    txtPrecio.value = "";
    txtCantidad.value = "";

    cargarProductos();

};




const cargarProductos = () => {
    let posicion = 0;
    productos = JSON.parse(localStorage.getItem("productos")) || [];
    let tabla = document.getElementById("productos");
    let contenido = "";
    productos.map((producto) => {
        contenido += `<tr>

            <td class="text-center">
                ${producto.nombre.toUpperCase()}
            </td>

            <td class="text-center">
                $${parseFloat(producto.precio).toFixed(2)}
            </td>

            <td class="text-center">
                ${producto.cantidad}
            </td>

            <td class="text-center">
                <button class="btn btn-danger"
                    onclick="eliminarProducto(${posicion})">
                    <i class="bi bi-trash"></i>
                </button>

                <button class="btn btn-warning"
                    onclick="editarProducto(${posicion})">

                    <i class="bi bi-pencil"></i>
                </button>

            </td>

        </tr>`;
        posicion++;

    });

    tabla.innerHTML = contenido;

};



cargarProductos();




const editarProducto = (posicion) => {

    const producto = productos[posicion];

    document.getElementById("nombree").value = producto.nombre;
    document.getElementById("precioe").value = producto.precio;
    document.getElementById("cantidade").value = producto.cantidad;
    document.getElementById("posicion").value = posicion;
    document.getElementById("editProducto").showModal();

};




const swalWithBootstrapButtons = Swal.mixin({

    customClass: {
        confirmButton: "btn btn-success me-2",
        cancelButton: "btn btn-danger"
    },

    buttonsStyling: false

});

const negro = Swal.mixin({

    customClass: {
        confirmButton: "btn btn-secondary"
    },

    buttonsStyling: false

});


const eliminarProducto = (posicion) => {

    swalWithBootstrapButtons.fire({

        title: "ELIMINAR REGISTRO",
        text: "¿Estás seguro de eliminar este registro?",
        icon: "error",
        showCancelButton: true,
        confirmButtonText: "SI",
        cancelButtonText: "NO",
        reverseButtons: true

    }).then((result) => {

        if(result.isConfirmed){
            productos.splice(posicion, 1);
            localStorage.setItem("productos", JSON.stringify(productos));
            cargarProductos();

            negro.fire({

                title: "EXITO!",
                text: "Se eliminó correctamente",
                icon: "success"

            });

        }

    });

};

window.editarProducto = editarProducto;
window.eliminarProducto = eliminarProducto;
