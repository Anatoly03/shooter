
import { createWorld, addEntity, addComponent, pipe, defineQuery, removeEntity, hasComponent } from 'bitecs'
import { ctx, width, height, keys, DEBUG_MODE, FPS } from "./app"
import { Acc, ActiveBullet, Asset, Bullet, Player, Point, Pos, Size, Vel } from './comps'
import blts from './_bullets'
import physics from './physics'

import config from './assets.json'

export const world = createWorld()

let debug_mode = true

const assets = defineQuery([Asset])
const bullets = defineQuery([Bullet, Pos, Size])
const points = defineQuery([Point, Pos, Size])

export const game = {
	img: new Image(),

	init() {
		this.img.src = `assets/touhou.png`

		world.pid = addEntity(world)
		addComponent(world, Player, world.pid)
		addComponent(world, Pos, world.pid)
		addComponent(world, Size, world.pid)
		addComponent(world, Vel, world.pid)

		Pos.x[world.pid] = .5
		Pos.y[world.pid] = .8

		Size.r[world.pid] = .005

		this.spawn()
	},

	async spawn() {
		let n = 16 // Math.floor(Math.random() * blts.length) // 13
		console.log(n)
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

		// Game Content

		if (debug_mode) {
			ctx.fillStyle = '#05052f'
			const point_array = points(world)
			for (let i = 0; i < point_array.length; i++) {
				let eid = point_array[i]
				ctx.beginPath()
				ctx.arc(Pos.x[eid] * size, Pos.y[eid] * size, Size.r[eid] * size, 0, 2 * Math.PI)
				ctx.fill()
			}

			const bullet_array = bullets(world)
			for (let i = 0; i < bullet_array.length; i++) {
				let eid = bullet_array[i]

				if (hasComponent(world, ActiveBullet, eid))
					ctx.fillStyle = '#ff0000'
				else
					ctx.fillStyle = '#3f0000'

				ctx.beginPath()
				ctx.arc(Pos.x[eid] * size, Pos.y[eid] * size, Size.r[eid] * size, 0, 2 * Math.PI)
				ctx.fill()
			}

			ctx.fillStyle = 'green'
			ctx.beginPath()
			ctx.arc(Pos.x[world.pid] * size, Pos.y[world.pid] * size, Size.r[world.pid] * size, 0, 2 * Math.PI)
			ctx.fill()

			// Draw assets (BELOW) only of half transparency
			ctx.globalAlpha = 0.5
		}

		let a = assets(world)
		for (let i = 0; i < a.length; i++) {
			let eid = a[i]
			if (Asset.id[eid] == 0) continue
			let data = config[Asset.id[eid] - 1]

			let x = Pos.x[eid] * size - data.d[2] * .5
			let y = Pos.y[eid] * size - data.d[3] * .5

			ctx.drawImage(this.img,
				data.d[0], data.d[1], data.d[2], data.d[3],
				x, y, data.d[2], data.d[3]
			)
		}

		ctx.globalAlpha = 1

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
		if (event.key == 'F3') debug_mode = !debug_mode
	},

	onClick(event: MouseEvent) {
		//
	},

	onMouseMove(event: MouseEvent) {
		//
	}
}

