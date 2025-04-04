const validateName = (name) => {
    if(!name) return false;
    let lengthValid = name.trim().length <= 200;
    
    return lengthValid;
  };

  const validateSector = (sector) => {
    if(!sector) return false;
    let lengthValid = sector.trim().length <=100;
    
    return lengthValid;
  };

const validateEmail = (email) => {
    if (!email) return false;
    let lengthValid = email.length <= 100;
    let re = /^[\w.]+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
    let formatValid = re.test(email);
    return lengthValid && formatValid;
  };

const validatePhoneNumber = (phoneNumber) => {
    if (!phoneNumber) return false;
    // validación de longitud
    let lengthValid = phoneNumber.length >= 8;
    let re = /^[0-9]+$/;
    let formatValid = re.test(phoneNumber);
    return lengthValid && formatValid;
  };

const validateDatetimef = (fechahorai, fechahoraf) => {
    if (fechahorai && fechahoraf) {
        const fechahoraInicio = new Date(fechahorai);
        const fechahoraFinal = new Date(fechahoraf);
        let fechahorafvalida = fechahoraInicio < fechahoraFinal
        return fechahorafvalida;
    };
};

const validateContacto = () => {
    const contactosMarcados = document.querySelectorAll('#contactos input[type="checkbox"]:checked');
    if (contactosMarcados.length === 0) return false;
    for (const checkbox of contactosMarcados) {
        const nombreInput = checkbox.name; 
        const inputTexto = document.getElementById(nombreInput);
        const valor = inputTexto.value.trim();
        if (inputTexto.style.display !== 'none' && (valor.length < 4 || valor.length > 50)) {
            return false;
        }
    }
    
    return true;
};


const validateFiles = (files) => {
    if (!files || files.length === 0) return false;
    const lengthValid = files.length >= 1 && files.length <= 5;
    const typeValid = Array.from(files).every(file => {
        return file.type.startsWith('image/');
    });
    return lengthValid && typeValid;
};

 const validateTheme = () => {
    const checkboxes = document.querySelectorAll("#tema input[type='checkbox']:checked");
    return checkboxes.length >= 1;
 }



/* No se valida datetime pq el formato no permite colocar un input incorrecto (ej un mes 15 o un día 54)*/
/* Codigo para que se ponga la fecha y hora automáticamente al abrir la página*/
function formatofechahora(date){
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return  `${year}-${month}-${day}T${hours}:${minutes}`;
}

function fechahorainicio() {
    const now =new Date();
    document.getElementById("fechayhorai").value = formatofechahora(now);
}

function fechahorafinal(){
    const inicioinput = document.getElementById("fechayhorai").value;
    if (inicioinput) {
        const inicio = new Date(inicioinput);
        const treshoras = new Date(inicio.getTime() + 3 * 60 * 60 * 1000);
        document.getElementById("fechayhoraf").value = formatofechahora(treshoras);
    }
}

window.onload = function() {
    fechahorainicio();
    fechahorafinal();
};

document.getElementById("fechayhorai").addEventListener("change", fechahorafinal);

/* funcion para que se pueda seleccionar máximo 5 contactos*/
function revisaCheck(element){
    if (element.checked) {
      document.getElementById(element.name).style.display = "inline-block";
    } else {
       document.getElementById(element.name).style.display = "none";
    }
    let checkboxes = document.querySelectorAll("#contactos input[type='checkbox']");
    let seleccionados = document.querySelectorAll("#contactos input[type='checkbox']:checked").length;
    checkboxes.forEach(cb => {
        if (seleccionados >= 5 && !cb.checked) {
            cb.disabled = true;
        } else {
            cb.disabled = false;
        }
    });
}

function mostrarInputOtro(checkbox) {
    const inputOtro = document.getElementById("otro-tema");
    
    if (checkbox.checked) {
      inputOtro.style.display = "inline-block"; 
    } else {
      inputOtro.style.display = "none"; 
    }
  }



