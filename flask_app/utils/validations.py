import re
import filetype
import html
from datetime import datetime
def sanitize_input(text):
    if not isinstance(text, str):
        return ""
    return re.sub(r'[<>]', '', text.strip())

def valida_nombre(nombre):
    if not nombre:
        return False
    sanitized_nombre=sanitize_input(nombre)
    return len(sanitized_nombre.strip()) <= 200

def valida_sector(sector):
    if not sector:
        return True
    sanitized_sector=sanitize_input(sector)
    return len(sanitized_sector.strip()) <= 100

def valida_email(email):
    if not email:
        return False
    if len(email) > 100:
        return False
    x = r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'
    return bool(re.match(x, email))

def valida_numero_telefono(numero_telefono):
    if not numero_telefono:
        return True
    if len(numero_telefono)>15:
        return False
    x = r'^\+(\d{3})\.(\d{8})$'
    return bool(re.match(x, numero_telefono))

def valida_fechayhora(hora_inicio, hora_fin):
    if not hora_inicio:
        return False
    if not hora_fin:
        return True
    fecha_inicio = datetime.strptime(hora_inicio, "%Y-%m-%dT%H:%M")
    fecha_fin = datetime.strptime(hora_fin, "%Y-%m-%dT%H:%M")
    return fecha_inicio < fecha_fin

def valida_contactos(contactos):
    if not contactos:
        return True
    for contacto in contactos:
        contacto_sanitized = sanitize_input(contacto)
        if len(contacto_sanitized.strip()) < 4 or len(contacto_sanitized.strip()) > 50:
            return False
    return True
def valida_max_contactos(contactos):
    return len(contactos) <= 5

def validate_conf_img(conf_img):
    ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "gif"}
    ALLOWED_MIMETYPES = {"image/jpeg", "image/png", "image/gif"}

    # check if a file was submitted
    if conf_img is None:
        return False

    # check if the browser submitted an empty file
    if conf_img.filename == "":
        return False
    
    # check file extension
    ftype_guess = filetype.guess(conf_img)
    if ftype_guess.extension not in ALLOWED_EXTENSIONS:
        return False
    # check mimetype
    if ftype_guess.mime not in ALLOWED_MIMETYPES:
        return False
    return True

def valida_tema(temas, otro_tema=None):
    if len(temas) == 0:
        return False
    if "otro" in temas and otro_tema:
        otro_tema_sanitized = sanitize_input(otro_tema)
        if len(otro_tema_sanitized.strip()) < 3 or len(otro_tema_sanitized.strip()) > 15:
            return False
    return True

def valida_region(region): 
    return region is not None and region != ""


def valida_comuna(comuna):
    return comuna is not None and comuna != ""

def sanitize_input(text):
    return re.sub(r'[<>]', '', text)

def validate_descripcion(descripcion):
    if not descripcion:
        return False
    descripcion = sanitize_input(descripcion)
    return len(descripcion.strip()) <= 500