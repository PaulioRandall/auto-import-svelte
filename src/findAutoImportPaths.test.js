import findAutoImportPaths from './findAutoImportPaths.js'

function toLines(s) {
	return s.split('\n')
}

function expectAutoImports(ais, exps) {
	for (let i = 0; i < ais.length; i++) {
		const act = ais[i]
		const exp = exps[i]

		expect(act.path).toEqual(exp.path)
		expect(act.lineIndex).toEqual(exp.lineIndex)
		expect(act.isGlob()).toEqual(exp.isGlob)
		expect(act.isLib()).toEqual(exp.isLib)
		expect(act.isRoot()).toEqual(exp.isRoot)
	}

	expect(ais.length).toEqual(exps.length)
}

describe('parseAutoImports.js', () => {
	test('Same directory', () => {
		const lines = toLines(`$autoImportDir(".")`)
		const autoImports = findAutoImportPaths(lines)

		expectAutoImports(autoImports, [
			{
				path: '.', //
				lineIndex: 0,
				isGlob: false,
				isLib: false,
				isRoot: false,
			},
		])
	})

	test('Sub directory', () => {
		const lines = toLines(`$autoImportDir("./sub")`)
		const autoImports = findAutoImportPaths(lines)

		expectAutoImports(autoImports, [
			{
				path: './sub',
				lineIndex: 0,
				isGlob: false,
				isLib: false,
				isRoot: false,
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

		expectAutoImports(autoImports, [
			{
				path: '.', //
				lineIndex: 2,
				isGlob: false,
				isLib: false,
				isRoot: false,
			},
			{
				path: './sub', //
				lineIndex: 3,
				isGlob: false,
				isLib: false,
				isRoot: false,
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

		expectAutoImports(autoImports, [
			{
				path: './**/*', //
				lineIndex: 2,
				isGlob: true,
				isLib: false,
				isRoot: false,
			},
		])
	})

	test('Returns all import paths ($lib)', () => {
		const lines = toLines(`$autoImportDir("$lib")')
`)

		const autoImports = findAutoImportPaths(lines)

		expectAutoImports(autoImports, [
			{
				path: '.', //
				lineIndex: 0,
				isGlob: false,
				isLib: true,
				isRoot: false,
			},
		])
	})

	test('Returns all import paths ($root)', () => {
		const lines = toLines(`$autoImportDir("$root/src")')
`)

		const autoImports = findAutoImportPaths(lines)

		expectAutoImports(autoImports, [
			{
				path: './src', //
				lineIndex: 0,
				isGlob: false,
				isLib: false,
				isRoot: true,
			},
		])
	})
})
