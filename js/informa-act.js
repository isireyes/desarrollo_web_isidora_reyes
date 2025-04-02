const validateName = (name) => {
    if(!name) return false;
    let lengthValid = name.trim().length <= 4;
    
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

