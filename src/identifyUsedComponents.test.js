import nodePath from 'path'
import identifyUsedComponents from './identifyUsedComponents.js'

const html = `
	<div>
		<Grid>
			<GridCell />
			<GridCell />
		</Grid>
	</div>
`

describe('identifyUsedComponents.js', () => {
	test('Identifies correct components', () => {
		const filename = nodePath.resolve('./src/testdata/Grid.svelte')
		const components = identifyUsedComponents(html)
		expect(components).toEqual(['Grid', 'GridCell'])
	})
})
