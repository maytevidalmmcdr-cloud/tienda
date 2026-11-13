let temporizador;

const multiplicar = () => {

    let num1 = parseInt(document.querySelector("#n1").value);

    document.querySelector("#vn1").innerHTML =
    `<b style="color:red">${num1}</b>`;

    clearTimeout(temporizador);

    document.querySelector("#cargando").style.display = "block";

    document.querySelector("#resultado").innerHTML = "";

    temporizador = setTimeout(() => {

        document.querySelector("#cargando").style.display = "none";

        let tabla = "";

        for(let i = 1; i <= 10; i++) {

            tabla += `
                <h4 class="text-primary">
                    ${num1} x ${i} = ${num1 * i}
                </h4>
            `;

        }

        document.querySelector("#resultado").innerHTML = tabla;

    }, 1000);

}

const reset = () => {

    document.querySelector("#n1").value = 1;

    multiplicar();

}

multiplicar();