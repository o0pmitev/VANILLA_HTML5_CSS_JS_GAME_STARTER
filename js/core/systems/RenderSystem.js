import config from "../config/index.js";

export class RenderSystem {
	constructor(canvas) {
		this._canvas = canvas;
		this._ctx = canvas.getContext('2d');
	}

	render() {
		// Clears the screen on each frame update
		this._ctx.fillStyle = config.screen.bgColor;
		this._ctx.fillRect(0, 0, config.screen.width, config.screen.height);
	}
}