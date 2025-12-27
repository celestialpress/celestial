document.title = "celestial. | media";

document.open();
document.write(`
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="shortcut icon" type="image/png" href="/assets/img/logo.png" />
  <link rel="stylesheet" href="/assets/css/home.css" />
  <style>
button {
    width:130px;
    border-radius:5px;
    padding:7px;
    background:#222;
    color:#fff;
    border:none;
    appearance:none;
    font-family:'Inter',sans-serif;
    text-align:center;
}
  </style>
</head>

<body>
<div align="center">
<h1>what do you wanna do?</h1>
<button onclick="window.location.href='/tab.html?autofill=https://soundcloud.com'">listen to music</button>
<button onclick="window.location.href='/tab.html?autofill=https://cineby.gd'">watch movies</button>
</div>
</body>
</html>
`);
document.close();
