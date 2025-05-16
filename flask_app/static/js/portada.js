let btngrega = document.getElementById("btn-agrega-act")
let btnlista = document.getElementById("btn-listado")
let btnesta = document.getElementById("btn-estadistica")

btngrega.addEventListener("click", function() {
    window.location.href = "/informa-act/";
});
btnlista.addEventListener("click", function() {
    window.location.href = "/listado/";
});
btnesta.addEventListener("click", function() {
    window.location.href = "estadistica.html";
});

