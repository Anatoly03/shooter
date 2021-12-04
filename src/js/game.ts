
import { createWorld, addEntity, addComponent, pipe, defineQuery, removeEntity } from 'bitecs'
import { ctx, width, height, keys, DEBUG_MODE, FPS } from "./app"
import { Player, Pos, Size, Vec } from './comps'

export const world = createWorld()

export const game = {
	init() {
		this.pid = addEntity(world)
		addComponent(world, Player, this.pid)
		addComponent(world, Pos, this.pid)
		addComponent(world, Size, this.pid)
		addComponent(world, Vec, this.pid)

		Pos.x[this.pid] = .5
		Pos.y[this.pid] = .5

		Size.r[this.pid] = .01
	},

	update() {
		if ((keys['w'] && !keys['s'])) {
			Pos.y[this.pid] -= .004
		} else if (keys['s'] && !keys['w']) {
			Pos.y[this.pid] += .004
			//} else {
			//Control.y[this.pid] = 0
		}

		if (keys['d'] && !keys['a']) {
			Pos.x[this.pid] += .004
		} else if (keys['a'] && !keys['d']) {
			Pos.x[this.pid] -= .004
			//} else {
			//Control.x[this.pid] = 0
		}
	},

	render() {
		ctx.fillStyle = 'black'
		ctx.fillRect(0, 0, width, height)

		ctx.fillStyle = 'green'
		ctx.fillRect(Pos.x[this.pid] * width, Pos.y[this.pid] * height, Size.r[this.pid] * width, Size.r[this.pid] * height)
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

