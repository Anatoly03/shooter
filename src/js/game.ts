
import { createWorld, addEntity, addComponent, pipe, defineQuery, removeEntity } from 'bitecs'
import { ctx, width, height, keys, DEBUG_MODE, FPS } from "./app"
import { Acc, Bullet, Player, Point, Pos, Size, Vel } from './comps'
import blts from './_bullets'
import physics from './physics'

export const world = createWorld()

const bullets = defineQuery([Bullet, Pos, Size])
const points = defineQuery([Point, Pos, Size])

export const game = {
	init() {
		world.pid = addEntity(world)
		addComponent(world, Player, world.pid)
		addComponent(world, Pos, world.pid)
		addComponent(world, Size, world.pid)
		addComponent(world, Vel, world.pid)

		Pos.x[world.pid] = .5
		Pos.y[world.pid] = .5

		Size.r[world.pid] = .005

		this.spawn()
	},

	async spawn() {
		let n = 10 //Math.floor(Math.random() * blts.length)
		//console.log(n)
		await blts[n](world)
		requestAnimationFrame(this.spawn.bind(this))
		//this.spawn.bind(this)()
	},

	update() {
		let x = (keys['a'] || keys['arrowleft'] ? -1 : 0) + (keys['d'] || keys['arrowright'] ? 1 : 0)
		let y = (keys['w'] || keys['arrowup'] ? -1 : 0) + (keys['s'] || keys['arrowdown'] ? 1 : 0)

		Vel.x[world.pid] = (keys['x'] ? .002 : .007) * x
		Vel.y[world.pid] = (keys['x'] ? .002 : .007) * y

		physics(world)
	},

	render() {
		let size = Math.min(width, height)

		// Background
		ctx.fillStyle = 'black'
		ctx.fillRect(0, 0, width, height)

		// Game Content

		ctx.fillStyle = 'green'
		ctx.beginPath()
		ctx.arc(Pos.x[world.pid] * size, Pos.y[world.pid] * size, Size.r[world.pid] * size, 0, 2 * Math.PI)
		ctx.fill()

		ctx.fillStyle = '#05052f'
		const point_array = points(world)
		for (let i = 0; i < point_array.length; i++) {
			let eid = point_array[i]
			ctx.beginPath()
			ctx.arc(Pos.x[eid] * size, Pos.y[eid] * size, Size.r[eid] * size, 0, 2 * Math.PI)
			ctx.fill()
		}

		ctx.fillStyle = 'red'
		const bullet_array = bullets(world)
		for (let i = 0; i < bullet_array.length; i++) {
			let eid = bullet_array[i]
			ctx.beginPath()
			ctx.arc(Pos.x[eid] * size, Pos.y[eid] * size, Size.r[eid] * size, 0, 2 * Math.PI)
			ctx.fill()
		}

		ctx.textAlign = 'right'
		ctx.textBaseline = 'bottom'
		ctx.fillStyle = 'white'
		ctx.font = '20px Righteous'
		ctx.fillText("" + Math.round(FPS), size - 5, size - 5)

		//
		// UI
		//

		// Clip
		ctx.fillStyle = 'black'
		if (width > height)
			ctx.fillRect(size, 0, width - size, height)
		else
			ctx.fillRect(0, size, width, height - size)

		// Gamescreen Border
		ctx.strokeStyle = 'white'
		ctx.lineWidth = 2
		ctx.strokeRect(0, 0, size, size)

		// Text
		ctx.fillStyle = 'white'
		ctx.font = '20px Righteous'
		ctx.textAlign = 'left'
		ctx.textBaseline = 'middle'

	},

	onKeyDown(event: KeyboardEvent) {
		//
	},

	onClick(event: MouseEvent) {
		//
	},

	onMouseMove(event: MouseEvent) {
		//
	}
}

