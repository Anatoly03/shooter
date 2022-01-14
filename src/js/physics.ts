
import { addComponent, addEntity, defineQuery, hasComponent, IWorld, pipe, removeEntity } from 'bitecs'
import { Player, Vel, Acc, Pos, Size, Bullet, KillOutside, Point, ActiveBullet, LimesVel, Vibration, ForceArrow, Arrow, ChainElement, Flip } from './comps'
import { assignAsset } from './asset'

const chain_query = defineQuery([ChainElement])
const force_arrow_query = defineQuery([ForceArrow])
const arrow_query = defineQuery([Arrow])

const vel_query = defineQuery([Vel, Acc])
const limes_vel_query = defineQuery([Vel, LimesVel])

const flip_query = defineQuery([Pos, Flip])

const vibration_query = defineQuery([Pos, Vibration]) // Vel?
const pos_query = defineQuery([Pos, Vel])
const bullets_query = defineQuery([Bullet, ActiveBullet, Pos])
const points_query = defineQuery([Point, Pos])
const kill_query = defineQuery([Bullet, KillOutside])

export default pipe(

	/**
	 * 
	 * › FORCE CHAIN OF ENTITIES ‹
	 *	
	 */

	(world: IWorld) => {
		const nodes = chain_query(world)

		for (let i = 0; i < nodes.length; i++) {
			const eid = nodes[i]
			const tid = ChainElement.follow[eid]

			const angle = Math.atan2(Pos.x[tid] - Pos.x[eid], Pos.y[tid] - Pos.y[eid])
			const vel = Math.sqrt(Vel.x[tid] ** 2 + Vel.y[tid] ** 2)

			Vel.x[eid] = Math.sin(angle) * vel
			Vel.y[eid] = Math.cos(angle) * vel
		}

		return world
	},

	/**
	 * 
	 * › FORCE ARROWS BETWEEN OBJECTS ‹
	 *	
	 */

	(world: IWorld) => {
		const arrows = force_arrow_query(world)

		for (let i = 0; i < arrows.length; i++) {
			const eid = arrows[i]

			const ex = Pos.x[ForceArrow.eid[eid]]
			const ey = Pos.y[ForceArrow.eid[eid]]

			const tx = Pos.x[ForceArrow.tid[eid]]
			const ty = Pos.y[ForceArrow.tid[eid]]

			const angle = Math.atan2(tx - ex, ty - ey) + Math.PI * ForceArrow.rot[eid]
			const dist = (tx - ex) ** 2 + (ty - ey) ** 2

			const Comp = hasComponent(world, Pos, eid) ? Pos : hasComponent(world, Vel, eid) ? Vel : Acc

			Comp.x[ForceArrow.eid[eid]] += dist * Math.sin(angle) * ForceArrow.force[eid]
			Comp.y[ForceArrow.eid[eid]] += dist * Math.cos(angle) * ForceArrow.force[eid]
		}

		return world
	},

	/**
	 * 
	 * › FORCE ARROWS INTO DIRECTION ‹
	 *
	 */

	(world: IWorld) => {
		const arrows = arrow_query(world)

		// NEEDS SEMANTICAL REWORK!

		/*for (let i = 0; i < arrows.length; i++) {
			const eid = arrows[i]

			const ex = Pos.x[ForceArrow.eid[eid]]
			const ey = Pos.y[ForceArrow.eid[eid]]

			const tx = Pos.x[ForceArrow.eid[eid]]
			const ty = Pos.y[ForceArrow.eid[eid]]

			const angle = Math.PI * ForceArrow.rot[eid]
			const dist = ex ** 2 + ey ** 2

			const Comp = hasComponent(world, Pos, eid) ? Pos : hasComponent(world, Vel, eid) ? Vel : Acc

			Comp.x[ForceArrow.eid[eid]] += dist * Math.sin(angle) * ForceArrow.force[eid]
			Comp.y[ForceArrow.eid[eid]] += dist * Math.cos(angle) * ForceArrow.force[eid]
		}*/

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
	 * › APPROACH VELOCITY ‹
	 * 
	 * Vel <- ToVel
	 *
	 */

	(world: IWorld) => {
		const entities = limes_vel_query(world)

		for (let i = 0; i < entities.length; i++) {
			const eid = entities[i]

			//let speed = Math.abs(Math.floor((Math.atan2(Vel.x[eid], Vel.y[eid]) * 180 / Math.PI) % 90)) / 90
			//console.log(speed)

			Vel.x[eid] += /*Math.sign*/ (LimesVel.x[eid] - Vel.x[eid]) * LimesVel.f[eid] // speed
			Vel.y[eid] += /*Math.sign*/ (LimesVel.y[eid] - Vel.y[eid]) * LimesVel.f[eid] // speed
		}

		return world
	},

	/**
	 * 
	 * › FLIP QUERY ‹
	 *
	 */

	(world: IWorld) => {
		const entities = flip_query(world)

		for (let i = 0; i < entities.length; i++) {
			const eid = entities[i]

			if (Pos.x[eid] < 0 || Pos.x[eid] > 1) {
				if (Flip.x[eid] === 0) {
					Flip.x[eid] = 1
					if (hasComponent(world, Vel, eid)) {
						Vel.x[eid] *= -1
					}
					if (hasComponent(world, Acc, eid)) {
						Acc.x[eid] *= -1
					}
				}
			} else {
				Flip.x[eid] = 0
			}

			if (Pos.y[eid] < 0 || Pos.y[eid] > 1) {
				if (Flip.y[eid] === 0) {
					Flip.y[eid] = 1
					if (hasComponent(world, Vel, eid)) {
						Vel.y[eid] *= -1
					}
					if (hasComponent(world, Acc, eid)) {
						Acc.y[eid] *= -1
					}
				}
			} else {
				Flip.y[eid] = 0
			}
		}

		return world
	},

	/**
	 * 
	 * › VIBRATION ‹
	 *
	 */

	(world: IWorld) => {
		const entities = vibration_query(world)

		for (let i = 0; i < entities.length; i++) {
			const eid = entities[i]

			Vibration.ix[eid] = (Math.random() - .5) * Vibration.f[eid]
			Vibration.iy[eid] = (Math.random() - .5) * Vibration.f[eid]

			//Vibration.ix[eid] **= 3
			//Vibration.iy[eid] **= 3

			// Velocity?
			Pos.x[eid] += Vibration.ix[eid] //Vibration.f[eid] * Math.sin(Vibration.ix[eid] / Math.PI * 2)
			Pos.y[eid] += Vibration.iy[eid] // ibration.f[eid] * Math.cos(Vibration.iy[eid] / Math.PI * 2)
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

				assignAsset(world, 'bullet-point', eid)

				Pos.x[eid] = Pos.x[e]
				Pos.y[eid] = Pos.y[e]

				Acc.y[eid] = .00005

				Size.r[eid] = .01

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