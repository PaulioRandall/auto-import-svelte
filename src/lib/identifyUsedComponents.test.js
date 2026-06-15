import path from 'path'
import identifyUsedComponents from './identifyUsedComponents.js'

const POSIX = path.posix

const html = `
	<GridColumn>
		<GridCell />
		<GridCell />
	</GridColumn>
`

test('identifyUsedComponents', () => {
	const filename = POSIX.resolve('./testdata/Grid.svelte')
	const components = identifyUsedComponents(html)
	expect(components).toEqual(['GridColumn', 'GridCell'])
})
