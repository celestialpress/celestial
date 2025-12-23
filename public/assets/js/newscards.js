var grid = document.querySelector(".gs");
var search = document.querySelector(".textbook");
var cat = document.querySelectorAll("select")[0];
var order = document.querySelectorAll("select")[1];

fetch("/assets/json/books.json")
  .then(res => res.json())
  .then(games => {
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

    function update() {
      var filtered = games.filter(g => g.name.toLowerCase().includes(search.value.toLowerCase()));
      if (cat.value.toLowerCase() === "exclusives") filtered = filtered.filter(g => g.type.toLowerCase() === "exclusive");
      if (order.value.toLowerCase() === "newest") filtered = filtered.slice().reverse();
      showGames(filtered);
    }

    search.addEventListener("input", update);
    cat.addEventListener("change", update);
    order.addEventListener("change", update);

    showGames(games);
  });
