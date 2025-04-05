// Función para abrir el modal y mostrar la imagen seleccionada
function openModal(imgElement) {
    var modal = document.getElementById("myModal");
    var modalImg = document.getElementById("img01");
    modal.style.display = "flex"; // Mostrar el modal
    modalImg.src = imgElement.src; // Obtener el src de la imagen clickeada y asignarlo al modal
  }
  
  // Función para cerrar el modal
  function closeModal() {
    var modal = document.getElementById("myModal");
    modal.style.display = "none"; // Ocultar el modal
  }

let btnlista = document.getElementById("btn-listado")
btnlista.addEventListener("click", function() {
    window.location.href = "../listado.html";
});