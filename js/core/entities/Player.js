import config from "../config/index.js";
export class Player {
	constructor(x, y, width, height, color, speed) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.color = color;
		this.speed = speed;
	}

	update(keys, dt) {
		let dx = 0;
		let dy = 0;

		if (keys['w'] || keys['arrowup']) dy -= 1;
		if (keys['s'] || keys['arrowdown']) dy += 1;
		if (keys['a'] || keys['arrowleft']) dx -= 1;
		if (keys['d'] || keys['arrowright']) dx += 1;

		if (dx || dy) {
			const len = Math.sqrt(dx * dx + dy * dy); //Normalize diagonal movement with Pythagorean theorem https://en.wikipedia.org/wiki/Pythagorean_theorem

			dy /= len;
			dx /= len;

			this.x += dx * this.speed * dt;
			this.y += dy * this.speed * dt;
		}

		this.x = Math.min(config.screen.width - this.width, this.x);
		this.x = Math.max(this.x, 0);
		this.y = Math.min(this.y, config.screen.height - this.height);
		this.y = Math.max(this.y, 0);
	}
}