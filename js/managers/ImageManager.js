export class ImageManager { 
	constructor() {
		this.images = {};
	}

	load(name, path){
		return new Promise((resolve) => {
			const img = new Image();
			img.src = path;

			this.images[name] = { img, loaded: false};

			img.onload = () => {
				this.images[name].loaded = true;
				console.log('Image loaded: ${name}');
				resolve();
			}

			img.onerror = (name) => {
				console.log(`Image failes: ${name} (will use fallback)`)
				resolve(); //Resolve here if we have fallback for assets loading
			}
		});
	}

	get(name){
		return this.images[name]?.loaded ? this.images[name].img : null;
	}

	async loadAll(){
		await Promise.all([
			this.load('player', './assets/sprites/person.png'),
		]);
		await new Promise(resolve => setTimeout(resolve, 2000));
	}
}