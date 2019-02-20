// Tileset:
/*
  ▓
  ▒
  ░
  ╠
  ╣
  ║
  ╗
  ╚
  ╝
  ╔
  ╩
  ═
*/

const COLS = 47;
const ROWS = 29;

const out = new Output("#container", COLS, ROWS);
const maps = {};

function loadMap(name, callback) {
  fetch(`maps/${ name }`)
    .then(res => res.text())
    .then(item => {
      maps[name] = item
        .split("\n")
        .map(row => row.split(""));
    })
    .then(callback);
}

out.createBuffer(0);

function drawBorder() {
  const hLine = "═".repeat(COLS - 2);
  out.print(0, 0, `╔${ hLine }╗`);
  out.print(0, ROWS - 1, `╚${ hLine }╝`);

  for (let y = 1; y < ROWS - 1; y++) {
    out.set(0, y, "║");
    out.set(COLS - 1, y, "║");
  }
}

const player = {
  x: 10,
  y: -10,
  char: "@"
};

const keymap = {
  w: () => player.y--,
  a: () => player.x--,
  s: () => player.y++,
  d: () => player.x++,
};

window.addEventListener("keydown", (e) => {
  const op = keymap[e.key];
  if (!op) return;
  op();
});

function drawMap(offsetX, offsetY, map) {
  for (let y = 1; y < ROWS - 1; y++) {
    for (let x = 1; x < COLS - 1; x++) {
      const row = map[y + offsetY];

      if (!row) {
        out.set(x, y, " ");
      } else {
        out.set(x, y, row[x + offsetX] || " ");
      }
    }
  }
}

function draw() {
  window.requestAnimationFrame(draw);

  drawMap(player.x, player.y, maps.grasslands);
  out.set(23, 14, player.char);

  out.push();
}

drawBorder();

loadMap("grasslands", draw);