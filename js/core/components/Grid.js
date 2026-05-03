import config from "../config/index.js";

export class Grid {
	constructor(ctx) {
		this._ctx = ctx;
	}

	render() {
		const {width, height } = config.screen;
		const {lineWidth, gridSize, color } = config.grid;

		this._ctx.strokeStyle = color;
		this._ctx.lineWidth = lineWidth;
		this._ctx.beginPath();
		for (let i = 0; i < width; i += gridSize) {
			this._ctx.moveTo(i, 0);
			this._ctx.lineTo(i, height);
		}
		for (let i = 0; i < height; i += gridSize) {
			this._ctx.moveTo(0, i);
			this._ctx.lineTo(width,i);
		}
		this._ctx.stroke()
	}
}