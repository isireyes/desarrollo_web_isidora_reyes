document.addEventListener("DOMContentLoaded", function () {
    const filas = document.querySelectorAll(".fila-actividad");
    filas.forEach(fila => {
        fila.addEventListener("click", function () {
            const id = this.dataset.id;
            if (id) {
                window.location.href = `/actividad/${id}`;
            }
        });
    });
    const btnPortada = document.getElementById("btn-portada");
    if (btnPortada) {
        btnPortada.addEventListener("click", function () {
            window.location.href = "/";
        });
    }
});

/* let btnportada = document.getElementById("btn-portada")
btnportada.addEventListener("click", function(){
    window.location.href = "/";
  }); */