import findAutoImportPaths from './findAutoImportPaths.js'

function toLines(s) {
	return s.split('\n')
}

describe('parseAutoImports.js', () => {
	test('Same directory', () => {
		const lines = toLines(`$autoImport(".")`)
		const autoImports = findAutoImportPaths(lines)

		expect(autoImports).toEqual([
			{
				isGlob: false, //
				lineIndex: 0,
				path: '.',
			},
		])
	})

	test('Sub directory', () => {
		const lines = toLines(`$autoImport("./sub")`)
		const autoImports = findAutoImportPaths(lines)

		expect(autoImports).toEqual([
			{
				isGlob: false, //
				lineIndex: 0,
				path: './sub',
			},
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
			{
				isGlob: false, //
				lineIndex: 2,
				path: '.',
			},
			{
				isGlob: false, //
				lineIndex: 3,
				path: './sub',
			},
		])
	})

	test('Returns empty array when no auto import statements', () => {
		const autoImports = findAutoImportPaths(`import abc from './abc.js'`)
		expect(autoImports).toEqual([])
	})

	test('Returns all import paths (GLOB)', () => {
		const lines = toLines(`
	import abc from './abc.js'
	$autoImportGlob("./**/*")
`)

		const autoImports = findAutoImportPaths(lines)

		expect(autoImports).toEqual([
			{
				isGlob: true, //
				lineIndex: 2,
				path: './**/*',
			},
		])
	})
})
