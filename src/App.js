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

    const datos = {
        "Línea 1": [
            "Zafra",
            "Julio Caro Baroja (Aqualon)",
            "Avda. Alemania (Esquina Ruiz de Alda)",
            "Avda. Alemania (Plaza de Toros)",
            "Bda. Navidad",
            "Don Bosco",
            "Plaza de los Dolores",
            "Barriada del Carmen",
            "Humilladero",
            "Cardeñas",
            "Orden Baja",
            "Gonzalo de Berceo",
            "Plaza Niño Miguel",
            "Magnolia",
            "Hospital JRJ",
            "Plaza las Amapolas",
            "Av. Andalucia (Castaño Robledo)",
            "Monumento al Fútbol",
            "Relaciones Laborales (Universidad)",
            "Vista Alegre-Universidad",
            "Centro Comercial Holea",
            "Cruce Romeralejo",
            "Universidad. Avenida de las Artes",
            "Palacio de Deportes",
            "Higueral (Fuerzas Armadas)",
            "Bda. José Antonio",
            "Isla Chica",
            "Las Delicias",
            "El Árbol",
            "Gasolinera",
            "Estación de Ferrocarril",
            "El punto",
            "Estación de Sevilla",
            "Nuevo Mercado"
        ],
        "Línea 5000": ["Puente de Vallecas"]
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
        if (audio) {
            audio.pause();
        }

        const playAudio = (audioFile) => {
            const nuevoAudio = new Audio(audioFile);
            nuevoAudio.play().catch(error => {
                console.error("Error al reproducir audio:", error);
            });
            return nuevoAudio;
        };

        // Play "parada_actual" or "parada_siguiente" FIRST
        const paradaTipoAudio = playAudio(`/audio/parada_${tipoParada}.wav`);
        setAudio(paradaTipoAudio); // Update state immediately
        audioRef.current = paradaTipoAudio; // Set audio ref
        paradaTipoAudio.volume = volume; // Set volume

        // Then, if a specific stop is selected, play that audio AFTER
        if (datos[lineaSeleccionada] && datos[lineaSeleccionada].includes(paradaSeleccionada)) {
            paradaTipoAudio.onended = () => {  // Play stop audio after type audio
                let paradaAudioFile = "";
                paradaAudioFile = `/audio/${paradaSeleccionada.toLowerCase().replace(/ /g, "_")}.wav`; // Dynamic file naming
                const paradaAudio = playAudio(paradaAudioFile);
                setAudio(paradaAudio); // Update state again
                audioRef.current = paradaAudio; // Set audio ref
                paradaAudio.volume = volume; // Set volume
            };
        }
    };

    useEffect(() => {
        const cargarAudios = () => {
            // Preload audio files (optional but recommended)
            const audioActual = new Audio(`/audio/parada_actual.wav`);
            const audioSiguiente = new Audio(`/audio/parada_siguiente.wav`);

            // Dynamically preload audio files for each stop
            datos["Línea 1"].forEach(parada => {
                const audio = new Audio(`/audio/${parada.toLowerCase().replace(/ /g, "_")}.wav`);
            });

            const audioVallecas = new Audio(`/audio/vallecas.wav`); // Preload new audio file
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

    return (
        <div className="container">
            <h1>Aplicación de Megafonía</h1>

            <div>
                <label htmlFor="linea">Línea:</label>
                <select id="linea" value={lineaSeleccionada} onChange={handleLineaChange} className="form-select">
                    <option value="">Selecciona una línea</option>
                    {Object.keys(datos).map((linea) => (
                        <option key={linea} value={linea}>{linea}</option>
                    ))}
                </select>
            </div>

            <div>
                <label htmlFor="parada">Parada:</label>
                <select id="parada" value={paradaSeleccionada} onChange={handleParadaChange} className="form-select">
                    <option value="">Selecciona una parada</option>
                    {datos[lineaSeleccionada]?.map((parada) => (
                        <option key={parada} value={parada}>{parada}</option>
                    ))}
                </select>
            </div>

            <div className="d-flex flex-column">
                <label>
                    <input
                        type="radio"
                        value="actual"
                        checked={tipoParada === 'actual'}
                        onChange={handleTipoParadaChange}
                        className="form-check-input"
                    />
                    <span className="form-check-label">Parada actual</span>
                </label>
                <label>
                    <input
                        type="radio"
                        value="siguiente"
                        checked={tipoParada === 'siguiente'}
                        onChange={handleTipoParadaChange}
                        className="form-check-input"
                    />
                    <span className="form-check-label">Parada siguiente</span>
                </label>
            </div>

            <div>
                <label htmlFor="volume">Volumen:</label>
                <input
                    type="range"
                    id="volume"
                    min="0"
                    max="1"
                    step="0.1"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="form-range"
                />
            </div>

            <button onClick={reproducirAudio} className="btn btn-primary">Reproducir</button>
            <button onClick={toggleTheme} className="btn btn-secondary mt-3">
                Cambiar tema a {theme === 'light' ? 'oscuro' : 'claro'}
            </button>
        </div>
    );
}

export default App;