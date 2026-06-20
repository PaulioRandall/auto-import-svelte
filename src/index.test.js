import path from 'path'
import preprocessor from './index.js'

const POSIX = path.posix

function joinLines(...lines) {
	return lines.join('\n')
}

describe('index.js', () => {
	test('index', () => {
		const filename = POSIX.resolve('./src/testdata/Grid.svelte')
		const pp = preprocessor()

		pp.markup({
			filename,
			content: joinLines(
				`<GridColumn>`,
				`	<GridCell>`,
				`		<GridCellContent />`,
				`	</GridCell>`,
				`	<GridCell>`,
				`		<GridCellContent />`,
				`	</GridCell>`,
				`	<GridCell>`,
				`		<GridCellContent />`,
				`	</GridCell>`,
				`</GridColumn>`
			),
		})

		const { code } = pp.script({
			filename,
			content: joinLines(
				`	$autoImportDir('.')`, //
				``,
				`	$autoImportDir('./subdir')`
			),
		})

		// Ordered first by auto import path then alphabetical
		// by name.
		const exp = joinLines(
			`  import GridCell from "./GridCell.svelte";`, //
			`  import GridColumn from "./GridColumn.svelte";`,
			``,
			`  import GridCellContent from "./subdir/GridCellContent.svelte";`
		)

		expect(code).toEqual(exp)
	})

	test('index (glob)', () => {
		const filename = POSIX.resolve('./src/testdata/Grid.svelte')
		const pp = preprocessor()

		pp.markup({
			filename,
			content: joinLines(
				`<GridColumn>`,
				`	<GridCell>`,
				`		<GridCellContent />`,
				`	</GridCell>`,
				`	<GridCell>`,
				`		<GridCellContent />`,
				`	</GridCell>`,
				`	<GridCell>`,
				`		<GridCellContent />`,
				`	</GridCell>`,
				`</GridColumn>`
			),
		})

		const { code } = pp.script({
			filename,
			content: joinLines(
				`	$autoImportGlob('./**/*')` //
			),
		})

		// Ordered first by auto import path then alphabetical
		// by name.
		const exp = joinLines(
			`  import GridColumn from "./GridColumn.svelte";`,
			`  import GridCell from "./GridCell.svelte";`,
			`  import GridCellContent from "./subdir/GridCellContent.svelte";`
		)

		expect(code).toEqual(exp)
	})
})
