document.title = "celestial. | games";

document.open();
document.write(`
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="shortcut icon" type="image/png" href="/assets/img/logo.png" />
  <link rel="stylesheet" href="/assets/css/home.css" />
  <link rel="stylesheet" href="/assets/css/edugs.css" />
</head>

<body>
<div class="search">
  <input class="textbook" placeholder="search 600+ games." />

    <select id="choices">
      <option id="all" selected>All G<span>am</span>es</option>
      <option id="exclusive">Exclusives</option>
    </select>

    <select id="choices">
      <option selected>In Order</option>
      <option>Newest</option>
    </select>
  </div>
  <div class="gs"></div>
</body>
<script src="/assets/js/newscards.js"></script>

</html>
`);
document.close();
