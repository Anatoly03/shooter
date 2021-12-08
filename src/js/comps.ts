

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

export const LimesVel = defineComponent({
	x: Types.f64,
	y: Types.f64,
	f: Types.f64, // factor
})

export const Size = defineComponent({
	r: Types.f64,
})

export const Gravity = defineComponent({
	eid: Types.ui32,
	force: Types.f64,
})

export const Vibration = defineComponent({
	f: Types.f64,
	ix: Types.f64,
	iy: Types.f64,
})

export const Rotation = defineComponent({
	eid: Types.ui32,
	angle: Types.f64,
	//rMod: Types.f64,
})

//
// Lifetime
//

export const KillOutside = defineComponent()