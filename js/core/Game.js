import config from "./config/index.js";
import { Player } from "./entities/Player.js";
import { RenderSystem } from "./systems/RenderSystem.js";
import { ImageManager } from "../managers/ImageManager.js";

const STATES = {
	MENU: 'menu',
	PLAY: 'play',
	PAUSED: 'paused',
}

const BUTTONS = {
	PLAY: 'playBtn',
	RESUME: 'resumeBtn',
	QUIT: 'quitBtn',
}

const MENU_SCREENS = {
	LOADING: 'loadingScreen',
	MAIN: 'mainMenu',
	PAUSE: 'pauseMenu',
}
export class Game {
	constructor() {
		this.canvas = document.getElementById("gameCanvas");
		this.ctx = this.canvas.getContext("2d");

		this.imageManager = new ImageManager();

		this.renderSystem = new RenderSystem(this.canvas, this.imageManager);

		this.keys = {};

		this.lastTime = 0;

		this.state = STATES.MENU;

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

	async _init() {
		await Promise.all([
			this.imageManager.loadAll(),
		]);

		document.getElementById(MENU_SCREENS.LOADING).classList.remove('active');
		document.getElementById(MENU_SCREENS.MAIN).classList.add('active');

		this._resizeCanvas();
		this._setupInput();
		this._setupUI();
		this.timestamp = performance.now();

		window.addEventListener('resize', this._resizeCanvas.bind(this));

		// window.addEventListener('resize', () => this._resizeCanvas()); //
		requestAnimationFrame((t) => this._gameLoop(t));
	}

	_update(dt) {
		if (this.state !== STATES.PLAY) return;
		this.player.update(this.keys, dt);
	}

	_render() {
		if (this.state === STATES.MENU) {
			this.ctx.fillStyle = config.screen.bgColor;
			this.ctx.fillRect(0, 0, config.screen.width, config.screen.height);
		} else {
			this.renderSystem.render(
				this.player,
			);
		}
	}

	_setupUI() {
		document.getElementById(BUTTONS.PLAY).onclick = () => this._startGame();
		document.getElementById(BUTTONS.RESUME).onclick = () => this._resume();
		document.getElementById(BUTTONS.QUIT).onclick = () => this._quitToMenu();

	}

	_pause() {
		this.state = STATES.PAUSED;
		document.getElementById(MENU_SCREENS.PAUSE).classList.add('active');
	}


	_resume() {
		this.state = STATES.PLAY;
		document.getElementById(MENU_SCREENS.PAUSE).classList.remove('active');
	}


	_quitToMenu() {
		this._returnToMenu();
	}


	_returnToMenu() {
		this.state = STATES.MENU;
		this._hideAllPanels();
		document.getElementById(MENU_SCREENS.MAIN).classList.add('active');
	}

	_hideAllPanels() {
		document.querySelectorAll(".ui-panel").forEach(p => p.classList.remove("active"));
	}

	_startGame() {
		this._reset();
		this.state = STATES.PLAY;
		this._hideAllPanels();
	}

	_setupInput() {
		window.addEventListener('keydown', (e) => {

			if (e.key === 'Escape') {
				if (this.state === STATES.PLAY) {
					this._pause();
				} else if (this.state === STATES.PAUSED) {
					this._resume();
				}
			}

			this.keys[e.key.toLowerCase()] = true;
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
		if (this.lastTime === 0) {
			this.lastTime = timestamp;
		}

		const dt = Math.min((timestamp - this.lastTime) / 1000, 0.1);
		this.lastTime = timestamp;
		this._update(dt);
		this._render();
		requestAnimationFrame((t) => this._gameLoop(t));
	}

	_reset() {
		this.player.reset();
		this.lastTime = performance.now();
	}
}