function calcular() {

    let peso = parseFloat(document.getElementById("peso").value);
    let estatura = parseFloat(document.getElementById("estatura").value);

    document.getElementById("vp").innerHTML = peso;
    document.getElementById("ve").innerHTML = estatura.toFixed(2);

    let imc = peso / (estatura * estatura);

    document.getElementById("resultado").innerHTML = imc.toFixed(2);

    
    for(let i=1; i<=6; i++){
        document.getElementById("imc"+i).style.transform = "scale(1)";
        document.getElementById("imc"+i).style.transition = "0.5s";
    }

    let tipo = 0;

    if (imc < 18.5) {
        document.getElementById("clasificacion").innerHTML = "BAJO PESO";
        tipo = 1;
    }
    else if (imc < 25) {
        document.getElementById("clasificacion").innerHTML = "NORMAL";
        tipo = 2;
    }
    else if (imc < 30) {
        document.getElementById("clasificacion").innerHTML = "SOBREPESO";
        tipo = 3;
    }
    else if (imc < 35) {
        document.getElementById("clasificacion").innerHTML = "OBESIDAD I";
        tipo = 4;
    }
    else if (imc < 40) {
        document.getElementById("clasificacion").innerHTML = "OBESIDAD II";
        tipo = 5;
    }
    else {
        document.getElementById("clasificacion").innerHTML = "OBESIDAD III";
        tipo = 6;
    }

  
    document.getElementById("imc"+tipo).style.transform = "scale(1.2)";
}

function reset() {

    document.getElementById("peso").value = 50;
    document.getElementById("estatura").value = 1.50;

    calcular();

}
