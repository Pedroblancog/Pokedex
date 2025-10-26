// ---- 1. Capturamos los elementos del HTML ----
// Usamos 'querySelector' con el mismo selector que en CSS (con # para IDs)
const pokemonInput = document.querySelector("#pokemonInput");
const searchButton = document.querySelector("#searchButton");
const pokedexDisplay = document.querySelector("#pokedexDisplay");

// ---- 2. Añadimos el "Escuchador de Eventos" al botón ----
// Esto le dice al botón: "Oye, cuando alguien te haga 'click',
// ejecuta la función llamada 'buscarPokemon'".
searchButton.addEventListener("click", buscarPokemon);

// ---- 3. La función principal (¡La magia!) ----
// 'async' es una palabra clave que le dice a JS:
// "Oye, esta función va a hacer cosas que TARDAN, como pedir datos a internet".
async function buscarPokemon() {
    
    // Cogemos el valor (el texto) de dentro del input
    // .toLowerCase() lo convierte todo a minúsculas,
    // porque la API es sensible a mayúsculas (Pikachu != pikachu)
    const pokemonNameOrId = pokemonInput.value.toLowerCase();

    // -- Aquí empieza la llamada a la API --
    // 'try...catch' es un bloque de seguridad.
    // 'try' = "Intenta hacer esto..."
    // 'catch' = "...y si algo sale mal (ej: no hay internet), avísame aquí".
    try {
        // 'fetch' es el "mensajero" que va a buscar los datos a la URL.
        // 'await' le dice a JS: "Espera aquí HASTA QUE el mensajero vuelva
        // con la respuesta".
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonNameOrId}`);

        // Si la respuesta NO fue exitosa (ej: escribiste "Pikacho" y no existe)
        if (!response.ok) {
            throw new Error("Pokémon no encontrado. ¿Lo escribiste bien?");
        }

        // Si todo fue bien, 'await' espera a que la respuesta
        // se "desempaquete" en un formato que JS entienda (JSON).
        const data = await response.json();

        const descripcion = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonNameOrId}`);
        const data2 = await descripcion.json();
        // ---- 4. Pintamos los resultados en el HTML ----
        // 'innerHTML' nos deja escribir HTML "a la fuerza" dentro de un elemento.
        // Estamos inyectando una imagen y un nombre.
        pokedexDisplay.innerHTML = `
            <h2>${data.name.toUpperCase()}</h2>
            <img src="${data.sprites.front_default}" alt="Imagen de ${data.name}">
            <p>Número: ${data.id}</p>
            <p>Altura: ${data.height / 10} m</p>
            <p>Peso: ${data.weight / 10} kg</p>
            <p>Descripcion: ${data2.flavor_text_entries[0].flavor_text}</p>
        `;

    } catch (error) {
        // Si algo falló en el 'try' (o lanzamos el error nosotros),
        // mostramos un mensaje de error al usuario.
        pokedexDisplay.innerHTML = `<p style="color: red;">${error.message}</p>`;
    }
}