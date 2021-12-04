
import { game } from './game'

export let DEBUG_MODE: boolean

export let width: number
export let height: number
export let canvas: HTMLCanvasElement
export let ctx: CanvasRenderingContext2D
export let keys: { [key: string]: boolean; } = {}

let lastCalledTime = Date.now();
let delta = 0;
export let FPS = 0;

export let app = {
	setup() {
		canvas = <HTMLCanvasElement>document.getElementById('canvas')
		this.update()
		this.updateFPS()
		this.addEventLiteners()
		game.init()
	},
	update() {
		width = canvas.width = window.innerWidth
		height = canvas.height = window.innerHeight
		ctx = canvas.getContext("2d")
		ctx.imageSmoothingEnabled = false
	},
	updateFPS() {
		FPS = 1 / delta
		setTimeout(() => {
			this.updateFPS()
		}, 100)
	},
	gameLoop() {
		delta = (Date.now() - lastCalledTime) / 1000;
		lastCalledTime = Date.now();
		requestAnimationFrame(this.gameLoop.bind(this))
		this.update()
		game.update()
		game.render()
	},
	addEventLiteners() {
		// document.addEventListener('mouseover', event => {})

		document.addEventListener('keydown', event => {
			game.onKeyDown(event)
			keys[event.key.toLowerCase()] = true
			if (keys['f3']) {
				DEBUG_MODE = !DEBUG_MODE
			}
		})

		document.addEventListener('keyup', event => {
			delete keys[event.key.toLowerCase()]
		})

		document.addEventListener('click', event => {
			game.onClick(event)
		})

		/*document.addEventListener('mousedown', event => {
			//
		})

		document.addEventListener('mouseup', event => {
			//
		})

		document.addEventListener('mousemove', event => {
			//game.onClick(event)
			game.onMouseMove(event)
		})*/


	}
}

window.onload = () => {
	app.setup()
	app.gameLoop()
}
