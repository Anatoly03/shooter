import { addComponent, addEntity, IWorld, removeComponent, removeEntity } from "bitecs";
import { Acc, ActiveBullet, Bullet, KillOutside, LimesVel, Pos, Size, Vel, Vibration, ChainElement, ForceArrow, Arrow } from './comps'
import { assignAsset } from './asset'

export default [

	/*
	 * CIRCLE ATTACK
	 */

	async (world: IWorld) => {
		const amount = 2 ** Math.floor(Math.random() * 3 + 3)

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
		let amount = Math.random() * 200

		for (let i = 0; i < amount; i++) {
			let eid = addEntity(world)
			addComponent(world, Bullet, eid)
			addComponent(world, ActiveBullet, eid)
			addComponent(world, Pos, eid)
			addComponent(world, Size, eid)
			addComponent(world, Vel, eid)
			addComponent(world, Acc, eid)
			addComponent(world, KillOutside, eid)

			assignAsset(world, 'small-black', eid)

			Pos.x[eid] = Math.random()
			Pos.y[eid] = 0

			Acc.x[eid] = (Math.random() - .5) * .00005
			Acc.y[eid] = Math.random() * .00005

			Size.r[eid] = .01

			await wait(50)
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

			assignAsset(world, 'small-black', eid)

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
	 * GALAXY (TOO LONG)
	 */

	async (world: IWorld) => {
		let amount = 50
		let circles = 3
		let radius = .4
		let spirals = Math.ceil(Math.random() * 10) + 1
		let radiusReduce = .95 + Math.random() * .009 - .001 * spirals //(.99 + Math.random() * .009) ** spirals // UNCOMMENT FOR MORE PINCH

		let m = 0
		let mM = 1

		let entities = []

		for (let j = 0; j < amount * circles; j++) {
			if (j % amount == 0) {
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

				entities.push(eid)

				addComponent(world, Bullet, eid)
				addComponent(world, Pos, eid)
				addComponent(world, Size, eid)
				addComponent(world, KillOutside, eid)

				assignAsset(world, "small-orange", eid)

				Pos.x[eid] = .5 + Math.sin(i / amount * 2 * Math.PI) * radius
				Pos.y[eid] = .5 + Math.cos(i / amount * 2 * Math.PI) * radius
				Size.r[eid] = .01

				await wait(5)
				//await wait(500 / ((j + 5) ** 5))

				setTimeout(() => {
					addComponent(world, Vel, eid)
					addComponent(world, Acc, eid)
					//addComponent(world, ActiveBullet, eid)
					//addComponent(world, ActiveBullet, eid)

					Vel.x[eid] = - Math.sin(i / amount * 2 * Math.PI) * .1 * (j % m + 1) * .05 / m //(Math.random() - .5) * .00001
					Vel.y[eid] = - Math.cos(i / amount * 2 * Math.PI) * .1 * (j % m + 1) * .05 / m //(Math.random() - .5) * .00001

					Acc.x[eid] = Math.cos(i / amount * 2 * Math.PI) * .001 * (j % m + 1) * .0005 //(Math.random() - .5) * .00001
					Acc.y[eid] = - Math.sin(i / amount * 2 * Math.PI) * .001 * (j % m + 1) * .0005 //(Math.random() - .5) * .00001
				}, 100 * mM)
			}

			radius *= radiusReduce
			//radius *= (j < amount * circles / 3) ? .99 : 1.01
		}

		await wait(5000)

		for (let eid of entities) {
			let angle = Math.atan2(Pos.x[eid] - .5, Pos.y[eid] - .5)
			Acc.x[eid] = Math.sin(angle) * .00005
			Acc.y[eid] = Math.cos(angle) * .00005
		}

		await wait(5000)

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

			assignAsset(world, 'huge-blue', eid)

			Pos.x[eid] = .5
			Pos.y[eid] = -.05
			Size.r[eid] = .03

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

				assignAsset(world, 'small-black', eid)

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
		// LUNATIC!
		let amount = Math.random() * 700 + 50
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
				addComponent(world, Acc, eid)
				addComponent(world, KillOutside, eid)

				assignAsset(world, 'small-black', eid)

				Pos.x[eid] = x
				Pos.y[eid] = - j * .01
				Size.r[eid] = .005

				Vel.y[eid] = .01
				Acc.y[eid] = .000001 * i
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
			let gravity = addEntity(world)

			addComponent(world, Bullet, eid)
			addComponent(world, ActiveBullet, eid)
			addComponent(world, Pos, eid)
			addComponent(world, Size, eid)
			addComponent(world, Vel, eid)
			addComponent(world, Acc, eid)
			addComponent(world, KillOutside, eid)

			Pos.x[eid] = Math.random()
			Pos.y[eid] = 0

			Size.r[eid] = .005

			addComponent(world, ForceArrow, gravity)
			addComponent(world, Acc, gravity)

			ForceArrow.eid[gravity] = eid
			ForceArrow.tid[gravity] = world.pid
			ForceArrow.force[gravity] = .000002

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

				assignAsset(world, 'small-black', eid)

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

	/*
	 * FILLING BULLETS (HARD | LUNATIC)
	 * 
	 * Fill the land with bullets that are only vibrating and then slowly sets them in random motion when everything is filled.
	 */

	async (world: IWorld) => {
		// 100 IS MEDIUM OR HARD
		let amount = 100

		let entities: number[] = []

		for (let corner = 0; corner < 4; corner++) {
			let asset = 'small-'

			switch (corner) {
				case 0:
					asset += 'black'
					break

				case 1:
					asset += 'red'
					break

				case 2:
					asset += 'green'
					break

				case 3:
					asset += 'orange'
					break
			}

			go(async () => {
				let radius = .03
				// .65 ALSO POSSIBLE
				let maxRadius = .65
				for (let i = 0; i < amount * 3; i++) {
					let eid = addEntity(world)
					entities.push(eid)

					addComponent(world, Bullet, eid)
					addComponent(world, Pos, eid)
					addComponent(world, Size, eid)
					addComponent(world, Vel, eid)
					addComponent(world, KillOutside, eid)
					addComponent(world, Vibration, eid)

					let angle = Math.random() * Math.PI * 2

					assignAsset(world, asset, eid)

					Pos.x[eid] = Math.floor(corner / 2) + Math.sin(angle) * radius
					Pos.y[eid] = corner % 2 + Math.cos(angle) * radius
					Size.r[eid] = .01

					Vibration.f[eid] = .001

					radius += (maxRadius - radius) / amount

					setTimeout(() => {
						addComponent(world, ActiveBullet, eid)
					}, 25 * amount)

					setTimeout(() => {
						addComponent(world, Acc, eid)
						removeComponent(world, Vibration, eid)

						// FACTOR .00005 = IS MEDIUM OR HARD SPEED
						Acc.x[eid] = (Math.random() - .5) * .000025
						Acc.y[eid] = (Math.random() - .5) * .000025
					}, 25 * amount + 2000)

					if (i % 3 == 0)
						await wait(50)
				}
			})
		}

		await wait(50 * amount / 3 + 25000)

		return world
	},

	/*
	 * JUNKO ON STEROIDS LuaSTG
	 */

	async (world: IWorld) => {
		let shoots = 5

		for (let i = 0; i < shoots; i++) {
			let amount = 10
			let radius = .2

			for (let i = 0; i < amount; i++) {
				let eid = addEntity(world)

				addComponent(world, Bullet, eid)
				addComponent(world, Pos, eid)
				addComponent(world, Size, eid)
				addComponent(world, Vel, eid)
				addComponent(world, Acc, eid)
				addComponent(world, ActiveBullet, eid)

				Pos.x[eid] = Pos.x[world.pid] + Math.sin(i / amount * Math.PI * 2) * radius
				Pos.y[eid] = Pos.y[world.pid] + Math.cos(i / amount * Math.PI * 2) * radius
				Size.r[eid] = .01

				assignAsset(world, 'small-black', eid)

				Vel.x[eid] = Math.sin(i / amount * Math.PI * 2) * .002
				Vel.y[eid] = Math.cos(i / amount * Math.PI * 2) * .002

				Acc.x[eid] = - Math.sin(i / amount * Math.PI * 2) * .00005
				Acc.y[eid] = - Math.cos(i / amount * Math.PI * 2) * .00005

				setTimeout(() => {
					Acc.x[eid] = Math.sin(Math.atan2(Pos.x[world.pid] - Pos.x[eid], Pos.y[world.pid] - Pos.y[eid])) * .0001
					Acc.y[eid] = Math.cos(Math.atan2(Pos.x[world.pid] - Pos.x[eid], Pos.y[world.pid] - Pos.y[eid])) * .0001

					//Gravity.eid[eid] = world.pid
					//Gravity.force[eid] = .00001
				}, 1000);

				setTimeout(() => {
					addComponent(world, KillOutside, eid)
				}, 2000)
			}

			await wait(2000)
		}

		return world
	},

	/*
	 * SOME WEIRDNESS WITH WEIRD BEHAVIOR
	 */

	async (world: IWorld) => {
		let times = 300 + Math.random() * 400

		let entities = []
		let arrows: number[] = []

		let center = addEntity(world)
		addComponent(world, Pos, center)

		Pos.x[center] = 0.5
		Pos.y[center] = 0.5

		for (let i = 0; i < times; i++) {
			let eid = addEntity(world)
			let gravity = addEntity(world)

			entities.push(eid)
			arrows.push(gravity)

			addComponent(world, Bullet, eid)
			addComponent(world, Pos, eid)
			addComponent(world, Size, eid)
			addComponent(world, Vel, eid)
			addComponent(world, Acc, eid)
			addComponent(world, ActiveBullet, eid)

			assignAsset(world, 'small-black', eid)

			let angle = Math.random() * Math.PI * 2

			Pos.x[eid] = .5 + Math.sin(angle)
			Pos.y[eid] = .5 + Math.cos(angle)

			Size.r[eid] = .01

			addComponent(world, ForceArrow, gravity)
			addComponent(world, Pos, gravity)

			ForceArrow.eid[gravity] = eid
			ForceArrow.tid[gravity] = center
			ForceArrow.rot[gravity] = .3 //+ Math.random() * .1
			ForceArrow.force[gravity] = .15

			await wait(i % 10)
		}

		//entities.forEach(eid => addComponent(world, ActiveBullet, eid))

		arrows.forEach(eid => removeEntity(world, eid))
		//arrows = []
		removeEntity(world, center)

		entities.forEach(eid => {
			/*let gravity = addEntity(world)
			arrows.push(gravity)

			addComponent(world, Arrow, gravity)
			addComponent(world, Vel, gravity)

			ForceArrow.eid[gravity] = eid
			ForceArrow.rot[gravity] = Math.atan2(Pos.x[eid] - .5, Pos.y[eid] - .5) / Math.PI
			ForceArrow.force[gravity] = .0001*/

			let angle = Math.atan2(Pos.x[eid] - .5, Pos.y[eid] - .5)
			Acc.x[eid] = Math.sin(angle) * .0005
			Acc.y[eid] = Math.cos(angle) * .0005
		})

		await wait(2000)

		entities.forEach(eid => removeEntity(world, eid))
		//arrows.forEach(eid => removeEntity(world, eid))

		return world
	},

	/*
	 * RAIN WITH NON PARALLEL BULLETS
	 */

	async (world: IWorld) => {
		let entities = []
		let times = Math.random() * 1000 + 1000
		let acc = Math.random()
		let dx = Math.random()
		let cy = Math.random() * 0.09 - 0.1

		for (let i = 0; i < times; i++) {
			let eid = addEntity(world)

			entities.push(eid)

			addComponent(world, Bullet, eid)
			addComponent(world, Pos, eid)
			addComponent(world, Size, eid)
			addComponent(world, Vel, eid)
			addComponent(world, Acc, eid)
			addComponent(world, ActiveBullet, eid)

			assignAsset(world, 'small-black', eid)

			let angle = (Math.random() - .5) * Math.PI

			Pos.x[eid] = .5 + Math.sin(angle) * dx
			Pos.y[eid] = cy

			Vel.x[eid] = Math.sin(angle) * .005
			Vel.y[eid] = Math.cos(angle) * .005

			Acc.x[eid] = Math.sin(angle) * i * .0000001 * acc
			Acc.y[eid] = Math.cos(angle) * i * .0000001 * acc

			Size.r[eid] = .01

			await wait(i % 10)
		}

		await wait(5000)

		entities.forEach(eid => removeEntity(world, eid))
		//arrows.forEach(eid => removeEntity(world, eid))

		return world
	},

	/*
	 * QUICK DIAGONAL BULLETS
	 */

	async (world: IWorld) => {
		let entities: number[] = []
		let times = Math.random() * 2000 + 1000

		go(async () => {
			for (let i = 0; i < times; i++) {
				let eid = addEntity(world)

				entities.push(eid)

				addComponent(world, Bullet, eid)
				addComponent(world, Pos, eid)
				addComponent(world, Size, eid)
				addComponent(world, Vel, eid)
				addComponent(world, Acc, eid)
				addComponent(world, KillOutside, eid)
				//addComponent(world, ActiveBullet, eid)

				assignAsset(world, 'small-black', eid)

				let angle = Math.sin(i) * Math.PI // ((i % 20) * 9 - 90) / 180 * Math.PI 

				Pos.x[eid] = .5
				Pos.y[eid] = -.01

				Vel.x[eid] = Math.sin(angle) * .01 // * .01 / (i%10 + 1)
				Vel.y[eid] = Math.cos(angle) * .01 // * .01 / (i%10 + 1)

				Acc.x[eid] = - Math.sin(angle) * .00001 * (i % 3 + 1) // / (i%10 + 1)
				Acc.y[eid] = - Math.cos(angle) * .00001 * (i % 3 + 1) // / (i%10 + 1)

				Size.r[eid] = .01

				if (i % 5 == 0)
					await wait(10)
			}
		})

		await wait(12000)

		entities.forEach(eid => removeEntity(world, eid))

		return world
	},

	/*
	 * FOLLOWING LINES
	 */

	async (world: IWorld) => {
		let entities: number[] = []
		let lead: number[] = []
		let arrows: number[] = []

		let center = addEntity(world)
		addComponent(world, Pos, center)

		Pos.x[center] = 0.5
		Pos.y[center] = 0.2

		go(async () => {
			let strings = 8

			for (let i = 0; i < strings; i++) {
				const angle = 2 * Math.PI * (i / strings)

				go(async () => {
					let next = null
					for (let j = 0; j < 20; j++) {
						let eid = addEntity(world)
						entities.push(eid)

						addComponent(world, Bullet, eid)
						addComponent(world, Pos, eid)
						addComponent(world, Size, eid)
						addComponent(world, Vel, eid)
						addComponent(world, Acc, eid)
						addComponent(world, KillOutside, eid)

						assignAsset(world, 'small-black', eid)

						Pos.x[eid] = Pos.x[center]
						Pos.y[eid] = Pos.y[center]

						if (next) {
							addComponent(world, ChainElement, eid)
							ChainElement.follow[eid] = next

							/*let gravity = addEntity(world)
							arrows.push(gravity)

							addComponent(world, ForceArrow, gravity)
							addComponent(world, Vel, gravity)

							ForceArrow.eid[gravity] = eid
							ForceArrow.tid[gravity] = next
							ForceArrow.rot[gravity] = 0
							ForceArrow.force[gravity] = .001*/
						} else {
							lead.push(eid)
						}
						next = eid

						Vel.x[eid] = Math.sin(angle) * .004
						Vel.y[eid] = Math.cos(angle) * .004

						Size.r[eid] = .01

						await wait(80)
					}
				})
			}
		})

		// 20 * 80 // + 200
		await wait(1800)

		Pos.x[center] = Pos.x[world.pid]
		Pos.y[center] = Pos.y[world.pid]

		lead.forEach(eid => {
			let gravity = addEntity(world)
			arrows.push(gravity)

			addComponent(world, ForceArrow, gravity)
			addComponent(world, Vel, gravity)

			ForceArrow.eid[gravity] = eid
			ForceArrow.tid[gravity] = center
			ForceArrow.rot[gravity] = 0
			ForceArrow.force[gravity] = .01
		})

		await wait(12000)

		entities.forEach(eid => removeEntity(world, eid))
		arrows.forEach(eid => removeEntity(world, eid))

		return world
	},

]

async function wait(ms: number) {
	return new Promise(resolve => {
		setTimeout(resolve, ms)
	})
}

async function go(f: () => void) {
	f()
}