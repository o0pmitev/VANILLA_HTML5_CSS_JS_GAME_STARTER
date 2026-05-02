import config from "../config/index.js";
import { Grid } from "../components/Grid.js";
export class RenderSystem {
	constructor(canvas) {
		this._canvas = canvas;
		this._ctx = canvas.getContext('2d');
		this._ctx.imageSmoothingEnabled = false; // Prevent the browser from blurring the graphics good for pixel art

		this.grid = new Grid(this._ctx);
	}

	render() {
		// Clears the screen on each frame update
		this._ctx.fillStyle = config.screen.bgColor;
		this._ctx.fillRect(0, 0, config.screen.width, config.screen.height);

		this.grid.render();
	}
}