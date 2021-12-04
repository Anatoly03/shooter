

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

export const Vec = defineComponent({
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
