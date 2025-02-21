// Fecha de inicio y objetivo
const startDate = new Date('2018-01-01T00:00:00'); // Cambia según sea necesario
const targetDate = new Date('2027-01-11T00:00:00');

// Función para actualizar el contador
function updateCountdown() {
    const now = new Date();
    const timeDifference = targetDate - now;

    if (timeDifference <= 0) {
        // Si ya hemos llegado a la fecha objetivo
        document.getElementById('days').textContent = '00';
        document.getElementById('hours').textContent = '00';
        document.getElementById('minutes').textContent = '00';
        document.getElementById('seconds').textContent = '00';
    } else {
        const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

        document.getElementById('days').textContent = String(days).padStart(2, '0');
        document.getElementById('hours').textContent = String(hours).padStart(2, '0');
        document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
        document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
    }
}

// Función para actualizar el progreso
function updateProgress() {
    const now = new Date();

    // Rango total y progreso actual
    const totalRange = targetDate - startDate;
    const currentProgress = now - startDate;

    // Calcular porcentaje completado
    const percentage = Math.min((currentProgress / totalRange) * 100, 100);

    // Actualizar círculo de progreso
    const circle = document.getElementById('circle-progress');
    const circumference = 314; // Perímetro del círculo
    const offset = circumference - (percentage / 100) * circumference;
    circle.style.strokeDashoffset = offset;

    // Actualizar porcentaje y descripción
    document.getElementById('progress-percentage').textContent = `${Math.round(percentage)}%`;
    const description = percentage === 100
        ? "¡Felicidades! Has alcanzado la fecha objetivo 🎉"
        : `Has completado el ${Math.round(percentage)}% del camino hacia tu meta.`;
    document.getElementById('progress-description').textContent = description;

    // Si ya se alcanzó la fecha objetivo, no seguir calculando
    if (percentage === 100) {
        document.getElementById('progress-description').textContent = "¡Felicidades! Has alcanzado la fecha objetivo 🎉";
    }
}

// Actualización periódica
setInterval(() => {
    updateCountdown();
    updateProgress();
}, 1000);

// Inicialización
updateCountdown();
updateProgress();
