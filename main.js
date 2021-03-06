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
let currentMap;

out.createBuffer(0);

function drawBorder() {
  const hLine = "═".repeat(COLS - 2);
  out.print(0, 0, `╔${ hLine }╗`);
  out.print(0, ROWS - 1, `╚${ hLine }╝`);
  // out.print(17, 0, `╣ ASCIIMON ╠`);
  out.print(2, 0, `╣ ASCIIMON v0.1 ╠`);

  for (let y = 1; y < ROWS - 1; y++) {
    out.set(0, y, "║");
    out.set(COLS - 1, y, "║");
  }
}

const player = {
  x: 10,
  y: -10,
  char: "@",
  speed: 1
};

const input = new Input(window, 120);

input.setActions({
  KeyW() { player.y -= player.speed },
  KeyA() { player.x -= player.speed },
  KeyS() { player.y += player.speed },
  KeyD() { player.x += player.speed },
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

function tp(x, y) {
  player.x = x;
  player.y = y;
  console.log("woosh!");
}

function draw() {
  window.requestAnimationFrame(draw);

  drawMap(player.x, player.y, currentMap);
  out.set(23, 14, player.char);
  out.print(2, ROWS - 1, `╣ x:${ player.x } y:${ player.y } ╠═════`);

  out.push();
}

drawBorder();
MapLoader.load("maps/grasslands", true, (map) => {
  currentMap = map;
  draw();
});