//Validaciones:
const validateName = (name) => {
    if(!name) return false;
    let lengthValid = name.trim().length < 200;
    
    return lengthValid;
  };

  const validateSector = (sector) => {
    if(!sector) return true;
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
    if (!phoneNumber) return true;
    // validación de longitud
    let lengthValid = phoneNumber.length >= 13;
    let re =/^\+(\d{3})\.(\d{8})$/;
    let formatValid = re.test(phoneNumber);
    return lengthValid && formatValid;
  };

const validateDatetimef = (fechahorai, fechahoraf) => {
    if (!fechahorai) return false; 
    if (!fechahoraf) return true;
        const fechahoraInicio = new Date(fechahorai);
        const fechahoraFinal = new Date(fechahoraf);
        let fechahorafvalida = fechahoraInicio < fechahoraFinal
        return fechahorafvalida;
   
};

const validateContacto = () => {
    const contactosMarcados = document.querySelectorAll('#contactos input[type="checkbox"]:checked');
    if (contactosMarcados.length === 0) return true;

    for (const checkbox of contactosMarcados) {
        const red = checkbox.name.replace("contacto_", "");
        const idInput = `${red}-id`; 
        const inputTexto = document.getElementById(idInput);
        if (!inputTexto) {
            console.error(`No se encontró el input con id="${idInput}"`);
            return false;
        }
        if (inputTexto.style.display !== "none") {
            const valor = inputTexto.value.trim();
            if (valor.length < 4 || valor.length > 50) {
                return false;
            }
        }
    }
    return true;
};

const validateFiles = () => {
    const fotoInputs = document.querySelectorAll('.foto-input input[type="file"]');
    let filesArray = [];

    
    fotoInputs.forEach(input => {
        if (input.files.length > 0) {
            filesArray.push(...input.files); 
        }
    });

    
    return filesArray.length > 0;
};

const validateTheme = () => {
    const checkboxes = document.querySelectorAll("#tema input[type='checkbox']:checked");
    const otroCheckbox = document.querySelector("#tema input[type='checkbox'][name='otro-tema']"); 
    const otroInput = document.getElementById("otro-tema-id");

    
    if (otroCheckbox && otroCheckbox.checked) {
        
        if (otroInput.value.trim().length < 3 || otroInput.value.trim().length > 15) {
            return false;
        }
    }

    
    return checkboxes.length >= 1;
};
 

 const validateRegion = (region) => {
    return region !== "" && region !== null;
 }
 const validateComuna = (comuna) => {
    return comuna !== "" && comuna !== null;
 }


 // funciones de fecha y hora
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
function revisaCheck(element) {
    const red = element.name.replace("contacto_", ""); 
    const inputId = `${red}-id`; 
    const inputTexto = document.getElementById(inputId);
    if (inputTexto) {
        if (element.checked) {
            inputTexto.style.display = "inline-block";
        } else {
            inputTexto.style.display = "none";
            inputTexto.value = "";
        }
    }
    let checkboxes = document.querySelectorAll("#contactos input[type='checkbox']");
    let seleccionados = document.querySelectorAll("#contactos input[type='checkbox']:checked").length;
    checkboxes.forEach(cb => {
        cb.disabled = (seleccionados >= 5 && !cb.checked);
    });
}

// funcion para mostrar input cuando se selecciona otro en contacto
function mostrarInputOtro(checkbox) {
    const inputOtro = document.getElementById("otro-tema-id");
    
    if (checkbox.checked) {
      inputOtro.style.display = "inline-block"; 
    } else {
      inputOtro.style.display = "none"; 
      inputOtro.value = "";
    }
  }


// funcion de como se muestra el input de imagenes
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

//nose q es esto
document.getElementById("region").addEventListener("change", function () {
    const regionId = this.value;
    fetch(`/get_comunas/${regionId}`)
        .then(response => response.json())
        .then(comunas => {
            const comunaSelect = document.getElementById("comuna");
            comunaSelect.innerHTML = '<option value="">Seleccione una comuna</option>';
            comunas.forEach(c => {
                let option = document.createElement("option");
                option.value = c.id;
                option.textContent = c.nombre;
                comunaSelect.appendChild(option);
            });
        });
});



