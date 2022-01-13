
import { createWorld, addEntity, addComponent, pipe, defineQuery, removeEntity, hasComponent } from 'bitecs'
import { ctx, width, height, keys, DEBUG_MODE, FPS } from "../app"
import { Acc, ActiveBullet, Asset, Bullet, Player, Point, Pos, Size, Vel } from '../comps'
import blts from '../_bullets'
import physics from '../physics'

import config from '../assets.json'

export default {
	selected: 0,
	buttons: ['Play', 'Practice', 'High Score', 'Credits'],

	init() {

	},

	update() {

	},

	render() {
		ctx.strokeStyle = 'white'
		ctx.fillStyle = '#5f8fff'
		ctx.font = '50px Righteous'
		ctx.textAlign = 'center'
		ctx.textBaseline = 'middle'

		this.buttons.forEach((element: string, i: number) => {
			if (this.selected == i) {
				ctx.fillText(element, width * .5, height * .5 + (i * 60) - (this.buttons.length * 25))
			} else {
				ctx.strokeText(element, width * .5, height * .5 + (i * 60) - (this.buttons.length * 25))
			}
		})
	},

	onKeyDown(event: KeyboardEvent) {
		switch (event.key.toLowerCase()) {
			case 'arrowdown':
			case 's':
				if (this.selected == this.buttons.length - 1) this.selected = 0
				else this.selected++
				break

			case 'arrowup':
			case 'w':
				if (this.selected == 0) this.selected = this.buttons.length - 1
				else this.selected--
				break

			case 'arrowright':
			case 'd':
				// enter playing room
				break
		}
	},

	onClick(event: MouseEvent) {
		//
	},

	onMouseMove(event: MouseEvent) {
		//
	}
}

