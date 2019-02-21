class Output {
  cols = 0;
  rows = 0;
  buffer = null;
  element = null;


  constructor(domElement, cols, rows) {
    this.cols = cols;
    this.rows = rows;
    this.element = document.querySelector(domElement);
  }

  createBuffer(content) {
    this.buffer = [];

    for (let y = 0; y < this.rows; y++) {
      this.buffer[y] = [];
      for (let x = 0; x < this.cols; x++) {
        this.buffer[y][x] = content;
      }
    }
  }

  push() {
    this.element.innerHTML = this.buffer
      .map(row => row.join(""))
      .join("<br>")
      .replace(/ /g, "&nbsp;");
  }

  set(x, y, content) {
    this.buffer[y][x] = content;
  }

  print(x, y, content) {
    this.buffer[y].splice(x, content.length, ...content.split(""));
  }
}