const validateForm = (event) => {
    event.preventDefault();
    let isValid = true;
    let invalidInputs = [];

    let formulario = document.getElementById("info-act-form")
    let sector = document.getElementById("sector").value;
    let nombre = document.getElementById("nombre").value;
    let email = document.getElementById("email").value;
    let numero = document.getElementById("numero").value;
    let contacto = document.getElementById("contacto");
    let horayfechai = document.getElementById("fechayhorai").value;
    let horayfechaf = document.getElementById("fechayhoraf").value;
    let tema = document.getElementById("tema");
    let fotos = document.getElementById("fotos1");
    let region = document.getElementById("region").value;
    let comuna = document.getElementById("comuna").value;


//validaciones hechas con el formato visto en auxiliar 3
    if (!validateSector(sector)) {
        invalidInputs.push("Sector");
        isValid = false;
    }
    if (!validateName(nombre)){
        invalidInputs.push("Nombre");
        isValid = false;
    }
    if (!validateEmail(email)) {
        invalidInputs.push("Email");
        isValid = false;
    }
    if (!validatePhoneNumber(numero)) {
        invalidInputs.push("Número");
        isValid = false;
    }
    if (!validateContacto(contacto)) {
        invalidInputs.push("Contacto");
        isValid = false;
    }
    if (!validateDatetimef(horayfechai,horayfechaf)) {
        invalidInputs.push("Fecha y Hora");
        isValid = false;
    }
    if (!validateTheme(tema)) {
        invalidInputs.push("Tema");
        isValid = false;
    }
    if (!validateFiles(fotos)) {
        invalidInputs.push("Fotos");
        isValid = false;
    }
    if (!validateRegion(region)) {
        invalidInputs.push("Región");
        isValid = false;
    }

    // Validación para la comuna
    if (!validateComuna(comuna)) {
        invalidInputs.push("Comuna");
        isValid = false;
    }

    let validationBox = document.getElementById("val-box");
    let validationMessageElem = document.getElementById("val-msg");
    let validationListElem = document.getElementById("val-list");
    let formContainer = document.querySelector(".main-container");
  

    validationListElem.textContent = "";
    if (!isValid) {
      
      for (input of invalidInputs) {
        let listElement = document.createElement("li");
        listElement.innerText = input;
        validationListElem.append(listElement);
      }
      
      validationMessageElem.innerText = "Los siguientes campos son inválidos:";
      validationBox.style.backgroundColor = "#ffdddd";
      validationBox.style.borderLeftColor = "#f44336";
      validationBox.hidden = false;
      validationListElem.scrollIntoView({
        behavior: 'smooth',   
        block: 'center'       
    });

    } else {
        validationMessageElem.innerText = "¿Está seguro que desea agregar esta actividad?";
        validationListElem.textContent = "";
        validationBox.style.backgroundColor = "#ddffdd";
        validationBox.style.borderLeftColor = "#4CAF50";
        validationBox.hidden = false; 
        formulario.style.display = "none";
  
  
      let submitButton = document.createElement("button");
      submitButton.innerText ="Sí, estoy seguro";
      submitButton.style.marginRight = "10px";
      submitButton.addEventListener("click", () => {
        validationMessageElem.innerHTML = "Hemos recibido su información. <br>¡Muchas gracias y suerte con su actividad!";
            submitButton.style.display = "none";
            backButton.textContent = "Volver al inicio";
            backButton.disabled = true;

            setTimeout(() => {
                formulario.submit();
             }, 1500); 
     });
     
  
      let backButton = document.createElement("button");
      backButton.innerText = "No, quiero volver al formulario";
      backButton.addEventListener("click", () => {
        formulario.style.display = "block";
        validationBox.hidden = true;
      });
     
      validationListElem.appendChild(submitButton);
      validationListElem.appendChild(backButton);
  
    }
  };
  
  
  let submitBtn = document.getElementById("submit-btn");
  submitBtn.addEventListener("click", validateForm);
  










