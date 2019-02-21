class Input {
  inputBuffer = "";
  keyBuffer = {};
  actionMap = {};
  instantActionMap = {};
  rate;
  tempActionMap = {};
  tempInstantActionMap = {};
  lastUpdate = new Date();
  skip = false;

  constructor(obj, rate = 200) {
    this.rate = rate;
    this.doubleRate = rate * 2;

    obj.addEventListener("keydown", (e) => {
      this.keyBuffer[e.code] = true;

      if (e.code === "Enter") this.inputBuffer = "";
      else this.inputBuffer += e.key;

      this.dispatchActions();
      this.skip = true;
    });

    obj.addEventListener("keyup", (e) => {
      this.keyBuffer[e.code] = false;
    });

    obj.setInterval(() => this.dispatchActions(), this.rate);
  }

  dispatchActions() {
    // Prevent double-stepping and auto-speed
    if (this.skip) {
      this.skip = false;
      return;
    }

    Object.entries(this.keyBuffer).map((key) => {
      if (!key[1]) return;
      const action = this.actionMap[key[0]];
      if (action) action();
    });
  }

  dispatchInstantActions() {
    Object.entries(this.keyBuffer).map((key) => {
      if (!key[1]) return;
      const action = this.instantActionMap[key[0]];
      if (action) action();
    });
  }

  setAction(code, callback) {
    this.actionMap[code] = callback;
  }

  removeAction(code) {
    this.actionMap[code] = null;
  }

  setActions(actions) {
    this.actionMap = actions;
  }

  yesNo(out, x, y, question, callback) {
    let selection = false;

    out.print(x, y, `${ question } (A-D)`);
    out.print(x, y + 2, " Yes   [No]");

    const parent = this;
    const temp = {};
    Object.assign(temp, this.actionMap);

    this.setActions({
      KeyD() {
        out.print(x, y + 2, " Yes   [No]");
        out.push();
        selection = false;
      },
      KeyA() {
        selection = true;
        out.print(x, y + 2, "[Yes]   No ");
        out.push();
      },
      Enter() {
        parent.setActions(temp);
        callback(selection);
      }
    });
  }
}