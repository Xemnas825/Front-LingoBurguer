const hamburguesas = ["Hamburguesa Clásica", "Hamburguesa BBQ", "Hamburguesa Doble Queso" , "Hamburguesa apruebame" , "Hamburguesa Vegetariana"];
const bebidas = ["Coca-Cola", "Sprite", "Agua Mineral", "Jugo de Naranja", "Limonada"];
const entrantes = ["Papas Fritas", "Aros de Cebolla", "Nuggets de Pollo", "Ensalada César", "Nachos con Queso"];

// Generar combo aleatorio
function getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function generateCombo() {
    const combo = {
        hamburguesa: getRandomItem(hamburguesas),
        bebida: getRandomItem(bebidas),
        entrante: getRandomItem(entrantes),
    };

    return combo;
}

// Renderizar combo en la página
function renderCombo() {
    const combo = generateCombo();
    const comboContainer = document.getElementById('combo-container');

    comboContainer.innerHTML = `
        <div class="product-card">
            <h2>Combo del Día</h2>
            <p><strong>Hamburguesa:</strong> ${combo.hamburguesa}</p>
            <p><strong>Bebida:</strong> ${combo.bebida}</p>
            <p><strong>Entrante:</strong> ${combo.entrante}</p>
        </div>
    `;
}

// Cargar combo al iniciar
document.addEventListener('DOMContentLoaded', renderCombo);

























/*let hamburguesas = [];
let bebidas = [];
let entrantes = [];

// Función para obtener los productos desde la base de datos
async function fetchProductos() {
    try {
        const response = await fetch('http://52.44.178.183:8080/Controller'); // Reemplaza con la URL de tu API
        const data = await response.json();

        // Asignar los productos a las variables correspondientes
        hamburguesas = data.hamburguesas || [];
        bebidas = data.bebidas || [];
        entrantes = data.entrantes || [];
    } catch (error) {
        console.error('Error al obtener los productos:', error);
    }
}

// Generar combo aleatorio
function getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function generateCombo() {
    const combo = {
        hamburguesa: getRandomItem(hamburguesas),
        bebida: getRandomItem(bebidas),
        entrante: getRandomItem(entrantes),
    };

    return combo;
}

// Renderizar combo en la página
function renderCombo() {
    const combo = generateCombo();
    const comboContainer = document.getElementById('combo-container');

    comboContainer.innerHTML = `
        <div class="product-card">
            <h2>Combo del Día</h2>
            <p><strong>Hamburguesa:</strong> ${combo.hamburguesa || 'No disponible'}</p>
            <p><strong>Bebida:</strong> ${combo.bebida || 'No disponible'}</p>
            <p><strong>Entrante:</strong> ${combo.entrante || 'No disponible'}</p>
        </div>
    `;
}

// Cargar productos y renderizar combo al iniciar
document.addEventListener('DOMContentLoaded', async () => {
    await fetchProductos(); // Cargar productos desde la base de datos
    renderCombo(); // Renderizar el combo con los datos cargados
});

// Generar combo aleatorio
function getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function generateCombo() {
    const combo = {
        hamburguesa: getRandomItem(hamburguesas),
        bebida: getRandomItem(bebidas),
        entrante: getRandomItem(entrantes),
    };

    return combo;
}

// Renderizar combo en la página
function renderCombo() {
    const combo = generateCombo();
    const comboContainer = document.getElementById('combo-container');

    comboContainer.innerHTML = `
        <div class="product-card">
            <h2>Combo del Día</h2>
            <p><strong>Hamburguesa:</strong> ${combo.hamburguesa}</p>
            <p><strong>Bebida:</strong> ${combo.bebida}</p>
            <p><strong>Entrante:</strong> ${combo.entrante}</p>
        </div>
    `;
}

// Cargar combo al iniciar
document.addEventListener('DOMContentLoaded', renderCombo);*/