import path from 'path'
import identifyUsedComponents from './identifyUsedComponents.js'

const POSIX = path.posix

const html = `
	<div>
		<Grid>
			<GridCell />
			<GridCell />
		</Grid>
	</div>
`

test('identifyUsedComponents', () => {
	const filename = POSIX.resolve('./src/testdata/Grid.svelte')
	const components = identifyUsedComponents(html)
	expect(components).toEqual(['Grid', 'GridCell'])
})
