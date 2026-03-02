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
  <link rel="stylesheet" href="/assets/css/xtra.css" />
  <style>
  html, body {
    margin: 0;
    padding: 0;
    height: 100%;
}
  body {
    margin: 0;
  }
button {
    width:auto;
    border-radius:5px;
    padding:10px;
    background:var(--button);
    color:var(--color);
    border:none;
    appearance:none;
    font-family:'Inter',sans-serif;
    text-align:center;
    max-width:200px;
    cursor:pointer;
}

.gridthing {
    width: 100%;
    height: 100%;
    background:
        repeating-linear-gradient(60deg,
            #fff3 0 1px,
            transparent 1px 40px),
        repeating-linear-gradient(-60deg,
            #fff3 0 1px,
            transparent 1px 40px);
}

body[theme="light"] .gridthing {
    background:
        repeating-linear-gradient(60deg,
            #0002 0 1px,
            transparent 1px 40px),
        repeating-linear-gradient(-60deg,
            #0002 0 1px,
            transparent 1px 40px);
}

body[theme="midnight"] .gridthing {
  background:
    repeating-linear-gradient(60deg,
      rgba(80, 140, 255, 0.15) 0 1px,
      transparent 1px 40px),
    repeating-linear-gradient(-60deg,
      rgba(80, 140, 255, 0.15) 0 1px,
      transparent 1px 40px);
}

body[theme="pisscolorlmao"] .gridthing {
  background:
    repeating-linear-gradient(60deg,
      rgba(173, 173, 67, 0.18) 0 1px,
      transparent 1px 40px),
    repeating-linear-gradient(-60deg,
      rgba(173, 173, 67, 0.18) 0 1px,
      transparent 1px 40px);
}

body[theme="gradientblue"] .gridthing {
  background:
    repeating-linear-gradient(60deg,
      rgba(73, 153, 219, 0.18) 0 1px,
      transparent 1px 40px),
    repeating-linear-gradient(-60deg,
      rgba(73, 153, 219, 0.18) 0 1px,
      transparent 1px 40px);
}
body[theme="eww"] .gridthing {
  background:
    repeating-linear-gradient(60deg,
      rgba(255, 255, 255, 0.51) 0 1px,
      transparent 1px 40px),
    repeating-linear-gradient(-60deg,
      rgba(255, 255, 255, 0.385) 0 1px,
      transparent 1px 40px);
}
      .pluh {
        margin:0;
        height:100vh;
        width:100vw;
        display:flex;
        align-items:center;
        justify-content:center;
        overflow:hidden;
        }
  </style>
</head>

<body theme="default">
<div align="center">
<div class="pluh">
<div class="gradientthing">
<h1>what do you wanna do?</h1>
<button onclick="window.location.href='/tab.html?autofill=https://soundcloud.com'">listen to music</button>
<button onclick="window.location.href='/tab.html?autofill=https://cineby.gd'">watch movies & tv shows</button>
</div>
</div>
</div>
</body>
<script src="/assets/js/theme.js"></script>
</html>
`);
document.close();
