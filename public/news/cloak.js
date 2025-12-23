document.title = "celestial. | games"
document.open();
document.write(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>celestial. | games</title>
  <link rel="stylesheet" href="/assets/css/home.css">
  <link rel="stylesheet" href="/assets/css/edugs.css">
</head>
<body>

<div class="search">
  <input class="textbook" placeholder="search 600+ games.">
  <select>
    <option selected>All Games</option>
    <option>Exclusives</option>
  </select>
  <select>
    <option selected>In Order</option>
    <option>Newest</option>
  </select>
</div>

<div class="gs"></div>

<script src="/assets/js/newscards.js"></script>
</body>
</html>
`);
document.close();
