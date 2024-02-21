const fs = require('fs');

// Función para generar coordenadas aleatorias dentro del área de Barcelona
function generateCoordinatesInBarcelona() {
    // Coordenadas aproximadas del área de Barcelona
    const latitude = 41.3888 + (Math.random() - 0.5) * 0.4; // Rango aproximado de latitud de Barcelona
    const longitude = 2.1589 + (Math.random() - 0.5) * 0.4; // Rango aproximado de longitud de Barcelona
    return [longitude, latitude];
}

// Array para almacenar los restaurantes generados
const restaurants = [];

// Generar 100 restaurantes en el área de Barcelona
for (let i = 0; i < 100; i++) {
    const restaurant = {
        name: `Restaurante ${i + 1}`,
        capacity: Math.floor(Math.random() * (200 - 10 + 1)) + 10, // Capacidad aleatoria entre 10 y 200
        image: "https://via.placeholder.com/300", // URL de imagen ficticia
        location: {
            type: "Point",
            coordinates: generateCoordinatesInBarcelona()
        },
        phone: Math.floor(Math.random() * (999999999 - 600000000 + 1)) + 600000000, // Número de teléfono aleatorio ficticio
        price: ["$", "$$", "$$$"][Math.floor(Math.random() * 3)], // Precio aleatorio entre $, $$, $$$
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", // Descripción ficticia
        category: ["Italian", "Mexican", "Japanese", "American", "Indian"][Math.floor(Math.random() * 5)], // Categoría aleatoria
        city: "Barcelona", // Ciudad fija como Barcelona
        postcode: "08001", // Código postal ficticio
        owner: "UsuarioFicticio123", // ID de usuario ficticio
        comments: [],
        ratings: [],
        favorites: [],
        commentedByUsers: [],
        ratedByUsers: [],
        favoritesByUsers: []
    };
    restaurants.push(restaurant);
}

// Exportar los restaurantes generados a un archivo JSON
fs.writeFileSync('restaurantes_barcelona.json', JSON.stringify(restaurants, null, 2));

console.log('Se han generado 100 restaurantes en el área de Barcelona. Puedes encontrarlos en el archivo restaurantes_barcelona.json.');
