import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
    const [lineaSeleccionada, setLineaSeleccionada] = useState('');
    const [paradaSeleccionada, setParadaSeleccionada] = useState('');
    const [tipoParada, setTipoParada] = useState('actual');
    const [audio, setAudio] = useState(null);
    const [volume, setVolume] = useState(1);
    const audioRef = useRef(null);
    const [theme, setTheme] = useState('light');
    const [playing, setPlaying] = useState(false);

    const datos = {
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
        "Línea 131": ["Puente de Vallecas"],
        "Línea T32": ["Profesor Raúl Vázquez"],
        "xx": ["tristante"]
    };
    const handleLineaChange = (event) => {
        setLineaSeleccionada(event.target.value);
        setParadaSeleccionada('');
    };

    const handleParadaChange = (event) => {
        setParadaSeleccionada(event.target.value);
    };

    const handleTipoParadaChange = (event) => {
        setTipoParada(event.target.value);
    };

    const handleVolumeChange = (event) => {
        setVolume(event.target.value);
        if (audioRef.current) {
            audioRef.current.volume = event.target.value;
        }
    };

    const reproducirAudio = () => {
        if (audio && playing) {
            audio.pause();
            setPlaying(false);
        } else if (lineaSeleccionada && paradaSeleccionada) {
            const playAudio = (audioFile) => {
                const nuevoAudio = new Audio(audioFile);
                nuevoAudio.play().catch(error => {
                    console.error("Error al reproducir audio:", error);
                });

                nuevoAudio.onended = () => {
                    setPlaying(false);
                };

                return nuevoAudio;
            };

            const lineaSinEspacios = lineaSeleccionada.split(" ")[1] || lineaSeleccionada.split(" ")[0];

            if (tipoParada === "noUsar") {
                let paradaAudioFile = `/audio/${lineaSinEspacios}-${paradaSeleccionada.toLowerCase().replace(/ /g, "_")}.wav`;
                const paradaAudio = playAudio(paradaAudioFile);
                setAudio(paradaAudio);
                audioRef.current = paradaAudio;
                paradaAudio.volume = volume;
            } else {
                const paradaTipoAudio = playAudio(`/audio/parada_${tipoParada}.wav`);
                setAudio(paradaTipoAudio);
                audioRef.current = paradaTipoAudio;
                paradaTipoAudio.volume = volume;

                paradaTipoAudio.onended = () => {
                    let paradaAudioFile = `/audio/${lineaSinEspacios}-${paradaSeleccionada.toLowerCase().replace(/ /g, "_")}.wav`;
                    const paradaAudio = playAudio(paradaAudioFile);
                    setAudio(paradaAudio);
                    audioRef.current = paradaAudio;
                    paradaAudio.volume = volume;
                };
            }
            setPlaying(true);
        } else {
            console.log("Por favor, selecciona una línea y una parada.");
            alert("Para reproducir el audio, selecciona una línea y una parada.");
        }
    };


    const reproducirColision = () => {
        const audioColision = new Audio('/audio/colision.wav');
        audioColision.play().catch(error => {
            console.error("Error al reproducir audio:", error);
        });
    };

    useEffect(() => {
        const cargarAudios = () => {
            const audioActual = new Audio(`/audio/parada_actual.wav`);
            const audioSiguiente = new Audio(`/audio/parada_siguiente.wav`);

            for (const linea in datos) {
                datos[linea].forEach(parada => {
                    const lineaSinEspacios = linea.split(" ")[1] || linea.split(" ")[0];
                    const audio = new Audio(`/audio/${lineaSinEspacios}-${parada.toLowerCase().replace(/ /g, "_")}.wav`);
                });
            }

            const audioVallecas = new Audio(`/audio/vallecas.wav`);
            const audioColision = new Audio(`/audio/colision.m4a`);
        };

        cargarAudios();
    }, []);

    useEffect(() => {
        localStorage.setItem('theme', theme);
        document.body.classList.toggle('dark-theme', theme === 'dark');
        document.body.classList.toggle('light-theme', theme === 'light');
    }, [theme]);

    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

    const reproducirCanceladora = (audioNombre) => {
        const audioCanceladora = new Audio(`/audio/${audioNombre}.mp3`);
        audioCanceladora.play().catch(error => {
            console.error("Error al reproducir audio:", error);
        });
    };

    return (
        <div className="container mt-4">
            <h1 className="mb-4">Aplicación de Megafonía</h1>

            <div className="card mb-4">
                <div className="card-body">
                    <div className="mb-3">
                        <label htmlFor="linea" className="form-label">Línea:</label>
                        <select id="linea" value={lineaSeleccionada} onChange={handleLineaChange} className="form-select">
                            <option value="">Selecciona una línea</option>
                            {Object.keys(datos).map((linea) => (
                                <option key={linea} value={linea}>{linea}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="parada" className="form-label">Parada:</label>
                        <select id="parada" value={paradaSeleccionada} onChange={handleParadaChange} className="form-select">
                            <option value="">Selecciona una parada</option>
                            {datos[lineaSeleccionada]?.map((parada) => (
                                <option key={parada} value={parada}>{parada}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <div className="card mb-4">
                <div className="card-body">hora_de_salida.wav
                    <div className="mb-3">
                        <div className="d-flex flex-column">
                            <label className="form-check-label">
                                <input type="radio" value="actual" checked={tipoParada === 'actual'} onChange={handleTipoParadaChange} className="form-check-input me-2" />
                                Parada actual
                            </label>
                            <label className="form-check-label">
                                <input type="radio" value="siguiente" checked={tipoParada === 'siguiente'} onChange={handleTipoParadaChange} className="form-check-input me-2" />
                                Parada siguiente
                            </label>
                            <label className="form-check-label">
                                <input type="radio" value="noUsar" checked={tipoParada === 'noUsar'} onChange={handleTipoParadaChange} className="form-check-input me-2" />
                                No usar
                            </label>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="volume" className="form-label">Volumen:</label>
                        <input type="range" id="volume" min="0" max="1" step="0.1" value={volume} onChange={handleVolumeChange} className="form-range" />
                    </div>
                </div>
            </div>

            <div className="d-grid gap-2">
                <button onClick={reproducirAudio} className="btn btn-primary" disabled={!lineaSeleccionada || !paradaSeleccionada}>
                    {playing ? "Detener" : "Reproducir"}
                </button>
                <button onClick={toggleTheme} className="btn btn-secondary">
                    Cambiar tema a {theme === 'light' ? 'oscuro' : 'claro'}
                </button>
                <button onClick={reproducirColision} className="btn btn-danger">Anti-Colisión</button>
            </div>


            <div className="card mb-4">
                <div className="card-body">
                    <h5 className="card-title">Canceladora</h5>
                    <div className="d-grid gap-2">
                        <button onClick={() => reproducirCanceladora('hora_de_salida')} className="btn btn-primary">
                            Hora de Salida
                        </button>
                        <button onClick={() => reproducirCanceladora('atencion_a_su_saldo')} className="btn btn-primary">
                            Atención a su Saldo
                        </button>
                        <button onClick={() => reproducirCanceladora('saldo_insuficiente')} className="btn btn-primary">
                            Saldo Insuficiente
                        </button>
                    </div>
                </div>
            </div>


        </div>
    );
}

export default App;