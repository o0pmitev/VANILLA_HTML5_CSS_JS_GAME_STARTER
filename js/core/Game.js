import config from "./config/index.js";

export class Game {
	constructor() {
		this.canvas = document.getElementById("gameCanvas");
		this.ctx = this.canvas.getContext("2d");
		this._init();
	}

	_init() {
		this._resizeCanvas();
		window.addEventListener('resize', this._resizeCanvas.bind(this));
		// window.addEventListener('resize', () => this._resizeCanvas()); //

		requestAnimationFrame((t) => this._gameLoop(t));
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

	_gameLoop(t) {
		// console.log('Seconds: ' + Math.ceil(t / 1000));
		this._render();
		requestAnimationFrame((t) => this._gameLoop(t));
	}

	_render() {
		// Clears the screen on each frame update
		this.ctx.fillStyle = config.screen.bgColor;
		this.ctx.fillRect(0, 0, config.screen.width, config.screen.height);
	}
}