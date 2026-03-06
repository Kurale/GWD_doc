import { Engine } from './core/Engine.js';

const canvas = document.getElementById('game-canvas');
const statusNode = document.getElementById('status-text');

const engine = new Engine({ canvas, statusNode });
window.__ARCADIA_ENGINE__ = engine;
engine.init();
