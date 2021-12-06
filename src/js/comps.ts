

import { Types, defineComponent } from 'bitecs'

/**
 * 
 * Components
 *
 */

export const Player = defineComponent()
export const Bullet = defineComponent()

//
// Physics and Position
//

export const Pos = defineComponent({
	x: Types.f64,
	y: Types.f64,
})

export const Vel = defineComponent({
	x: Types.f64,
	y: Types.f64,
})

export const Acc = defineComponent({
	x: Types.f64,
	y: Types.f64,
})

export const Size = defineComponent({
	r: Types.f64,
})

export const Gravity = defineComponent({
	eid: Types.ui32,
	force: Types.f64,
})

//
// Lifetime
//

export const KillOutside = defineComponent()