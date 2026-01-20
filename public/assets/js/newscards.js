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
      list.forEach(g => {
        var card = document.createElement("div");
        card.className = "card";
        card.onclick = () => location.href = g.source === "local" ? g.url : `/tab.html?autofill=${encodeURIComponent(g.url)}`;
        card.innerHTML = `<div class="thumb" style="background-image:url('${g.img || "/assets/img/placeholder.png"}')"></div><p>${g.name}</p>`;
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
  });
