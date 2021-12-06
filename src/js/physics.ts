
import { addComponent, addEntity, defineQuery, hasComponent, IWorld, pipe, removeEntity } from 'bitecs'
import { Player, Vel, Acc, Pos, Size, Bullet, Gravity, KillOutside, Point } from './comps'


const acc_gravity_query = defineQuery([Pos, Acc, Gravity])
const vel_query = defineQuery([Vel, Acc])
const pos_query = defineQuery([Pos, Vel])
const bullets_query = defineQuery([Bullet, Pos])
const points_query = defineQuery([Point, Pos])
const kill_query = defineQuery([Bullet, KillOutside])

export default pipe(

	/**
	 * 
	 * › SET ACCELERATION ‹
	 * 
	 * Acc <- Gravity, Pos
	 *
	 */

	(world: IWorld) => {
		const entities = acc_gravity_query(world)

		for (let i = 0; i < entities.length; i++) {
			const eid = entities[i]

			if (hasComponent(world, Pos, eid)) {
				Acc.x[eid] += Gravity.force[eid] * (Pos.x[Gravity.eid[eid]] - Pos.x[eid])
				Acc.y[eid] += Gravity.force[eid] * (Pos.y[Gravity.eid[eid]] - Pos.y[eid])
				// F = r1, r2 / d^2
				//Acc.x[eid] += Gravity.force[eid] * Math.sign(Pos.x[Gravity.eid[eid]] - Pos.x[eid]) / Math.abs(Pos.x[Gravity.eid[eid]] - Pos.x[eid]) ** 2
				//Acc.y[eid] += Gravity.force[eid] * Math.sign(Pos.y[Gravity.eid[eid]] - Pos.y[eid]) / Math.abs(Pos.x[Gravity.eid[eid]] - Pos.x[eid]) ** 2
			}
		}

		return world
	},

	/**
	 * 
	 * › SET VELOCITY ‹
	 * 
	 * Vel <- Acc
	 *
	 */

	(world: IWorld) => {
		const entities = vel_query(world)

		for (let i = 0; i < entities.length; i++) {
			const eid = entities[i]

			Vel.x[eid] += Acc.x[eid]
			Vel.y[eid] += Acc.y[eid]
		}

		return world
	},

	/**
	 * 
	 * › SET POSITION ‹
	 * 
	 * Pos <- Vel
	 *
	 */

	(world: IWorld) => {
		const entities = pos_query(world)

		for (let i = 0; i < entities.length; i++) {
			const eid = entities[i]

			Pos.x[eid] += Vel.x[eid]
			Pos.y[eid] += Vel.y[eid]
		}

		return world
	},

	/**
	 * 
	 * › COLLISION DETECTION: PLAYER - BULLET ‹
	 *
	 */

	(world: IWorld) => {
		const entities = bullets_query(world)
		let collided = false

		for (let i = 0; i < entities.length; i++) {
			const eid = entities[i]

			if ((Pos.x[world.pid] - Pos.x[eid]) ** 2 + (Pos.y[world.pid] - Pos.y[eid]) ** 2 < (Size.r[eid] + Size.r[world.pid]) ** 2) {
				collided = true
				break
			}
		}

		if (collided)
			entities.forEach(e => {
				let eid = addEntity(world)

				addComponent(world, Point, eid)
				addComponent(world, Pos, eid)
				addComponent(world, Vel, eid)
				addComponent(world, Acc, eid)
				addComponent(world, Size, eid)
				addComponent(world, KillOutside, eid)

				Pos.x[eid] = Pos.x[e]
				Pos.y[eid] = Pos.y[e]

				Acc.y[eid] = .00005

				Size.r[eid] = .005

				removeEntity(world, e)
			})

		return world
	},


	/**
	 * 
	 * › COLLISION DETECTION: PLAYER - COLLECTABLE POINTS ‹
	 *
	 */

	(world: IWorld) => {
		const entities = points_query(world)

		for (let i = 0; i < entities.length; i++) {
			const eid = entities[i]

			if ((Pos.x[world.pid] - Pos.x[eid]) ** 2 + (Pos.y[world.pid] - Pos.y[eid]) ** 2 < (Size.r[eid] + Size.r[world.pid]) ** 2) {
				removeEntity(world, eid)
			}
		}

		return world
	},

	/**
	 * 
	 * › REMOVE OUTSIDE BULLETS ‹
	 *
	 */

	(world: IWorld) => {
		const entities = kill_query(world)

		for (let i = 0; i < entities.length; i++) {
			const eid = entities[i]

			if (Pos.x[eid] < -.1 || Pos.x[eid] > 1.1 || Pos.y[eid] < -.1 || Pos.y[eid] > 1.1)
				removeEntity(world, eid)
		}

		return world
	},

)