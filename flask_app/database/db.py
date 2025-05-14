from sqlalchemy import create_engine, Column, Integer, BigInteger,String, ForeignKey, DateTime
from sqlalchemy.orm import sessionmaker, declarative_base, relationship

DB_NAME= "tarea2"
DB_USERNAME= "cc5002"
DB_PASSWORD="programacionweb"
DB_HOST= "localhost"
DB_PORT= 3306
DB_CHARSET = "utf8"
DATABASE_URL = f"mysql+pymysql://{DB_USERNAME}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
engine = create_engine(DATABASE_URL, echo=False, future=True)
SessionLocal=sessionmaker(bind=engine)
Base = declarative_base()

class Region(Base):
    __tablename__ = 'region'
    id = Column(Integer, primary_key=True, autoincrement=True)
    nombre = Column(String(200), nullable=False)

    comunas = relationship("Comuna", back_populates="region")

class Comuna(Base):
    __tablename__ = 'comuna'
    id = Column(Integer, primary_key=True, autoincrement=True)
    nombre = Column(String(200), nullable=False)
    region_id = Column(Integer, ForeignKey("region.id"), nullable=False)

    region = relationship("Region", back_populates="comunas") 
    actividades = relationship('Actividad', back_populates='comuna')   

class Actividad(Base):
    __tablename__ = 'actividad'
    id = Column(Integer, primary_key=True, autoincrement=True)
    comuna_id = Column(Integer, ForeignKey('comuna.id'))
    sector = Column(String(100))
    nombre = Column(String(200), nullable=False)
    email = Column(String(100), nullable=False)
    celular = Column(String(15))
    dia_hora_inicio = Column(DateTime, nullable=False)
    dia_hora_termino = Column(DateTime)
    descripcion = Column(String(500))

    comuna = relationship('Comuna', back_populates='actividades')
    contactos = relationship('Contacto', back_populates='actividad', cascade="all, delete-orphan")
    temas = relationship('Tema', back_populates='actividad', cascade="all, delete-orphan")
    foto = relationship('Foto', back_populates='actividad', cascade="all, delete-orphan")

class Contacto(Base):
    __tablename__ = 'contactar_por'
    id = Column(Integer, primary_key=True, autoincrement=True)
    nombre = Column(String(50), nullable=False)
    identificador = Column(String(150), nullable=False)
    actividad_id = Column(Integer, ForeignKey('actividad.id'))

    actividad =relationship('Actividad', back_populates='contactos')

class Tema(Base):
    __tablename__ = 'actividad_tema'
    id = Column(Integer, primary_key=True)
    tema = Column(String(50), nullable=False)  
    glosa_otro = Column(String(100)) 
    actividad_id = Column(Integer, ForeignKey('actividad.id'), nullable=False)

    actividad = relationship('Actividad', back_populates='temas')

class Foto(Base):
    __tablename__='foto'
    id= Column(Integer, primary_key=True)
    ruta_archivo = Column(String(500), nullable=False)
    nombre_archivo = Column(String(300), nullable=False)
    actividad_id = Column(Integer, ForeignKey('actividad.id'), nullable=False)

    actividad = relationship('Actividad', back_populates='foto')






