var grid = document.querySelector(".gs");
var search = document.querySelector(".textbook");
var cat = document.querySelectorAll("select")[0];
var order = document.querySelectorAll("select")[1];

// main game func
fetch("/assets/json/books.json")
  .then(res => res.json())
  .then(games => {
    const originalGames = [...games];

    function showGames(list) {
      grid.innerHTML = "";
      list.forEach(g => { // loop through all the games in /assets/json/books.json

        /**
         * Separate the card HTML so it's visually easier to understand & modify
         * 
         * also the SVG has to be in-line so CSS can touch it's colors 🥲
         * I know it seems a bit unoptimized, having a new SVG for every card, but since it's
         * just math and the size of it is pretty small, it shouldn't really matter much
         */
        let cardHTML = `
        <div class="thumb" style="background-image:url('${g.img}')"></div>
        <p>${g.name}</p>
        <svg class="favoriteBook" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" width="24" height="24" fill="currentColor"> <path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Zm0-108q96-86 158-147.5t98-107q36-45.5 50-81t14-70.5q0-60-40-100t-100-40q-47 0-87 26.5T518-680h-76q-15-41-55-67.5T300-774q-60 0-100 40t-40 100q0 35 14 70.5t50 81q36 45.5 98 107T480-228Zm0-273Z"/> </svg>

        `;


        var card = document.createElement("div"); // create a new game card
        card.className = "card";
        card.onclick = () => location.href = g.source === "local" ? g.url : `/tab.html?autofill=${encodeURIComponent(g.url)}`;
        card.innerHTML = cardHTML;
        grid.appendChild(card);
      });
    }

    // update games based on cat
    function update() {
      let filtered = originalGames.filter(g => g.name.toLowerCase().includes(search.value.toLowerCase()));
      if (cat.value === "exclusive") filtered = filtered.filter(g => g.type === "exclusive");
      else if (cat.value !== "all") filtered = filtered.filter(g => g.categories?.includes(cat.value));

      if (order.value === "abc") filtered.sort((a, b) => a.name.localeCompare(b.name));
      else if (order.value === "new") filtered = [...filtered].reverse();

      showGames(filtered);
    }

    // runs the function
    search.addEventListener("input", update);
    cat.addEventListener("change", update);
    order.addEventListener("change", update);

    // make sure ts loads
    update();

    /**
     * The
     */
    function favoriteGame() {

    }

  });
