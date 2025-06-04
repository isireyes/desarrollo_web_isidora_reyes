from flask import Flask, request, render_template, redirect, url_for, session, jsonify,abort
from database.db import Region, Comuna, Actividad, Contacto, Tema, Foto
from database.db import SessionLocal
from database import db
from sqlalchemy.orm import joinedload
from sqlalchemy import func, extract
from werkzeug.utils import secure_filename
import hashlib
from flask_cors import cross_origin
import filetype
import os
from math import ceil
from datetime import datetime, time
from utils.validations import ( valida_nombre, valida_sector, valida_email, valida_numero_telefono, 
                               valida_fechayhora, valida_contactos, valida_max_contactos, validate_conf_img,
                               valida_tema, valida_region, valida_comuna, sanitize_input, validate_descripcion)

app = Flask(__name__)
app.secret_key = "s3cr3t_k3y"
app.config['UPLOAD_FOLDER'] = 'static/uploads'

@app.route('/', methods = ['GET', 'POST'])
def portada():
    with SessionLocal() as session:
        actividades = (
            session.query(Actividad)
            .options(
                joinedload(Actividad.comuna),
                joinedload(Actividad.temas),
                joinedload(Actividad.foto)
            )
            .order_by(Actividad.id.desc()) 
            .limit(5)
            .all()
        )
    return render_template('portada.html', actividades=actividades)



@app.route('/listado/', methods = ['GET', 'POST'])
def listado():
    por_pagina = 5
    pagina_actual = request.args.get("pagina", default=1, type=int)
    with SessionLocal() as session:
        actividades_query = session.query(Actividad).options(joinedload(Actividad.comuna))
        total_actividades = actividades_query.count()
        total_paginas = (total_actividades + por_pagina - 1) // por_pagina
        actividades = actividades_query.order_by(Actividad.id.desc())\
                                       .offset((pagina_actual - 1) * por_pagina)\
                                       .limit(por_pagina)\
                                       .all()
        return render_template("listado.html",
                               actividades=actividades,
                               pagina_actual=pagina_actual,
                               total_paginas=total_paginas)
@app.route('/actividad/<int:id>')
def detalle_actividad(id):
    session = SessionLocal()
    actividad = session.query(Actividad).filter_by(id=id).first()
    if actividad is None:
        abort(404)
    
    return render_template('detalle_actividad.html', actividad=actividad)



@app.route('/get_comunas/<int:region_id>')
def get_comunas(region_id):
    session = SessionLocal()
    comunas = session.query(Comuna).filter_by(region_id=region_id).all()
    session.close()
    return jsonify([{'id': c.id, 'nombre': c.nombre} for c in comunas])

