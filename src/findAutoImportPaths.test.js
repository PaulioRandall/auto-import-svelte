import findAutoImportPaths from './findAutoImportPaths.js'

function toLines(s) {
	return s.split('\n')
}

describe('parseAutoImports.js', () => {
	test('Same directory', () => {
		const lines = toLines(`$autoImportDir(".")`)
		const autoImports = findAutoImportPaths(lines)

		expect(autoImports).toEqual([
			{
				isGlob: false, //
				isLib: false,
				lineIndex: 0,
				path: '.',
			},
		])
	})

	test('Sub directory', () => {
		const lines = toLines(`$autoImportDir("./sub")`)
		const autoImports = findAutoImportPaths(lines)

		expect(autoImports).toEqual([
			{
				isGlob: false, //
				isLib: false,
				lineIndex: 0,
				path: './sub',
			},
		])
	})

	test('Returns all import paths', () => {
		const lines = toLines(`
	import abc from './abc.js'
	$autoImportDir(".")
	$autoImportDir("./sub")
`)

		const autoImports = findAutoImportPaths(lines)

		expect(autoImports).toEqual([
			{
				isGlob: false, //
				isLib: false,
				lineIndex: 2,
				path: '.',
			},
			{
				isGlob: false, //
				isLib: false,
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
				isLib: false,
				lineIndex: 2,
				path: './**/*',
			},
		])
	})
})
