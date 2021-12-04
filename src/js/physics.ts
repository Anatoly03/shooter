
import { defineQuery, IWorld, pipe, removeEntity } from 'bitecs'
import { Player, Vel, Acc, Pos, Size, Bullet } from './comps'


const vel_query = defineQuery([Vel, Acc])
const pos_query = defineQuery([Pos, Vel])
const bullets_query = defineQuery([Bullet, Pos])

export default pipe(

	/**
	 * 
	 * › SET VELOCITY ‹
	 *
	 */

	(world: IWorld) => {
		const entities = vel_query(world)

		for (let i = 0; i < entities.length; i++) {
			const pid = entities[i]

			Vel.x[pid] += Acc.x[pid]
			Vel.y[pid] += Acc.y[pid]
		}

		return world
	},

	/**
	 * 
	 * › SET POSITION ‹
	 *
	 */

	(world: IWorld) => {
		const entities = pos_query(world)

		for (let i = 0; i < entities.length; i++) {
			const pid = entities[i]

			Pos.x[pid] += Vel.x[pid]
			Pos.y[pid] += Vel.y[pid]
		}

		return world
	},

	/**
	 * 
	 * › REMOVE OUTSIDE BULLETS ‹
	 *
	 */

	 (world: IWorld) => {
		const entities = bullets_query(world)

		for (let i = 0; i < entities.length; i++) {
			const pid = entities[i]

			if (Pos.x[pid] < -.1 || Pos.x[pid] > 1.1 || Pos.y[pid] < -.1 || Pos.y[pid] > 1.1)
				removeEntity(world, pid)
		}

		return world
	},

)