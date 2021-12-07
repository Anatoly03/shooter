import { addComponent, addEntity, IWorld } from "bitecs";
import { Acc, ActiveBullet, Bullet, Gravity, KillOutside, LimesVel, Player, Pos, Size, Vel } from './comps'

export default [

	/*
	 * CIRCLE ATTACK
	 */

	async (world: IWorld) => {
		const amount = 2 ** Math.floor(Math.random() * 5 + 3)

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

			await wait(2500 / amount)
		}

		await wait(100)

		for (let i = 0; i < entities.length; i++) {
			let eid = entities[i]
			addComponent(world, Vel, eid)
			addComponent(world, Acc, eid)
			addComponent(world, KillOutside, eid)
			addComponent(world, ActiveBullet, eid)

			Acc.x[eid] = - Math.sin(i / amount * 2 * Math.PI) * .0001
			Acc.y[eid] = - Math.cos(i / amount * 2 * Math.PI) * .0001
		}

		await wait(500)

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
			addComponent(world, ActiveBullet, eid)
			addComponent(world, Pos, eid)
			addComponent(world, Size, eid)
			addComponent(world, Vel, eid)
			addComponent(world, Acc, eid)
			addComponent(world, KillOutside, eid)

			Pos.x[eid] = Math.random()
			Pos.y[eid] = 0

			Acc.x[eid] = (Math.random() - .5) * .0001
			Acc.y[eid] = Math.random() * .00005

			Size.r[eid] = .005

			await wait(Math.random() * 30)
		}

		await wait(500)

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
			addComponent(world, ActiveBullet, eid)
			addComponent(world, Pos, eid)
			addComponent(world, Size, eid)
			addComponent(world, Vel, eid)
			addComponent(world, KillOutside, eid)

			if (Math.random() > .5) {
				Pos.x[eid] = Math.random()
				Pos.y[eid] = 0
			} else {
				Pos.x[eid] = 1
				Pos.y[eid] = Math.random()
			}

			Vel.x[eid] = -.005
			Vel.y[eid] = .01

			Size.r[eid] = .005

			await wait(Math.random() * 30)
		}

		await wait(500)

		return world
	},

	/*
	 * GALAXY
	 */

	async (world: IWorld) => {
		let amount = 500
		let circles = 3
		let radius = .5
		let spirals = 2 // 10
		let radiusReduce = .99 + Math.random() * .009 //(.99 + Math.random() * .009) ** spirals // UNCOMMENT FOR MORE PINCH

		let m = 0
		let mM = 1

		for (let j = 0; j < amount * circles; j++) {
			if (j%amount == 0) {
				m = 0
		     	mM = 1
			}

			let a = []

			for (let i = 0; i < spirals; i++) {
				a.push(j + amount * i / spirals)
			}

			for (let i of a) {
				let eid = addEntity(world)
				m += 1
				if (m > mM) {
					m = 0
					mM += 1
				}

				addComponent(world, Bullet, eid)
				addComponent(world, Pos, eid)
				addComponent(world, Size, eid)
				addComponent(world, KillOutside, eid)

				Pos.x[eid] = .5 + Math.sin(i / amount * 2 * Math.PI) * radius
				Pos.y[eid] = .5 + Math.cos(i / amount * 2 * Math.PI) * radius
				Size.r[eid] = .005

				await wait(500 / ((j + 5) ** 5))

				setTimeout(() => {
					addComponent(world, Vel, eid)
					addComponent(world, Acc, eid)
					//addComponent(world, ActiveBullet, eid)

					Vel.x[eid] = - Math.sin(i / amount * 2 * Math.PI) * .1 * (j % m + 1) / amount //(Math.random() - .5) * .00001
					Vel.y[eid] = - Math.cos(i / amount * 2 * Math.PI) * .1 * (j % m + 1) / amount //(Math.random() - .5) * .00001

					Acc.x[eid] = Math.cos(i / amount * 2 * Math.PI) * .001 * (j % m + 1) / amount //(Math.random() - .5) * .00001
					Acc.y[eid] = - Math.sin(i / amount * 2 * Math.PI) * .001 * (j % m + 1) / amount //(Math.random() - .5) * .00001
				}, 100 * m)
			}

			radius *= radiusReduce
			//radius *= (j < amount * circles / 3) ? .99 : 1.01
		}

		await wait(17000)

		return world
	},

	/*
	 * FIRE RING 2
	 */

	async (world: IWorld) => {
		let amount = 50
		let radius = .05

		for (let i = 0; i < amount * 3; i++) {
			let eid = addEntity(world)

			addComponent(world, Bullet, eid)
			addComponent(world, Pos, eid)
			addComponent(world, Size, eid)
			addComponent(world, KillOutside, eid)

			Pos.x[eid] = .5 + Math.sin(i / amount * Math.PI) * radius
			Pos.y[eid] = .5 + Math.cos(i / amount * Math.PI) * radius
			Size.r[eid] = .005

			await wait(200 / (i + 1))

			setTimeout(() => {
				addComponent(world, Vel, eid)
				addComponent(world, Acc, eid)
				addComponent(world, ActiveBullet, eid)

				Acc.x[eid] = (Math.random() - .5) * .0001
				Acc.y[eid] = (Math.random() - .5) * .0001
			}, 200)
		}

		await wait(500)

		return world
	},

	/*
	 * FIRE HALF RING
	 */

	async (world: IWorld) => {
		let amount = 50
		let radius = .05

		let entities = []

		for (let i = 0; i < amount * 3; i++) {
			let eid = addEntity(world)
			entities.push(eid)

			addComponent(world, Bullet, eid)
			addComponent(world, Pos, eid)
			addComponent(world, Size, eid)
			addComponent(world, KillOutside, eid)

			Pos.x[eid] = .5 //+ Math.cos(i / amount * Math.PI) * radius
			//Pos.y[eid] = Math.sin(i / amount * Math.PI) * radius
			Size.r[eid] = .005

			setTimeout(() => {
				addComponent(world, Vel, eid)
				addComponent(world, Acc, eid)
				addComponent(world, ActiveBullet, eid)

				Acc.x[eid] = Math.cos(i / amount * Math.PI) * .0001
				Acc.y[eid] = Math.sin(i / amount * Math.PI) * .0001
			}, 200)

		}

		await wait(500)

		return world
	},

	/*
	 * FIRE HALF RING HUGE
	 */

	async (world: IWorld) => {
		let amount = 20

		let entities = []

		for (let i = 0; i < amount * 3; i++) {
			let eid = addEntity(world)
			entities.push(eid)

			addComponent(world, Bullet, eid)
			addComponent(world, Pos, eid)
			addComponent(world, Size, eid)
			addComponent(world, KillOutside, eid)

			Pos.x[eid] = .5
			Pos.y[eid] = -.05
			Size.r[eid] = .05

			setTimeout(() => {
				addComponent(world, Vel, eid)
				addComponent(world, Acc, eid)
				addComponent(world, ActiveBullet, eid)

				Vel.x[eid] = Math.cos(i / amount * Math.PI) * .01
				Vel.y[eid] = Math.sin(i / amount * Math.PI) * .01

				Acc.x[eid] = - Math.cos(i / amount * Math.PI) * .00002
				Acc.y[eid] = - Math.sin(i / amount * Math.PI) * .00002
			}, 200)

		}

		await wait(500)

		return world
	},

	/*
	 * HORIZONTAL WALL ATTACKS
	 */

	async (world: IWorld) => {
		let waves = Math.random() * 10

		for (let i = 0; i < waves; i++) {
			let amount = Math.random() * 20 + 30

			for (let j = 0; j < amount; j++) {
				let x = Math.random()

				let eid = addEntity(world)

				addComponent(world, Bullet, eid)
				addComponent(world, ActiveBullet, eid)
				addComponent(world, Pos, eid)
				addComponent(world, Size, eid)
				addComponent(world, Vel, eid)
				addComponent(world, KillOutside, eid)

				Pos.x[eid] = x
				Size.r[eid] = .005

				Vel.y[eid] = .01
			}

			await wait(500)
		}

		await wait(500)

		return world
	},

	/*
	 * VERTICAL LINEAR ATTACKS
	 */

	async (world: IWorld) => {
		let amount = Math.random() * 20 + 180
		let length = 10

		for (let i = 0; i < amount; i++) {
			let x = Math.random()

			for (let j = 0; j < length; j++) {
				let eid = addEntity(world)

				addComponent(world, Bullet, eid)
				addComponent(world, ActiveBullet, eid)
				addComponent(world, Pos, eid)
				addComponent(world, Size, eid)
				addComponent(world, Vel, eid)
				addComponent(world, KillOutside, eid)

				Pos.x[eid] = x
				Pos.y[eid] = - j * .01
				Size.r[eid] = .005

				Vel.y[eid] = .01

			}

			await wait(Math.random() * 100)
		}

		await wait(500)

		return world
	},

	/*
	 * GRAVITY ATTACKS
	 */

	async (world: IWorld) => {
		let amount = Math.random() * 100

		for (let i = 0; i < amount; i++) {
			let eid = addEntity(world)

			addComponent(world, Bullet, eid)
			addComponent(world, ActiveBullet, eid)
			addComponent(world, Gravity, eid)
			addComponent(world, Pos, eid)
			addComponent(world, Size, eid)
			addComponent(world, Vel, eid)
			addComponent(world, Acc, eid)
			addComponent(world, KillOutside, eid)

			Pos.x[eid] = Math.random()
			Pos.y[eid] = 0

			Size.r[eid] = .005

			Gravity.eid[eid] = world.pid
			Gravity.force[eid] = .000005

			await wait(Math.random() * 30)
		}

		await wait(500)

		return world
	},

	/*
	 * HALF RING HUGE (VARIANT WITHOUT FREE LINES)
	 */

	async (world: IWorld) => {
		let amount = 50

		let entities = []

		for (let wave = 0; wave < 10; wave++) {
			for (let i = 0; i < amount * 3; i++) {
				let eid = addEntity(world)
				entities.push(eid)

				addComponent(world, Bullet, eid)
				addComponent(world, Pos, eid)
				addComponent(world, Size, eid)
				addComponent(world, KillOutside, eid)

				Pos.x[eid] = .5
				Pos.y[eid] = -.05
				Size.r[eid] = .01

				addComponent(world, Vel, eid)
				addComponent(world, LimesVel, eid)
				addComponent(world, ActiveBullet, eid)

				Vel.x[eid] = Math.cos((i + wave % 2 * .5) / amount * Math.PI) * .01
				Vel.y[eid] = Math.sin((i + wave % 2 * .5) / amount * Math.PI) * .01

				LimesVel.x[eid] = Math.cos((i + wave % 2 * .5) / amount * Math.PI) * .0001
				LimesVel.y[eid] = Math.sin((i + wave % 2 * .5) / amount * Math.PI) * .0001
				LimesVel.f[eid] = .005
			}

			await wait(200)
		}

		await wait(1000)

		return world
	},

]

async function wait(ms: number) {
	return new Promise(resolve => {
		setTimeout(resolve, ms)
	})
}