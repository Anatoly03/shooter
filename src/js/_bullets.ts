import { addComponent, addEntity, IWorld } from "bitecs";
import { Acc, Bullet, Player, Pos, Size, Vel } from './comps'

export default [

	/*
	 * CIRCLE ATTACK
	 */

	async (world: IWorld) => {
		const amount = 16

		let entities = []

		for (let i = 0; i < amount; i++) {
			let eid = addEntity(world)
			entities.push(eid)

			addComponent(world, Bullet, eid)
			addComponent(world, Pos, eid)
			addComponent(world, Size, eid)

			Pos.x[eid] = .5 + Math.sin(i / amount * 2 * Math.PI) * .3
			Pos.y[eid] = .5 + Math.cos(i / amount * 2 * Math.PI) * .3
			Size.r[eid] = .005

			await wait(100)
		}

		await wait(100)

		for (let i = 0; i < entities.length; i++) {
			let eid = entities[i]
			addComponent(world, Vel, eid)
			addComponent(world, Acc, eid)

			Acc.x[eid] = - Math.sin(i / amount * 2 * Math.PI) * .0001
			Acc.y[eid] = - Math.cos(i / amount * 2 * Math.PI) * .0001
		}

		await wait(1000)

		return world
	},

	/*
	 * RANDOMNESS FROM TOP 
	 */

	async (world: IWorld) => {

		let amount = Math.random() * 500

		for (let i = 0; i < amount; i++) {
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

			await wait(Math.random() * 30)
		}

		await wait(2000)

		return world
	},

	/*
	 * RAIN
	 */

	async (world: IWorld) => {

		let amount = Math.random() * 300

		for (let i = 0; i < amount; i++) {
			let eid = addEntity(world)
			addComponent(world, Bullet, eid)
			addComponent(world, Pos, eid)
			addComponent(world, Size, eid)
			addComponent(world, Vel, eid)

			Pos.x[eid] = Math.random() * 2
			Pos.y[eid] = 0

			Vel.x[eid] = -.005
			Vel.y[eid] = .01

			Size.r[eid] = .005

			await wait(Math.random() * 30)
		}

		await wait(2000)

		return world
	},

	/*
	 * FIRE RING
	 */

	async (world: IWorld) => {
		let amount = 50
		let radius = .05

		let entities = []

		for (let j = 0; j < amount * 5; j++) {
			for (let i of [j, j + amount * .5]) {
				let eid = addEntity(world)
				entities.push(eid)

				addComponent(world, Bullet, eid)
				addComponent(world, Pos, eid)
				addComponent(world, Size, eid)

				Pos.x[eid] = .5 + Math.sin(i / amount * 2 * Math.PI) * radius
				Pos.y[eid] = .5 + Math.cos(i / amount * 2 * Math.PI) * radius
				Size.r[eid] = .005

				await wait(200 / (i + 1))

				setTimeout(() => {
					addComponent(world, Vel, eid)
					addComponent(world, Acc, eid)

					Acc.x[eid] = (Math.random() - .5) * .0001
					Acc.y[eid] = (Math.random() - .5) * .0001
				}, 200)
			}
		}

		await wait(2000)

		return world
	},

]

async function wait(ms: number) {
	return new Promise(resolve => {
		setTimeout(resolve, ms)
	})
}