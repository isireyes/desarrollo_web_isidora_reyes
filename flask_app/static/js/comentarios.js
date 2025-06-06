function cargarComentarios() {
  const actividadId = document.getElementById("comentarios-lista").dataset.actividadId;

  fetch(`/comentarios/${actividadId}`)
    .then(response => {
      if (!response.ok) {
        throw new Error("No se pudo obtener los comentarios");
      }
      return response.json();  // 
    })
    .then(data => {
      const comentariosDiv = document.getElementById("comentarios-lista");
      comentariosDiv.innerHTML = ""; 

      if (data.length === 0) {
        comentariosDiv.innerHTML = "<p>No hay comentarios aún.</p>";
        return;
      }

      data.forEach(com => {
        const div = document.createElement("div");
        div.className = "comentario-item";
        div.innerHTML = `
            <strong>${com.nombre}</strong>
            <span class="fecha">${com.fecha}</span>
            <p>${com.texto}</p>
        `;
        comentariosDiv.appendChild(div);
    });
    })
    .catch(error => {
      console.error("Error al obtener comentarios:", error);
    });
};


document.addEventListener("DOMContentLoaded", () => {
  cargarComentarios();
  const actividadId = document.getElementById("comentarios-lista").dataset.actividadId;
  document.getElementById("comentario-form").addEventListener("submit", function(e) {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const texto = document.getElementById("texto").value.trim();
    const error = document.getElementById("comentario-error");
    if (nombre.length < 3 || nombre.length > 80) {
        error.textContent = "El nombre debe tener entre 3 y 80 caracteres.";
        return;
    }
    if (texto.length < 5) {
        error.textContent = "El comentario debe tener al menos 5 caracteres.";
        return;
    }


    fetch("/agregar-comentario", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ nombre, texto, actividad_id: actividadId })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            error.textContent = "";
            document.getElementById("comentario-form").reset();
            cargarComentarios();
        } else {
            error.textContent = data.error || "Error al agregar comentario.";
      }
    })
    .catch(err => {
      console.error("Error al enviar comentario:", err);
      error.textContent = "Error al conectar con el servidor.";
    });
  });
});