@app.route('/informa-act/', methods=['GET', 'POST'])
def informa_act():
    session = SessionLocal()
    errores = []

    if request.method == "POST":
        fotos = request.files.getlist("foto[]")
        plataformas = ["whatsapp", "instagram", "tiktok", "telegram", "x", "otro"]
        contactos = []
        redes = ['whatsapp', 'instagram', 'tiktok', 'telegram', 'x', 'otro']

        for red in redes:
            activo = request.form.get(f'contacto_{red}')
            valor = request.form.get(red)
            if activo and valor and 4 <= len(valor) <= 50:
                contactos.append(f'{red}: {valor}')
            elif activo:
                errores.append(f"Cada contacto debe tener entre 4 y 50 caracteres. Problema con {red}")
        temas = [t for t in ["musica", "deporte", "ciencias", "religion", "politica", "tecnologia", "juegos", "baile", "comida"] if t in request.form]
        otro_tema = request.form.get("otro-tema-input") if "otro-tema" in request.form else None
        if not valida_nombre(request.form.get("nombre")):
            errores.append("El nombre es inválido o demasiado largo.")
        if not valida_sector(request.form.get("sector")):
            errores.append("El sector es inválido o demasiado largo.")
        if not valida_email(request.form.get("email")):
            errores.append("El correo electrónico no es válido.")
        if not valida_numero_telefono(request.form.get("numero")):
            errores.append("El número de teléfono debe tener el formato +XXX.XXXXXXXX.")
        if not valida_fechayhora(request.form.get("fechayhorai"), request.form.get("fechayhoraf")):
            errores.append("La fecha de inicio debe ser anterior a la de término.")
        if not validate_descripcion(request.form.get("descripcion")):
            errores.append("La descripción es obligatoria y debe tener máximo 500 caracteres.")
        if not valida_comuna(request.form.get("comuna")):
            errores.append("Debe seleccionar una comuna.")
        if not valida_contactos(contactos):
            errores.append("Cada contacto debe tener entre 4 y 50 caracteres.")
        if not valida_max_contactos(contactos):
            errores.append("Solo se permiten hasta 5 contactos.")
        if not valida_tema(temas + (["otro"] if "otro-tema" in request.form else []), otro_tema):
            errores.append("Debe seleccionar al menos un tema válido. Si usó 'Otro', escriba una glosa válida.")
        if not all(validate_conf_img(f) for f in fotos if f.filename):
            errores.append("Una o más imágenes no son válidas.")
        
        if not errores:
            actividad = Actividad(
                comuna_id= request.form.get("comuna"),
                sector=request.form.get("sector"),
                nombre=request.form.get("nombre"),
                email=request.form.get("email"),
                celular=request.form.get("numero"),
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
            session.close()
            return redirect(url_for("portada"))
        
        regiones = session.query(Region).order_by(Region.nombre).all()
        session.close()
        return render_template('informa-act.html', regiones=regiones, errores=errores)


    regiones = session.query(Region).order_by(Region.nombre).all()
    return render_template('informa-act.html', regiones=regiones)

       
@app.route('/estadistica', methods = ['GET'])
def estadistica():
    return render_template('estadistica.html')

@app.route("/get-stats-data1", methods=["GET"])

@cross_origin(origin="127.0.0.1", supports_credentials=True)
def get_stats_data1():
    session = SessionLocal()
    result = session.query(
        Actividad.dia_hora_inicio, func.count()
    ).group_by(Actividad.dia_hora_inicio).all()

    data = [{'fecha': r[0].strftime('%Y-%m-%d'), 'cantidad': r[1]} for r in result]
    session.close()
    return jsonify(data)


@app.route("/get-stats-data2", methods=["GET"])
@cross_origin(origin="127.0.0.1", supports_credentials=True)
def get_stats_data2():
    session = SessionLocal()
    result = session.query(
        Tema.tema, func.count()
    ).group_by(Tema.tema).all()

    data = [{"name": tema, "y": cantidad} for tema, cantidad in result]
    session.close()
    return jsonify(data)



@app.route("/get-stats-data3", methods=["GET"])
@cross_origin(origin="127.0.0.1", supports_credentials=True)
def get_stats_data3():
    session = SessionLocal()
    actividades = session.query(Actividad).all()

    # Inicializar datos
    meses = {m: {"mañana": 0, "mediodía": 0, "tarde": 0} for m in range(1, 13)}

    for act in actividades:
        fecha = act.dia_hora_inicio
        if not fecha:
            continue  # evitar errores con datos nulos

        mes = fecha.month
        hora = fecha.hour

        if hora < 12:
            franja = "mañana"
        elif hora < 18:
            franja = "mediodía"
        else:
            franja = "tarde"

        meses[mes][franja] += 1

    response = {
        "mañana": [meses[m]["mañana"] for m in range(1, 13)],
        "mediodía": [meses[m]["mediodía"] for m in range(1, 13)],
        "tarde": [meses[m]["tarde"] for m in range(1, 13)],
    }

    return jsonify(response)

if __name__ == '__main__':
    app.run(debug=True)