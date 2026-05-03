import config from "./config/index.js";
import { Player } from "./entities/Player.js";
import { RenderSystem } from "./systems/RenderSystem.js";
import { ImageManager } from "../managers/ImageManager.js";

export class Game {
	constructor() {
		this.canvas = document.getElementById("gameCanvas");
		this.ctx = this.canvas.getContext("2d");

		this.imageManager = new ImageManager();
		this.imageManager.loadAll();

		this.renderSystem = new RenderSystem(this.canvas, this.imageManager);

		this.keys = {};

		this.lastTime = 0;

		this.player = new Player(
			config.screen.width / 2 - config.player.width / 2,
			config.screen.height/ 2 - config.player.height / 2,
			config.player.width,
			config.player.height,
			config.player.color,
			config.player.movement.speed,
		);

		this._init();
	}

	_init() {
		this._resizeCanvas();
		this._setupInput();
		this.timestamp = performance.now();

		window.addEventListener('resize', this._resizeCanvas.bind(this));

		// window.addEventListener('resize', () => this._resizeCanvas()); //
		requestAnimationFrame((t) => this._gameLoop(t));
	}

	update(dt) {
		this.player.update(this.keys, dt);
	}

	_setupInput() {
		window.addEventListener('keydown', (e) => {
			this.keys[e.key.toLowerCase()] = true;
			console.log(this.keys)
		});

		window.addEventListener('keyup', (e) => {
			this.keys[e.key.toLowerCase()] = false;
		});

		//🐛 prevent from player movement stuck on context menu open
		window.addEventListener('contextmenu', () => {
			this.keys = {};
		});

		//🐛 prevent from player movement stuck on tab switch
		window.addEventListener('blur', () => {
			this.keys = {};
		});
	}

	_resizeCanvas() {
		const { margin, width, height, ratio } = config.screen;
		let w, h;

		const availableWidth = window.innerWidth - margin * 2;
		const availableHeight = window.innerHeight - margin * 2;

		// The below calculation is based on screen ration it should be adjusted accordingly
		// TODO: refactor to decide based on the ratio
		if (availableWidth/availableHeight > ratio) {
			// the window is too wide (landscape) we are limited by height
			h = availableHeight;
			w = h * ratio;
		} else {
			// the window is too tall (portrait || square) we are limited by width
			w = availableWidth;
			h = w / ratio;
		}

		this.canvas.width = width;
		this.canvas.height = height;

		this.canvas.style.width = w + 'px';
		this.canvas.style.height = h + 'px';
		this.canvas.style.margin = margin + 'px';

	}

	_gameLoop(timestamp) {
		const dt = Math.min((timestamp - this.lastTime) / 1000, 0.1);
		this.lastTime = timestamp;
		this.update(dt);
		this.renderSystem.render(
			this.player,
		);

		requestAnimationFrame((t) => this._gameLoop(t));
	}

}