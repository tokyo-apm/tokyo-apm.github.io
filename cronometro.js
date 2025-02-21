let timer;
let isRunning = false;
let startTime = 0;
let elapsedTime = 0;
let sessionList = [];

// Referencias a elementos del DOM
const timeDisplay = document.getElementById('time');
const startStopBtn = document.getElementById('startStopBtn');
const saveSessionBtn = document.getElementById('saveSessionBtn');
const exportBtn = document.getElementById('exportBtn');  // Botón de exportar
const importFileInput = document.getElementById('importFile'); // Input para importar
const importBtn = document.getElementById('importBtn'); // Botón de importar
const sessionListContainer = document.getElementById('sessionList');

// Función para formatear el tiempo en formato HH:MM:SS.MS
function formatTime(ms) {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);
    const milliseconds = ms % 1000;

    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}.${pad(milliseconds, 3)}`;
}

// Función para agregar ceros a la izquierda si es necesario
function pad(num, size = 2) {
    let s = num.toString();
    while (s.length < size) s = '0' + s;
    return s;
}

// Función para iniciar o detener el cronómetro
function toggleTimer() {
    if (isRunning) {
        clearInterval(timer);
        saveSessionBtn.disabled = false;  // Habilitar el botón de guardar
    } else {
        startTime = Date.now() - elapsedTime;
        timer = setInterval(updateTime, 10); // Actualizar cada 10 ms
        saveSessionBtn.disabled = true;  // Deshabilitar el botón de guardar
    }
    isRunning = !isRunning;
    startStopBtn.textContent = isRunning ? 'Detener' : 'Iniciar';
}

// Función para actualizar el tiempo en pantalla
function updateTime() {
    elapsedTime = Date.now() - startTime;
    timeDisplay.textContent = formatTime(elapsedTime);
}

// Función para guardar la sesión
function saveSession() {
    const endTime = Date.now();
    const session = {
        startTime: new Date(startTime).toLocaleString(),
        endTime: new Date(endTime).toLocaleString(),
        duration: elapsedTime // Guardamos el tiempo en milisegundos
    };
    
    sessionList.push(session);
    updateSessionList();
    
    // Activamos el botón de exportar
    exportBtn.disabled = false;

    // Reiniciar el cronómetro después de guardar la sesión
    resetTimer();
}

// Función para actualizar la lista de sesiones guardadas
function updateSessionList() {
    sessionListContainer.innerHTML = ''; // Limpiar la lista antes de agregar nuevas
    sessionList.forEach(session => {
        const listItem = document.createElement('li');
        listItem.textContent = `Inicio: ${session.startTime} | Fin: ${session.endTime} | Duración: ${formatTime(session.duration)}`;
        sessionListContainer.appendChild(listItem);
    });
}

// Función para reiniciar el cronómetro
function resetTimer() {
    clearInterval(timer);
    isRunning = false;
    elapsedTime = 0;
    timeDisplay.textContent = '00:00:00.000';
    startStopBtn.textContent = 'Iniciar';
    saveSessionBtn.disabled = true;
}

// Función para exportar las sesiones a un archivo JSON
function exportSessions() {
    const json = JSON.stringify(sessionList, null, 2); // Convertir a JSON con formato
    const blob = new Blob([json], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'sesiones_cronometro.json';  // Nombre del archivo
    link.click();
}

// Función para importar las sesiones desde un archivo JSON
function importSessions() {
    const file = importFileInput.files[0];
    if (!file) {
        alert("Por favor, selecciona un archivo para importar.");
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importedSessions = JSON.parse(e.target.result);
            if (Array.isArray(importedSessions)) {
                sessionList = importedSessions;  // Sobrescribir las sesiones existentes
                updateSessionList();
                alert("Sesiones importadas con éxito.");
            } else {
                alert("El archivo no contiene un formato de sesiones válido.");
            }
        } catch (error) {
            alert("Hubo un error al leer el archivo.");
        }
    };
    reader.readAsText(file);
}

// Event Listeners
startStopBtn.addEventListener('click', toggleTimer);
saveSessionBtn.addEventListener('click', saveSession);
exportBtn.addEventListener('click', exportSessions);
importBtn.addEventListener('click', importSessions);
