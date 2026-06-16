import findAutoImportPaths from './findAutoImportPaths.js'

function toLines(s) {
	return s.split('\n')
}

describe('parseAutoImports.js', () => {
	test('Same directory', () => {
		const lines = toLines(`$autoImport(".")`)
		const autoImports = findAutoImportPaths(lines)

		expect(autoImports).toEqual([
			{ lineIndex: 0, path: '.' }, //
		])
	})

	test('Sub directory', () => {
		const lines = toLines(`$autoImport("./sub")`)
		const autoImports = findAutoImportPaths(lines)

		expect(autoImports).toEqual([
			{ lineIndex: 0, path: './sub' }, //
		])
	})

	test('Returns all import paths', () => {
		const lines = toLines(`
	import abc from './abc.js'
	$autoImport(".")
	$autoImport("./sub")
`)

		const autoImports = findAutoImportPaths(lines)

		expect(autoImports).toEqual([
			{ lineIndex: 2, path: '.' }, //
			{ lineIndex: 3, path: './sub' }, //
		])
	})

	test('Returns empty array when no auto import statements', () => {
		const autoImports = findAutoImportPaths(`import abc from './abc.js'`)
		expect(autoImports).toEqual([])
	})
})
