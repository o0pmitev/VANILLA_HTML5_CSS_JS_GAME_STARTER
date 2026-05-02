import config from "../config/index.js";
import { Grid } from "../components/Grid.js";
export class RenderSystem {
	constructor(canvas, imageManager) {
		this.imageManager = imageManager;
		this._canvas = canvas;
		this._ctx = canvas.getContext('2d');
		this._ctx.imageSmoothingEnabled = false; // Prevent the browser from blurring the graphics good for pixel art

		this.grid = new Grid(this._ctx);
	}

	render(player) {
		// Clears the screen on each frame update
		this._ctx.fillStyle = config.screen.bgColor;
		this._ctx.fillRect(0, 0, config.screen.width, config.screen.height);

		this.grid.render();
		this.renderPlayer(player);
	}

	renderPlayer(player) {
		const playerImage = this.imageManager.get('player');
		if (playerImage) {
			this._ctx.drawImage(playerImage, player.x, player.y, playerImage.width, playerImage.height);
		} else {
			this._ctx.fillStyle = player.color;
			this._ctx.fillRect(player.x, player.y, player.width, player.height);
		}
	}
}