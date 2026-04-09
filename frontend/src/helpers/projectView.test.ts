import {beforeEach, describe, expect, it} from 'vitest'

import {getProjectViewId, saveProjectView} from './projectView'

describe('project view helpers', () => {
	beforeEach(() => {
		localStorage.clear()
	})

	it('stores the last used view per project', () => {
		saveProjectView(12, 3)
		saveProjectView(42, 7)

		expect(getProjectViewId(12)).toBe(3)
		expect(getProjectViewId(42)).toBe(7)
	})

	it('overwrites legacy non-object values', () => {
		localStorage.setItem('projectView', '5')

		saveProjectView(7, 9)

		expect(localStorage.getItem('projectView')).toBe(JSON.stringify({7: 9}))
		expect(getProjectViewId(7)).toBe(9)
	})

	it('ignores invalid stored data', () => {
		localStorage.setItem('projectView', 'not-json')
		expect(getProjectViewId(3)).toBe(0)

		localStorage.setItem('projectView', JSON.stringify({3: 'nan'}))
		expect(getProjectViewId(3)).toBe(0)
	})
})
