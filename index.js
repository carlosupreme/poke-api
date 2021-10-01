const d = document;
let $main = d.querySelector("main");
let $links = d.querySelector(".links");
let pokeapi = "https://pokeapi.co/api/v2/pokemon/";

async function loadPokemons(url) {
  try {
    $main.innerHTML = `<img class="loader" src="three-dots.svg" alt="cargando" title="Cargando...">`;
    let res = await fetch(url);
    let json = await res.json();
    let $template = "";
    let $prev ;
    let $next ;

    if (!res.ok) throw { status: res.status, statusText: res.statusText };

    for (let i = 0; i < json.results.length; i++) {
      try {
        let res = await fetch(json.results[i].url);
        let pokemon = await res.json();
        if (!res.ok) throw { status: res.status, statusText: res.statusText };
        $template += `
        <figure>
         <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}" >
         <figcaption>${pokemon.name}</figcaption>
         </figure>
         `;
      } catch (error) {
        let message = error.statusText || "Ocurrió un error";
        console.warn(error);
        $template += ` <h1> ${message} ${error.status}</h1> `;
      }
    }

    $main.innerHTML = $template;

    $prev = json.previous ? `<a href="${json.previous}">⏮</a>` : "";
    $next = json.next ? `<a href="${json.next}">⏭</a>` : "";
    $links.innerHTML = $prev + `\n` + $next;
  } catch (error) {
    let message = error.statusText || "Ocurrió un error";
    console.warn(error);
    $main.innerHTML = ` <h1> ${message} ${error.status}</h1> `;
  }
}

d.addEventListener("DOMContentLoaded", (e) => loadPokemons(pokeapi));
d.addEventListener("click", (e) => {
 if(e.target.matches(`.links a`)){
  e.preventDefault()
  loadPokemons(e.target.href)
 }
});
