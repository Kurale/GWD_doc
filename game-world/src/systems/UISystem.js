export class UISystem {
  constructor(statusNode) {
    this.statusNode = statusNode;
    this.message = '';
    this.hint = '';
    this.coins = 0;
  }

  setMessage(message) {
    this.message = message;
  }

  setHint(hint) {
    this.hint = hint;
  }

  setCoins(value) {
    this.coins = value;
  }

  render(state) {
    const petStatus = state.hasPet ? 'Питомец: с вами' : 'Питомец: не заведён';
    const hintText = this.hint ? ` | ${this.hint}` : '';
    const messageText = this.message ? ` | ${this.message}` : '';
    this.statusNode.textContent = `${state.levelName} | Монеты: ${this.coins} | ${petStatus}${hintText}${messageText}`;
  }
}
