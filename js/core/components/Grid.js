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
		for (let i = 0; i < width; i += gridSize) {
			this._ctx.beginPath();
			this._ctx.moveTo(i, 0);
			this._ctx.lineTo(i, height);
			this._ctx.stroke()
		}
		for (let i = 0; i < height; i += gridSize) {
			this._ctx.beginPath();
			this._ctx.moveTo(0, i);
			this._ctx.lineTo(width,i);
			this._ctx.stroke()
		}
	}
}