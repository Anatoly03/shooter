
import { defineQuery, IWorld, pipe } from 'bitecs'
import { Player, Vel, Acc, Pos, Size } from './comps'


const vel_query = defineQuery([Vel, Acc])
const pos_query = defineQuery([Pos, Vel])

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

)