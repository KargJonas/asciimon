class Input {
  inputBuffer = "";
  keyBuffer = {};
  actionMap = {};
  rate;
  tempActionMap = {};
  lastUpdate = new Date();
  skip = false;
  keyDownFuncs = [];

  constructor(obj, rate = 200) {
    this.rate = rate;
    this.doubleRate = rate * 2;

    obj.addEventListener("keydown", (e) => {
      this.keyBuffer[e.code] = true;
      this.dispatchActions();

      if (e.code === "Enter") this.inputBuffer = "";
      else if (e.key.length === 1) this.inputBuffer += e.key;

      this.keyDownFuncs.map(func => func(e));

      this.skip = true;
    });

    obj.addEventListener("keyup", (e) => {
      this.keyBuffer[e.code] = false;
    });

    obj.setInterval(() => this.dispatchActions(), this.rate);
  }

  dispatchActions() {
    // Prevent double-stepping and auto-clicking
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

  keyDown(func) {
    this.keyDownFuncs.push(func);
  }

  disableActions() {
    this.tempActionMap = {};
    Object.assign(this.tempActionMap, this.actionMap);
    this.actionMap = {};
  }

  enableActions() {
    this.actionMap = this.tempActionMap;
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

  async yesNo(out, x, y, question) {
      let selection = false;

      out.print(x, y, `${ question } (A-D)`);
      out.print(x, y + 2, " Yes   [No]");

      const parent = this;
      this.disableActions();

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
          parent.enableActions();
          return selection; // !! WRONG!
        }
      });

      out.push();
  }

  text(out, x, y, question) {
    return new Promise((resolve) => {
      out.print(x, y, question);

      const parent = this;
      this.disableActions();

      this.setActions({
        Enter() {
          parent.enableActions();
          window.clearInterval(cursorInterval);
          resolve(parent.inputBuffer);
        },
        Backspace() {
          parent.inputBuffer = parent.inputBuffer.slice(
            0, parent.inputBuffer.length - 1);
        }
      });

      const spaceLine = " ".repeat(COLS - 2);

      this.keyDown(() => {
        out.print(1, y + 2, spaceLine);
        out.print(x, y + 2, parent.inputBuffer);
        out.push();
      });

      let cursorState = true;

      let cursorInterval = window.setInterval(() => {
        cursorState = !cursorState;
        out.print(x + this.inputBuffer.length, y + 2, cursorState ? "░" : " ");
        out.push();
      }, 500);

      out.push();
    });
  }
}