

import { Types, defineComponent } from 'bitecs'

/**
 * 
 * Components
 *
 */

//
// Assets
//

export const Asset = defineComponent({
	id: Types.ui16,
})

//
// 
//

export const Player = defineComponent()
export const Point = defineComponent()

//
// Bullets
//

export const Bullet = defineComponent()
export const ActiveBullet = defineComponent() // Only active bullets can kill

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

//
// Arrows
// Create a one-directional force between two entities
//

export const ForceArrow = defineComponent({
	eid: Types.ui32, // eid of entity
	tid: Types.ui32, // target eid
	rot: Types.f64, // rotation: 0 = together, 1 = away from each other, 0.5 = circular around target
	force: Types.f64, // force
})

export const Arrow = defineComponent({
	eid: Types.ui32, // eid of entity
	rot: Types.f64, // rotation: 0 = right, 1 = left, 0.5 = top, -0.5 = bottom
	force: Types.f64, // force
})

//
// Physics and Position
//

export const Flip = defineComponent({
	x: Types.ui8,
	y: Types.ui8,
})

export const ChainElement = defineComponent({
	follow: Types.ui32, // eid of entity to follow
})

export const LimesVel = defineComponent({
	x: Types.f64,
	y: Types.f64,
	f: Types.f64, // factor
})

export const Vibration = defineComponent({
	f: Types.f64,
	ix: Types.f64,
	iy: Types.f64,
})

//
// Lifetime
//

export const KillOutside = defineComponent()