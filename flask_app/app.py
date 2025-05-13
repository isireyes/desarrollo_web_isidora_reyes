from flask import Flask, request, render_template, redirect, url_for, session, jsonify
from database.db import Region, Comuna, Actividad, Contacto, Tema, Foto
from database.db import SessionLocal
from database import db
from werkzeug.utils import secure_filename
import hashlib
import filetype
import os
from datetime import datetime
from utils.validations import ( valida_nombre, valida_sector, valida_email, valida_numero_telefono, 
                               valida_fechayhora, valida_contactos, valida_max_contactos, validate_conf_img,
                               valida_tema, valida_region, valida_comuna, sanitize_input, validate_descripcion)

app = Flask(__name__)
app.secret_key = "s3cr3t_k3y"
app.config['UPLOAD_FOLDER'] = 'static/uploads'

@app.route('/portada/', methods = ['GET', 'POST'])
def portada():
    return render_template('portada.html')

@app.route('/listado/', methods = ['GET', 'POST'])
def listado():
    return render_template('listado.html')


@app.route('/get_comunas/<int:region_id>')
def get_comunas(region_id):
    session = SessionLocal()
    comunas = session.query(Comuna).filter_by(region_id=region_id).all()
    session.close()
    return jsonify([{'id': c.id, 'nombre': c.nombre} for c in comunas])

@app.route('/informa-act/')
def informa_act():
    session = SessionLocal()
    if request.method == "POST":
        fotos = request.files.getlist("foto[]")
        plataformas = ["whatsapp", "instagram", "tiktok", "telegram", "x", "otro"]
        contactos = [request.form.get(p) for p in plataformas if request.form.get(p)]
        temas = [t for t in ["musica", "deporte", "ciencias", "religion", "politica", "tecnologia", "juegos", "baile", "comida"] if t in request.form]
        otro_tema = request.form.get("otro-tema-input") if "otro-tema" in request.form else None
        if all([
            valida_nombre(request.form.get("nombre")),
            valida_sector(request.form.get("sector")),
            valida_email((request.form.get("email"))),
            valida_numero_telefono(request.form.get("numero")),
            valida_fechayhora(request.form.get("fechayhorai"), request.form.get("fechayhoraf")),
            validate_descripcion(request.form.get("descripcion")),
            valida_comuna(request.form.get("comuna")),
            valida_contactos(contactos),
            valida_max_contactos(contactos),
            valida_tema(temas + (["otro"] if "otro-tema" in request.form else []), otro_tema),
            all(validate_conf_img(f) for f in fotos if f.filename)
        ]):
            actividad = Actividad(
                comuna_id= request.form.get("comuna"),
                sector=request.form.get("sector"),
                nombre=request.form.get("nombre"),
                email=request.form.get("email"),
                telefono=request.form.get("numero"),
                dia_hora_inicio=datetime.fromisoformat(request.form.get("fechayhorai")),
                dia_hora_termino=datetime.fromisoformat(request.form.get("fechayhoraf")),
                descripcion=request.form.get("descripcion")
                )
            session.add(actividad)
            session.flush()
            for p in plataformas:
                identificador = request.form.get(p)
                if identificador:
                    session.add(Contacto(nombre=p.capitalize(), identificador=identificador, actividad_id=actividad.id))

            for t in temas:
                session.add(Tema(tema=t.capitalize(), actividad_id=actividad.id))
                if "otro-tema" in request.form and otro_tema:
                    session.add(Tema(tema="Otro", glosa_otro=otro_tema, actividad_id=actividad.id))

            for f in fotos:
                if f.filename:
                    original_name = secure_filename(f.filename)
                    _filename = hashlib.sha256(original_name.encode("utf-8")).hexdigest()
                    _extension = filetype.guess(f).extension
                    img_filename = f"{_filename}.{_extension}"
                    path = os.path.join(app.config["UPLOAD_FOLDER"], img_filename)
                    f.save(path)
                    session.add(Foto(ruta_archivo=path, nombre_archivo=img_filename, actividad_id=actividad.id))
            session.commit()
        else:
            session.close()
        return redirect(url_for("informa_actividad"))

       



    regiones = session.query(Region).order_by(Region.nombre).all()
    session.close()
    return render_template('informa-act.html', regiones=regiones)

#@app.route('/informa-act', methods = ['GET', 'POST'])
#def informa_act():
#    return render_template('informa-act.html')
@app.route('/estadistica/', methods = ['GET', 'POST'])
def estadistica():
    return render_template('estadistica.html')

if __name__ == '__main__':
    app.run(debug=True)