let inputsOcultos = document.querySelectorAll('.foto-input[style="display:none;"]');
let indiceActual = 0;
function mostrarSiguienteInput() {
    if (indiceActual < inputsOcultos.length) {
      inputsOcultos[indiceActual].style.display = "block";
      indiceActual++;
      if (indiceActual === inputsOcultos.length) {
        document.getElementById("agregar-foto-btn").style.display = "none";
      }
    }
}

const validateForm = () => {
    let isValid = true;
    let invalidInputs = [];

    let formulario = document.getElementById("info-act-form")
    /* aqui deberia ir lo de region-comuna */
    let sector = document.getElementById("sector").value
    let nombre = document.getElementById("nombre").value
    let email = document.getElementById("email").value
    let numero = document.getElementById("numero").value
    let contacto = document.getElementById("contacto")
    let horayfechai = document.getElementById("fechayhorai")
    let horayfechaf = document.getElementById("fechayhoraf")
    let tema = document.getElementById("tema")
    let fotos = document.getElementById("fotos")
    

    if (!validateSector(sector)) {
        setInvalidInput.push("Sector");
        isValid = false;
    }
    if (!validateName(nombre)){
        setInvalidInput.push("Nombre");
        isValid = false;
    }
    if (!validateEmail(email)) {
        setInvalidInput.push("Email");
        isValid = false;
    }
    if (!validatePhoneNumber(numero)) {
        setInvalidInput.push("Número");
        isValid = false;
    }
    if (!validateContacto()) {
        invalidInputs.push("Contacto");
        isValid = false;
    }
    if (!validateDatetimef(horayfechai,horayfechaf)) {
        setInvalidInput.push("Fecha y Hora");
        isValid = false;
    }
    if (!validateTheme(tema)) {
        setInvalidInput.push("Tema");
        isValid = false;
    }
    if (!validateFiles(fotos)) {
        setInvalidInput.push("Fotos");
        isValid = false;
    }
    let validationBox = document.getElementById("val-box");
    let validationMessageElem = document.getElementById("val-msg");
    let validationListElem = document.getElementById("val-list");
    let formContainer = document.querySelector(".main-container");

    if (!isValid) {
        validationListElem.innerHTML = "";
          invalidInputs.forEach(input => {
          let listElement = document.createElement("li");
          listElement.innerText = input;
          validationListElem.append(listElement);
        })
        // establecer val-msg
        validationMessageElem.innerText = "Los siguientes campos son inválidos:";
        validationBox.style.backgroundColor = "#ffdddd";
        validationBox.style.borderLeftColor = "#f44336";
        validationBox.hidden = false;
    }   else {
        // Ocultar el formulario
        document.getElementById("info-act-form").style.display = "none";
    
        // establecer mensaje de éxito
        validationMessageElem.innerText = "¿Está seguro que desea agregar esta actividad?";
        validationListElem.textContent = "";
        validationBox.style.backgroundColor = "#ddffdd";
        validationBox.style.borderLeftColor = "#4CAF50";

    // Agregar botones para enviar el formulario o volver
        let submitButton = document.createElement("button");
        submitButton.innerText = "Sí, estoy seguro";
        submitButton.style.marginRight = "10px";
        submitButton.addEventListener("click", () => {
        validationMessageElem.innerText = "Hemos recibido su información.¡Muchas gracias y suerte con su actividad!"

      // myForm.submit();
      // no tenemos un backend al cual enviarle los datos
        });

        let backButton = document.createElement("button");
        backButton.innerText = "No, quiero volver al formulario";
        backButton.addEventListener("click", () => {
            document.getElementById("info-act-form").style.display = "block";
            validationBox.hidden = true;
        });

        validationListElem.appendChild(submitButton);
        validationListElem.appendChild(backButton);
        validationBox.hidden = false;
        }
    
}

document.getElementById("submit-btn").addEventListener("click", validateForm);









