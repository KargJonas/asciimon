class Input {
  inputBuffer = "";
  keyBuffer = {};
  actionMap = {};

  constructor(obj, rate) {
    obj.addEventListener("keydown", (e) => {
      this.keyBuffer[e.code] = true;

      if (e.code === "Enter") this.inputBuffer = "";
      else this.inputBuffer += e.key;
      this.dispatchActions();
    });

    obj.addEventListener("keyup", (e) => {
      this.keyBuffer[e.code] = false;
    });

    obj.setInterval(() => this.dispatchActions(), rate);
  }

  dispatchActions() {
    Object.entries(this.keyBuffer).map((key) => {
      if (!key[1]) return;
      const action = this.actionMap[key[0]];
      if (action) action();
    });
  }

  addAction(code, callback) {
    this.actionMap[code] = callback;
  }

  removeAction(code) {
    this.actionMap[code] = null;
  }

  setActions(actions) {
    this.actionMap = actions;
  }

  yesNo(out, x, y, question) {
    out.print(x, y, `${ question } (A-D)`);
    out.print(x, y + 2, " Yes   [No]");

    const tempActionMap = {};
    Object.assign(tempActionMap, this.actionMap);

    this.setActions({
      KeyD() { out.print(x, y + 2, " Yes   [No]"); out.push() },
      KeyA() { out.print(x, y + 2, "[Yes]   No "); out.push() },

    });
  }
}