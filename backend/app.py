from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

# Datos de ejemplo (reemplaza con una base de datos)
datos = {
    "Línea 1": [
        "Zafra", "Julio Caro Baroja (Aqualon)", "Avda. Alemania (Esquina Ruiz de Alda)",
        "Avda. Alemania (Plaza de Toros)", "Bda. Navidad", "Don Bosco",
        "Plaza de los Dolores", "Barriada del Carmen", "Humilladero", "Cardeñas",
        "Orden Baja", "Gonzalo de Berceo", "Plaza Niño Miguel", "Magnolia",
        "Hospital JRJ", "Plaza las Amapolas", "Av. Andalucia (Castaño Robledo)",
        "Monumento al Fútbol", "Relaciones Laborales (Universidad)",
        "Vista Alegre-Universidad", "Centro Comercial Holea", "Cruce Romeralejo",
        "Universidad. Avenida de las Artes", "Palacio de Deportes",
        "Higueral (Fuerzas Armadas)", "Bda. José Antonio", "Isla Chica",
        "Las Delicias", "El Árbol", "Gasolinera", "Estación de Ferrocarril",
        "El punto", "Estación de Sevilla", "Nuevo Mercado"
    ],
    "Línea 2": [
        "Zafra", "Nuevo Mercado", "Villa de Madrid", "Avenida Italia",
        "Estación de Sevilla", "El Punto", "Estación de Ferrocarril", "Juzgados",
        "Barrio Obrero", "El Porvenir", "Las Delicias", "Isla Chica",
        "Bda, José Antonio", "Fuerzas Armadas Los Rosales", "Palacio de Deporte",
        "Ciencias de la Educación (Universidad)", "Biblioteca (Universidad)",
        "Monumento al Fútbol", "Relaciones Laborales (Universidad)",
        "Vista Alegre-Universidad", "Centro Comercial Holea", "Plaza las Amapolas",
        "Hospital JRJ", "Magnolia", "Orden Alta", "Gonzalo de Berceo (Alto)",
        "Gonzalo de Berceo (Bajo)", "Orden Baja", "Legión Española", "Cardeñas",
        "Humilladero", "Bda. del Carmen", "Santa Lucía", "Santa Eulalia",
        "Bda. Navidad", "Molino de la Vega", "Paseo de las Palmeras",
        "Julio Caro Baroja (Aqualon)"
    ],
    "Línea 131": ["Puente de Vallecas"]
}

@app.route("/")
def index():
    return render_template("index.html", datos=datos)

@app.route("/paradas")
def obtener_paradas():
    linea = request.args.get("linea")
    if linea and linea in datos:
        return jsonify(datos[linea])
    return jsonify([])

if __name__ == "__main__":
    app.run(debug=True)