
import { addComponent, IWorld } from 'bitecs'
import assets from './assets.json'
import { Asset } from './comps'

export function getIndex(search: string) {
	for (let i = 0; i < assets.length; i++)
		if (assets[i].id === search)
			return i + 1
	return 0
}

export function assignAsset(world: IWorld, search: string, eid: number) {
	let index = getIndex(search)

	if (index === 0) return

	addComponent(world, Asset, eid)
	Asset.id[eid] = index
}