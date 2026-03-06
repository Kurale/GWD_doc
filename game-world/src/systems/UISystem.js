export class UISystem {
  constructor(statusNode) {
    this.statusNode = statusNode;
    this.message = '';
    this.coins = 0;
  }

  setMessage(message) {
    this.message = message;
  }

  setCoins(value) {
    this.coins = value;
  }

  render(state) {
    const petStatus = state.hasPet ? 'Питомец: с вами' : 'Питомец: не заведён';
    this.statusNode.textContent = `${state.levelName} | Монеты: ${this.coins} | ${petStatus}${this.message ? ` | ${this.message}` : ''}`;
  }
}
