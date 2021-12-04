
import { createWorld, addEntity, addComponent, pipe, defineQuery, removeEntity } from 'bitecs'
import { ctx, width, height, keys, DEBUG_MODE, FPS } from "./app"
import { Acc, Bullet, Player, Pos, Size, Vel } from './comps'
import physics from './physics'

export const world = createWorld()

const bullets = defineQuery([Bullet, Pos, Size])

export const game = {
	init() {
		this.pid = addEntity(world)
		addComponent(world, Player, this.pid)
		addComponent(world, Pos, this.pid)
		addComponent(world, Size, this.pid)
		addComponent(world, Vel, this.pid)

		Pos.x[this.pid] = .5
		Pos.y[this.pid] = .5

		Size.r[this.pid] = .005

		this.spawn()
	},

	spawn() {
		for (let i = 0; i < Math.random() * 25; i++) {
			let eid = addEntity(world)
			addComponent(world, Bullet, eid)
			addComponent(world, Pos, eid)
			addComponent(world, Size, eid)
			addComponent(world, Vel, eid)
			addComponent(world, Acc, eid)

			Pos.x[eid] = Math.random()
			Pos.y[eid] = 0

			Acc.x[eid] = (Math.random() - .5) * .0001
			Acc.y[eid] = Math.random() * .00005

			Size.r[eid] = .005
		}

		setTimeout(this.spawn.bind(this), 200)
	},

	update() {
		let x = (keys['a'] || keys['left'] ? -1 : 0) + (keys['d'] || keys['right'] ? 1 : 0)
		let y = (keys['w'] || keys['up'] ? -1 : 0) + (keys['s'] || keys['down'] ? 1 : 0)

		Vel.x[this.pid] = (keys['x'] ? .002 : .005) * x
		Vel.y[this.pid] = (keys['x'] ? .002 : .005) * y

		physics(world)
	},

	render() {
		let offset = 50
		let size = Math.min(width, height) - 2 * offset

		// Background
		ctx.fillStyle = 'black'
		ctx.fillRect(0, 0, width, height)

		// Game Content

		ctx.fillStyle = 'green'
		ctx.beginPath()
		ctx.arc(offset + Pos.x[this.pid] * size, offset + Pos.y[this.pid] * size, Size.r[this.pid] * size, 0, 2 * Math.PI)
		ctx.fill()

		ctx.fillStyle = 'red'
		const bullet_array = bullets(world)
		for (let i = 0; i < bullet_array.length; i++) {
			let eid = bullet_array[i]
			ctx.beginPath()
			ctx.arc(offset + Pos.x[eid] * size, offset + Pos.y[eid] * size, Size.r[eid] * size, 0, 2 * Math.PI)
			ctx.fill()
		}

		ctx.textAlign = 'right'
		ctx.textBaseline = 'bottom'
		ctx.fillStyle = 'white'
		ctx.font = '20px Righteous'
		ctx.fillText("" + Math.round(FPS), size + offset - 5, size + offset - 5)

		//
		// UI
		//

		// Clip
		ctx.fillStyle = 'black'
		ctx.fillRect(0, 0, offset, height) // left
		ctx.fillRect(0, 0, width, offset) // top
		ctx.fillRect(0, height - offset, width, offset) // bottom
		ctx.fillRect(offset + size, 0, width - offset - size, height) // right

		// Gamescreen Border
		ctx.strokeStyle = 'white'
		ctx.lineWidth = 2
		ctx.strokeRect(offset, offset, size, size)

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

