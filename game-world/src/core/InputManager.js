export class InputManager {
  constructor() {
    this.keys = new Set();
    this.pressedOnce = new Set();

    window.addEventListener('keydown', (event) => {
      if (!this.keys.has(event.code)) {
        this.pressedOnce.add(event.code);
      }
      this.keys.add(event.code);
    });

    window.addEventListener('keyup', (event) => {
      this.keys.delete(event.code);
      this.pressedOnce.delete(event.code);
    });
  }

  isPressed(code) {
    return this.keys.has(code);
  }

  consumePressed(code) {
    if (!this.pressedOnce.has(code)) {
      return false;
    }
    this.pressedOnce.delete(code);
    return true;
  }
}
